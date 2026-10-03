# Shark Tech — Novo Site Institucional do CEEP Curitiba

Novo portal institucional do **Centro Estadual de Educação Profissional de Curitiba**,
desenvolvido como Projeto Integrador do Curso Técnico em Desenvolvimento de Sistemas.

O objetivo do sistema é **substituir o site institucional atual**, reunindo em um só
lugar a apresentação da escola, os cursos técnicos, notícias, documentos, serviços da
secretaria e o encaminhamento para os sistemas oficiais da SEED-PR.

- **Empresa responsável:** Shark Tech
- **Cliente:** CEEP Curitiba
- **Desenvolvedores:** Igor Danton de Oliveira e Vinicius Edson do Prado Barreto de Souza

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | HTML5, CSS3 e JavaScript (sem framework) |
| Back-end | Node.js + Express |
| Banco de dados | MySQL 8 |
| Autenticação | express-session + bcryptjs |
| Editor | Visual Studio Code |

A documentação do projeto define HTML, CSS, JavaScript e MySQL. Foram acrescentados
apenas dois itens, ambos justificados:

- **Express** — servidor HTTP e rotas da API. É a forma mais direta de usar JavaScript
  no back-end, como previsto no plano de ação. Sem ele seria preciso escrever
  manualmente o roteamento com o módulo `http` do Node.
- **bcryptjs** — gera o hash das senhas do painel. O RNF02 exige autenticação, e
  guardar senha em texto puro no banco seria uma falha de segurança grave.

Nenhum framework de front-end foi usado: a interface é HTML, CSS e JavaScript puro.

---

## Instalação rápida

```bash
npm install
cp .env.example .env        # no Windows: copy .env.example .env
# edite o .env com a senha do seu MySQL
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
npm run criar-admin -- "Seu Nome" "seu@email.com" "SuaSenhaAqui"
npm start
```

Abra <http://localhost:3000>.

O passo a passo detalhado, com as diferenças entre PowerShell e CMD, está em
[`docs/INSTALACAO.md`](docs/INSTALACAO.md).

---

## Estrutura de pastas

```text
shark-tech-ceep/
├── public/               Tudo que o navegador acessa
│   ├── css/              base.css (tokens e layout) + componentes.css
│   ├── js/               um arquivo por página + api.js, app.js, dados.js
│   ├── components/       header.html e footer.html reaproveitados em todas as páginas
│   ├── assets/images/    imagens do site
│   ├── admin/            área administrativa (login e painel)
│   └── *.html            páginas públicas
├── src/                  Back-end
│   ├── config/db.js      pool de conexão com o MySQL
│   ├── middlewares/      controle de acesso e tratamento de erros
│   ├── routes/           uma rota por assunto (cursos, avaliações, conteúdo…)
│   └── server.js         ponto de entrada da aplicação
├── database/
│   ├── schema.sql        criação do banco e das tabelas
│   └── seed.sql          dados iniciais
├── scripts/criar-admin.js
├── docs/                 instalação, migração do site atual e pendências
├── .env.example          modelo de configuração (o .env real nunca vai pro Git)
└── package.json
```

Por que cada pasta existe:

- `public/` é a única pasta exposta publicamente. Separar isso de `src/` evita que um
  arquivo do servidor seja servido por engano.
- `src/routes/` divide a API por assunto. Um arquivo gigante com todas as rotas fica
  impossível de manter e de apresentar.
- `components/` existe para que header e footer sejam escritos uma vez só. Mudar um link
  do menu altera 15 páginas de uma vez.
- `database/` mantém o SQL versionado no Git, então qualquer pessoa da equipe recria o
  banco do zero com dois comandos.

---

## Mapa do site

| Página | Arquivo | Atende |
|---|---|---|
| Início | `index.html` | RF01, RF05, RF07 |
| Cursos | `cursos.html` | RF01, RF05 |
| Página de curso | `curso.html?id=` | RF02, RF04, RF08 |
| Comparar cursos | `comparador.html` | comparação entre dois cursos |
| A instituição | `instituicao.html` | RF07 |
| Estrutura e laboratórios | `estrutura.html` | RF07 |
| Como ingressar | `como-ingressar.html` | RF09 |
| Notícias e comunicados | `noticias.html` | portal institucional |
| Documentos e editais | `documentos.html` | portal institucional |
| Secretaria | `secretaria.html` | portal institucional |
| Contato | `contato.html` | RF07 |
| Área do aluno | `area-do-aluno.html` | RF03, RF08 |
| Busca | `busca.html` | RF05 |
| Área administrativa | `admin/` | RF04, RF06, RNF02 |

