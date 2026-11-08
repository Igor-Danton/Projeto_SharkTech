-- Registra a rejeição e prepara a limpeza automática após 14 dias.
-- Execute uma única vez no banco sharktech_ceep antes de publicar a nova API.
-- Registros já rejeitados recebem a data da migração, preservando-os por mais
-- 14 dias completos antes da primeira expiração automática.

USE sharktech_ceep;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'avaliacao'
      AND column_name = 'rejeitada_em') = 0,
  'ALTER TABLE avaliacao ADD COLUMN rejeitada_em DATETIME NULL AFTER status',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

SET @sharktech_sql = IF(
  (SELECT COUNT(*) FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'avaliacao'
      AND index_name = 'idx_avaliacao_status_rejeitada_em') = 0,
  'CREATE INDEX idx_avaliacao_status_rejeitada_em ON avaliacao (status, rejeitada_em)',
  'SELECT 1'
);
PREPARE sharktech_stmt FROM @sharktech_sql;
EXECUTE sharktech_stmt;
DEALLOCATE PREPARE sharktech_stmt;

UPDATE avaliacao
   SET rejeitada_em = CURRENT_TIMESTAMP
 WHERE status = 'rejeitada'
   AND rejeitada_em IS NULL;

UPDATE avaliacao
   SET rejeitada_em = NULL
 WHERE status <> 'rejeitada'
   AND rejeitada_em IS NOT NULL;
