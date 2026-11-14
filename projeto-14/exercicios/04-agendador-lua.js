import { createClient } from 'redis';

const client = createClient();
client.on('error', console.error);
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

const agendadas = 'tutorial14:agendadas';
const fila = 'tutorial14:fila';
const tarefa = JSON.stringify({ assunto: 'Tarefa vencida' });

await client.del([agendadas, fila]);
await client.zAdd(agendadas, { score: Date.now() - 1, value: tarefa });
const movidas = await client.eval(script, {
  keys: [agendadas, fila],
  arguments: [String(Date.now())],
});
console.log('Tarefas movidas:', movidas);
console.log('Fila:', await client.lRange(fila, 0, -1));
await client.close();
