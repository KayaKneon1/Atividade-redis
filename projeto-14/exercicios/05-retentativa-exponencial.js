import { createClient } from 'redis';

const client = createClient();
client.on('error', console.error);
await client.connect();

const agendadas = 'tutorial14:retentativas';
const fila = 'tutorial14:emails';
await client.del([agendadas, fila]);

const tarefa = { id: 1, tentativas: 0 };
for (let tentativa = 1; tentativa <= 3; tentativa++) {
  tarefa.tentativas = tentativa;
  const espera = 2 ** tentativa;
  await client.zAdd(agendadas, {
    score: Date.now() + espera * 1000,
    value: JSON.stringify(tarefa),
  });
  console.log(`Tentativa ${tentativa}: aguarda ${espera} segundos`);

  await new Promise((resolve) => setTimeout(resolve, espera * 1000));
  const [vencida] = await client.zRange(agendadas, 0, 0);
  await client.zRem(agendadas, vencida);
  await client.lPush(fila, vencida);
}

console.log('Tarefa após as retentativas:', await client.rPop(fila));
await client.del([agendadas, fila]);
await client.close();
