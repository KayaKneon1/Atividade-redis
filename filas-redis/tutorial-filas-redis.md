# Tutorial - filas-redis

Requer Node.js, dependências instaladas e Redis rodando em `localhost:6379`.
Na pasta `filas-redis`, execute `npm install`. Inicie o Redis e abra dois
terminais nessa pasta:

```powershell
# Terminal 1: API
node .\api.js

# Terminal 2: worker
node .\worker.js worker-1
```

Em outro terminal, envie um e-mail de teste e consulte a fila:

```powershell
$corpo = @{ para = 'ana@example.com'; assunto = 'Teste' } | ConvertTo-Json; Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/emails' -ContentType 'application/json' -Body $corpo; Invoke-RestMethod -Uri 'http://localhost:3000/status'
```

O envio é simulado pelo worker. Endereços terminados em `@invalido.com` simulam
falhas.
