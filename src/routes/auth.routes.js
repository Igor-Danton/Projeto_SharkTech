/**
 * Autenticacao da area administrativa — RNF02.
 * Senha nunca e' guardada em texto puro: o banco guarda o hash bcrypt.
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { loginRateLimit } = require('../middlewares/rate-limit');
const { exigirAdmin } = require('../middlewares/auth');

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

/**
 * PUT /api/auth/reset-senha
 * Permite que o administrador autenticado troque a propria senha.
 * Exige senha atual, nova senha e confirmacao.
 */
router.put('/reset-senha', exigirAdmin, async (req, res, next) => {
  try {
    const senhaAtual = String(req.body.senhaAtual || '').trim();
    const novaSenha = String(req.body.novaSenha || '').trim();
    const confirmaSenha = String(req.body.confirmaSenha || '').trim();

    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      return res.status(400).json({ erro: 'Informe senha atual, nova senha e confirmacao.' });
    }

    if (novaSenha.length < 8) {
      return res.status(400).json({ erro: 'A nova senha deve ter no minimo 8 caracteres.' });
    }

    if (novaSenha !== confirmaSenha) {
      return res.status(400).json({ erro: 'As senhas nao conferem.' });
    }

    const [linhas] = await pool.execute(
      'SELECT senha_hash FROM usuario_admin WHERE id_usuario = ?',
      [req.session.usuario.id]
    );

    if (!linhas.length) {
      return res.status(404).json({ erro: 'Usuario nao encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, linhas[0].senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha atual incorreta.' });
    }

    const novoHash = await bcrypt.hash(novaSenha, 10);
    await pool.execute(
      'UPDATE usuario_admin SET senha_hash = ? WHERE id_usuario = ?',
      [novoHash, req.session.usuario.id]
    );

    res.json({ mensagem: 'Senha atualizada com sucesso.' });
  } catch (erro) {
    next(erro);
  }
});

module.exports = router;
