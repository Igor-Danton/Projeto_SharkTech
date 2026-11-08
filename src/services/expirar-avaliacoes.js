const INTERVALO_VERIFICACAO_MS = 60 * 1000;

async function expirarAvaliacoesRejeitadas(pool) {
  const [resultado] = await pool.execute(
    `DELETE FROM avaliacao
      WHERE status = 'rejeitada'
        AND rejeitada_em <= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 14 DAY)`,
  );
  return resultado.affectedRows;
}

function iniciarExpiracaoAvaliacoes(pool, logger = console) {
  const verificar = async () => {
    try {
      const removidas = await expirarAvaliacoesRejeitadas(pool);
      if (removidas > 0) {
        logger.info(
          `[ok] ${removidas} avaliação(ões) rejeitada(s) expirada(s).`,
        );
      }
    } catch (erro) {
      logger.error(
        "[erro] Não foi possível expirar avaliações rejeitadas:",
        erro.code || erro.message,
      );
    }
  };

  void verificar();
  const temporizador = setInterval(verificar, INTERVALO_VERIFICACAO_MS);
  temporizador.unref();
  return temporizador;
}

module.exports = {
  expirarAvaliacoesRejeitadas,
  iniciarExpiracaoAvaliacoes,
};
