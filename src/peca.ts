import { tipoPeca, statusPeca } from "./enums";

export class peca {
  nome: string;
  tipo: tipoPeca;
  fornecedor: string;
  status: statusPeca;

  constructor(
    nome: string,
    tipo: tipoPeca,
    fornecedor: string,
    status: statusPeca
  ) {
    this.nome = nome;
    this.tipo = tipo;
    this.fornecedor = fornecedor;
    this.status = status;
  }

  atualizarStatus(novoStatus: statusPeca): void {
    this.status = novoStatus;
  }

  exibirDados(): void {
    console.log("= Peca =");
    console.log(`Nome: ${this.nome}`);
    console.log(`Tipo: ${this.tipo}`);
    console.log(`Fornecedor: ${this.fornecedor}`);
    console.log(`Status: ${this.status}`);
  }
}