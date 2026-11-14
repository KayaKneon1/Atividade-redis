import express from 'express';
import { Queue } from 'bullmq';

const fila = new Queue('tutorial14-emails', {
  connection: { host: 'localhost', port: 6379 },
});
const app = express();
app.use(express.json());

app.post('/emails', async (req, res) => {
  const { para, assunto } = req.body;
  if (!para || !assunto) return res.status(400).json({ erro: 'Informe para e assunto.' });
  const job = await fila.add('email', { para, assunto }, { attempts: 3 });
  res.status(202).json({ id: job.id, status: 'enfileirado' });
});

app.get('/falhas', async (req, res) => {
  const jobs = await fila.getJobs(['failed']);
  res.json(jobs.map((job) => ({ id: job.id, dados: job.data, erro: job.failedReason })));
});

app.listen(3009, () => console.log('API em http://localhost:3009'));
