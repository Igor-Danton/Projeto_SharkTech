/**
 * Tratamento central de erros.
 * Detalhes tecnicos ficam no console do servidor; o cliente recebe
 * apenas uma mensagem generica (nao expor estrutura do banco).
 */
const path = require("path");

function naoEncontrado(req, res) {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ erro: "Recurso nao encontrado." });
  }
  res
    .status(404)
    .sendFile(path.join(__dirname, "..", "..", "public", "404.html"));
}

function tratarErro(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  console.error("[ERRO]", err);
  if (res.headersSent) return;
  res.status(500).json({ erro: "Erro interno do servidor." });
}

module.exports = { naoEncontrado, tratarErro };
