import { Worker } from 'bullmq';

const worker = new Worker('tutorial14-emails', async (job) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (job.data.para.endsWith('@invalido.com')) throw new Error('domínio inexistente');
  return 'E-mail enviado';
}, { connection: { host: 'localhost', port: 6379 } });

worker.on('completed', (job) => console.log(`Enviado para ${job.data.para}`));
worker.on('failed', (job, erro) => console.log(`Falha: ${erro.message}`));
