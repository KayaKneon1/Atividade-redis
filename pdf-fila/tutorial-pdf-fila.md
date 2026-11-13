# Tutorial - pdf-fila

Requer Node.js 22 ou superior e Redis rodando em `localhost:6379`. Na pasta
`pdf-fila`, instale as dependências e configure módulos ES:

```powershell
npm install
npm pkg set type=module
```

Abra três terminais nessa pasta e execute um comando em cada:

```powershell
node .\api.js
node .\worker.js worker-1
node .\monitor.js
```

Abra `http://localhost:3000`, envie um PDF com texto e acompanhe o processamento
no monitor. O texto extraído será salvo em `resultados`.
