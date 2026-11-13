import { createClient } from 'redis';
import { randomUUID } from 'node:crypto';

const client = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
client.on('error', (erro) => console.error('Erro no Redis:', erro.message));
await client.connect();

const prefixo = `tutorial14:${randomUUID()}`;
const fila = `${prefixo}:emails`;
const agendadas = `${prefixo}:retentativas`;

async function agendarRetentativa(tarefa) {
  tarefa.tentativas++;
  const instante = Date.now() + 2 ** tarefa.tentativas * 1000;
  await client.zAdd(agendadas, {
    score: instante,
    value: JSON.stringify(tarefa),
  });
  console.log(`tentativa ${tarefa.tentativas}: agendada para daqui a ${2 ** tarefa.tentativas} s`);
}

async function moverVencidas() {
  const vencidas = await client.zRange(agendadas, '-inf', Date.now(), {
    BY: 'SCORE',
    LIMIT: { offset: 0, count: 100 },
  });
  for (const bruto of vencidas) {
    if (await client.zRem(agendadas, bruto)) await client.lPush(fila, bruto);
  }
}

try {
  const tarefa = { id: 'demo', tentativas: 0, dados: { para: 'ana@example.com' } };
  await agendarRetentativa(tarefa);
  while (await client.zCard(agendadas)) {
    await moverVencidas();
    const pronta = await client.rPop(fila);
    if (pronta) {
      const atual = JSON.parse(pronta);
      if (atual.tentativas < 3) await agendarRetentativa(atual);
      else console.log('Tarefa processada após três retentativas.');
    } else {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
} finally {
  await client.del([fila, agendadas]);
  await client.close();
}
