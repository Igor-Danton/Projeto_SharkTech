const express = require("express");
const { testarConexao } = require("../config/db");

const router = express.Router();

router.get("/", async (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

router.get("/readiness", async (_req, res) => {
  try {
    await testarConexao();
    res.json({
      status: "ready",
      database: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (erro) {
    res.status(503).json({
      status: "not_ready",
      database: "unavailable",
      timestamp: new Date().toISOString(),
      erro: erro.message || "Banco indisponível",
    });
  }
});

module.exports = router;
