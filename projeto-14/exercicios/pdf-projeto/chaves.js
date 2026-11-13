export const K = {
  fila: 'pdf:fila',
  falhas: 'pdf:falhas',
  jobs: 'pdf:jobs',
  contagem: 'pdf:contagem',
  eventos: 'pdf:eventos',
  job: (id) => `pdf:job:${id}`,
  paginas: (id) => `pdf:paginas:${id}`,
  processando: (worker) => `pdf:processando:${worker}`,
};

export async function publicar(client, tipo, dados) {
  await client.publish(K.eventos, JSON.stringify({ tipo, em: Date.now(), ...dados }));
}
