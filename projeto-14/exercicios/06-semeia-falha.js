import { createClient } from 'redis';

const client = createClient();
client.on('error', console.error);
await client.connect();

const tarefa = JSON.stringify({
  id: 1,
  dados: { para: 'ana@example.com', assunto: 'Teste' },
  tentativas: 3,
});
await client.lPush('tutorial14:emails:falhas', tarefa);
console.log('Tarefa de teste adicionada à fila de falhas.');
await client.close();
