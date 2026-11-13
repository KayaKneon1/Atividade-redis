# Tutorial - projeto 14

O projeto contém os 12 exercícios propostos na seção 14 do Tutorial-redis.
Requer Node.js, Redis em `localhost:6379` e, para o exercício 2, `redis-cli`
instalado.

## 1. Prepare o projeto

Inicie o Redis. Se ainda não tem um servidor local, pode usar Docker:

```powershell
docker run --name redis-projeto14 -p 6379:6379 -d redis:8
```

Entre na pasta `projeto-14` e instale as dependências:

```powershell
npm install
```

## 2. Execute os exercícios

Rode os comandos a partir da pasta `projeto-14`.

Exercícios 1–5:

```powershell
node .\exercicios\01-fila-circular.js
.\exercicios\02-atendimento.cmd
node .\exercicios\03-paralelismo.js
node .\exercicios\04-agendador-lua.js
node .\exercicios\05-retentativa-exponencial.js
```

Exercício 6: abra dois terminais; no primeiro, inicie a API e, no segundo,
crie uma tarefa de exemplo:

```powershell
node .\exercicios\06-api-falhas.js
node .\exercicios\06-semeia-falha.js
```

Consulte `http://localhost:3006/falhas` ou reenvie as falhas com:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3006/falhas/reprocessar
```

Exercício 7: em dois terminais, inicie a API e o worker:

```powershell
node .\exercicios\07-prioridade-api.js
node .\exercicios\07-prioridade-worker.js
```

Envie uma tarefa em outro terminal:

```powershell
$body = @{ para = 'ana@example.com'; assunto = 'Teste'; prioridade = 'alta' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3007/emails -ContentType 'application/json' -Body $body
```

Exercício 8: inicie um worker para cada grupo e depois publique pedidos:

```powershell
node .\exercicios\08-stream-worker.js email email-1
node .\exercicios\08-stream-worker.js auditoria audit-1
node .\exercicios\08-stream-produtor.js
```

Exercício 9: em dois terminais, inicie o worker e a API:

```powershell
node .\exercicios\09-bullmq-worker.js
node .\exercicios\09-bullmq-api.js
```

Envie um e-mail de teste por `http://localhost:3009/emails`. Consulte falhas em
`http://localhost:3009/falhas`. O endereço `x@invalido.com` simula uma falha.

Exercícios 10–12: siga as instruções de execução em
[pdf-projeto](./exercicios/pdf-projeto/README.md).

## Observação sobre comandos

Os exemplos acima são para PowerShell no Windows. O exercício 2 é um arquivo
`.cmd` e pode ser iniciado pelo PowerShell com
`.\exercicios\02-atendimento.cmd`. Para os comandos HTTP, use `Invoke-RestMethod`
como mostrado, ou adapte o JSON se preferir `curl.exe`.
