# Tutorial - stream

Requer Node.js, dependências instaladas e Redis rodando em `localhost:6379`.
Na pasta `stream`, execute `npm install`. Abra dois terminais nessa pasta:

```powershell
# Terminal 1: inicia o consumidor
node .\stream-worker.js worker-1

# Terminal 2: publica três pedidos
node .\stream-produto.js
```

O worker fica aguardando pedidos e confirma cada um depois de processá-lo.
