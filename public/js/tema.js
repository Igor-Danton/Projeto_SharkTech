const CHAVE_TEMA = "ceep-tema";
let temaSalvo = null;
const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;

try {
  temaSalvo = localStorage.getItem(CHAVE_TEMA);
} catch (erro) {
  console.warn("Não foi possível ler a preferência de tema salva.", erro);
}

document.documentElement.dataset.tema =
  temaSalvo === "claro" || temaSalvo === "escuro"
    ? temaSalvo
    : prefereEscuro
      ? "escuro"
      : "claro";

function atualizarBotaoTema(botao) {
  const escuroAtivo = document.documentElement.dataset.tema === "escuro";
  const rotulo = botao.querySelector("[data-tema-rotulo]");
  const icone = botao.querySelector("[data-tema-icone]");

  botao.setAttribute("aria-pressed", String(escuroAtivo));
  botao.setAttribute(
    "aria-label",
    escuroAtivo ? "Ativar modo claro" : "Ativar modo escuro",
  );

  if (rotulo) {
    rotulo.textContent = escuroAtivo ? "Modo claro" : "Modo escuro";
  }

  if (icone) {
    icone.textContent = escuroAtivo ? "☼" : "☾";
  }
}

function inicializarTema() {
  const botao = document.getElementById("botao-tema");

  if (!botao || botao.dataset.temaInicializado === "true") return;

  botao.dataset.temaInicializado = "true";
  atualizarBotaoTema(botao);

  botao.addEventListener("click", () => {
    const tema =
      document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro";

    document.documentElement.dataset.tema = tema;
    atualizarBotaoTema(botao);

    try {
      localStorage.setItem(CHAVE_TEMA, tema);
    } catch (erro) {
      console.warn("Não foi possível salvar a preferência de tema.", erro);
    }
  });
}

window.inicializarTema = inicializarTema;
