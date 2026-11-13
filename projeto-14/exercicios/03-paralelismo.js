import { createClient } from 'redis';

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
const fila = 'tutorial14:paralelismo';
const quantidade = 100;
const atrasoMs = 100;

async function medir(workers) {
  const produtor = createClient({ url });
  produtor.on('error', (erro) => console.error('Erro no Redis:', erro.message));
  await produtor.connect();
  await produtor.del(fila);
  await produtor.rPush(fila, Array.from({ length: quantidade }, (_, i) => String(i)));
  const consumidores = await Promise.all(Array.from({ length: workers }, async () => {
    const client = produtor.duplicate();
    client.on('error', (erro) => console.error('Erro no Redis:', erro.message));
    await client.connect();
    return client;
  }));
  let processadas = 0;
  const inicio = performance.now();
  await Promise.all(consumidores.map(async (client) => {
    while (true) {
      const item = await client.brPop(fila, 1);
      if (!item) break;
      await new Promise((resolve) => setTimeout(resolve, atrasoMs));
      processadas++;
    }
  }));
  const duracao = performance.now() - inicio;
  await Promise.all(consumidores.map((client) => client.close()));
  await produtor.close();
  return { workers, tarefas: processadas, 'tempo (s)': Number((duracao / 1000).toFixed(2)) };
}

const resultados = [];
for (const workers of [1, 2, 4]) resultados.push(await medir(workers));
console.table(resultados);
