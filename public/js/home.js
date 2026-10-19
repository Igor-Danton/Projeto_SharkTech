/** Pagina inicial: indicadores, cursos em destaque e ultimas noticias. */

function montarIndicadores() {
  const alvo = document.getElementById("indicadores");
  if (!alvo) return;
  alvo.innerHTML = DadosCeep.indicadores
    .map(
      (item) => `
    <div class="indicador">
      <div class="indicador__numero">${escapar(item.valor)}</div>
      <div class="indicador__rotulo">${escapar(item.rotulo)}</div>
    </div>
  `,
    )
    .join("");
}

async function carregarCursosDestaque() {
  const alvo = document.getElementById("cursos-destaque");
  if (!alvo) return;
  try {
    const cursos = await Api.get("/cursos");
    if (!cursos.length) {
      alvo.innerHTML =
        '<div class="vazio">Nenhum curso cadastrado ainda.</div>';
      return;
    }
    alvo.innerHTML = cursos.slice(0, 6).map(cardCurso).join("");
  } catch (erro) {
    alvo.innerHTML = `<div class="aviso aviso--erro">Não foi possível carregar os cursos. ${escapar(erro.message)}</div>`;
  }
}

async function carregarNoticiasHome() {
  const alvo = document.getElementById("noticias-home");
  if (!alvo) return;
  try {
    const noticias = await Api.get("/noticias?limite=3");
    if (!noticias.length) {
      alvo.innerHTML =
        '<div class="vazio">Ainda não há comunicados publicados.</div>';
      return;
    }
    alvo.innerHTML = noticias
      .map(
        (n) => `
      <article class="card">
        <span class="etiqueta">${escapar(n.categoria)}</span>
        <h3><a href="/noticias.html#noticia-${n.id_noticia}">${escapar(n.titulo)}</a></h3>
        <p>${n.resumo ? escapar(n.resumo) : ""}</p>
        <div class="card__rodape"><small>${formatarData(n.data_publicacao)}</small></div>
      </article>
    `,
      )
      .join("");
  } catch (erro) {
    alvo.innerHTML =
      '<div class="vazio">Não foi possível carregar as notícias.</div>';
  }
}

document.addEventListener("layout-pronto", () => {
  montarIndicadores();
  carregarCursosDestaque();
  carregarNoticiasHome();
});
