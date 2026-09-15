/**
 * Conteudo institucional: noticias/comunicados e documentos/editais.
 * Somente itens marcados como publicados aparecem aqui.
 */
const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

/** GET /api/noticias?categoria=&limite= */
router.get('/noticias', async (req, res, next) => {
  try {
    const limite = Math.min(Number(req.query.limite) || 20, 50);
    const categoria = req.query.categoria;
    const valores = [];
    let filtro = 'WHERE publicada = 1';

    if (categoria) {
      filtro += ' AND categoria = ?';
      valores.push(categoria);
    }

    const [linhas] = await pool.query(
      `SELECT id_noticia, titulo, resumo, conteudo, categoria, data_publicacao
         FROM noticia ${filtro}
        ORDER BY data_publicacao DESC
        LIMIT ${limite}`,
      valores
    );
    res.json(linhas);
  } catch (erro) { next(erro); }
});

/** GET /api/noticias/:id */
router.get('/noticias/:id', async (req, res, next) => {
  try {
    const [linhas] = await pool.execute(
      `SELECT id_noticia, titulo, resumo, conteudo, categoria, data_publicacao
         FROM noticia WHERE id_noticia = ? AND publicada = 1`,
      [Number(req.params.id)]
    );
    if (!linhas.length) return res.status(404).json({ erro: 'Noticia nao encontrada.' });
    res.json(linhas[0]);
  } catch (erro) { next(erro); }
});

/** GET /api/documentos?categoria= */
router.get('/documentos', async (req, res, next) => {
  try {
    const categoria = req.query.categoria;
    const valores = [];
    let filtro = 'WHERE publicado = 1';

    if (categoria) {
      filtro += ' AND categoria = ?';
      valores.push(categoria);
    }

    const [linhas] = await pool.query(
      `SELECT id_documento, titulo, descricao, categoria, url_arquivo, data_publicacao
         FROM documento ${filtro}
        ORDER BY data_publicacao DESC`,
      valores
    );
    res.json(linhas);
  } catch (erro) { next(erro); }
});

module.exports = router;
