/**
 * Autenticacao da area administrativa — RNF02.
 * Senha nunca e' guardada em texto puro: o banco guarda o hash bcrypt.
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { loginRateLimit } = require('../middlewares/rate-limit');

const router = express.Router();

/** POST /api/auth/login */
router.post('/login', loginRateLimit, async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const senha = String(req.body.senha || '');

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }

    const [linhas] = await pool.execute(
      'SELECT id_usuario, nome, email, senha_hash, perfil FROM usuario_admin WHERE email = ?',
      [email]
    );

    // Mensagem igual para usuario inexistente e senha errada:
    // evita que alguem descubra quais e-mails existem no sistema.
    const generico = { erro: 'E-mail ou senha incorretos.' };
    if (!linhas.length) return res.status(401).json(generico);

    const usuario = linhas[0];
    const confere = await bcrypt.compare(senha, usuario.senha_hash);
    if (!confere) return res.status(401).json(generico);

    req.session.usuario = {
      id: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    };

    res.json({ usuario: req.session.usuario });
  } catch (erro) {
    next(erro);
  }
});

/** GET /api/auth/me — usado pelo painel para saber se a sessao continua valida */
router.get('/me', (req, res) => {
  if (!req.session.usuario) return res.status(401).json({ erro: 'Nao autenticado.' });
  res.json({ usuario: req.session.usuario });
});

/** POST /api/auth/logout */
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sharktech.sid');
    res.json({ mensagem: 'Sessao encerrada.' });
  });
});

module.exports = router;
