import { createClient } from 'redis';

const fila = 'tutorial14:paralelismo';
const tarefas = 100;
const atraso = 100;
const resultados = [];

for (const quantidadeWorkers of [1, 2, 4]) {
  const client = createClient();
  client.on('error', console.error);
  await client.connect();

  await client.del(fila);
  for (let i = 0; i < tarefas; i++) await client.lPush(fila, String(i));

  const workers = [];
  for (let i = 0; i < quantidadeWorkers; i++) {
    const worker = client.duplicate();
    worker.on('error', console.error);
    await worker.connect();
    workers.push(worker);
  }

  const inicio = Date.now();
  await Promise.all(workers.map(async (worker) => {
    let item;
    while ((item = await worker.rPop(fila))) {
      await new Promise((resolve) => setTimeout(resolve, atraso));
    }
  }));
  resultados.push({ workers: quantidadeWorkers, segundos: ((Date.now() - inicio) / 1000).toFixed(1) });

  for (const worker of workers) await worker.close();
  await client.close();
}

console.table(resultados);
