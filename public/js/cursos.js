/** Listagem de cursos com busca e filtro por eixo — RF01 e RF05. */

async function carregarAreas() {
  const select = document.getElementById("filtro-area");
  try {
    const areas = await Api.get("/cursos/areas");
    areas
      .filter((a) => a.total > 0)
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
  alvo.innerHTML = "<p>Carregando…</p>";

  try {
    const cursos = await Api.get(`/cursos${parametros}`);
    contador.textContent =
      cursos.length === 1
        ? "1 curso encontrado"
        : `${cursos.length} cursos encontrados`;

    alvo.innerHTML = cursos.length
      ? cursos.map(cardCurso).join("")
      : '<div class="vazio">Nenhum curso corresponde a esse filtro. Limpe os campos para ver todos.</div>';
  } catch (erro) {
    alvo.innerHTML = `<div class="aviso aviso--erro">${escapar(erro.message)}</div>`;
  }
}

document.addEventListener("layout-pronto", () => {
  const form = document.getElementById("filtros-cursos");

  carregarAreas();

  // Se veio da busca do topo (busca.html -> cursos), preenche o campo
  const termo = parametro("q");
  if (termo) form.querySelector("#filtro-q").value = termo;

  listar(termo ? `?q=${encodeURIComponent(termo)}` : "");

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
