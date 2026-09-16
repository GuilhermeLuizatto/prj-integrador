# Azis / Projeto Integrador — versão de março de 2026

Plataforma acadêmica colaborativa de tarefas e gamificação: organização de equipes,
quadro Kanban, pontos e acompanhamento do trabalho.

**Stack desta versão:** React + TypeScript + Vite no frontend; Node.js + Express
na API; PostgreSQL; Docker Compose para o ambiente local.

## Origem

Fork de [gigioaf/prj-integrador](https://github.com/gigioaf/prj-integrador).
O histórico compartilha commits com o [Azis de LariWerneck](https://github.com/LariWerneck/Azis).
Esta versão preserva três commits atribuídos à conta de Guilherme Luizatto.

Para os ajustes posteriores de maio, consulte
[Projeto_Integrador](https://github.com/GuilhermeLuizatto/Projeto_Integrador).
Os dois repositórios são versões de um trabalho colaborativo.

## Contribuições verificáveis

| Commit | Contribuição de Guilherme Luizatto |
| --- | --- |
| [d0390f1](https://github.com/GuilhermeLuizatto/prj-integrador/commit/d0390f13ce021b7d8983b495eef92d8a218f7ed5) | Operações de usuários, tratamento de duplicidade na importação e alterações nas telas de importação e estrutura organizacional. |
| [6438680](https://github.com/GuilhermeLuizatto/prj-integrador/commit/6438680955acdfaee25c499f2842f91ac6dd0fda) | Normalização de papéis, níveis de permissão, rota de importação e integração da hierarquia entre frontend e backend. |
| [de90ff9](https://github.com/GuilhermeLuizatto/prj-integrador/commit/de90ff941d711e1df73eac753ec6e55f038d72d8) | API de tarefas com criação, consulta, edição, mudança de status e exclusão; persistência e integração com o Kanban. |

Esses links delimitam alterações registradas; não atribuem a Guilherme a autoria
exclusiva do projeto, da autenticação ou de toda a infraestrutura.

## Como explorar o código

- [API de tarefas](backend/controllers/taskController.js) e [rotas](backend/routes/taskRoutes.js).
- [Regras de papéis e níveis](backend/utils/roleUtils.js).
- [Importação de usuários](frontend/src/pages/UserImport.tsx).
- [Quadro Kanban](frontend/src/pages/Kanban.tsx).
- [Ambiente em containers](docker-compose.yml).

## Ambiente local

Requer Git e Docker com Docker Compose. As portas configuradas são 8080 para o
frontend, 3000 para a API e 5432 para PostgreSQL.

```bash
git clone https://github.com/GuilhermeLuizatto/prj-integrador.git
cd prj-integrador
docker compose up --build
```

Frontend: <http://localhost:8080>.

Para encerrar os containers, preservando o volume de dados:

```bash
docker compose down
```

Esta é uma versão histórica acadêmica. O Compose utiliza credenciais de
desenvolvimento, e o código contém dados de inicialização. Use dados fictícios
em ambiente local. A configuração e os comandos foram revisados estaticamente;
a execução dos containers não foi validada nesta revisão documental.

## Créditos

Consulte o [histórico completo](https://github.com/GuilhermeLuizatto/prj-integrador/commits/main/)
para os demais autores. A referência de portfólio é **contribuição em projeto
colaborativo**.
