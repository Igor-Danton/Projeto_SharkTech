const crypto = require("node:crypto");
const express = require("express");
const { pool } = require("../config/db");
const {
  expirarAvaliacoesRejeitadas,
} = require("../services/expirar-avaliacoes");

const router = express.Router();

function autorizada(req, segredo) {
  const recebido = Buffer.from(req.get("authorization") || "");
  const esperado = Buffer.from(`Bearer ${segredo}`);
  return (
    recebido.length === esperado.length &&
    crypto.timingSafeEqual(recebido, esperado)
  );
}

router.get("/cleanup-rejected-reviews", async (req, res, next) => {
  const segredo = process.env.CRON_SECRET;
  if (!segredo) {
    return res
      .status(503)
      .json({ erro: "O cron não está configurado neste ambiente." });
  }
  if (!autorizada(req, segredo)) {
    return res.status(401).json({ erro: "Não autorizado." });
  }

  try {
    const removidas = await expirarAvaliacoesRejeitadas(pool);
    res.json({ removidas });
  } catch (erro) {
    next(erro);
  }
});

module.exports = router;
