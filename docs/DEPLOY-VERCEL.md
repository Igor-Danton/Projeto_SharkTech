# 🚀 Guia de Deploy no Vercel — SharkTech

## Visão geral

Este projeto é um backend Express com HTML/CSS/JS estáticos em `public/` e banco MySQL. Para deploy no Vercel, o app precisa ser montado como uma função Node.js e receber variáveis de ambiente do banco e do cookie de sessão.

## Build settings recomendados

### Build Command
```
npm install
```

### Output Directory
```
.
```

### Install Command
```
npm install
```

### Framework Preset
```
Other
```

## Variáveis de ambiente

Configure no painel do Vercel (Settings → Environment Variables):

```env
NODE_ENV=production
DB_HOST=seu-host-do-banco
DB_PORT=3306
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_NAME=sharktech_ceep
SESSION_SECRET=gere-uma-chave-forte
```

### Dica para gerar SESSION_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Arquivo Vercel recomendado

```json
{
  "version": 2,
  "builds": [
    { "src": "src/server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/src/server.js" },
    { "src": "/(.*)", "dest": "/src/server.js" }
  ]
}
```

## Observações

- O Vercel hospeda a aplicação, mas o banco MySQL precisa ficar em um provedor externo (ex.: Railway, PlanetScale, RDS, etc.).
- Se estiver usando PlanetScale, verifique se o banco exige SSL.
- O projeto precisa expor a app Express em `module.exports = app` para funcionar em serverless.
- O endpoint `/api/health` ajuda a validar a aplicação após deploy.

## Exemplo de configuração segura para produção

```env
NODE_ENV=production
DB_HOST=endpoint-do-banco
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=senha_forte_gerada
DB_NAME=sharktech_ceep
SESSION_SECRET=GERE_UM_SECRET_FORTE_AQUI
```

## Checklist final

- [ ] Banco MySQL externo pronto
- [ ] Variáveis do Vercel configuradas
- [ ] `vercel.json` presente
- [ ] `src/server.js` exportando app
- [ ] Deploy realizado com sucesso
- [ ] `/api/health` retornando status OK
