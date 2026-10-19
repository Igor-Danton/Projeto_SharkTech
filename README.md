# Shark Tech — Novo Site Institucional do CEEP Curitiba

Novo portal institucional do **Centro Estadual de Educação Profissional de Curitiba**,
desenvolvido como Projeto Integrador do Curso Técnico em Desenvolvimento de Sistemas.

## Instalação rápida

```bash
npm install
cp .env.example .env
# edite o .env com as credenciais do seu MySQL / TiDB
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
npm run criar-admin -- "Seu Nome" "admin@exemplo.com" "SenhaForte123"
# ou, para redefinir a senha de um administrador existente:
npm run reset-admin -- "admin@exemplo.com" "NovaSenhaForte123"
npm start
```

Abra <http://localhost:3000>.

## Área administrativa

A área administrativa usa autenticação por e-mail e senha. O login fica em:

- http://localhost:3000/admin/

O primeiro administrador pode ser criado com o script abaixo, que salva a senha em hash BCrypt e nunca em texto puro:

```bash
npm run criar-admin -- "Nome Completo" "email@exemplo.com" "SenhaForte123"
```

Se for necessário redefinir a senha de um administrador já existente, use:

```bash
npm run reset-admin -- "email@exemplo.com" "NovaSenhaForte123"
```

A senha deve ter no mínimo 8 caracteres. O valor real nunca deve ser versionado no Git, no README, no SQL ou em arquivos de configuração.

## Segurança

- Senhas em hash com bcryptjs
- `.env` não versionado
- `SESSION_SECRET` forte e com no mínimo 32 caracteres
- `DB_SSL=false` para MySQL local e `DB_SSL=true` para bancos que exigem TLS/SSL
- Rate limit no login
- Sessão com cookie `httpOnly` e `sameSite=lax`

---
