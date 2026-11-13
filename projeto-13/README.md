# Tutorial - projeto 13

Este exemplo demonstra boas práticas de uso do Redis. Requer Node.js, Docker
(ou um Redis já rodando em `localhost:6379`).

## 1. Inicie o Redis

Se ainda não criou o contêiner:

```powershell
docker run --name redis-projeto13 -p 6379:6379 -d redis:8 redis-server --appendonly yes --appendfsync everysec
```

Se já existe, inicie-o:

```powershell
docker start redis-projeto13
```

## 2. Execute o exemplo

Abra um terminal na pasta `projeto-13` e rode:

```powershell
npm install
node .\boas-praticas.js
```

O programa mostra uma fila confiável, idempotência, uma conexão separada para
comandos bloqueantes, Pub/Sub e inspeção de chaves com `SCAN`.

Opcionalmente, confira e configure a política de memória:

```powershell
docker exec redis-projeto13 redis-cli CONFIG GET maxmemory-policy
docker exec redis-projeto13 redis-cli CONFIG SET maxmemory-policy noeviction
```
