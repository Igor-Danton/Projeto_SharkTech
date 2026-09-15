/**
 * Envio de avaliacoes e depoimentos — RF03 e RF08.
 * Tudo entra com status 'pendente'; so aparece no site depois de aprovado
 * na area administrativa (RF04).
 */
const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Limpa espacos e corta o tamanho maximo aceito no banco. */
function texto(valor, maximo) {
  return String(valor ?? '').trim().slice(0, maximo);
}

/** POST /api/avaliacoes */
router.post('/', async (req, res, next) => {
  const conexao = await pool.getConnection();
  try {
    const nome = texto(req.body.nome, 120);
    const email = texto(req.body.email, 160).toLowerCase();
    const turma = texto(req.body.turma, 60) || null;
    const comentario = texto(req.body.comentario, 2000);
    const tipo = req.body.tipo === 'depoimento' ? 'depoimento' : 'avaliacao';
    const idCurso = Number(req.body.id_curso);
    const nota = tipo === 'avaliacao' ? Number(req.body.nota) : null;

    // ----- validacao de entrada -----
    const erros = [];
    if (nome.length < 3) erros.push('Informe seu nome completo.');
    if (!EMAIL_VALIDO.test(email)) erros.push('Informe um e-mail valido.');
    if (comentario.length < 10) erros.push('O comentario precisa ter pelo menos 10 caracteres.');
    if (!Number.isInteger(idCurso)) erros.push('Selecione um curso.');
    if (tipo === 'avaliacao' && !(Number.isInteger(nota) && nota >= 1 && nota <= 5)) {
      erros.push('A nota deve ser um numero de 1 a 5.');
    }
    if (erros.length) return res.status(400).json({ erro: erros.join(' ') });

    const [curso] = await conexao.execute(
      'SELECT id_curso FROM curso WHERE id_curso = ? AND ativo = 1', [idCurso]
    );
    if (curso.length === 0) return res.status(404).json({ erro: 'Curso nao encontrado.' });

    await conexao.beginTransaction();

    // O aluno e' identificado pelo e-mail: se ja existe, reaproveita o cadastro.
    const [existente] = await conexao.execute(
      'SELECT id_aluno FROM aluno WHERE email = ?', [email]
    );

    let idAluno;
    if (existente.length) {
      idAluno = existente[0].id_aluno;
      await conexao.execute(
        'UPDATE aluno SET nome = ?, turma = COALESCE(?, turma) WHERE id_aluno = ?',
        [nome, turma, idAluno]
      );
    } else {
      const [novo] = await conexao.execute(
        'INSERT INTO aluno (nome, email, turma, id_curso) VALUES (?, ?, ?, ?)',
        [nome, email, turma, idCurso]
      );
      idAluno = novo.insertId;
    }

    await conexao.execute(
      `INSERT INTO avaliacao (nota, comentario, status, tipo, id_aluno, id_curso)
       VALUES (?, ?, 'pendente', ?, ?, ?)`,
      [nota, comentario, tipo, idAluno, idCurso]
    );

    await conexao.commit();
    res.status(201).json({
      mensagem: tipo === 'depoimento'
        ? 'Depoimento enviado. Ele aparece no site depois da analise da equipe.'
        : 'Avaliacao enviada. Ela aparece no site depois da analise da equipe.'
    });
  } catch (erro) {
    await conexao.rollback().catch(() => {});
    next(erro);
  } finally {
    conexao.release();
  }
});

module.exports = router;
