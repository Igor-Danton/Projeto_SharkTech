/**
 * Atualiza a senha do administrador usando o e-mail.
 *
 * Uso:
 *   npm run reset-admin -- "admin@exemplo.com" "SenhaForte123"
 *
 * A senha e sempre salva em hash bcrypt, nunca em texto puro.
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool } = require("../src/config/db");

async function principal() {
  const [email, senha] = process.argv.slice(2);

  if (!email || !senha) {
    console.error(
      '\nUso: npm run reset-admin -- "admin@exemplo.com" "NovaSenhaForte123"\n',
    );
    process.exit(1);
  }

  if (senha.length < 8) {
    console.error("A senha precisa ter pelo menos 8 caracteres.");
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    const [resultado] = await pool.execute(
      "UPDATE usuario_admin SET senha_hash = ? WHERE email = ?",
      [hash, String(email).trim().toLowerCase()],
    );

    if (resultado.affectedRows === 0) {
      console.error("Nenhum administrador encontrado com esse e-mail.");
      await pool.end();
      process.exit(1);
    }

    console.log(
      `\n✅ Senha atualizada com sucesso para: ${String(email).trim().toLowerCase()}\n`,
    );
    await pool.end();
    process.exit(0);
  } catch (erro) {
    console.error(
      "\nFalha ao redefinir a senha do administrador:",
      erro.message,
      "\n",
    );
    process.exit(1);
  }
}

principal().catch((erro) => {
  console.error("Erro não tratado:", erro.message);
  process.exit(1);
});
