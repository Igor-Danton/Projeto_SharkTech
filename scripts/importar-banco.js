require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const configuracao = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
  ssl: {
    rejectUnauthorized: false,
  },
};

async function executarArquivo(nomeArquivo) {
  const caminho = path.join(__dirname, "..", "database", nomeArquivo);
  const sql = fs.readFileSync(caminho, "utf8");

  const conexao = await mysql.createConnection(configuracao);

  try {
    console.log(`Executando ${nomeArquivo}...`);
    await conexao.query(sql);
    console.log(`✓ ${nomeArquivo} executado com sucesso!`);
  } catch (erro) {
    console.error(`✗ Erro ao executar ${nomeArquivo}:`);
    console.error(erro.message);
    throw erro;
  } finally {
    await conexao.end();
  }
}

async function main() {
  try {
    await executarArquivo("schema.sql");
    await executarArquivo("seed.sql");
    console.log("\n✓ Importação concluída com sucesso!");
  } catch (erro) {
    console.error("\n✗ Falha na importação do banco de dados");
    process.exitCode = 1;
  }
}

main();
