# Exercícios 10–12 — projeto de PDFs

Este projeto combina os exercícios 10, 11 e 12 da seção 14:

- **10:** a API publica eventos como Server-Sent Events (SSE); a página usa
  `EventSource` em vez de consultar o status continuamente.
- **11:** o worker persiste o texto de cada página em `pdf:paginas:<id>` e retoma
  a partir da primeira página ainda não salva.
- **12:** `DELETE /pdfs/:id` cancela jobs que ainda estão na fila.

Requer Node.js 22 ou superior, Redis em `localhost:6379` e as dependências do
projeto instaladas na pasta `projeto-14` (`npm install`). Inicie três terminais
CMD nessa pasta:

```cmd
node exercicios\pdf-projeto\api.js
node exercicios\pdf-projeto\worker.js worker-1
node exercicios\pdf-projeto\worker.js worker-2
```

Abra `http://localhost:3010` e envie um PDF com texto. A API guarda os uploads
em `exercicios\pdf-projeto\uploads`; o resultado fica em `resultados`. Para
simular processamento mais lento e facilitar o teste de retomada, defina
`ATRASO_POR_PAGINA_MS=1500` antes de iniciar um worker no CMD:

```cmd
set ATRASO_POR_PAGINA_MS=1500
node exercicios\pdf-projeto\worker.js worker-1
```

Para testar a retomada, envie um PDF com várias páginas e feche à força o
terminal do worker durante a extração. Reinicie o worker com o mesmo nome;
ele recupera o job e continua depois da última página salva.

Para cancelar um job pendente pelo CMD, use:

```cmd
curl.exe -X DELETE http://localhost:3010/pdfs/ID_DO_JOB
```

Somente um job ainda pendente pode ser cancelado. Um job já em processamento exige
cooperação do worker: uma extensão possível é gravar `cancelar: "1"` no Hash do
job e o worker conferir essa marca entre páginas. Esta demonstração não cancela
um processamento em andamento.
