# Checklist de Segurança — SharkTech

## Credenciais e Configuração

- ✅ Arquivo `.env` configurado com variáveis locais
- ✅ Arquivo `.env` no `.gitignore` (não versionado)
- ✅ `.env.example` existe como referência, com valores fictícios
- ✅ Nenhuma senha real no `.env.example`
- ✅ SESSION_SECRET com mínimo 32 caracteres
- ✅ Credenciais do banco preenchidas corretamente

## Banco de Dados

- ✅ Tabela `usuario_admin` criada com `id_usuario`, `email`, `senha_hash`
- ✅ Campo `senha_hash` usa VARCHAR(255) para bcrypt
- ✅ Todas as queries usam prepared statements (placeholders `?`)
- ✅ Nenhuma query com concatenação de strings diretas
- ✅ Índices criados para performance nas tabelas principais
- ✅ Chaves primárias e estrangeiras configuradas

## Autenticação

- ✅ Senha armazenada como hash bcrypt, nunca em texto puro
- ✅ Login por e-mail e senha
- ✅ Script `criar-admin.js` para criar/resetar senha de admin
- ✅ Senha mínima 8 caracteres no script
- ✅ Sessão criada via `express-session` com cookie `httpOnly`
- ✅ Cookie `sameSite=lax` (em produção: `secure=true`)
- ✅ Timeout de sessão: 4 horas
- ✅ Rate limiting no login (10 tentativas em 15 minutos)

## Rotas Administrativas

- ✅ Todas as rotas `/api/admin/*` protegidas por middleware `exigirAdmin`
- ✅ Middleware verifica `req.session.usuario` antes de permitir acesso
- ✅ GET /api/auth/me — verifica sessão ativa
- ✅ POST /api/auth/login — autentica administrador
- ✅ POST /api/auth/logout — encerra sessão
- ✅ PUT /api/auth/mudar-senha — permite trocar senha autenticado
- ✅ Erro genérico "E-mail ou senha incorretos" (não revela que usuário existe)

## Validação de Entrada

- ✅ `email` — validado como e-mail válido
- ✅ `senha` — mínimo 8 caracteres
- ✅ `nome` — mínimo 3 caracteres
- ✅ `id_curso`, `id_noticia`, `id_documento` — validados como integers
- ✅ Campos de texto — escapados com função `escapar()` antes de inserir no HTML
- ✅ Campos `nota` — validados como 1-5
- ✅ LIMIT em queries de busca (máximo 20-50 resultados)

## XSS e Injeção

- ✅ Conteúdo vindo do banco passa por `escapar()` antes de inserir no HTML
- ✅ Todas as queries usam placeholders `?` (previne SQL Injection)
- ✅ JSON.stringify usado para enviar dados para API
- ✅ Sem uso de `eval()` ou `innerHTML` perigosos

## CORS e Headers

- ✅ Helmet.js ativo para headers de segurança
- ✅ X-Frame-Options: deny
- ✅ X-Content-Type-Options: nosniff
- ✅ Content-Security-Policy configurado
- ✅ Credenciais enviadas com `credentials: 'same-origin'`

## Errros e Logs

- ✅ Erros detalhados ficam no console do servidor
- ✅ Cliente recebe apenas mensagens genéricas
- ✅ Nenhuma informação sensível em mensagens de erro
- ✅ Tratamento central de erros em `src/middlewares/erros.js`

## Dependências

- ✅ bcryptjs — hash de senha
- ✅ express-session — gerenciamento de sessão
- ✅ helmet — headers de segurança
- ✅ express-rate-limit — proteção contra brute force
- ✅ mysql2 — conexão com banco
- ✅ dotenv — variáveis de ambiente
- ✅ express — servidor web

Todas as versões fixadas no `package.json`.

## Testes Recomendados

1. Criar admin: `npm run criar-admin -- "Teste" "teste@ceep.edu.br" "Abc@12345678"`
2. Login com e-mail/senha corretos → deve entrar
3. Login com e-mail/senha errados → mensagem genérica
4. Tentar 11 vezes o login → rate limit (bloqueado por 15 min)
5. Acessar `/api/admin/resumo` sem autenticar → erro 401
6. Acessar `/api/admin/resumo` autenticado → deve retornar dados
7. Logout → sessão encerrada
8. Trocar senha autenticado (PUT /api/auth/mudar-senha) → funcionando
9. Acessar `/health` e `/health/readiness` → sem autenticação

## Deploy em Produção

- [ ] Usar banco externo (TiDB, AWS RDS, etc.)
- [ ] NODE_ENV=production
- [ ] SESSION_SECRET com chave muito forte
- [ ] Cookie `secure=true` (apenas HTTPS)
- [ ] Rate limit mais restritivo
- [ ] HTTPS obrigatório
- [ ] Backup automático do banco
- [ ] Monitoramento de erros (Sentry, etc.)
- [ ] Logs centralizados
- [ ] Renovação de SESSION_SECRET periodicamente

---

**Verificação rápida:**
```bash
npm run check          # linting + formatação
npm start              # inicia servidor
curl http://localhost:3000/health  # verifica saúde
```

