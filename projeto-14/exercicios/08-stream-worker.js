import { createClient } from 'redis';

const stream = 'tutorial14:pedidos';
const grupo = process.argv[2];
const consumidor = process.argv[3] ?? `worker-${process.pid}`;
if (!['email', 'auditoria'].includes(grupo)) {
  throw new Error('Uso: node exercicios/08-stream-worker.js <email|auditoria> [consumidor]');
}
const client = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
client.on('error', (erro) => console.error('Erro no Redis:', erro.message));
await client.connect();

try {
  await client.xGroupCreate(stream, grupo, '0', { MKSTREAM: true });
} catch (erro) {
  if (!erro.message.includes('BUSYGROUP')) throw erro;
}

let rodando = true;
process.on('SIGINT', () => { rodando = false; });
console.log(`[${grupo}/${consumidor}] aguardando mensagens`);
while (rodando) {
  const resposta = await client.xReadGroup(
    grupo,
    consumidor,
    { key: stream, id: '>' },
    { COUNT: 10, BLOCK: 2000 },
  );
  if (!resposta) continue;
  for (const { id, message } of resposta[0].messages) {
    console.log(`[${grupo}/${consumidor}] pedido ${message.pedido} de ${message.cliente}`);
    await client.xAck(stream, grupo, id);
  }
}
await client.close();
