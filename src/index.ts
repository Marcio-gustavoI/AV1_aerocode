import * as readline from "readline";
import { aeronave } from "./aeronave";
import { peca } from "./peca";
import { etapa } from "./etapa";
import { teste } from "./teste";
import { relatorio } from "./relatorio";
import { funcionario } from "./funcionario";
import { salvarDados, carregarDados } from "./percistencia";
import {
  tipoAeronave,
  nivelPermissao,
  tipoPeca,
  statusPeca,
  statusEtapa,
  tipoTeste,
  resultadoTeste,
} from "./enums";

let aeronaves: aeronave[] = [];
let usuarios: funcionario[] = [];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function perguntar(texto: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(texto, (resp) => resolve(resp.trim()));
  });
}

function linha(): void {
  console.log("----------------------------------------");
}

function sincronizarBanco() {
  salvarDados(aeronaves, usuarios);
}

// Tela de login
async function login(): Promise<funcionario | null> {
  console.log("\nSistema Aerocode");
  console.log("=== Login ===");

  const usuario = await perguntar("usuario: ");
  const senha   = await perguntar("senha:   ");

  return usuarios.find((u) => u.autenticar(usuario, senha)) ?? null;
}

// menu principal
async function menuPrincipal(usuarioLogado: funcionario): Promise<void> {
  while (true) {
    console.log("\n========================================");
    console.log(`  AEROCODE  |  ${usuarioLogado.nome} (${usuarioLogado.permissao})`);
    console.log("========================================");
    console.log("1. Cadastrar aeronave");
    console.log("2. Listar aeronaves");
    console.log("3. Adicionar peça a aeronave");
    console.log("4. Adicionar etapa a aeronave");
    console.log("5. Adicionar funcionario a etapa");
    console.log("6. Registrar teste em aeronave");
    console.log("7. Gerar relatorio final");
    console.log("8. Atualizar status de Etapa");
    console.log("9. Atualizar status de Peça");
    console.log("0. Sair");
    linha();

    const opcao = await perguntar("escolha: ");

    switch (opcao) {
      case "1": 
        if (verificarPermissao(usuarioLogado, [nivelPermissao.administrador])) await cadastrarAeronave();
        break;
      case "2": 
        listarAeronaves(); 
        break;
      case "3": 
        if (verificarPermissao(usuarioLogado, [nivelPermissao.administrador, nivelPermissao.engenheiro])) await adicionarPeca(); 
        break;
      case "4": 
        if (verificarPermissao(usuarioLogado, [nivelPermissao.administrador, nivelPermissao.engenheiro])) await adicionarEtapa(); 
        break;
      case "5": 
        if (verificarPermissao(usuarioLogado, [nivelPermissao.administrador, nivelPermissao.engenheiro])) await adicionarFuncionarioEtapa(); 
        break;
      case "6": 
        if (verificarPermissao(usuarioLogado, [nivelPermissao.administrador, nivelPermissao.engenheiro])) await registrarTeste(); 
        break;
      case "7": 
        if (verificarPermissao(usuarioLogado, [nivelPermissao.administrador, nivelPermissao.engenheiro])) await gerarRelatorio(); 
        break;
      case "8": 
        await atualizarStatusEtapa(); 
        break;
      case "9": 
        await atualizarStatusPeca(); 
        break;
        
      // EASTER EGG DO BOEING 747
      case "747": 
        console.log("\n========================================================");
        console.log("EASTER EGG ENCONTRADO");
        console.log("O BOEING 747");
        console.log("========================================================");
        console.log("");
        console.log("  O Boeing 747, também conhecido como 'Jumbo Jet',");
        console.log("  é amplamente considerado o avião comercial mais");
        console.log("  famoso e icônico do mundo. Lançado em 1969,");
        console.log("  revolucionou a aviação com seu tamanho e capacidade.");
        console.log("");
        console.log("========================================================");
        break;
      // 

      case "0":
        sincronizarBanco();
        console.log("\nDados salvos. Sistema encerrado com sucesso");
        rl.close();
        return;
        
      default:
        console.log("Opcao invalida.");
    }
  }
}

function verificarPermissao(usuario: funcionario, permissoesPermitidas: nivelPermissao[]): boolean {
  if (permissoesPermitidas.includes(usuario.permissao)) {
    return true;
  }
  console.log(`\n[ACESSO NEGADO] Sua permissão (${usuario.permissao}) não permite realizar esta ação.`);
  return false;
}

