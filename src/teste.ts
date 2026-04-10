import { tipoTeste, resultadoTeste } from "./enums";

export class teste {
  tipo: tipoTeste;
  resultado: resultadoTeste;

  constructor(tipo: tipoTeste, resultado: resultadoTeste) {
    this.tipo = tipo;
    this.resultado = resultado;
  }

  exibirDados(): void {
    console.log("= Teste =");
    console.log(`Tipo: ${this.tipo}`);
    console.log(`Resultado: ${this.resultado}`);
  }
}