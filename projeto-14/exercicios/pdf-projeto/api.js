import express from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { conectar } from './redis.js';
import { K, publicar } from './chaves.js';

mkdirSync('exercicios/pdf-projeto/uploads', { recursive: true });
const client = await conectar();
const app = express();
const upload = multer({
  dest: 'exercicios/pdf-projeto/uploads/',
  limits: { fileSize: 20 * 1024 * 1024, files: 10 },
  fileFilter: (req, arquivo, aceitar) => aceitar(null, arquivo.mimetype === 'application/pdf'),
});

app.use(express.static('exercicios/pdf-projeto/public'));

app.post('/pdfs', upload.array('arquivos', 10), async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ erro: 'Envie ao menos um arquivo PDF.' });
  const criados = [];
  for (const arquivo of req.files) {
    const id = randomUUID();
    const agora = Date.now();
    const nome = Buffer.from(arquivo.originalname, 'latin1').toString('utf8');
    await client.multi()
      .hSet(K.job(id), {
        id, nome, caminho: arquivo.path, bytes: arquivo.size,
        status: 'na_fila', tentativas: 0, pagina: 0, criadoEm: agora,
      })
      .zAdd(K.jobs, { score: agora, value: id })
      .lPush(K.fila, id)
      .exec();
    await publicar(client, 'na_fila', { id, nome, pagina: 0 });
    criados.push({ id, nome, status: 'na_fila', pagina: 0 });
  }
  res.status(202).json(criados);
});

app.get('/pdfs/:id', async (req, res) => {
  const job = await client.hGetAll(K.job(req.params.id));
  if (!job.id) return res.status(404).json({ erro: 'Job não encontrado.' });
  res.json(job);
});

app.get('/pdfs/:id/texto', async (req, res) => {
  const job = await client.hGetAll(K.job(req.params.id));
  if (job.status !== 'concluido') {
    return res.status(409).json({ erro: `O job está "${job.status ?? 'inexistente'}".` });
  }
  res.type('text/plain; charset=utf-8').sendFile(job.resultado, { root: process.cwd() });
});

app.delete('/pdfs/:id', async (req, res) => {
  const jobKey = K.job(req.params.id);
  const job = await client.hGetAll(jobKey);
  if (!job.id) return res.status(404).json({ erro: 'Job não encontrado.' });
  const removido = await client.lRem(K.fila, 1, req.params.id);
  if (!removido) {
    return res.status(409).json({ erro: 'Só é possível cancelar um job ainda pendente na fila.' });
  }
  await client.hSet(jobKey, { status: 'cancelado', canceladoEm: Date.now() });
  await publicar(client, 'cancelado', { id: req.params.id, nome: job.nome });
  res.json({ id: req.params.id, status: 'cancelado' });
});

app.get('/eventos', async (req, res) => {
  const assinante = await client.duplicate();
  assinante.on('error', (erro) => console.error('Erro no assinante SSE:', erro.message));
  await assinante.connect();
  res.set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();
  await assinante.subscribe(K.eventos, (mensagem) => {
    res.write(`data: ${mensagem}\n\n`);
  });
  res.on('close', () => { void assinante.close(); });
});

app.use((erro, req, res, next) => {
  if (res.headersSent) return next(erro);
  res.status(400).json({ erro: erro.message });
});

app.listen(3010, () => console.log('Formulário em http://localhost:3010'));