// cadastrar
async function cadastrarAeronave(): Promise<void> {
  console.log("\n=== Cadastrar aeronave ===");

  const codigo = await perguntar("Codigo: ");
  const jaExiste = aeronaves.some((a) => a.codigo === codigo);
  if (jaExiste) {
    console.log("Erro: ja existe uma aeronave com esse codigo.");
    return;
  }

  const modelo     = await perguntar("Modelo: ");
  const cliente    = await perguntar("Cliente: ");
  const capacidade = parseInt(await perguntar("Capacidade de passageiros: "));
  const alcance    = parseInt(await perguntar("Alcance em km: "));

  console.log("Tipo da aeronave:");
  console.log("1. Comercial");
  console.log("2. Militar");
  const tipoOpcao = await perguntar("escolha: ");
  const tipo = tipoOpcao === "2" ? tipoAeronave.militar : tipoAeronave.comercial;

  const nova = new aeronave(codigo, modelo, tipo, capacidade, alcance, cliente);
  aeronaves.push(nova);
  sincronizarBanco();

  console.log(`\nAeronave "${modelo}" cadastrada com sucesso`);
}

// listar
function listarAeronaves(): void {
  console.log("\n=== Aeronaves cadastradas ===");
  if (aeronaves.length === 0) {
    console.log("Nenhuma aeronave cadastrada.");
    return;
  }
  for (const a of aeronaves) {
    a.exibirDetalhes();
    linha();
  }
}

async function selecionarAeronave(): Promise<aeronave | null> {
  if (aeronaves.length === 0) {
    console.log("Nenhuma aeronave cadastrada.");
    return null;
  }
  console.log("\nAeronaves disponiveis:");
  aeronaves.forEach((a, i) => console.log(`${i + 1}. [${a.codigo}] ${a.modelo}`));
  const idx = parseInt(await perguntar("Numero da aeronave: ")) - 1;
  
  if (isNaN(idx) || idx < 0 || idx >= aeronaves.length) {
    console.log("Opcao invalida.");
    return null;
  }
  return aeronaves[idx];
}

// add peca
async function adicionarPeca(): Promise<void> {
  console.log("\n=== Adicionar peça ===");
  const av = await selecionarAeronave();
  if (!av) return;

  const nome       = await perguntar("Nome da peça: ");
  const fornecedor = await perguntar("Fornecedor: ");

  console.log("Tipo da peça:");
  console.log("1. Nacional");
  console.log("2. Importada");
  const tipoOpcao = await perguntar("escolha: ");
  const tipo = tipoOpcao === "2" ? tipoPeca.importada : tipoPeca.nacional;

  console.log("Status da peça:");
  console.log("1. Em producao");
  console.log("2. Em transporte");
  console.log("3. Pronta");
  const statusOpcao = await perguntar("escolha: ");
  let status: statusPeca;
  if (statusOpcao === "2")      status = statusPeca.em_transporte;
  else if (statusOpcao === "3") status = statusPeca.pronta;
  else                          status = statusPeca.em_producao;

  const novaPeca = new peca(nome, tipo, fornecedor, status);
  av.adicionarPeca(novaPeca);
  sincronizarBanco();

  console.log(`\nPeca "${nome}" adicionada na aeronave "${av.modelo}".`);
}

// add etapa
async function adicionarEtapa(): Promise<void> {
  console.log("\n=== Adicionar etapa ===");
  const av = await selecionarAeronave();
  if (!av) return;

  const nome  = await perguntar("Nome da etapa: ");
  const prazo = await perguntar("Prazo (digite uma data): ");

  const novaEtapa = new etapa(nome, prazo);
  av.adicionarEtapa(novaEtapa);
  sincronizarBanco();

  console.log(`Etapa "${nome}" adicionada a aeronave "${av.modelo}".`);
}

// add funcionario na etapa
async function adicionarFuncionarioEtapa(): Promise<void> {
  console.log("\n=== Adicionar funcionario a etapa ===");
  const av = await selecionarAeronave();
  if (!av) return;

  if (av.etapas.length === 0) {
    console.log("Essa aeronave nao tem etapas cadastradas.");
    return;
  }

  console.log("Etapas:");
  av.etapas.forEach((e, i) => console.log(`${i + 1}. ${e.nome} (${e.status})`));
  const idxEtapa = parseInt(await perguntar("Numero da etapa: ")) - 1;
  
  if (isNaN(idxEtapa) || idxEtapa < 0 || idxEtapa >= av.etapas.length) {
    console.log("Opcao invalida.");
    return;
  }
  const etapaEscolhida = av.etapas[idxEtapa];

  console.log("Funcionarios:");
  usuarios.forEach((u, i) => console.log(`${i + 1}. ${u.nome} (${u.permissao})`));
  const idxFunc = parseInt(await perguntar("Numero do funcionario: ")) - 1;
  
  if (isNaN(idxFunc) || idxFunc < 0 || idxFunc >= usuarios.length) {
    console.log("Opcao invalida.");
    return;
  }
  
  const func = usuarios[idxFunc];
  etapaEscolhida.adicionarFuncionario(func);
  sincronizarBanco();
  
  console.log(`Funcionario "${func.nome}" adicionado a etapa "${etapaEscolhida.nome}".`);
}

