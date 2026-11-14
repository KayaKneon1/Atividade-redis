import { createClient } from 'redis';

const stream = 'tutorial14:pedidos';
const grupo = process.argv[2];
const consumidor = process.argv[3] ?? 'worker-1';
if (grupo !== 'email' && grupo !== 'auditoria') {
  throw new Error('Informe o grupo: email ou auditoria.');
}

const client = createClient();
client.on('error', console.error);
await client.connect();

try {
  await client.xGroupCreate(stream, grupo, '0', { MKSTREAM: true });
} catch (erro) {
  if (!erro.message.includes('BUSYGROUP')) throw erro;
}

console.log(`${consumidor} aguardando no grupo ${grupo}`);
while (true) {
  const resposta = await client.xReadGroup(
    grupo,
    consumidor,
    { key: stream, id: '>' },
    { COUNT: 10, BLOCK: 2000 },
  );
  if (!resposta) continue;

  for (const mensagem of resposta[0].messages) {
    console.log(`Pedido ${mensagem.message.pedido}: ${mensagem.message.cliente}`);
    await client.xAck(stream, grupo, mensagem.id);
  }
}
