# Aerocode - Avaliação Individual 1
**Nome:** Marcio Gustavo Inocêncio - 2° DSM  
**RA:** 1461392521036

**Atividade:** Avaliação Individual 1 (Prof. Eng. Dr. Gerson Penha).  
**O Desafio:** Construir o "Produto Mínimo Viável" (MVP) de um sistema CLI (Command-Line Interface) para a Aerocode, uma empresa focada em softwares para indústrias aeronáuticas. O sistema deve simular o processo completo de produção de uma aeronave, gerenciando o cadastro de aviões, controle de peças, alocação de funcionários em etapas lógicas de produção, testes de qualidade e, por fim, a geração de um relatório final exportado em formato `.txt`. O desafio inclui persistência de dados e controle rigoroso de permissões de acesso.

## Pré-requisitos (Tecnologias)
Para rodar este projeto, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/)
* TypeScript
* Biblioteca `ts-node` (para execução direta do TypeScript)

## Como inicializar o projeto

1. Abra o terminal e navegue até a pasta raiz do projeto:
* `cd aerocode`

2. Instale as dependências executando o comando:
* `npm install`

3. Inicie o sistema executando o comando:
* `npx ts-node src/index.ts`

## Como usar

* **Autenticação:** Ao iniciar, o sistema pedirá um usuário e senha. Utilize uma das credenciais de teste fornecidas abaixo.
* **Navegação:** Um menu principal será exibido com opções de 0 a 9. Digite o número correspondente à ação desejada e aperte Enter.
* **Exemplo:** Logado como Administrador, pressione 1 para cadastrar uma nova aeronave.

## Login

### Nível Administrador (Acesso Total)
**Usuário:** administrador  
**Senha:** 123  

### Nível Engenheiro 
**Usuário:** engenheiro  
**Senha:** 123  

**Permissão de acesso no sistema:** O engenheiro não tem acesso à opção 1 (Cadastrar aeronave). Das opções 2 a 9 o acesso é liberado. 

* 1. Cadastrar aeronave ❌
* 2. Listar aeronaves ✅
* 3. Adicionar peça a aeronave ✅
* 4. Adicionar etapa a aeronave ✅
* 5. Adicionar funcionario a etapa ✅
* 6. Registrar teste em aeronave ✅
* 7. Gerar relatorio final ✅
* 8. Atualizar status de Etapa ✅
* 9. Atualizar status de Peça ✅
* 0. Sair ✅

### Nível Operador
**Usuário:** operador  
**Senha:** 123  

**Permissão de acesso no sistema:** O operador não tem acesso às opções 1, 3, 4, 5, 6 e 7. Para as opções 2, 8 e 9 o acesso é liberado.

* 1. Cadastrar aeronave ❌
* 2. Listar aeronaves ✅
* 3. Adicionar peça a aeronave ❌
* 4. Adicionar etapa a aeronave ❌
* 5. Adicionar funcionario a etapa ❌
* 6. Registrar teste em aeronave ❌
* 7. Gerar relatorio final ❌
* 8. Atualizar status de Etapa ✅
* 9. Atualizar status de Peça ✅
* 0. Sair ✅

## Estrutura do projeto

O projeto foi construído respeitando os princípios da Orientação a Objetos. Os arquivos estão divididos da seguinte forma:

* **index.ts:** Arquivo principal que gerencia os menus do CLI, a captura de dados do terminal e as travas de permissão.
* **aeronave.ts, peca.ts, etapa.ts, funcionario.ts, teste.ts:** Classes que representam as entidades do sistema e suas lógicas internas.
* **enums.ts:** Centraliza os valores fixos utilizados no projeto para evitar erros de digitação.
* **percistencia.ts:** Gerencia a leitura e gravação dos dados no arquivo genérico `dados_aerocode.json`, incluindo a lógica de "hidratação" das classes.
* **relatorio.ts:** Classe focada na extração e formatação dos dados para exportação em `.txt`.

## Conceitos aprendidos

* Programação Orientada a Objetos (POO)
* Tipagem estática
* Enumerações (Enums)
* Persistência de dados
