import { Worker } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
};
const worker = new Worker('tutorial14-emails', async (job) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (job.data.para.endsWith('@invalido.com')) throw new Error('domínio inexistente');
  return { enviadoEm: new Date().toISOString() };
}, { connection, concurrency: 5 });

worker.on('completed', (job) => console.log(`ok #${job.id} -> ${job.data.para}`));
worker.on('failed', (job, erro) => console.log(`falha #${job.id}: ${erro.message}`));
worker.on('error', (erro) => console.error('Erro no worker:', erro.message));
process.on('SIGINT', async () => {
  await worker.close();
  process.exit(0);
});
