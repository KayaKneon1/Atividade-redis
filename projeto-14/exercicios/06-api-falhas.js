import express from 'express';
import { createClient } from 'redis';

const client = createClient();
client.on('error', console.error);
await client.connect();

const fila = 'tutorial14:emails';
const falhas = `${fila}:falhas`;
const app = express();

app.get('/falhas', async (req, res) => {
  const tarefas = await client.lRange(falhas, 0, -1);
  res.json(tarefas.map(JSON.parse));
});

app.post('/falhas/reprocessar', async (req, res) => {
  let total = 0;
  let item;
  while ((item = await client.rPop(falhas))) {
    const tarefa = JSON.parse(item);
    tarefa.tentativas = 0;
    await client.lPush(fila, JSON.stringify(tarefa));
    total++;
  }
  res.json({ reprocessadas: total });
});

app.listen(3006, () => console.log('API em http://localhost:3006'));
