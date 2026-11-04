/** Página inicial: indicadores, cursos em destaque e últimas notícias. */

function montarIndicadores(totalCursos) {
  const alvo = document.getElementById("indicadores");
  if (!alvo) return;
  const indicadores = [...DadosCeep.indicadores];
  if (Number.isInteger(totalCursos)) {
    indicadores.unshift({
      valor: String(totalCursos),
      rotulo: "cursos técnicos",
    });
  }
  alvo.innerHTML = indicadores
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
  alvo.setAttribute("aria-busy", "true");
  alvo.innerHTML = window.cartoesEsqueleto(6);
  try {
    const cursos = await Api.get("/cursos");
    alvo.setAttribute("aria-busy", "false");
    montarIndicadores(cursos.length);
    if (!cursos.length) {
      alvo.innerHTML =
        '<div class="vazio">Nenhum curso cadastrado ainda.</div>';
      return;
    }
    alvo.innerHTML = cursos.slice(0, 6).map(cardCurso).join("");
    window.ativarRevelacoes(alvo);
    window.ativarSpotlightCursos(alvo);
  } catch (erro) {
    alvo.setAttribute("aria-busy", "false");
    montarIndicadores();
    alvo.innerHTML = `<div class="aviso aviso--erro" role="alert">
      <p>Não foi possível carregar os cursos. ${escapar(erro.message)}</p>
      <button class="botao botao--contorno botao--pequeno" type="button" data-tentar-cursos-home>
        Tentar novamente
      </button>
    </div>`;
  }
}

async function carregarNoticiasHome() {
  const alvo = document.getElementById("noticias-home");
  if (!alvo) return;
  alvo.setAttribute("aria-busy", "true");
  alvo.innerHTML = window.cartoesEsqueleto(3);
  try {
    const noticias = await Api.get("/noticias?limite=3");
    alvo.setAttribute("aria-busy", "false");
    if (!noticias.length) {
      alvo.innerHTML =
        '<div class="vazio">Ainda não há comunicados publicados.</div>';
      return;
    }
    alvo.innerHTML = noticias
      .map(
        (n) => `
        <article class="card revelar-ao-rolar" data-revelar>
        <span class="etiqueta">${escapar(n.categoria)}</span>
        <h3><a href="/noticias.html#noticia-${n.id_noticia}">${escapar(n.titulo)}</a></h3>
        <p>${n.resumo ? escapar(n.resumo) : ""}</p>
        <div class="card__rodape"><small>${formatarData(n.data_publicacao)}</small></div>
      </article>
    `,
      )
      .join("");
    window.ativarRevelacoes(alvo);
  } catch (erro) {
    alvo.setAttribute("aria-busy", "false");
    alvo.innerHTML = `<div class="aviso aviso--erro" role="alert">
      <p>Não foi possível carregar as notícias. ${escapar(erro.message)}</p>
      <button class="botao botao--contorno botao--pequeno" type="button" data-tentar-noticias-home>
        Tentar novamente
      </button>
    </div>`;
  }
}

document.addEventListener("layout-pronto", () => {
  document
    .getElementById("cursos-destaque")
    ?.addEventListener("click", (evento) => {
      if (evento.target.closest("[data-tentar-cursos-home]")) {
        carregarCursosDestaque();
      }
    });
  document
    .getElementById("noticias-home")
    ?.addEventListener("click", (evento) => {
      if (evento.target.closest("[data-tentar-noticias-home]")) {
        carregarNoticiasHome();
      }
    });
  carregarCursosDestaque();
  carregarNoticiasHome();
});
