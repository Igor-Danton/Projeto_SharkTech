const test = require("node:test");
const assert = require("node:assert/strict");
const {
  expirarAvaliacoesRejeitadas,
} = require("../src/services/expirar-avaliacoes");

test("expira somente avaliações rejeitadas há pelo menos 14 dias", async () => {
  let consulta;
  const pool = {
    execute: async (sql) => {
      consulta = sql;
      return [{ affectedRows: 2 }, []];
    },
  };

  const removidas = await expirarAvaliacoesRejeitadas(pool);

  assert.equal(removidas, 2);
  assert.match(consulta, /status = 'rejeitada'/);
  assert.match(consulta, /rejeitada_em IS NOT NULL/);
  assert.match(
    consulta,
    /rejeitada_em <= DATE_SUB\(CURRENT_TIMESTAMP, INTERVAL 14 DAY\)/,
  );
});

test("não informa exclusões quando nenhum registro expirou", async () => {
  const pool = {
    execute: async () => [{ affectedRows: 0 }, []],
  };

  assert.equal(await expirarAvaliacoesRejeitadas(pool), 0);
});
