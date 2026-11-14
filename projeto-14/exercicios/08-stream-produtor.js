import { createClient } from 'redis';

const client = createClient();
client.on('error', console.error);
await client.connect();

for (const [pedido, cliente] of [[201, 'ana'], [202, 'bruno'], [203, 'caio']]) {
  const id = await client.xAdd('tutorial14:pedidos', '*', {
    pedido: String(pedido),
    cliente,
  });
  console.log('Pedido publicado:', id);
}

await client.close();