// Registra teste
async function registrarTeste(): Promise<void> {
  console.log("\n=== Registrar teste ===");
  const av = await selecionarAeronave();
  if (!av) return;

  console.log("Tipo do teste:");
  console.log("1. Eletrico");
  console.log("2. Hidraulico");
  console.log("3. Aerodinamico");
  const tipoOpcao = await perguntar("escolha: ");

  let tipo: tipoTeste;
  if (tipoOpcao === "2") tipo = tipoTeste.hidraulico;
  else if (tipoOpcao === "3") tipo = tipoTeste.aerodinamico;
  else tipo = tipoTeste.eletrico;

  console.log("Resultado:  1. Aprovado  2. Reprovado");
  const resOpcao = await perguntar("escolha: ");
  const resultado = resOpcao === "2" ? resultadoTeste.reprovado : resultadoTeste.aprovado;

  const novoTeste = new teste(tipo, resultado);
  av.adicionarTeste(novoTeste);
  sincronizarBanco();

  console.log(`Teste "${tipo}" registrado: ${resultado}.`);
}

//  Relatorio
async function gerarRelatorio(): Promise<void> {
  console.log("\n=== Gerar relatorio final ===");
  const av = await selecionarAeronave();
  if (!av) return;

  const dataEntrega = await perguntar("Data de entrega: ");
  const rel = new relatorio(av, dataEntrega);

  console.log("\n" + rel.gerar());
  rel.salvar();
}

// Atualizar etapa 
async function atualizarStatusEtapa(): Promise<void> {
  console.log("\n=== Atualizar status de etapa ===");
  const av = await selecionarAeronave();
  if (!av) return;

  if (av.etapas.length === 0) {
    console.log("Nenhuma etapa registrada.");
    return;
  }

  console.log("\nEtapas cadastradas na ordem:");
  av.etapas.forEach((e, i) => console.log(`${i + 1}. ${e.nome} - Atual: ${e.status}`));
  
  const idx = parseInt(await perguntar("Selecione a etapa para atualizar: ")) - 1;
  
  if (isNaN(idx) || idx < 0 || idx >= av.etapas.length) {
    console.log("Opcao invalida.");
    return;
  }

  const etapaSelecionada = av.etapas[idx];

  if (idx > 0) {
    const etapaAnterior = av.etapas[idx - 1];
    if (etapaAnterior.status !== statusEtapa.concluido) {
      console.log(`\n[ERRO] Ação bloqueada! A etapa anterior "${etapaAnterior.nome}" ainda não foi concluída.`);
      return;
    }
  }

  console.log("\nNovo status desejado:");
  console.log("1. Iniciar (Mudar para Andamento)");
  console.log("2. Finalizar (Mudar para Concluído)");
  const op = await perguntar("escolha: ");

  if (op === "1") {
    etapaSelecionada.iniciar();
  } else if (op === "2") {
    etapaSelecionada.finalizar();
  }

  sincronizarBanco();
  console.log(`Status da etapa "${etapaSelecionada.nome}" atualizado para: ${etapaSelecionada.status}`);
}

// Atualizar peca
async function atualizarStatusPeca(): Promise<void> {
  console.log("\n=== Atualizar status de peça ===");
  const av = await selecionarAeronave();
  if (!av) return;

  if (av.pecas.length === 0) {
    console.log("Nenhuma peça registrada nesta aeronave.");
    return;
  }

  console.log("\nPeças da aeronave:");
  av.pecas.forEach((p, i) => console.log(`${i + 1}. ${p.nome} - Atual: ${p.status}`));
  
  const idx = parseInt(await perguntar("Selecione a peça: ")) - 1;
  
  if (isNaN(idx) || idx < 0 || idx >= av.pecas.length) {
    console.log("Opcao invalida.");
    return;
  }

  const pecaSelecionada = av.pecas[idx];

  console.log("\nNovo Status da peça:");
  console.log("1. Em producao");
  console.log("2. Em transporte");
  console.log("3. Pronta");
  const statusOpcao = await perguntar("escolha: ");
  
  if (statusOpcao === "1") pecaSelecionada.atualizarStatus(statusPeca.em_producao);
  else if (statusOpcao === "2") pecaSelecionada.atualizarStatus(statusPeca.em_transporte);
  else if (statusOpcao === "3") pecaSelecionada.atualizarStatus(statusPeca.pronta);

  sincronizarBanco();
  console.log(`Status atualizado com sucesso`);
}

async function main(): Promise<void> {
  const dados = carregarDados();
  aeronaves = dados.aeronaves;
  usuarios = dados.usuarios;

  const usuarioLogado = await login();

  if (!usuarioLogado) {
    console.log("\nUsuario ou senha incorretos");
    rl.close();
    return;
  }

  await menuPrincipal(usuarioLogado);
}

main();