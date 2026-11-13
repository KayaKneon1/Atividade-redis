import express from 'express';
import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
client.on('error', (erro) => console.error('Erro no Redis:', erro.message));
await client.connect();

const fila = 'tutorial14:emails';
const falhas = `${fila}:falhas`;
const app = express();
app.use(express.json());

app.get('/falhas', async (req, res) => {
  const itens = await client.lRange(falhas, 0, -1);
  res.json(itens.map((item) => JSON.parse(item)));
});

app.post('/falhas/reprocessar', async (req, res) => {
  let reprocessadas = 0;
  while (true) {
    const bruto = await client.lMove(falhas, fila, 'RIGHT', 'LEFT');
    if (bruto === null) break;
    const tarefa = JSON.parse(bruto);
    tarefa.tentativas = 0;
    const atualizada = JSON.stringify(tarefa);
    await client
      .multi()
      .lRem(fila, 1, bruto)
      .lPush(fila, atualizada)
      .exec();
    reprocessadas++;
  }
  res.json({ reprocessadas });
});

app.listen(3006, () => console.log('API de falhas em http://localhost:3006'));