---

## API

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/cursos` | lista cursos (`?q=`, `?area=`, `?turno=`) |
| GET | `/api/cursos/areas` | eixos tecnológicos com contagem |
| GET | `/api/cursos/comparar?a=&b=` | compara dois cursos |
| GET | `/api/cursos/:id` | curso com disciplinas, professores e avaliações aprovadas |
| POST | `/api/avaliacoes` | envia avaliação ou depoimento (entra como pendente) |
| GET | `/api/noticias` | notícias publicadas |
| GET | `/api/documentos` | documentos publicados |
| GET | `/api/busca?q=` | busca em cursos, notícias e documentos |
| POST | `/api/auth/login` | entra na área administrativa |
| POST | `/api/auth/logout` | encerra a sessão |
| GET | `/api/admin/*` | rotas protegidas do painel |

---

## Alterações no DER

O modelo do PDF foi mantido. As mudanças abaixo foram necessárias para atender
requisitos que já estavam na documentação, mas não tinham tabela correspondente.

| Alteração | Por quê | Impacto |
|---|---|---|
| Tabela `usuario_admin` | O RNF02 exige autenticação e controle de acesso, e o DER não tinha onde guardar o usuário do painel | Tabela nova, isolada; não altera as existentes |
| Coluna `avaliacao.tipo` | O RF08 pede depoimentos de egressos, que têm fluxo de aprovação igual ao das avaliações | Uma coluna, em vez de uma tabela duplicada |
| Colunas `curso.perfil_egresso` e `curso.requisitos_ingresso` | O RF02 exige exibir perfil e requisitos do curso | Duas colunas de texto |
| Coluna `curso.slug` | URL legível e melhor indexação nos buscadores | Coluna única |
| Tabelas `noticia` e `documento` | Páginas de Notícias/Comunicados e Documentos/Editais, necessárias porque o site passa a substituir o portal institucional | Tabelas independentes, sem relacionamento com as demais |

Nenhum atributo do DER original foi removido.

---

## Dados institucionais

O arquivo `public/js/dados.js` concentra os dados da escola usados em várias páginas.
Ele segue a regra do projeto: **nada pode ser inventado**. Cada informação está
classificada como confirmada, histórica ou pendente, e o site exibe essa marcação.

Dados confirmados em uso:

- Rua Frederico Maurer, 3015 — Boqueirão, Curitiba/PR, CEP 81670-020
- Telefone (41) 3276-9534 · Código INEP 41129857
- Censo Escolar 2025: 1.137 matrículas, 121 professores, 0 reprovações, 0 abandonos
- IDEB 2025 — Ensino Médio: 5,7 (sempre exibido com o ano)
- Saeb 2023 — 3º ano: Português 64%, Matemática 16%
- Fundação em 1941 como Instituto Técnico de Agronomia, Veterinária e Química do Paraná

Marcado como **dado histórico** (não publicar como atual):

- cerca de 15 laboratórios para cursos básicos e específicos

Pendências abertas estão em [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md).

---

## Padrão de commits

```text
feat:     nova funcionalidade        feat: adiciona comparador de cursos
fix:      correção de erro           fix: corrige filtro por eixo na listagem
style:    visual e formatação        style: ajusta espaçamento do rodapé
docs:     documentação               docs: atualiza guia de instalação
refactor: melhoria interna           refactor: separa rotas de conteúdo
```

---

## Segurança

- Senhas guardadas como hash bcrypt, nunca em texto puro.
- Todas as consultas usam parâmetros (`?`), o que impede SQL Injection.
- Conteúdo vindo do banco passa por `escapar()` antes de entrar no HTML (previne XSS).
- Cookie de sessão `httpOnly` e `sameSite=lax`; em produção também `secure`.
- Credenciais só no `.env`, que está no `.gitignore`.
- Avaliações e depoimentos só aparecem no site depois de aprovados.

## Área Administrativa

A área administrativa utiliza autenticação por e-mail e senha.

O primeiro administrador deve ser criado durante a instalação da aplicação:

npm run criar-admin 

Não versionar credenciais no GitHub.

---

## Licença

Projeto acadêmico. Uso livre para fins educacionais.
