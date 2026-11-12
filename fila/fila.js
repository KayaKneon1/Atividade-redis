// fila.js — Fila (FIFO) com operações O(1)
export class Fila {
  #itens = {};   // índice -> item
  #inicio = 0;   // índice do primeiro item
  #fim = 0;      // próximo índice livre

  enfileirar(item) {          // enqueue
    this.#itens[this.#fim] = item;
    this.#fim++;
  }

  desenfileirar() {           // dequeue
    if (this.estaVazia()) return undefined;
    const item = this.#itens[this.#inicio];
    delete this.#itens[this.#inicio];
    this.#inicio++;
    return item;
  }

  frente() {                  // peek
    return this.#itens[this.#inicio];
  }

  tamanho() {
    return this.#fim - this.#inicio;
  }

  estaVazia() {
    return this.tamanho() === 0;
  }
}