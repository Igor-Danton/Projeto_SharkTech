# Shark Tech — Novo Site Institucional do CEEP Curitiba

Novo portal institucional do **Centro Estadual de Educação Profissional de Curitiba**,
desenvolvido como Projeto Integrador do Curso Técnico em Desenvolvimento de Sistemas.

## 🚀 Instalação rápida

`ash
npm install
cp .env.example .env
# Edite o .env com as credenciais do seu MySQL / TiDB
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
npm run criar-admin -- "Seu Nome" "admin@exemplo.com" "SenhaForte123"
npm start
`

Abra <http://localhost:3000>.

## 🔑 Área administrativa

A área administrativa usa autenticação por e-mail e senha. O login fica em:
- http://localhost:3000/admin/

O primeiro administrador pode ser criado com o script abaixo:
`ash
npm run criar-admin -- "Nome Completo" "email@exemplo.com" "SenhaForte123"
`

Se precisar redefinir a senha de um administrador existente:
`ash
npm run reset-admin -- "email@exemplo.com" "NovaSenhaForte123"
`

**Atenção:** A senha deve ter no mínimo 8 caracteres. O valor real nunca deve ser versionando no Git ou em arquivos de configuração.

## 🛡️ Segurança e Infraestrutura

- **Criptografia:** Senhas armazenadas em hash com cryptjs.
- **Ambiente:** .env não versionando para proteção de credenciais.
- **Sessões:** SESSION_SECRET forte (mínimo 32 caracteres), cookies httpOnly e sameSite=lax.
- **Conexão:** Suporte a DB_SSL=true para conexões seguras via TLS (exigido pelo TiDB Cloud).
- **Estabilidade:** Rate limit implementador no login para evitar ataques de força bruta.

---
