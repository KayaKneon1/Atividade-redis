import { randomUUID } from 'node:crypto';
import { createClient } from 'redis';

const prefixo = `tutorial13:${randomUUID()}`;
const fila = `${prefixo}:fila`;
const falhas = `${prefixo}:falhas`;
const processando = `${prefixo}:processando`;
const client = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
client.on('error', (erro) => console.error('Erro no Redis:', erro.message));
await client.connect();
const bloqueante = client.duplicate();
bloqueante.on('error', (erro) => console.error('Erro na conexão bloqueante:', erro.message));
await bloqueante.connect();
const assinante = client.duplicate();
assinante.on('error', (erro) => console.error('Erro no assinante:', erro.message));
await assinante.connect();

try {
  const tarefa = { id: randomUUID(), alunoId: 42 };
  await client.lPush(fila, JSON.stringify(tarefa));
  console.log('Payload pequeno enfileirado:', tarefa);

  const primeiraVez = await client.set(`${prefixo}:feito:${tarefa.id}`, '1', { NX: true, EX: 86400 });
  const repetida = await client.set(`${prefixo}:feito:${tarefa.id}`, '1', { NX: true, EX: 86400 });
  console.log('Idempotência (primeira, repetida):', Boolean(primeiraVez), Boolean(repetida));

  const recebido = await bloqueante.blMove(fila, processando, 'RIGHT', 'LEFT', 1);
  if (recebido !== null) {
    await client.lRem(processando, 1, recebido);
    console.log('Tarefa movida para processamento e confirmada.');
  }

  await client.lPush(falhas, JSON.stringify({ id: randomUUID(), erro: 'exemplo' }));
  console.log('Tamanhos:', {
    fila: await client.lLen(fila),
    processando: await client.lLen(processando),
    falhas: await client.lLen(falhas),
  });

  const encontradas = [];
  for await (const chaves of client.scanIterator({ MATCH: `${prefixo}:*`, COUNT: 100 })) {
    encontradas.push(...chaves);
  }
  console.log('Chaves da execução (SCAN):', encontradas);
  const canal = `${prefixo}:eventos`;
  let confirmarEvento;
  const eventoRecebido = new Promise((resolve) => { confirmarEvento = resolve; });
  await assinante.subscribe(canal, confirmarEvento);
  await client.publish(canal, JSON.stringify({ tipo: 'exemplo', id: tarefa.id }));
  console.log('Aviso Pub/Sub recebido:', await eventoRecebido);
  console.log('Pub/Sub é apenas aviso: assinantes offline não recebem mensagens.');
} finally {
  await assinante.close();
  await bloqueante.close();
  await client.close();
}
