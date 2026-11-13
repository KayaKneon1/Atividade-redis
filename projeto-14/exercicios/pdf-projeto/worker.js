import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import { conectar } from './redis.js';
import { K, publicar } from './chaves.js';

const workerId = process.argv[2] ?? 'worker-1';
const maxTentativas = 3;
const atrasoMs = Number(process.env.ATRASO_POR_PAGINA_MS ?? 400);
const client = await conectar();
const bloqueante = await client.duplicate();
bloqueante.on('error', (erro) => console.error('Erro na conexão bloqueante:', erro.message));
await bloqueante.connect();
const processando = K.processando(workerId);
await mkdir('exercicios/pdf-projeto/resultados', { recursive: true });

async function extrairTexto(id, caminho) {
  const parser = new PDFParse({ data: await readFile(caminho) });
  try {
    const { total } = await parser.getInfo();
    const paginasSalvas = await client.lLen(K.paginas(id));
    await client.hSet(K.job(id), { paginas: total, pagina: paginasSalvas });

    for (let pagina = paginasSalvas + 1; pagina <= total; pagina++) {
      const { text } = await parser.getText({ partial: [pagina] });
      await client.rPush(K.paginas(id), text);
      await client.hSet(K.job(id), { pagina });
      await publicar(client, 'progresso', { id, pagina, paginas: total });
      await new Promise((resolve) => setTimeout(resolve, atrasoMs));
    }

    const partes = await client.lRange(K.paginas(id), 0, -1);
    const texto = partes.join('\n\n');
    const resultado = `exercicios/pdf-projeto/resultados/${id}.txt`;
    await writeFile(resultado, texto, 'utf8');
    return { resultado, caracteres: texto.length, paginas: total };
  } finally {
    await parser.destroy();
  }
}

let rodando = true;
for (const sinal of ['SIGINT', 'SIGTERM']) {
  process.on(sinal, () => {
    console.log(`[${workerId}] encerrando após o job atual...`);
    rodando = false;
  });
}

let preso;
while ((preso = await client.lMove(processando, K.fila, 'RIGHT', 'RIGHT'))) {
  await client.hSet(K.job(preso), { status: 'na_fila' });
  console.log(`[${workerId}] job ${preso} recuperado`);
}

console.log(`[${workerId}] aguardando PDFs...`);
while (rodando) {
  const id = await bloqueante.blMove(K.fila, processando, 'RIGHT', 'LEFT', 5);
  if (id === null) continue;

  const { nome, caminho } = await client.hGetAll(K.job(id));
  await client.hSet(K.job(id), { status: 'processando', worker: workerId, iniciadoEm: Date.now() });
  await publicar(client, 'iniciado', { id, nome, worker: workerId });
  try {
    const { resultado, caracteres, paginas } = await extrairTexto(id, caminho);
    await client.multi()
      .hSet(K.job(id), { status: 'concluido', resultado, caracteres, paginas, concluidoEm: Date.now() })
      .hIncrBy(K.contagem, 'concluidos', 1)
      .lRem(processando, 1, id)
      .exec();
    await publicar(client, 'concluido', { id, nome, caracteres, paginas, worker: workerId });
    console.log(`[${workerId}] ${nome}: ${caracteres} caracteres extraídos`);
  } catch (erro) {
    const tentativas = await client.hIncrBy(K.job(id), 'tentativas', 1);
    const desistir = tentativas >= maxTentativas;
    await client.multi()
      .hSet(K.job(id), { status: desistir ? 'erro' : 'na_fila', erro: erro.message })
      .lRem(processando, 1, id)
      .lPush(desistir ? K.falhas : K.fila, id)
      .hIncrBy(K.contagem, desistir ? 'erros' : 'retentativas', 1)
      .exec();
    await publicar(client, desistir ? 'erro' : 'reenfileirado', {
      id, nome, worker: workerId, tentativas, erro: erro.message,
    });
    console.log(`[${workerId}] ${nome}: falha ${tentativas}/${maxTentativas} (${erro.message})`);
  }
}

await bloqueante.close();
await client.close();
