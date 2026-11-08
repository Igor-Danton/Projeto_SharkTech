const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const { pool } = require("../src/config/db");
const rotasCron = require("../src/routes/cron.routes");

async function comServidor(callback) {
  const app = express();
  app.use("/api/cron", rotasCron);
  const servidor = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => servidor.once("listening", resolve));
  try {
    return await callback(
      `http://127.0.0.1:${servidor.address().port}/api/cron/cleanup-rejected-reviews`,
    );
  } finally {
    await new Promise((resolve, reject) =>
      servidor.close((erro) => (erro ? reject(erro) : resolve())),
    );
  }
}

test("cron exige CRON_SECRET e não consulta o banco sem autenticação", async () => {
  const segredoAnterior = process.env.CRON_SECRET;
  const executarOriginal = pool.execute;
  let chamadas = 0;
  delete process.env.CRON_SECRET;
  pool.execute = async () => {
    chamadas += 1;
    return [{ affectedRows: 0 }, []];
  };

  try {
    await comServidor(async (url) => {
      let resposta = await fetch(url);
      assert.equal(resposta.status, 503);
      resposta = await fetch(url, {
        headers: { authorization: "Bearer incorreto" },
      });
      assert.equal(resposta.status, 503);
      assert.equal(chamadas, 0);
    });
  } finally {
    pool.execute = executarOriginal;
    if (segredoAnterior !== undefined) {
      process.env.CRON_SECRET = segredoAnterior;
    }
  }
});

test("cron rejeita token inválido e executa limpeza com token válido", async () => {
  const segredoAnterior = process.env.CRON_SECRET;
  const executarOriginal = pool.execute;
  const consultas = [];
  process.env.CRON_SECRET = "test-cron-secret";
  pool.execute = async (sql) => {
    consultas.push(sql);
    return [{ affectedRows: 3 }, []];
  };

  try {
    await comServidor(async (url) => {
      let resposta = await fetch(url, {
        headers: { authorization: "Bearer token-invalido" },
      });
      assert.equal(resposta.status, 401);
      assert.equal(consultas.length, 0);

      resposta = await fetch(url, {
        headers: { authorization: "Bearer test-cron-secret" },
      });
      assert.equal(resposta.status, 200);
      assert.deepEqual(await resposta.json(), { removidas: 3 });
      assert.equal(consultas.length, 1);
      assert.match(consultas[0], /status = 'rejeitada'/);
      assert.match(consultas[0], /rejeitada_em IS NOT NULL/);
      assert.match(
        consultas[0],
        /rejeitada_em <= DATE_SUB\(CURRENT_TIMESTAMP, INTERVAL 14 DAY\)/,
      );
    });
  } finally {
    pool.execute = executarOriginal;
    if (segredoAnterior === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = segredoAnterior;
    }
  }
});
