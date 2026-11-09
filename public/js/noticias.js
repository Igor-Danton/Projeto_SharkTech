/** Noticias, comunicados e eventos. */

async function listarNoticias(categoria = "") {
  const alvo = document.getElementById("lista-noticias");
  if (!alvo) return;

  alvo.innerHTML = "<p>Carregando…</p>";
  alvo.setAttribute("aria-busy", "true");

  try {
    const noticias = await Api.get(
      `/noticias${categoria ? `?categoria=${categoria}` : ""}`,
    );

    if (!noticias.length) {
      alvo.innerHTML =
        '<div class="vazio" role="status">Nenhum item publicado nesta categoria.</div>';
      alvo.setAttribute("aria-busy", "false");
      return;
    }

    alvo.innerHTML = noticias
      .map(
        (n) => `
      <article class="card" id="noticia-${n.id_noticia}" style="margin-bottom:var(--e-2)">
        <span class="etiqueta">${escapar(n.categoria || "notícia")}</span>
        <h3>${escapar(n.titulo)}</h3>
        <small>${formatarData(n.data_publicacao)}</small>
        <p>${escapar(n.conteudo)}</p>
      </article>`,
      )
      .join("");

    alvo.setAttribute("aria-busy", "false");
  } catch (erro) {
    alvo.setAttribute("aria-busy", "false");
    alvo.innerHTML = `<div class="aviso aviso--erro" role="alert">${escapar(erro.message)}</div>`;
  }
}

document.addEventListener("layout-pronto", () => {
  const form = document.getElementById("filtros-noticias");
  if (!form) return;

  listarNoticias();

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    listarNoticias(form.categoria.value);
  });
});
