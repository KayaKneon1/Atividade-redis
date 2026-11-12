// fila-encadeada.js — fila com nós ligados: cada nó aponta para o próximo
class No {
  constructor(valor) {
    this.valor = valor;
    this.proximo = null;     // referência para o nó seguinte (ou null)
  }
}

export class FilaEncadeada {
  #inicio = null;            // nó que sai primeiro
  #fim = null;               // último nó que entrou
  #tamanho = 0;

  enfileirar(item) {         // O(1): liga um nó novo depois do último
    const novo = new No(item);
    if (this.#fim) {
      this.#fim.proximo = novo;  // o antigo último passa a apontar para o novo
    } else {
      this.#inicio = novo;       // fila vazia: o novo é também o primeiro
    }
    this.#fim = novo;
    this.#tamanho++;
  }

  desenfileirar() {          // O(1): o segundo nó vira o primeiro
    if (this.estaVazia()) return undefined;
    const { valor } = this.#inicio;
    this.#inicio = this.#inicio.proximo;
    if (this.#inicio === null) this.#fim = null; // a fila esvaziou
    this.#tamanho--;
    return valor;
  }

  frente() {
    return this.#inicio?.valor;
  }

  tamanho() {
    return this.#tamanho;
  }

  estaVazia() {
    return this.#tamanho === 0;
  }
}