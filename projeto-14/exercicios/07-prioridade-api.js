import express from 'express';
import { createClient } from 'redis';

const client = createClient();
client.on('error', console.error);
await client.connect();

const app = express();
app.use(express.json());

app.post('/emails', async (req, res) => {
  const { para, assunto, prioridade = 'normal' } = req.body;
  if (!para || !assunto) return res.status(400).json({ erro: 'Informe para e assunto.' });

  const fila = prioridade === 'alta'
    ? 'tutorial14:prioridade:alta'
    : 'tutorial14:prioridade:normal';
  await client.lPush(fila, JSON.stringify({ para, assunto }));
  res.status(202).json({ status: 'enfileirado', prioridade });
});

app.listen(3007, () => console.log('API em http://localhost:3007'));
