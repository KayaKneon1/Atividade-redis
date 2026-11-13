# Projeto 14 — exercícios do tutorial

Implementações separadas dos 12 exercícios da seção 14. Exercícios que usam
Redis precisam de um servidor em `localhost:6379`. Para instalar as
dependências usadas pelos exercícios:

```cmd
npm install
```

## Windows: CMD e PowerShell

Os comandos deste README estão escritos para o **CMD** (`cmd.exe`). No CMD,
`^` continua um comando em várias linhas; no PowerShell use crases (`` ` ``) ou
escreva o comando em uma linha. Os exercícios de Redis podem ser executados
diretamente no CMD; `redis-cli` precisa estar instalado e acessível pelo `PATH`.

O exercício 2 inclui `02-atendimento.cmd`, que executa a sessão Redis inteira:

```cmd
cd /d C:\caminho\para\Atividade-redis\projeto-14
exercicios\02-atendimento.cmd
```

## Como rodar os exercícios

Execute os exemplos a partir da pasta `projeto-14`:

```cmd
node exercicios\01-fila-circular.js
exercicios\02-atendimento.cmd
node exercicios\03-paralelismo.js
node exercicios\04-agendador-lua.js
node exercicios\05-retentativa-exponencial.js
```

O exercício 2 limpa a chave `fila:atendimento` antes de cada demonstração.
Exercícios 3–5 usam chaves com prefixo `tutorial14:` e requerem Redis.

Para o exercício 6, em um terminal execute `node exercicios\06-api-falhas.js`.
Em outro terminal, rode `node exercicios\06-semeia-falha.js` para criar um
exemplo; consulte `http://localhost:3006/falhas` ou faça POST para
`http://localhost:3006/falhas/reprocessar` com
`curl.exe -X POST http://localhost:3006/falhas/reprocessar`. As chaves de exemplo são
`tutorial14:emails` e `tutorial14:emails:falhas`.

Para o exercício 7, abra dois terminais e execute
`node exercicios\07-prioridade-api.js` e
`node exercicios\07-prioridade-worker.js`. A API aceita POST em
`http://localhost:3007/emails`, com `para`, `assunto` e `prioridade` (`alta` ou
`normal`). Como no exercício, o worker retira a tarefa da lista sem lista de
processamento; uma queda durante o trabalho pode perdê-la. Exemplo no CMD:

```cmd
curl.exe -X POST http://localhost:3007/emails -H "Content-Type: application/json" -d "{\"para\":\"ana@example.com\",\"assunto\":\"Teste\",\"prioridade\":\"alta\"}"
```

Para o exercício 8, execute `node exercicios\08-stream-worker.js email email-1`
e `node exercicios\08-stream-worker.js auditoria audit-1` em terminais separados,
depois rode `node exercicios\08-stream-produtor.js`. Cada grupo recebe todas as
mensagens; execute dois workers com o mesmo grupo para ver a divisão dentro
dele.

Para o exercício 9, execute `node exercicios\09-bullmq-worker.js` e
`node exercicios\09-bullmq-api.js` em dois terminais. A API recebe POST
`http://localhost:3009/emails`; consulte falhas em
`http://localhost:3009/falhas`. O endereço `@invalido.com` simula falhas. Exemplo:

```cmd
curl.exe -X POST http://localhost:3009/emails -H "Content-Type: application/json" -d "{\"para\":\"x@invalido.com\",\"assunto\":\"Teste\"}"
```

Os exercícios 10, 11 e 12 estendem o projeto de PDFs e compartilham o mesmo
código em `exercicios\pdf-projeto`. Instruções e comandos para CMD estão no
README dessa pasta.
