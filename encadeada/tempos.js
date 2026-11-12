// tempos.js — os três jeitos de medir, num exemplo pequeno
import { FilaEncadeada } from './fila-encadeada.js';
const fila = new FilaEncadeada();

console.time('enfileirar 100 mil');
for (let i = 0; i < 100_000; i++) fila.enfileirar(i);
console.timeEnd('enfileirar 100 mil');          // enfileirar 100 mil: 13.381ms

const inicio = process.hrtime.bigint();
while (!fila.estaVazia()) fila.desenfileirar();
const ns = process.hrtime.bigint() - inicio;     // BigInt, em nanossegundos
console.log(`desenfileirar 100 mil: ${ns} ns (${Number(ns) / 1e6} ms)`);
// desenfileirar 100 mil: 2487586 ns (2.487586 ms)