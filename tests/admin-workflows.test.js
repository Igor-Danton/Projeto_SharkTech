const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const { pool } = require("../src/config/db");

test("administra rascunhos e registra a data de rejeição", async () => {
  const executarOriginal = pool.execute;
  const consultas = [];
  pool.execute = async (sql, valores = []) => {
    consultas.push({ sql, valores });
    if (sql.includes("FROM noticia") && sql.includes("publicada = 0")) {
      return [
        [
          {
            id_noticia: 9,
            titulo: "Rascunho",
            resumo: "Resumo",
            conteudo: "Conteúdo preservado",
            categoria: "noticia",
          },
        ],
        [],
      ];
    }
    if (sql.startsWith("UPDATE noticia")) {
      return [{ affectedRows: valores[4] === 10 ? 0 : 1 }, []];
    }
    if (sql.startsWith("SELECT publicada FROM noticia")) {
      return [[{ publicada: 1 }], []];
    }
    if (sql.includes("FROM avaliacao v")) return [[], []];
    if (sql.startsWith("UPDATE avaliacao")) return [{ affectedRows: 1 }, []];
    throw new Error("Consulta inesperada no teste de rotas administrativas.");
  };

  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.session = { usuario: { id: 1 } };
    next();
  });
  app.use("/api/admin", require("../src/routes/admin.routes"));
  const servidor = app.listen(0, "127.0.0.1");

  try {
    await new Promise((resolve) => servidor.once("listening", resolve));
    const base = `http://127.0.0.1:${servidor.address().port}/api/admin`;

    let resposta = await fetch(`${base}/noticias/9`);
    assert.equal(resposta.status, 200);
    assert.equal((await resposta.json()).conteudo, "Conteúdo preservado");

    resposta = await fetch(`${base}/noticias/9`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        titulo: "Rascunho editado",
        resumo: "Novo resumo",
        conteudo: "Novo conteúdo",
        categoria: "evento",
      }),
    });
    assert.equal(resposta.status, 200);
    const atualizacao = consultas.find(({ sql }) =>
      sql.startsWith("UPDATE noticia"),
    );
    assert.match(atualizacao.sql, /WHERE id_noticia = \? AND publicada = 0/);
    assert.doesNotMatch(atualizacao.sql.split("WHERE")[0], /publicada\s*=/);

    resposta = await fetch(`${base}/noticias/10`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        titulo: "Notícia publicada",
        conteudo: "Não deve ser editada por esta rota.",
        categoria: "noticia",
      }),
    });
    assert.equal(resposta.status, 409);

    resposta = await fetch(`${base}/avaliacoes?status=rejeitada`);
    assert.equal(resposta.status, 200);
    const listagem = consultas.find(({ sql }) =>
      sql.includes("FROM avaliacao v"),
    );
    assert.match(
      listagem.sql,
      /rejeitada_em > DATE_SUB\(CURRENT_TIMESTAMP, INTERVAL 14 DAY\)/,
    );

    resposta = await fetch(`${base}/avaliacoes/7`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "rejeitada" }),
    });
    assert.equal(resposta.status, 200);
    const rejeicao = consultas.find(({ sql }) =>
      sql.startsWith("UPDATE avaliacao"),
    );
    assert.match(rejeicao.sql, /COALESCE\(rejeitada_em, CURRENT_TIMESTAMP\)/);
    assert.deepEqual(rejeicao.valores, ["rejeitada", "rejeitada", 7]);

    resposta = await fetch(`${base}/avaliacoes/7`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "aprovada" }),
    });
    assert.equal(resposta.status, 200);
    const aprovacao = consultas.find(
      ({ sql, valores }) =>
        sql.startsWith("UPDATE avaliacao") && valores[0] === "aprovada",
    );
    assert.match(aprovacao.sql, /ELSE NULL/);
  } finally {
    await new Promise((resolve, reject) =>
      servidor.close((erro) => (erro ? reject(erro) : resolve())),
    );
    pool.execute = executarOriginal;
  }
});
