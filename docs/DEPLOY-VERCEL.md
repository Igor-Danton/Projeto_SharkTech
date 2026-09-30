
# 🚀 Guia de Deploy no Vercel — SharkTech

## Visão geral

Este projeto é um backend Express com HTML/CSS/JS estáticos em `public/` e banco MySQL. Para deploy no Vercel, o app precisa ser montado como função Node.js e a base de dados precisa ficar em um provedor externo.

A melhor opção gratuita para esse projeto hoje é o TiDB Serverless, porque é compatível com MySQL, funciona bem em ambientes serverless e oferece plano gratuito.

## Banco recomendado

### TiDB Serverless (recomendado)

- Compatível com MySQL
- Serverless e sem necessidade de manter VM
- Plano gratuito inicial suficiente para projetos acadêmicos e pequenos projetos
- Funciona bem com Vercel
- Usa SSL por padrão

## Requisitos

- Conta no GitHub
- Conta no TiDB Cloud
- Repositório no GitHub
- Conta no Vercel

## 1) Criar o banco no TiDB Cloud

1. Acesse: https://tidbcloud.com
2. Faça cadastro com GitHub ou e-mail
3. Crie um cluster do tipo `Serverless`
4. Escolha região próxima ao deploy (ex.: EUA/Europa/América do Sul)
5. Aguarde a criação do cluster

Depois que o cluster estiver pronto:

1. Abra o cluster
2. Vá em `Connect`
3. Copie as informações de conexão
4. Anote:
   - `DB_HOST`
   - `DB_PORT` (normalmente `4000`)
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`

## 2) Configurar as variáveis locais

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
NODE_ENV=development

DB_HOST=seu_host.tidbcloud.com
DB_PORT=4000
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=sharktech_ceep

SESSION_SECRET=gere_uma_chave_forte
```

### Gerar uma chave forte para SESSION_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 3) Importar o schema do banco

Use o cliente MySQL ou o SQL Editor do TiDB Cloud.

```bash
mysql -u seu_usuario -p -h seu_host.tidbcloud.com -P 4000 sharktech_ceep < database/schema.sql
mysql -u seu_usuario -p -h seu_host.tidbcloud.com -P 4000 sharktech_ceep < database/seed.sql
```

Se o cliente MySQL não estiver instalado localmente, use o SQL Editor do TiDB Cloud e rode os arquivos SQL no ambiente do banco.

## 4) Ajustar a conexão do projeto

O arquivo `src/config/db.js` deve estar assim:

```javascript
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sharktech_ceep',
  waitForConnections: true,
  connectionLimit: process.env.NODE_ENV === 'production' ? 1 : 10,
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci',
  dateStrings: true,
  ssl: true,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

async function testarConexao() {
  const conexao = await pool.getConnection();
  await conexao.ping();
  conexao.release();
}

module.exports = { pool, testarConexao };
```

### Por que isso importa?

- `DB_PORT=4000` é a porta padrão do TiDB Serverless
- `ssl: true` é obrigatório para a maioria dos serviços serverless
- `connectionLimit: 1` evita excesso de conexões em ambiente Vercel/serverless

## 5) Atualizar o `.env.example`

O arquivo `.env.example` deve ficar assim:

```env
# Copie este arquivo para .env e preencha com os seus dados.
# O arquivo .env NUNCA deve ir para o GitHub.

PORT=3000
NODE_ENV=development

DB_HOST=seu_host.tidbcloud.com
DB_PORT=4000
DB_USER=seu_usuario
DB_PASSWORD=sua_senha_gerada
DB_NAME=sharktech_ceep

SESSION_SECRET=troque-esta-chave-por-um-texto-longo-e-aleatorio
```

## 6) Configurar o deploy no Vercel

### Passo 1: criar `vercel.json`

Na raiz do projeto, adicione:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/src/server.js" },
    { "src": "/(.*)", "dest": "/src/server.js" }
  ]
}
```

### Passo 2: configurar variáveis de ambiente no Vercel

No painel do Vercel:

- Projeto → Settings → Environment Variables
- Adicione:

```env
NODE_ENV=production
DB_HOST=seu_host.tidbcloud.com
DB_PORT=4000
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=sharktech_ceep
SESSION_SECRET=sua_chave_forte
```

### Passo 3: fazer o deploy

1. Faça push para o GitHub
2. Importe o repositório no Vercel
3. Clique em `Deploy`
4. Aguarde a build terminar

## 7) Testar a aplicação em produção

Depois do deploy, teste:

- `https://seu-projeto.vercel.app/`
- `https://seu-projeto.vercel.app/api/cursos`
- `https://seu-projeto.vercel.app/admin/`

Se tiver um endpoint `/api/health`, teste também:

```bash
curl https://seu-projeto.vercel.app/api/health
```

## 8) Observações importantes

- O banco MySQL precisa ficar em provedor externo; o Vercel não hospeda banco de dados do tipo MySQL de forma nativa
- O TiDB Cloud oferece plano gratuito inicial e é a melhor opção para esse projeto
- O TiDB deve ser usado com SSL ativo
- O projeto precisa expor a aplicação Express em `module.exports = app` para funcionar corretamente em serverless

## 9) Checklist final

- [ ] Conta no TiDB Cloud criada
- [ ] Cluster serverless criado
- [ ] Variáveis configuradas localmente
- [ ] Banco importado com schema e seed
- [ ] `src/config/db.js` atualizado
- [ ] `.env.example` ajustado
- [ ] `vercel.json` presente
- [ ] Vercel com variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Aplicação acessível no domínio do Vercel
- [ ] API funcionando em produção

## 10) Recomendação final

Para esse projeto específico, a melhor combinação é:

- Vercel → hospedagem do backend e front-end
- TiDB Serverless → banco de dados gratuito e compatível com MySQL

Essa combinação é a mais simples, mais estável e mais adequada para um projeto acadêmico e para uso inicial sem custos.
