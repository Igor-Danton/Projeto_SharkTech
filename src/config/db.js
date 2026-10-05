/**
 * Conexao com o MySQL.
 * Para MySQL local, SSL normalmente fica desligado.
 * Para TiDB/servidores com TLS exigido, use DB_SSL=true.
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

const sslAtivado = String(process.env.DB_SSL || 'false').toLowerCase() === 'true';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sharktech_ceep',
  waitForConnections: true,
  connectionLimit: process.env.NODE_ENV === 'production' ? 1 : 10,
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci',
  dateStrings: true,
  ssl: sslAtivado ? { rejectUnauthorized: false } : false,
  enableKeepAlive: true,
});

async function testarConexao() {
  const conexao = await pool.getConnection();
  await conexao.ping();
  conexao.release();
}

module.exports = { pool, testarConexao };
