@echo off
setlocal
echo === LPUSH + RPOP: FIFO ===
redis-cli DEL fila:atendimento
redis-cli LPUSH fila:atendimento Ana Bruno Caio Dani Eva
redis-cli RPOP fila:atendimento
redis-cli RPOP fila:atendimento
redis-cli LINDEX fila:atendimento 0
redis-cli LLEN fila:atendimento

echo === RPUSH + LPOP: FIFO ===
redis-cli DEL fila:atendimento
redis-cli RPUSH fila:atendimento Ana Bruno Caio Dani Eva
redis-cli LPOP fila:atendimento
redis-cli LPOP fila:atendimento
redis-cli LINDEX fila:atendimento 0
redis-cli LLEN fila:atendimento

echo === LPUSH + LPOP: LIFO (ordem invertida) ===
redis-cli DEL fila:atendimento
redis-cli LPUSH fila:atendimento Ana Bruno Caio Dani Eva
redis-cli LPOP fila:atendimento
redis-cli LPOP fila:atendimento
redis-cli LINDEX fila:atendimento 0
redis-cli LLEN fila:atendimento
endlocal
