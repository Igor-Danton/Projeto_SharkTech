/** Resultados da busca por palavra-chave — RF05. */

function secaoResultado(titulo, itens, montarLink) {
  const dados = Array.isArray(itens) ? itens : [];
  if (!dados.length) return "";

  return `
    <h2 style="margin-top:var(--e-3)">${titulo} (${dados.length})</h2>
    <ul class="lista-limpa">
      ${dados
        .map(
          (item) => `
        <li class="card" style="margin-bottom:var(--e-1)">
          <h3 style="margin:0">${montarLink(item)}</h3>
          ${item && item.resumo ? `<p>${escapar(item.resumo)}</p>` : ""}
        </li>`,
        )
        .join("")}
    </ul>`;
}

async function buscar(termo) {
  const alvo = document.getElementById("resultado-busca");
  const cabecalho = document.querySelector(".cabecalho-pagina h1");
  const busca = typeof termo === "string" ? termo.trim() : "";

  if (!alvo) return;

  alvo.setAttribute("aria-busy", "true");
  alvo.innerHTML = "<p>Carregando resultados…</p>";

  try {
    if (!busca) {
      alvo.setAttribute("aria-busy", "false");
      alvo.innerHTML =
        '<div class="vazio" role="status">Digite uma palavra para buscar cursos, comunicados e documentos.</div>';
      return;
    }

    const r = await Api.get(`/busca?q=${encodeURIComponent(busca)}`);
    const total = Number(r && r.total ? r.total : 0);
    const cursos = Array.isArray(r && r.cursos) ? r.cursos : [];
    const noticias = Array.isArray(r && r.noticias) ? r.noticias : [];
    const documentos = Array.isArray(r && r.documentos) ? r.documentos : [];

    if (cabecalho) {
      cabecalho.textContent = `${total} resultado${total === 1 ? "" : "s"} para “${busca}”`;
    }

    if (total === 0) {
      alvo.setAttribute("aria-busy", "false");
      alvo.innerHTML = `<div class="vazio" role="status">
        Nenhum resultado para “${escapar(busca)}”. Tente uma palavra mais curta,
        ou veja a <a href="/cursos.html">lista completa de cursos</a>.
      </div>`;
      return;
    }

    alvo.innerHTML =
      secaoResultado(
        "Cursos",
        cursos,
        (i) => `<a href="/curso.html?id=${i.id}">${escapar(i.titulo)}</a>`,
      ) +
      secaoResultado(
        "Notícias e comunicados",
        noticias,
        (i) => `<a href="/noticias.html#noticia-${i.id}">${escapar(i.titulo)}</a>`,
      ) +
      secaoResultado(
        "Documentos",
        documentos,
        (i) =>
          `<a href="${escapar(i.url_arquivo)}" target="_blank" rel="noopener">${escapar(i.titulo)}</a>`,
      );

    alvo.setAttribute("aria-busy", "false");
  } catch (erro) {
    alvo.setAttribute("aria-busy", "false");
    alvo.innerHTML = `<div class="aviso aviso--erro" role="alert">${escapar(
      erro && erro.message ? erro.message : "Não foi possível realizar a busca.",
    )}</div>`;
  }
}

document.addEventListener("layout-pronto", () => {
  const termo = parametro("q");
  const campo = document.getElementById("busca-termo");
  const alvo = document.getElementById("resultado-busca");

  if (!alvo) return;

  if (!termo) {
    alvo.setAttribute("aria-busy", "false");
    alvo.innerHTML =
      '<div class="vazio" role="status">Digite uma palavra para buscar cursos, comunicados e documentos.</div>';
    return;
  }

  if (campo) {
    campo.value = termo;
  }

  buscar(termo);
});
