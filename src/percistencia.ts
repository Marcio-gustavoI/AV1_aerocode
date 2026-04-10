import * as fs from "fs";
import * as path from "path";
import { aeronave } from "./aeronave";
import { peca } from "./peca";
import { etapa } from "./etapa";
import { teste } from "./teste";
import { funcionario } from "./funcionario";
import { nivelPermissao } from "./enums";

const ARQUIVO = path.resolve("dados_aerocode.json");

export function salvarDados(aeronaves: aeronave[], usuarios: funcionario[]): void {
  const dados = { aeronaves, usuarios };
  fs.writeFileSync(ARQUIVO, JSON.stringify(dados, null, 2), "utf-8");
}

export function carregarDados(): { aeronaves: aeronave[]; usuarios: funcionario[] } {
  if (!fs.existsSync(ARQUIVO)) {
    // Retorna os dados padrão se o arquivo ainda não existir
    const usuariosPadrao = [
      new funcionario(1, "Marcio", "11996124525", "Rua A", "administrador", "123", nivelPermissao.administrador),
      new funcionario(2, "Gustavo", "12980025655", "Rua B", "operador", "123", nivelPermissao.operador),
      new funcionario(3, "Inocencio", "1125645446", "Rua C", "engenheiro", "123", nivelPermissao.engenheiro),
    ];
    return { aeronaves: [], usuarios: usuariosPadrao };
  }

  const conteudo = fs.readFileSync(ARQUIVO, "utf-8");
  const dadosParsed = JSON.parse(conteudo);

  // Recria as instâncias da classe Funcionario
  const usuarios: funcionario[] = dadosParsed.usuarios.map((u: any) =>
    new funcionario(u.id, u.nome, u.telefone, u.endereco, u.usuario, u.senha, u.permissao)
  );

  // Recria as instâncias da classe Aeronave e suas dependências internas
  const aeronaves: aeronave[] = dadosParsed.aeronaves.map((a: any) => {
    const novaAeronave = new aeronave(a.codigo, a.modelo, a.tipo, a.capacidade, a.alcance, a.cliente);

    novaAeronave.pecas = a.pecas.map((p: any) => new peca(p.nome, p.tipo, p.fornecedor, p.status));

    novaAeronave.etapas = a.etapas.map((e: any) => {
      const novaEtapa = new etapa(e.nome, e.prazo);
      novaEtapa.status = e.status;
      
      // Religa a referência de memória dos funcionários atrelados à etapa usando o ID
      novaEtapa.funcionarios = e.funcionarios
        .map((ef: any) => usuarios.find((u) => u.id === ef.id))
        .filter((u: any) => u !== undefined) as funcionario[];
      
      return novaEtapa;
    });

    novaAeronave.testes = a.testes.map((t: any) => new teste(t.tipo, t.resultado));

    return novaAeronave;
  });

  return { aeronaves, usuarios };
}