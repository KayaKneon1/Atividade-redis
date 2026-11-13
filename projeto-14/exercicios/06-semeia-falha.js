import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
client.on('error', (erro) => console.error('Erro no Redis:', erro.message));
await client.connect();
try {
  const tarefa = {
    id: `falha-${Date.now()}`,
    dados: { para: 'ana@example.com', assunto: 'Reprocessamento de teste' },
    tentativas: 3,
    ultimoErro: 'falha de exemplo',
  };
  await client.lPush('tutorial14:emails:falhas', JSON.stringify(tarefa));
  console.log('Tarefa de teste adicionada à DLQ:', tarefa.id);
} finally {
  await client.close();
}
