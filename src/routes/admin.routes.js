/**
 * Area administrativa — RF06.
 * Todas as rotas deste arquivo exigem sessao ativa (exigirAdmin).
 * Escopo proposital: editar cursos, moderar avaliacoes/depoimentos,
 * publicar noticias e documentos. Nao e' um CMS completo.
 */
const express = require("express");
const { pool } = require("../config/db");
const { exigirAdmin } = require("../middlewares/auth");

const router = express.Router();
router.use(exigirAdmin);

function texto(valor, maximo) {
  const v = String(valor ?? "").trim();
  return v ? v.slice(0, maximo) : null;
}

/* ------------------------------ CURSOS ------------------------------ */

/** PUT /api/admin/cursos/:id — atualiza os dados do curso */
router.put("/cursos/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ erro: "Curso invalido." });

    const nome = texto(req.body.nome, 120);
    if (!nome)
      return res.status(400).json({ erro: "O nome do curso e obrigatorio." });

    const vagas =
      req.body.vagas === "" || req.body.vagas == null
        ? null
        : Number(req.body.vagas);
    if (vagas !== null && (!Number.isInteger(vagas) || vagas < 0)) {
      return res
        .status(400)
        .json({ erro: "Vagas deve ser um numero inteiro." });
    }

    const [r] = await pool.execute(
      `UPDATE curso SET
         nome = ?, id_area = ?, turno = ?, duracao = ?, descricao = ?,
         vagas = ?, perfil_egresso = ?, requisitos_ingresso = ?, imagem_capa = ?
       WHERE id_curso = ?`,
      [
        nome,
        req.body.id_area ? Number(req.body.id_area) : null,
        texto(req.body.turno, 60),
        texto(req.body.duracao, 60),
        texto(req.body.descricao, 5000),
        vagas,
        texto(req.body.perfil_egresso, 5000),
        texto(req.body.requisitos_ingresso, 5000),
        texto(req.body.imagem_capa, 200),
        id,
      ],
    );
    if (r.affectedRows === 0)
      return res.status(404).json({ erro: "Curso nao encontrado." });
    res.json({ mensagem: "Curso atualizado." });
  } catch (erro) {
    next(erro);
  }
});

/** POST /api/admin/cursos — cadastra um novo curso */
router.post("/cursos", async (req, res, next) => {
  try {
    const nome = texto(req.body.nome, 120);
    if (!nome)
      return res.status(400).json({ erro: "O nome do curso e obrigatorio." });

    const slug = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const [r] = await pool.execute(
      "INSERT INTO curso (nome, slug, id_area) VALUES (?, ?, ?)",
      [nome, slug, req.body.id_area ? Number(req.body.id_area) : null],
    );
    res
      .status(201)
      .json({ id_curso: r.insertId, mensagem: "Curso cadastrado." });
  } catch (erro) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ erro: "Ja existe um curso com esse nome." });
    }
    next(erro);
  }
});

/* --------------------- AVALIACOES E DEPOIMENTOS --------------------- */

/** GET /api/admin/avaliacoes?status=pendente */
router.get("/avaliacoes", async (req, res, next) => {
  try {
    const status = ["pendente", "aprovada", "rejeitada"].includes(
      req.query.status,
    )
      ? req.query.status
      : "pendente";

    const [linhas] = await pool.execute(
      `SELECT v.id_avaliacao, v.nota, v.comentario, v.data_avaliacao, v.status, v.tipo,
              al.nome AS aluno, al.email, al.turma, c.nome AS curso
         FROM avaliacao v
         JOIN aluno al ON al.id_aluno = v.id_aluno
         JOIN curso c  ON c.id_curso  = v.id_curso
        WHERE v.status = ?
        ORDER BY v.data_avaliacao DESC`,
      [status],
    );
    res.json(linhas);
  } catch (erro) {
    next(erro);
  }
});

/** PATCH /api/admin/avaliacoes/:id — aprova ou rejeita */
router.patch("/avaliacoes/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const status = req.body.status;
    if (!["aprovada", "rejeitada", "pendente"].includes(status)) {
      return res.status(400).json({ erro: "Status invalido." });
    }
    const [r] = await pool.execute(
      "UPDATE avaliacao SET status = ? WHERE id_avaliacao = ?",
      [status, id],
    );
    if (r.affectedRows === 0)
      return res.status(404).json({ erro: "Registro nao encontrado." });
    res.json({ mensagem: `Registro marcado como ${status}.` });
  } catch (erro) {
    next(erro);
  }
});

