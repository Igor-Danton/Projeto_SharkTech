/**
 * Shark Tech — Novo site institucional do CEEP Curitiba
 * Servidor Express: inicia a aplicacao e escuta a porta do processo.
 */

require('dotenv').config();

const app = require('./app');
const { testarConexao } = require('./config/db');

const PORTA = Number(process.env.PORT) || 3000;

async function iniciarServidor() {
  try {
    await testarConexao();
    console.log('[ok] Conectado ao MySQL.');
  } catch (erro) {
    console.error('[aviso] Nao foi possivel conectar ao MySQL:', erro.code || erro.message);
    console.error('        O site abre, mas as paginas com dados ficarao vazias.');
    console.error('        Confira o arquivo .env e se o banco foi criado (schema.sql).');
  }

  app.listen(PORTA, () => {
    console.log(`\nShark Tech / CEEP Curitiba`);
    console.log(`Servidor rodando em http://localhost:${PORTA}\n`);
  });
}

iniciarServidor();
