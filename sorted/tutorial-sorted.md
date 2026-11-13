# Tutorial - sorted

Requer Node.js, dependências instaladas e Redis rodando em `localhost:6379`.
Na pasta `sorted`, execute:

```powershell
npm install
node .\agendador.js
```

O script agenda duas tarefas e move a primeira para a fila após um segundo.
**Atenção:** a demonstração apaga as chaves Redis `fila:agendada` e `fila:emails`.