/* ----------------------------- NOTICIAS ----------------------------- */

router.get("/noticias", async (req, res, next) => {
  try {
    const [linhas] = await pool.query(
      `SELECT id_noticia, titulo, categoria, data_publicacao, publicada
         FROM noticia ORDER BY data_publicacao DESC`,
    );
    res.json(linhas);
  } catch (erro) {
    next(erro);
  }
});

router.post("/noticias", async (req, res, next) => {
  try {
    const titulo = texto(req.body.titulo, 180);
    const conteudo = texto(req.body.conteudo, 20000);
    if (!titulo || !conteudo) {
      return res
        .status(400)
        .json({ erro: "Titulo e conteudo sao obrigatorios." });
    }
    const categoria = ["noticia", "comunicado", "evento"].includes(
      req.body.categoria,
    )
      ? req.body.categoria
      : "noticia";

    const [r] = await pool.execute(
      `INSERT INTO noticia (titulo, resumo, conteudo, categoria, publicada)
       VALUES (?, ?, ?, ?, ?)`,
      [
        titulo,
        texto(req.body.resumo, 300),
        conteudo,
        categoria,
        req.body.publicada ? 1 : 0,
      ],
    );
    res
      .status(201)
      .json({ id_noticia: r.insertId, mensagem: "Noticia salva." });
  } catch (erro) {
    next(erro);
  }
});

router.patch("/noticias/:id", async (req, res, next) => {
  try {
    const [r] = await pool.execute(
      "UPDATE noticia SET publicada = ? WHERE id_noticia = ?",
      [req.body.publicada ? 1 : 0, Number(req.params.id)],
    );
    if (r.affectedRows === 0)
      return res.status(404).json({ erro: "Noticia nao encontrada." });
    res.json({ mensagem: "Publicacao atualizada." });
  } catch (erro) {
    next(erro);
  }
});

/* ---------------------------- DOCUMENTOS ---------------------------- */

router.get("/documentos", async (req, res, next) => {
  try {
    const [linhas] = await pool.query(
      `SELECT id_documento, titulo, categoria, url_arquivo, data_publicacao, publicado
         FROM documento ORDER BY data_publicacao DESC`,
    );
    res.json(linhas);
  } catch (erro) {
    next(erro);
  }
});

router.post("/documentos", async (req, res, next) => {
  try {
    const titulo = texto(req.body.titulo, 180);
    const url = texto(req.body.url_arquivo, 300);
    if (!titulo || !url) {
      return res
        .status(400)
        .json({ erro: "Titulo e link do arquivo sao obrigatorios." });
    }
    const categoria = [
      "edital",
      "formulario",
      "regulamento",
      "calendario",
      "outro",
    ].includes(req.body.categoria)
      ? req.body.categoria
      : "outro";

    const [r] = await pool.execute(
      `INSERT INTO documento (titulo, descricao, categoria, url_arquivo, data_publicacao)
       VALUES (?, ?, ?, ?, CURDATE())`,
      [titulo, texto(req.body.descricao, 300), categoria, url],
    );
    res
      .status(201)
      .json({ id_documento: r.insertId, mensagem: "Documento salvo." });
  } catch (erro) {
    next(erro);
  }
});

/* ------------------------------ RESUMO ------------------------------ */

router.get("/resumo", async (req, res, next) => {
  try {
    const [[cursos]] = await pool.query(
      "SELECT COUNT(*) AS total FROM curso WHERE ativo = 1",
    );
    const [[pendentes]] = await pool.query(
      "SELECT COUNT(*) AS total FROM avaliacao WHERE status = 'pendente'",
    );
    const [[noticias]] = await pool.query(
      "SELECT COUNT(*) AS total FROM noticia WHERE publicada = 1",
    );
    const [[incompletos]] = await pool.query(
      "SELECT COUNT(*) AS total FROM curso WHERE ativo = 1 AND (descricao IS NULL OR turno IS NULL OR duracao IS NULL)",
    );
    res.json({
      cursos: cursos.total,
      avaliacoes_pendentes: pendentes.total,
      noticias_publicadas: noticias.total,
      cursos_incompletos: incompletos.total,
    });
  } catch (erro) {
    next(erro);
  }
});

module.exports = router;
