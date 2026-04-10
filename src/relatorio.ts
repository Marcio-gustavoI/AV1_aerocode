import * as fs from "fs";
import * as path from "path";
import { aeronave } from "./aeronave";

export class relatorio {
  aeronaveRef: aeronave;
  cliente: string;
  dataEntrega: string;

  constructor(aeronaveRef: aeronave, dataEntrega: string) {
    this.aeronaveRef = aeronaveRef;
    this.cliente = aeronaveRef.cliente;
    this.dataEntrega = dataEntrega;
  }

  gerar(): string {
    const sep  = "========================================";
    const sep2 = "----------------------------------------";
    const linhas: string[] = [];

    linhas.push(sep);
    linhas.push("       Relatorio final - AEROCODE       ");
    linhas.push(sep);
    linhas.push(`Data de Entrega : ${this.dataEntrega}`);
    linhas.push(`Cliente         : ${this.cliente}`);
    linhas.push(sep2);

    linhas.push("AERONAVE");
    linhas.push(sep2);
    linhas.push(`Codigo     : ${this.aeronaveRef.codigo}`);
    linhas.push(`Modelo     : ${this.aeronaveRef.modelo}`);
    linhas.push(`Tipo       : ${this.aeronaveRef.tipo}`);
    linhas.push(`Capacidade : ${this.aeronaveRef.capacidade} passageiros`);
    linhas.push(`Alcance    : ${this.aeronaveRef.alcance} km`);
    linhas.push(sep2);

    linhas.push("Peças ultilizadas");
    linhas.push(sep2);
    if (this.aeronaveRef.pecas.length === 0) {
      linhas.push("Nenhuma peca registrada.");
    } else {
      for (const p of this.aeronaveRef.pecas) {
        linhas.push(`- ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}`);
      }
    }
    linhas.push(sep2);

    linhas.push("Etapas realizadas");
    linhas.push(sep2);
    if (this.aeronaveRef.etapas.length === 0) {
      linhas.push("Nenhuma etapa registrada.");
    } else {
      for (const e of this.aeronaveRef.etapas) {
        linhas.push(`- ${e.nome} | Prazo: ${e.prazo} | Status: ${e.status}`);
        if (e.funcionarios.length > 0) {
          for (const f of e.funcionarios) {
            linhas.push(`    Funcionario: ${f.nome} (${f.permissao})`);
          }
        }
      }
    }
    linhas.push(sep2);

    linhas.push("Resultados dos testes");
    linhas.push(sep2);
    if (this.aeronaveRef.testes.length === 0) {
      linhas.push("Nenhum teste registrado.");
    } else {
      for (const t of this.aeronaveRef.testes) {
        linhas.push(`- Tipo: ${t.tipo} | Resultado: ${t.resultado}`);
      }
    }
    linhas.push(sep);

    return linhas.join("\n");
  }

  salvar(): void {
    const conteudo    = this.gerar();
    const nomeArquivo = `relatorio_${this.aeronaveRef.codigo}.txt`;
    const caminho     = path.resolve(nomeArquivo);

    fs.writeFileSync(caminho, conteudo, "utf-8");
    console.log(`\nRelatorio salvo em: ${caminho}`);
  }
}