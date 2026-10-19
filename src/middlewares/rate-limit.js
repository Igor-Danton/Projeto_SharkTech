const { rateLimit } = require("express-rate-limit");

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    erro: "Muitas tentativas de login. Tente novamente em alguns minutos.",
  },
});

module.exports = { loginRateLimit };
