/**
 * Cria (ou atualiza a senha de) um usuario da area administrativa.
 *
 * Uso:  npm run criar-admin -- "Nome" email@exemplo.com senhaSegura123
 *
 * A senha nunca e' salva em texto puro: o script gera o hash bcrypt.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/db');

async function principal() {
  const [nome, email, senha] = process.argv.slice(2);

  if (!nome || !email || !senha) {
    console.error('Uso: npm run criar-admin -- "Nome Completo" email@exemplo.com senha');
    process.exit(1);
  }
  if (senha.length < 8) {
    console.error('A senha precisa ter pelo menos 8 caracteres.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(senha, 10);

  await pool.execute(
    `INSERT INTO usuario_admin (nome, email, senha_hash)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE nome = VALUES(nome), senha_hash = VALUES(senha_hash)`,
    [nome.trim(), email.trim().toLowerCase(), hash]
  );

  console.log(`Usuario administrativo pronto: ${email}`);
  await pool.end();
}

principal().catch((erro) => {
  console.error('Falhou:', erro.message);
  process.exit(1);
});
