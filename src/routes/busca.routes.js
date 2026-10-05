/**
 * Busca por palavra-chave — RF05.
 * Procura em cursos, noticias e documentos e devolve tudo num formato unico.
 */
const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const termo = String(req.query.q || "").trim();
    if (termo.length < 2) {
      return res
        .status(400)
        .json({ erro: "Digite pelo menos 2 caracteres para buscar." });
    }
    const like = `%${termo}%`;

    const [cursos] = await pool.execute(
      `SELECT id_curso AS id, nome AS titulo, descricao AS resumo
         FROM curso
        WHERE ativo = 1 AND (nome LIKE ? OR descricao LIKE ? OR perfil_egresso LIKE ?)
        ORDER BY nome LIMIT 20`,
      [like, like, like],
    );

    const [noticias] = await pool.execute(
      `SELECT id_noticia AS id, titulo, resumo
         FROM noticia
        WHERE publicada = 1 AND (titulo LIKE ? OR conteudo LIKE ?)
        ORDER BY data_publicacao DESC LIMIT 20`,
      [like, like],
    );

    const [documentos] = await pool.execute(
      `SELECT id_documento AS id, titulo, descricao AS resumo, url_arquivo
         FROM documento
        WHERE publicado = 1 AND (titulo LIKE ? OR descricao LIKE ?)
        ORDER BY data_publicacao DESC LIMIT 20`,
      [like, like],
    );

    res.json({
      termo,
      total: cursos.length + noticias.length + documentos.length,
      cursos,
      noticias,
      documentos,
    });
  } catch (erro) {
    next(erro);
  }
});

module.exports = router;
