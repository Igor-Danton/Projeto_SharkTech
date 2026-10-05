const path = require("path");
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");

const validateEnv = require("./config/env");
const { naoEncontrado, tratarErro } = require("./middlewares/erros");

const rotasCursos = require("./routes/cursos.routes");
const rotasAvaliacoes = require("./routes/avaliacoes.routes");
const rotasConteudo = require("./routes/conteudo.routes");
const rotasBusca = require("./routes/busca.routes");
const rotasAuth = require("./routes/auth.routes");
const rotasAdmin = require("./routes/admin.routes");
const rotasHealth = require("./routes/health.routes");

const config = validateEnv();
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        frameSrc: ["'self'", "https://www.openstreetmap.org"],
      },
    },
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "sharktech.sid",
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: config.nodeEnv === "production",
      maxAge: 1000 * 60 * 60 * 4,
    },
  }),
);

app.use("/api/cursos", rotasCursos);
app.use("/api/avaliacoes", rotasAvaliacoes);
app.use("/api", rotasConteudo);
app.use("/api/busca", rotasBusca);
app.use("/api/auth", rotasAuth);
app.use("/api/admin", rotasAdmin);
app.use("/health", rotasHealth);

app.use(
  express.static(path.join(__dirname, "..", "public"), {
    extensions: ["html"],
  }),
);

app.use(naoEncontrado);
app.use(tratarErro);

module.exports = app;