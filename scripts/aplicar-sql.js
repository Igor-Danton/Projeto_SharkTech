/**
 * Executa arquivos .sql da pasta database/ no banco do .env.
 * Uso: node scripts/aplicar-sql.js arquivo1.sql arquivo2.sql
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const arquivos = process.argv.slice(2);

if (!arquivos.length) {
  console.error("Uso: node scripts/aplicar-sql.js arquivo.sql [outro.sql]");
  process.exit(1);
}

const ssl = String(process.env.DB_SSL || "false").toLowerCase() === "true";

(async () => {
  const conexao = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    charset: "utf8mb4",
    ssl: ssl ? { rejectUnauthorized: false } : undefined,
  });

  try {
    for (const nome of arquivos) {
      const sql = fs.readFileSync(
        path.join(__dirname, "..", "database", nome),
        "utf8",
      );

      console.log(`Executando ${nome}...`);
      await conexao.query(sql);
      console.log(`✓ ${nome}`);
    }
  } catch (erro) {
    console.error("✗ Erro:", erro.message);
    process.exitCode = 1;
  } finally {
    await conexao.end();
  }
})();
