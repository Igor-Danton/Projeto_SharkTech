/** Listagem de cursos com busca e filtro por eixo — RF01 e RF05. */

async function carregarAreas() {
  const select = document.getElementById("filtro-area");
  if (!select) return;

  try {
    const areas = await Api.get("/cursos/areas");
    areas
      .filter((area) => area && area.total > 0)
      .forEach((area) => {
        const opcao = document.createElement("option");
        opcao.value = area.nome;
        opcao.textContent = `${area.nome} (${area.total})`;
        select.appendChild(opcao);
      });
  } catch (_) {
    /* filtro simplesmente fica só com "Todos" */
  }
}

async function listar(parametros = "") {
  const alvo = document.getElementById("lista-cursos");
  const contador = document.getElementById("contador-cursos");

  if (!alvo || !contador) return;

  alvo.setAttribute("aria-busy", "true");
  contador.textContent = "Carregando cursos…";
  alvo.innerHTML = window.cartoesEsqueleto(6);

  try {
    const cursos = await Api.get(`/cursos${parametros}`);
    alvo.setAttribute("aria-busy", "false");
    contador.textContent =
      cursos.length === 1 ? "1 curso encontrado" : `${cursos.length} cursos encontrados`;

    alvo.innerHTML = cursos.length
      ? cursos.map(cardCurso).join("")
      : '<div class="vazio" role="status">Nenhum curso corresponde a esse filtro. Limpe os campos para ver todos.</div>';

    window.ativarRevelacoes?.(alvo);
    window.ativarSpotlightCursos?.(alvo);
  } catch (erro) {
    alvo.setAttribute("aria-busy", "false");
    contador.textContent = "Não foi possível carregar os cursos.";
    alvo.innerHTML = `<div class="aviso aviso--erro" role="alert">
      <p>Não foi possível carregar os cursos. ${escapar(erro.message)}</p>
      <button class="botao botao--contorno botao--pequeno" type="button" data-tentar-cursos>
        Tentar novamente
      </button>
    </div>`;
  }
}

document.addEventListener("layout-pronto", () => {
  const form = document.getElementById("filtros-cursos");
  const lista = document.getElementById("lista-cursos");

  if (!form || !lista) return;

  carregarAreas();

  const termo = parametro("q");
  if (termo) form.querySelector("#filtro-q").value = termo;

  listar(termo ? `?q=${encodeURIComponent(termo)}` : "");

  lista.addEventListener("click", (evento) => {
    if (!evento.target.closest("[data-tentar-cursos]")) return;

    const dados = new URLSearchParams();
    const q = form.q.value.trim();
    const area = form.area.value;

    if (q) dados.set("q", q);
    if (area) dados.set("area", area);

    listar(dados.toString() ? `?${dados}` : "");
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dados = new URLSearchParams();
    const q = form.q.value.trim();
    const area = form.area.value;

    if (q) dados.set("q", q);
    if (area) dados.set("area", area);

    listar(dados.toString() ? `?${dados}` : "");
  });

  form.addEventListener("reset", () => setTimeout(() => listar(""), 0));
});
