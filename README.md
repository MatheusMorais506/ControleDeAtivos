# Controle de Ativos

## Descrição do Projeto

O **Controle de Ativos** é uma ferramenta desenvolvida para gerenciar equipamentos compartilhados, como monitores, teclados e projetores.

### Funcionalidades Principais
1. **Cadastrar um Ativo**: Registrar novos equipamentos com nome e código de identificação.
2. **Listar Ativos**: Visualizar todos os equipamentos com seu status: "Disponível" ou "Em uso".
3. **Realizar Empréstimo (Check-out)**: Marcar um item como "Em uso" e adicionar uma nota sobre quem o retirou.
4. **Registrar Devolução (Check-in)**: Atualizar o status de um item emprestado para "Disponível".
5. **Remover um Ativo**: Excluir equipamentos danificados ou aposentados.

## Tecnologias Utilizadas
- **Backend:** .NET 8 API (ASP.NET Core)
- **Frontend:** React / Next.js
- **Banco de Dados:** SQLite
- **Containerização:** Docker & Docker Compose

## Estrutura do Projeto
| Pasta / Arquivo                      | Descrição                                      |
|-------------------------------------|------------------------------------------------|
| src/ControleDeAtivos.Api/            | Backend (API ASP.NET Core)                     |
| src/ControleDeAtivos.Application/    | Camada de aplicação: serviços, casos de uso, DTOs |
| src/ControleDeAtivos.Domain/         | Camada de domínio: entidades e regras de negócio |
| src/ControleDeAtivos.Infrastructure/ | Persistência, migrations, contexto EF         |
| src/frontend/                        | Frontend React/Next.js                         |
| docker-compose.yml                   | Configuração de containers Docker             |
| README.md                            | Documentação do projeto                        |


## Pré-requisitos
Antes de executar o projeto, instale:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Executando a Aplicação
1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git
   cd seu-repo

2. Execute o Docker Compose para construir e subir os containers:
   ```
   docker-compose up --build

3. Acesse a aplicação:
   ```
   Backend: http://localhost:5000
   Frontend: http://localhost:3000
