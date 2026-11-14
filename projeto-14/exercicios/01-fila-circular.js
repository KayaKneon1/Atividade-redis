export class FilaCircular {
  constructor(capacidade) {
    this.itens = new Array(capacidade);
    this.inicio = 0;
    this.fim = 0;
    this.tamanhoAtual = 0;
  }

  enfileirar(item) {
    if (this.tamanhoAtual === this.itens.length) throw new Error('Fila cheia');
    this.itens[this.fim] = item;
    this.fim = (this.fim + 1) % this.itens.length;
    this.tamanhoAtual++;
  }

  desenfileirar() {
    if (this.tamanhoAtual === 0) return undefined;
    const item = this.itens[this.inicio];
    this.itens[this.inicio] = undefined;
    this.inicio = (this.inicio + 1) % this.itens.length;
    this.tamanhoAtual--;
    return item;
  }

  frente() {
    return this.tamanhoAtual === 0 ? undefined : this.itens[this.inicio];
  }
}

const fila = new FilaCircular(3);
fila.enfileirar('Ana');
fila.enfileirar('Bruno');
console.log(fila.desenfileirar()); // Ana
fila.enfileirar('Caio');
fila.enfileirar('Dani');
console.log(fila.desenfileirar()); // Bruno
console.log(fila.frente());        // Caio
