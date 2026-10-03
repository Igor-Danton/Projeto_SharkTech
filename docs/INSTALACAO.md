# Guia de instalação e execução

Passo a passo completo, do zero até o site rodando no navegador.
Os comandos do Windows estão indicados quando forem diferentes.

---

## 1. Programas necessários

| Programa | Versão | Onde baixar |
|---|---|---|
| Node.js | 18 ou superior | <https://nodejs.org> (versão LTS) |
| MySQL Server | 8.0 ou superior | <https://dev.mysql.com/downloads/mysql/> |
| Git | qualquer versão atual | <https://git-scm.com/downloads> |

Confira se instalou certo. No **PowerShell** (Windows) ou no terminal do VS Code:

```powershell
node -v
npm -v
mysql --version
git --version
```

Se `mysql` não for reconhecido no Windows, o MySQL não está no PATH. Duas saídas:
usar o **MySQL Workbench** para rodar os scripts SQL, ou adicionar
`C:\Program Files\MySQL\MySQL Server 8.0\bin` à variável PATH do sistema.

---

## 2. Baixar o projeto

Se você já tem a pasta, pule para o passo 3.

```bash
git clone https://github.com/Igor-Danton/Projeto_SharkTech.git
cd shark-tech-ceep
```

No VS Code: **Arquivo → Abrir pasta**, escolha `shark-tech-ceep` e abra o terminal
integrado com **Ctrl + '** (aspas simples).

---

## 3. Instalar as dependências

```bash
npm install
```

Isso cria a pasta `node_modules/`, que não vai para o Git. Demora de 10 a 60 segundos.

---

## 4. Configurar o arquivo `.env`

O `.env` guarda a senha do banco. Ele **nunca** pode ir para o GitHub — já está no
`.gitignore`.

**Windows (PowerShell ou CMD):**
```powershell
copy .env.example .env
```

**Linux ou macOS:**
```bash
cp .env.example .env
```

Abra o `.env` no VS Code e preencha:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=a_senha_que_voce_definiu_ao_instalar_o_mysql
DB_NAME=sharktech_ceep
SESSION_SECRET=qualquer-texto-longo-e-aleatorio-aqui
```

---

## 5. Criar o banco de dados

O `schema.sql` **apaga e recria** o banco `sharktech_ceep`. Se você já tiver dados
lá dentro, eles serão perdidos.

**Pelo terminal:**
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

O terminal vai pedir a senha do MySQL — ela não aparece enquanto você digita, é normal.

**Pelo MySQL Workbench:** abra `database/schema.sql`, execute com o raio ⚡,
depois faça o mesmo com `database/seed.sql`.

Para conferir:

```sql
USE sharktech_ceep;
SHOW TABLES;
SELECT id_curso, nome FROM curso;
```

Devem aparecer 8 tabelas e 11 cursos.

---

## 6. Criar o usuário da área administrativa

Não existe usuário padrão no projeto — seria uma falha de segurança deixar uma senha
conhecida no repositório. Crie o seu: npm run criar-admin

O acesso administrativo é criado pelo script `npm run criar-admin`.
Consulte `docs/INSTALACAO.md` para configurar as credenciais.

Os dois hífens (`--`) são obrigatórios: eles avisam o npm que os argumentos são para o
script, não para o npm. A senha precisa ter no mínimo 8 caracteres e é salva como hash.

Rodar o comando de novo com o mesmo e-mail **troca a senha** daquele usuário.

---

## 7. Rodar o projeto

```bash
npm start
```

Saída esperada:

```text
[ok] Conectado ao MySQL.

Shark Tech / CEEP Curitiba
Servidor rodando em http://localhost:3000
```

Abra <http://localhost:3000> no navegador.

Durante o desenvolvimento, use `npm run dev`: o servidor reinicia sozinho a cada
alteração em arquivos do back-end. Alterações em HTML, CSS e JS do `public/` só
precisam de **F5** no navegador.

Para parar o servidor: **Ctrl + C** no terminal.

---

## 8. O que testar

| Onde | O que fazer | Resultado esperado |
|---|---|---|
| `/` | abrir a home | indicadores, 6 cursos e o bloco de notícias |
| `/cursos.html` | filtrar por eixo | a lista diminui conforme o filtro |
| `/curso.html?id=2` | abrir Desenvolvimento de Sistemas | dados pendentes aparecem marcados em vermelho |
| `/comparador.html` | escolher dois cursos | tabela lado a lado |
| busca do topo | digitar "sistemas" | leva para `/busca.html` com resultados |
| `/area-do-aluno.html` | enviar uma avaliação | mensagem de que ficará aguardando análise |
| `/admin/` | entrar com o usuário criado | painel com a avaliação na fila |
| painel → aprovar | aprovar a avaliação | ela passa a aparecer na página do curso |
| celular (F12 → modo responsivo) | navegar | menu vira botão "Menu" |

---

## 9. Erros comuns

**`ECONNREFUSED` ou `[aviso] Não foi possível conectar ao MySQL`**
O serviço do MySQL está parado. No Windows: tecla Windows → "Serviços" → procure
`MySQL80` → botão direito → Iniciar.

**`ER_ACCESS_DENIED_ERROR`**
Usuário ou senha errados no `.env`. Confirme entrando manualmente com `mysql -u root -p`.

**`ER_BAD_DB_ERROR: Unknown database 'sharktech_ceep'`**
O `schema.sql` não foi executado. Volte ao passo 5.

**`EADDRINUSE: address already in use :::3000`**
Já existe algo na porta 3000 — provavelmente outro `npm start` aberto. Feche o outro
terminal ou troque `PORT=3001` no `.env`.

**As páginas abrem mas ficam sem cabeçalho e sem cursos**
Você abriu o arquivo HTML com duplo clique (`file:///...`). O site precisa do servidor:
use sempre `http://localhost:3000`.

**`npm : O termo 'npm' não é reconhecido`**
O Node.js não foi instalado ou o terminal foi aberto antes da instalação. Feche e abra
o VS Code novamente.

---

## 10. Enviar para o GitHub

Se o repositório ainda não existe, crie um vazio no GitHub (sem README) e rode:

```bash
git init
git add .
git commit -m "feat: estrutura inicial do novo site institucional"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/shark-tech-ceep.git
git push -u origin main
```

Antes do primeiro `push`, confira que o `.env` **não** está na lista:

```bash
git status
```

Se `.env` aparecer, pare e verifique o `.gitignore`.

Nos próximos envios:

```bash
git status
git add .
git commit -m "feat: descrição do que mudou"
git push
```

> **Atenção:** `git reset --hard`, `git clean -fd` e `git push --force` apagam trabalho
> sem possibilidade de recuperação pelo Git. Não use esses comandos sem ter certeza.
