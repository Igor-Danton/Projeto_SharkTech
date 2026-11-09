const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const codigoApi = fs.readFileSync(
  path.join(__dirname, "..", "public", "js", "api.js"),
  "utf8",
);

function carregarApi(fetch) {
  const contexto = { window: {}, fetch };
  vm.runInNewContext(codigoApi, contexto);
  return contexto.window.Api;
}

test("prefixa requisições com /api e retorna o JSON da resposta", async () => {
  let urlSolicitada;
  const api = carregarApi(async (url) => {
    urlSolicitada = url;
    return {
      ok: true,
      text: async () => JSON.stringify([{ id_curso: 1 }]),
    };
  });

  const resposta = await api.get("/cursos");

  assert.equal(urlSolicitada, "/api/cursos");
  assert.equal(JSON.stringify(resposta), '[{"id_curso":1}]');
});

test("preserva o status HTTP ao rejeitar uma resposta da API", async () => {
  const api = carregarApi(async () => ({
    ok: false,
    status: 401,
    text: async () => JSON.stringify({ erro: "Não autorizado." }),
  }));

  await assert.rejects(api.get("/admin/resumo"), (erro) => {
    assert.equal(erro.message, "Não autorizado.");
    assert.equal(erro.status, 401);
    return true;
  });
});
