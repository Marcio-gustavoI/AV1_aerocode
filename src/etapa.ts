import { statusEtapa } from "./enums";
import { funcionario } from "./funcionario";

export class etapa {
  nome: string;
  prazo: string;
  status: statusEtapa;
  funcionarios: funcionario[];

  constructor(nome: string, prazo: string) {
    this.nome = nome;
    this.prazo = prazo;
    this.status = statusEtapa.pendente;
    this.funcionarios = [];
  }

  iniciar(): void {
    if (this.status === statusEtapa.pendente) {
      this.status = statusEtapa.andamento;
    }
  }

  finalizar(): void {
    if (this.status === statusEtapa.andamento) {
      this.status = statusEtapa.concluido;
    }
  }

  adicionarFuncionario(func: funcionario): void {
    const jaExiste = this.funcionarios.some(f => f.id === func.id);

    if (!jaExiste) {
      this.funcionarios.push(func);
    }
  }

  listarFuncionarios(): void {
    console.log(`Funcionarios da etapa ${this.nome}:`);
    for (const func of this.funcionarios) {
      console.log(`- ${func.nome}`);
    }
  }

  exibirDados(): void {
    console.log("= Etapa =");
    console.log(`Nome: ${this.nome}`);
    console.log(`Prazo: ${this.prazo}`);
    console.log(`Status: ${this.status}`);
  }
}