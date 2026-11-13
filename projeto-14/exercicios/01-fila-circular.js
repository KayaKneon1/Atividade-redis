import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export class FilaCircular {
  #itens;
  #inicio = 0;
  #fim = 0;
  #tamanho = 0;

  constructor(capacidade) {
    if (!Number.isInteger(capacidade) || capacidade < 1) {
      throw new RangeError('A capacidade deve ser um inteiro positivo.');
    }
    this.#itens = new Array(capacidade);
  }

  enfileirar(item) {
    if (this.#tamanho === this.#itens.length) throw new Error('Fila cheia.');
    this.#itens[this.#fim] = item;
    this.#fim = (this.#fim + 1) % this.#itens.length;
    this.#tamanho++;
  }

  desenfileirar() {
    if (this.estaVazia()) return undefined;
    const item = this.#itens[this.#inicio];
    this.#itens[this.#inicio] = undefined;
    this.#inicio = (this.#inicio + 1) % this.#itens.length;
    this.#tamanho--;
    return item;
  }

  frente() {
    return this.estaVazia() ? undefined : this.#itens[this.#inicio];
  }

  tamanho() { return this.#tamanho; }
  estaVazia() { return this.#tamanho === 0; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const fila = new FilaCircular(3);
  fila.enfileirar('Ana');
  fila.enfileirar('Bruno');
  console.log(fila.desenfileirar(), fila.frente());
  fila.enfileirar('Caio');
  fila.enfileirar('Dani');
  try { fila.enfileirar('Eva'); } catch (erro) { console.log(erro.message); }
  console.log(fila.desenfileirar(), fila.desenfileirar(), fila.desenfileirar());
}
