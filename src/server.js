/**
 * Shark Tech — Novo site institucional do CEEP Curitiba
 * Servidor Express: serve o site estatico (pasta /public) e a API (/api).
 */
require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');

const { testarConexao } = require('./config/db');
const { naoEncontrado, tratarErro } = require('./middlewares/erros');

const rotasCursos = require('./routes/cursos.routes');
const rotasAvaliacoes = require('./routes/avaliacoes.routes');
const rotasConteudo = require('./routes/conteudo.routes');
const rotasBusca = require('./routes/busca.routes');
const rotasAuth = require('./routes/auth.routes');
const rotasAdmin = require('./routes/admin.routes');

const app = express();
const PORTA = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'sharktech.sid',
  secret: process.env.SESSION_SECRET || 'defina-o-SESSION_SECRET-no-env',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                                  // bloqueia leitura por JavaScript
    sameSite: 'lax',                                 // reduz risco de CSRF
    secure: process.env.NODE_ENV === 'producao',     // exige HTTPS em producao
    maxAge: 1000 * 60 * 60 * 4                       // 4 horas
  }
}));

// ----- API -----
app.use('/api/cursos', rotasCursos);
app.use('/api/avaliacoes', rotasAvaliacoes);
app.use('/api', rotasConteudo);   // /api/noticias e /api/documentos
app.use('/api/busca', rotasBusca);
app.use('/api/auth', rotasAuth);
app.use('/api/admin', rotasAdmin);

// ----- Site -----
app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));

app.use(naoEncontrado);
app.use(tratarErro);

testarConexao()
  .then(() => console.log('[ok] Conectado ao MySQL.'))
  .catch((erro) => {
    console.error('[aviso] Nao foi possivel conectar ao MySQL:', erro.code || erro.message);
    console.error('        O site abre, mas as paginas com dados ficarao vazias.');
    console.error('        Confira o arquivo .env e se o banco foi criado (schema.sql).');
  });

app.listen(PORTA, () => {
  console.log(`\nShark Tech / CEEP Curitiba`);
  console.log(`Servidor rodando em http://localhost:${PORTA}\n`);
});
