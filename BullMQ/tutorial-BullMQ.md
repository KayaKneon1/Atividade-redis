# Tutorial - BullMQ

Requer Node.js, dependências do projeto e Redis em `localhost:6379`.

Na pasta `BullMQ`, instale as dependências e configure módulos ES:

```powershell
npm install
npm pkg set type=module
```

Inicie o Redis. Abra dois terminais nessa pasta:

```powershell
# Terminal 1
node .\bull-worker.js

# Terminal 2
node .\bull-fila.js
```

O produtor adiciona tarefas; o worker as processa. O endereço `@invalido.com`
simula falhas e novas tentativas.
