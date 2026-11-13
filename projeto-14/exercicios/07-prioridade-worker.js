import { createClient } from 'redis';

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
const bloqueante = createClient({ url });
bloqueante.on('error', (erro) => console.error('Erro no Redis:', erro.message));
await bloqueante.connect();

console.log('Worker aguardando (Ctrl+C para sair).');
try {
  while (true) {
    const item = await bloqueante.brPop([
      'tutorial14:prioridade:alta',
      'tutorial14:prioridade:normal',
    ], 0);
    const email = JSON.parse(item.element);
    console.log(`processando ${item.key}: ${email.assunto} -> ${email.para}`);
  }
} finally {
  await bloqueante.close();
}
