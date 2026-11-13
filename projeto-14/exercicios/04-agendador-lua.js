import { createClient } from 'redis';
import { randomUUID } from 'node:crypto';

const client = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
client.on('error', (erro) => console.error('Erro no Redis:', erro.message));
await client.connect();

const script = `
local itens = redis.call('ZRANGE', KEYS[1], '-inf', ARGV[1], 'BYSCORE', 'LIMIT', 0, 100)
for _, item in ipairs(itens) do
  if redis.call('ZREM', KEYS[1], item) == 1 then
    redis.call('LPUSH', KEYS[2], item)
  end
end
return #itens
`;
const prefixo = `tutorial14:${randomUUID()}`;
const agendadas = `${prefixo}:agendadas`;
const fila = `${prefixo}:fila`;

try {
  const tarefa = JSON.stringify({ id: Date.now(), assunto: 'Tarefa vencida' });
  await client.zAdd(agendadas, { score: Date.now() - 1, value: tarefa });
  const movidas = await client.eval(script, {
    keys: [agendadas, fila],
    arguments: [String(Date.now())],
  });
  console.log({ movidas, fila: await client.lRange(fila, 0, -1) });
} finally {
  await client.del([agendadas, fila]);
  await client.close();
}
