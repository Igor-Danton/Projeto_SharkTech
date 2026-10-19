/**
 * Codigo compartilhado por todas as paginas do site:
 * carrega header e footer, marca o link ativo, controla o menu do celular
 * e expoe utilitarios usados pelos scripts de pagina.
 */

/** Substitui valores vazios por uma etiqueta visivel de pendencia. */
function ouPendente(valor) {
  if (valor === null || valor === undefined || String(valor).trim() === "") {
    return '<span class="pendente">Informação pendente</span>';
  }

  return escapar(valor);
}

/** Escapa texto vindo do banco antes de inserir no HTML (previne XSS). */
function escapar(valor) {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Converte "2026-03-04 10:00:00" em "04/03/2026". */
function formatarData(valor) {
  if (!valor) return "";

  const data = new Date(String(valor).replace(" ", "T"));

  if (Number.isNaN(data.getTime())) return "";

  return data.toLocaleDateString("pt-BR");
}

/** Converte 3234 em "3.234 h". */
function formatarHoras(valor) {
  return valor ? `${Number(valor).toLocaleString("pt-BR")} h` : null;
}

/** Desenha a nota em estrelas cheias e vazias. */
function estrelas(nota) {
  const n = Number(nota) || 0;

  return `<span class="estrelas" aria-label="Nota ${n} de 5">${"★".repeat(n)}${"☆".repeat(5 - n)}</span>`;
}

/** Mostra uma mensagem em um elemento de aviso. */
function mostrarAviso(elemento, texto, tipo = "ok") {
  if (!elemento) return;

  elemento.className = `aviso ${tipo === "erro" ? "aviso--erro" : "aviso--ok"}`;

  elemento.textContent = texto;
  elemento.hidden = false;
}

/** Le um parametro da URL (ex.: curso.html?id=2). */
function parametro(nome) {
  return new URLSearchParams(window.location.search).get(nome);
}

async function carregarComponente(seletor, arquivo) {
  const alvo = document.querySelector(seletor);

  if (!alvo) return;

  try {
    const resposta = await fetch(arquivo);
    alvo.innerHTML = await resposta.text();
  } catch (_) {
    alvo.innerHTML = "";
  }
}

function marcarLinkAtivo() {
  const atual = window.location.pathname.replace(/\/index\.html$/, "/");

  document.querySelectorAll(".navegacao a").forEach((link) => {
    const destino = link.getAttribute("href");

    if (destino === atual || (destino !== "/" && atual.startsWith(destino))) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function ativarMenu() {
  const botao = document.getElementById("menu-botao");
  const menu = document.getElementById("navegacao");

  if (!botao || !menu) return;

  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");

    botao.setAttribute("aria-expanded", String(aberto));
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await carregarComponente("#cabecalho", "/components/header.html");
  await carregarComponente("#rodape", "/components/footer.html");

  marcarLinkAtivo();
  ativarMenu();

  const ano = document.getElementById("ano-atual");

  if (ano) {
    ano.textContent = new Date().getFullYear();
  }

  // busca do topo da home e da pagina de busca
  document.querySelectorAll("[data-busca]").forEach((form) => {
    form.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const termo = form.querySelector('input[name="q"]').value.trim();

      if (termo.length >= 2) {
        window.location.href = `/busca.html?q=${encodeURIComponent(termo)}`;
      }
    });
  });

  document.dispatchEvent(new CustomEvent("layout-pronto"));
});
