import { tipoAeronave } from "./enums";
import { peca } from "./peca";
import { etapa } from "./etapa";
import { teste } from "./teste";

export class aeronave {
  codigo: string;
  modelo: string;
  tipo: tipoAeronave;
  capacidade: number;
  alcance: number;
  cliente: string;
  pecas: peca[];
  etapas: etapa[];
  testes: teste[];

  constructor(
    codigo: string,
    modelo: string,
    tipo: tipoAeronave,
    capacidade: number,
    alcance: number,
    cliente: string
  ) {
    this.codigo = codigo;
    this.modelo = modelo;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.alcance = alcance;
    this.cliente = cliente;
    this.pecas = [];
    this.etapas = [];
    this.testes = [];
  }

  adicionarPeca(p: peca): void {
    this.pecas.push(p);
  }

  adicionarEtapa(e: etapa): void {
    this.etapas.push(e);
  }

  adicionarTeste(t: teste): void {
    this.testes.push(t);
  }

  exibirDetalhes(): void {
    console.log("\n=== Aeronave ===");
    console.log(`Codigo:     ${this.codigo}`);
    console.log(`Modelo:     ${this.modelo}`);
    console.log(`Tipo:       ${this.tipo}`);
    console.log(`Capacidade: ${this.capacidade} passageiros`);
    console.log(`Alcance:    ${this.alcance} km`);
    console.log(`Cliente:    ${this.cliente}`);
    console.log(`Pecas:      ${this.pecas.length}`);
    console.log(`Etapas:     ${this.etapas.length}`);
    console.log(`Testes:     ${this.testes.length}`);
  }
}