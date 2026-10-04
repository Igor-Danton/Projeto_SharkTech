/**
 * Cria (ou atualiza a senha de) um usuario da area administrativa.
 *
 * Uso:  npm run criar-admin -- "Nome" email@exemplo.com senhaSegura123
 *
 * A senha nunca e' salva em texto puro: o script gera o hash bcrypt.
 * A senha deve ter no minimo 8 caracteres.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/db');

async function principal() {
  const [nome, email, senha] = process.argv.slice(2);

  if (!nome || !email || !senha) {
    console.error('\n❌ Uso: npm run criar-admin -- "Nome Completo" email@exemplo.com senha');
    console.error('   Exemplo: npm run criar-admin -- "Maria Silva" maria@ceep.edu.br Abc@123456\n');
    process.exit(1);
  }

  if (senha.length < 8) {
    console.error('❌ A senha precisa ter pelo menos 8 caracteres.');
    process.exit(1);
  }

  if (nome.trim().length < 3) {
    console.error('❌ O nome precisa ter pelo menos 3 caracteres.');
    process.exit(1);
  }

  if (!email.includes('@')) {
    console.error('❌ Informe um e-mail valido.');
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    await pool.execute(
      `INSERT INTO usuario_admin (nome, email, senha_hash)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE nome = VALUES(nome), senha_hash = VALUES(senha_hash)`,
      [nome.trim(), email.trim().toLowerCase(), hash]
    );

    console.log(`\n✅ Administrador criado/atualizado com sucesso!`);
    console.log(`   E-mail: ${email.trim().toLowerCase()}`);
    console.log(`   Nome: ${nome.trim()}\n`);

    await pool.end();
    process.exit(0);
  } catch (erro) {
    console.error('\n❌ Falha ao criar administrador:', erro.message, '\n');
    process.exit(1);
  }
}

principal().catch((erro) => {
  console.error('Erro não capturado:', erro.message);
  process.exit(1);
});
