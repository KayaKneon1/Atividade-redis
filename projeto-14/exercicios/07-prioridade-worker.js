import { createClient } from 'redis';

const client = createClient();
client.on('error', console.error);
await client.connect();

console.log('Worker aguardando e-mails...');
while (true) {
  const item = await client.brPop([
    'tutorial14:prioridade:alta',
    'tutorial14:prioridade:normal',
  ], 0);
  const email = JSON.parse(item.element);
  console.log(`${email.assunto} -> ${email.para} (${item.key})`);
}
