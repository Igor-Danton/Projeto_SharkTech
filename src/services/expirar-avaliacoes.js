async function expirarAvaliacoesRejeitadas(pool) {
  // A single conditional DELETE makes retries and overlapping cron calls safe.
  const [resultado] = await pool.execute(
    `DELETE FROM avaliacao
      WHERE status = 'rejeitada'
        AND rejeitada_em IS NOT NULL
        AND rejeitada_em <= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 14 DAY)`,
  );
  return resultado.affectedRows;
}

module.exports = { expirarAvaliacoesRejeitadas };
