/**
 * Rotas publicas de cursos — RF01, RF02, RF04, RF08.
 * Todas as consultas usam placeholders (?) = protecao contra SQL Injection.
 */
const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

const CAMPOS_LISTA = `
  c.id_curso, c.nome, c.slug, c.turno, c.duracao, c.vagas,
  c.descricao, c.imagem_capa, a.nome AS area
`;

/** GET /api/cursos?q=&area=&turno=  — lista de cursos (RF01) */
router.get('/', async (req, res, next) => {
  try {
    const { q, area, turno } = req.query;
    const condicoes = ['c.ativo = 1'];
    const valores = [];

    if (q) {
      condicoes.push('(c.nome LIKE ? OR c.descricao LIKE ?)');
      valores.push(`%${q}%`, `%${q}%`);
    }
    if (area) {
      condicoes.push('a.nome = ?');
      valores.push(area);
    }
    if (turno) {
      condicoes.push('c.turno = ?');
      valores.push(turno);
    }

    const [linhas] = await pool.execute(
      `SELECT ${CAMPOS_LISTA}
         FROM curso c
         LEFT JOIN area_conhecimento a ON a.id_area = c.id_area
        WHERE ${condicoes.join(' AND ')}
        ORDER BY c.nome`,
      valores
    );
    res.json(linhas);
  } catch (erro) { next(erro); }
});

/** GET /api/cursos/areas — lista de eixos usados nos filtros */
router.get('/areas', async (req, res, next) => {
  try {
    const [linhas] = await pool.query(
      `SELECT a.id_area, a.nome, COUNT(c.id_curso) AS total
         FROM area_conhecimento a
         LEFT JOIN curso c ON c.id_area = a.id_area AND c.ativo = 1
        GROUP BY a.id_area, a.nome
        ORDER BY a.nome`
    );
    res.json(linhas);
  } catch (erro) { next(erro); }
});

/** GET /api/cursos/comparar?a=1&b=2 — comparacao entre exatamente dois cursos (RF: comparador) */
router.get('/comparar', async (req, res, next) => {
  try {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      return res.status(400).json({ erro: 'Informe dois cursos para comparar.' });
    }
    if (a === b) {
      return res.status(400).json({ erro: 'Escolha dois cursos diferentes.' });
    }

    const [linhas] = await pool.execute(
      `SELECT ${CAMPOS_LISTA}, c.perfil_egresso, c.requisitos_ingresso
         FROM curso c
         LEFT JOIN area_conhecimento a ON a.id_area = c.id_area
        WHERE c.id_curso IN (?, ?) AND c.ativo = 1`,
      [a, b]
    );

    if (linhas.length !== 2) {
      return res.status(404).json({ erro: 'Um dos cursos nao foi encontrado.' });
    }
    // devolve na ordem pedida pelo usuario
    res.json([linhas.find(c => c.id_curso === a), linhas.find(c => c.id_curso === b)]);
  } catch (erro) { next(erro); }
});

/** GET /api/cursos/:id — pagina de curso (RF02) com disciplinas, professores e avaliacoes aprovadas */
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ erro: 'Curso invalido.' });

    const [cursos] = await pool.execute(
      `SELECT c.*, a.nome AS area
         FROM curso c
         LEFT JOIN area_conhecimento a ON a.id_area = c.id_area
        WHERE c.id_curso = ? AND c.ativo = 1`,
      [id]
    );
    if (cursos.length === 0) return res.status(404).json({ erro: 'Curso nao encontrado.' });

    const [disciplinas] = await pool.execute(
      `SELECT d.id_disciplina, d.nome, d.carga_horaria, d.ementa, p.nome AS professor
         FROM disciplina d
         LEFT JOIN professor p ON p.id_professor = d.id_professor
        WHERE d.id_curso = ?
        ORDER BY d.nome`,
      [id]
    );

    const [professores] = await pool.execute(
      `SELECT id_professor, nome, especialidade FROM professor WHERE id_curso = ? ORDER BY nome`,
      [id]
    );

    // RF04 / RF08: somente registros aprovados aparecem publicamente
    const [avaliacoes] = await pool.execute(
      `SELECT v.id_avaliacao, v.nota, v.comentario, v.data_avaliacao, v.tipo,
              al.nome AS aluno, al.turma
         FROM avaliacao v
         JOIN aluno al ON al.id_aluno = v.id_aluno
        WHERE v.id_curso = ? AND v.status = 'aprovada'
        ORDER BY v.data_avaliacao DESC`,
      [id]
    );

    const notas = avaliacoes.filter(v => v.tipo === 'avaliacao' && v.nota);
    const media = notas.length
      ? Number((notas.reduce((s, v) => s + v.nota, 0) / notas.length).toFixed(1))
      : null;

    res.json({
      ...cursos[0],
      disciplinas,
      professores,
      avaliacoes: avaliacoes.filter(v => v.tipo === 'avaliacao'),
      depoimentos: avaliacoes.filter(v => v.tipo === 'depoimento'),
      media_notas: media,
      total_avaliacoes: notas.length
    });
  } catch (erro) { next(erro); }
});

module.exports = router;
