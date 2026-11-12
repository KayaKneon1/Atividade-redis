// teste-fila.js
import { Fila } from './fila.js';

const atendimento = new Fila();
atendimento.enfileirar('Ana');
atendimento.enfileirar('Bruno');
atendimento.enfileirar('Caio');

console.log(atendimento.frente());        // Ana
console.log(atendimento.desenfileirar()); // Ana
console.log(atendimento.desenfileirar()); // Bruno
console.log(atendimento.tamanho());       // 1