/**
 * Conexao com o MySQL.
 * Usa pool de conexoes (reaproveita conexoes em vez de abrir uma por requisicao)
 * e sempre consultas preparadas nas rotas, para evitar SQL Injection.
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sharktech_ceep',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci',
  dateStrings: true
});

async function testarConexao() {
  const conexao = await pool.getConnection();
  await conexao.ping();
  conexao.release();
}

module.exports = { pool, testarConexao };
