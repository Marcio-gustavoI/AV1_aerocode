import { nivelPermissao } from "./enums";

export class funcionario {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  permissao: nivelPermissao;

  constructor(
    id: number,
    nome: string,
    telefone: string,
    endereco: string,
    usuario: string,
    senha: string,
    permissao: nivelPermissao
  ) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
    this.endereco = endereco;
    this.usuario = usuario;
    this.senha = senha;
    this.permissao = permissao;
  }

  autenticar(usuario: string, senha: string): boolean {
    return this.usuario === usuario && this.senha === senha;
  }

  exibirDados(): void {
    console.log("= Funcionario =");
    console.log(`Id: ${this.id}`);
    console.log(`Nome: ${this.nome}`);
    console.log(`Telefone: ${this.telefone}`);
    console.log(`Endereco: ${this.endereco}`);
    console.log(`Usuario: ${this.usuario}`);
    console.log(`Permissao: ${this.permissao}`);
  }
}