import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
client.on('error', (erro) => console.error('Erro no Redis:', erro.message));
await client.connect();

try {
  for (const [pedido, cliente] of [[201, 'ana'], [202, 'bruno'], [203, 'caio']]) {
    const id = await client.xAdd('tutorial14:pedidos', '*', {
      pedido: String(pedido),
      cliente,
    });
    console.log('publicado', id);
  }
} finally {
  await client.close();
}
