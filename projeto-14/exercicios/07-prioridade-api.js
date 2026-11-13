import express from 'express';
import { createClient } from 'redis';

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
const client = createClient({ url });
client.on('error', (erro) => console.error('Erro no Redis:', erro.message));
await client.connect();

const alta = 'tutorial14:prioridade:alta';
const normal = 'tutorial14:prioridade:normal';
const app = express();
app.use(express.json());

app.post('/emails', async (req, res) => {
  const { para, assunto, prioridade = 'normal' } = req.body ?? {};
  if (!para || !assunto || !['alta', 'normal'].includes(prioridade)) {
    return res.status(400).json({ erro: 'Informe para, assunto e prioridade alta ou normal.' });
  }
  const item = JSON.stringify({ para, assunto });
  await client.lPush(prioridade === 'alta' ? alta : normal, item);
  res.status(202).json({ status: 'enfileirado', prioridade });
});

app.listen(3007, () => console.log('API de prioridade em http://localhost:3007'));
