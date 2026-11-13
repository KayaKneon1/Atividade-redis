import express from 'express';
import { Queue } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
};
const fila = new Queue('tutorial14-emails', { connection });
const app = express();
app.use(express.json());

app.post('/emails', async (req, res) => {
  const { para, assunto } = req.body ?? {};
  if (!para || !assunto) return res.status(400).json({ erro: 'Informe para e assunto.' });
  const job = await fila.add('email', { para, assunto }, { attempts: 3, removeOnFail: false });
  res.status(202).json({ id: job.id, status: 'enfileirado' });
});

app.get('/falhas', async (req, res) => {
  const jobs = await fila.getJobs(['failed'], 0, 99, true);
  res.json(jobs.map((job) => ({
    id: job.id,
    dados: job.data,
    tentativas: job.attemptsMade,
    erro: job.failedReason,
  })));
});

app.listen(3009, () => console.log('API BullMQ em http://localhost:3009'));
process.on('SIGINT', async () => {
  await fila.close();
  process.exit(0);
});
