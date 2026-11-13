# Projeto 13 — boas práticas com Redis

Este exemplo reúne demonstrações executáveis das práticas da seção 13 do
Tutorial-redis. Requer Node.js, Redis e o pacote `redis`.

Na pasta `projeto-13`, instale o pacote e rode a demonstração:

```cmd
npm install
node boas-praticas.js
```

O programa usa chaves com o prefixo `tutorial13:` e um identificador por
execução; não apaga as filas existentes. Mostra payload pequeno, conexão
separada para comando bloqueante, idempotência, contagem das filas e um aviso
Pub/Sub recebido por um assinante conectado.

## Persistência e configuração

Para testar AOF no Docker, inicie o Redis com:

```cmd
docker run -d --name redis-tutorial13 -p 6379:6379 -v redis-tutorial13-dados:/data redis:8 redis-server --appendonly yes --appendfsync everysec
```

Confira a política de memória:

```cmd
redis-cli CONFIG GET maxmemory-policy
```

Para filas, configure `noeviction` no Redis:

```cmd
redis-cli CONFIG SET maxmemory-policy noeviction
```

Evite usar uma instância pública sem autenticação ou rede privada. Não exponha
a porta `6379` à internet. Em Redis gerenciado, use as opções de persistência,
memória e controle de acesso oferecidas pelo provedor.

Pub/Sub serve apenas para avisos: consumidores desconectados perdem os eventos.
Use Lists, Streams ou BullMQ para tarefas que não podem ser perdidas. Para
inspecionar chaves, use `SCAN` (o exemplo faz isso) em vez de `KEYS`.
