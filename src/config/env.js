/**
 * Validação central de variáveis de ambiente
 * Falha rapidamente se alguma variável obrigatória estiver ausente ou inválida
 */

const requiredEnvs = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "NODE_ENV",
  "SESSION_SECRET",
];

function validateEnv() {
  const missing = [];
  const invalid = [];

  requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
      missing.push(env);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias não definidas: ${missing.join(", ")}. ` +
        `Verifique o arquivo .env e tente novamente.`,
    );
  }

  // Validação de NODE_ENV
  if (!["development", "production", "test"].includes(process.env.NODE_ENV)) {
    invalid.push('NODE_ENV deve ser "development", "production" ou "test"');
  }

  // Validação de SESSION_SECRET (mínimo de 32 caracteres)
  if (process.env.SESSION_SECRET.length < 32) {
    invalid.push("SESSION_SECRET deve ter no mínimo 32 caracteres");
  }

  // Validação de DB_PORT (deve ser número válido)
  const dbPort = Number(process.env.DB_PORT);
  if (isNaN(dbPort) || dbPort <= 0 || dbPort > 65535) {
    invalid.push("DB_PORT deve ser um número entre 1 e 65535");
  }

  if (invalid.length > 0) {
    throw new Error(
      `Configuração inválida:\n${invalid.map((msg) => `  - ${msg}`).join("\n")}`,
    );
  }

  return {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV,
    db: {
      host: process.env.DB_HOST,
      port: dbPort,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    session: {
      secret: process.env.SESSION_SECRET,
    },
  };
}

module.exports = validateEnv;
