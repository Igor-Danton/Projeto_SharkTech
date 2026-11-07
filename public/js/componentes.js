document.addEventListener(
  "error",
  (evento) => {
    if (
      evento.target instanceof HTMLImageElement &&
      evento.target.classList.contains("curso-imagem__arquivo")
    ) {
      evento.target.hidden = true;
      const fallback = evento.target.nextElementSibling;
      if (fallback) fallback.hidden = false;
    }
  },
  true,
);

function imagemCursoHTML(curso) {
  const descricoesImagem = {
    eletronica:
      "Ilustração de uma bancada de eletrônica com circuito e instrumento de medição.",
    eletromecanica:
      "Ilustração de um motor elétrico com ligações e painel de controle.",
    mecanica:
      "Ilustração de uma máquina-ferramenta em uma oficina de mecânica.",
    "manutencao-automotiva":
      "Ilustração de um automóvel em manutenção em uma oficina.",
  };
  const textoAlternativo =
    descricoesImagem[curso.slug] || `Capa do curso ${curso.nome}`;

  return `
    <div class="curso-imagem">
      <img
        src="/assets/img/cursos/${escapar(curso.slug)}.png"
        alt="${escapar(textoAlternativo)}"
        class="curso-imagem__arquivo"
        width="1280"
        height="720"
        loading="lazy"
        decoding="async"
      >
      <span class="curso-imagem__fallback" hidden>Imagem indisponível</span>
    </div>`;
}

function cartoesEsqueleto(quantidade = 3) {
  return Array.from(
    { length: quantidade },
    () => `
      <article class="card-esqueleto" aria-hidden="true">
        <span class="card-esqueleto__imagem"></span>
        <span class="card-esqueleto__linha card-esqueleto__linha--titulo"></span>
        <span class="card-esqueleto__linha"></span>
        <span class="card-esqueleto__linha card-esqueleto__linha--curta"></span>
      </article>`,
  ).join("");
}

function cardCurso(curso) {
  const resumo = curso.descricao
    ? escapar(curso.descricao).slice(0, 150) +
      (curso.descricao.length > 150 ? "…" : "")
    : "";
  const metadados = [
    curso.modalidade ? escapar(curso.modalidade) : "",
    curso.turno ? `Turno: ${escapar(curso.turno)}` : "",
    curso.codigo_matriz
      ? `Código da matriz: ${escapar(curso.codigo_matriz)}`
      : "",
    formatarHoras(curso.carga_horaria_minima)
      ? `Carga horária mínima: ${formatarHoras(curso.carga_horaria_minima)}`
      : formatarHoras(curso.carga_horaria_total)
        ? `Carga horária: ${formatarHoras(curso.carga_horaria_total)}`
        : "",
  ].filter(Boolean);

  return `
    <article class="card card-curso revelar-ao-rolar" data-revelar>
      ${imagemCursoHTML(curso)}
      ${curso.area ? `<span class="card-curso__area">${escapar(curso.area)}</span>` : ""}

      <h3>
        <a href="/curso.html?id=${curso.id_curso}">
          ${escapar(curso.nome)}
        </a>
      </h3>

      ${resumo ? `<p>${resumo}</p>` : ""}

      ${metadados.length ? `<div class="card-curso__meta">${metadados.map((item) => `<span>${item}</span>`).join("")}</div>` : ""}

      <div class="card__rodape">
        <a
          class="botao botao--contorno botao--pequeno"
          href="/curso.html?id=${curso.id_curso}"
        >
          Ver curso
        </a>
      </div>
    </article>`;
}

let observadorRevelacao;

function ativarRevelacoes(raiz = document) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const elementos = [
    ...(raiz.matches?.("[data-revelar]") ? [raiz] : []),
    ...raiz.querySelectorAll("[data-revelar]"),
  ].filter((elemento) => !elemento.dataset.revelacaoInicializada);

  if (!elementos.length) return;

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("revelar-visivel"));
    return;
  }

  if (!observadorRevelacao) {
    observadorRevelacao = new IntersectionObserver(
      (entradas, observador) => {
        if (entradas.length) {
          document.documentElement.classList.add("revelacoes-ativas");
        }
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("revelar-visivel");
          observador.unobserve(entrada.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );
  }

  elementos.forEach((elemento) => {
    elemento.dataset.revelacaoInicializada = "true";
    observadorRevelacao.observe(elemento);
  });
}

function ativarSpotlightCursos(raiz = document) {
  const grades = [
    ...(raiz.matches?.("[data-spotlight]") ? [raiz] : []),
    ...raiz.querySelectorAll("[data-spotlight]"),
  ].filter((grade) => !grade.dataset.spotlightInicializado);

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  grades.forEach((grade) => {
    grade.dataset.spotlightInicializado = "true";

    grade.addEventListener("pointermove", (evento) => {
      if (evento.pointerType === "touch") return;
      const card = evento.target.closest(".card-curso");
      if (!card || !grade.contains(card)) return;

      const limites = card.getBoundingClientRect();
      card.style.setProperty(
        "--spotlight-x",
        `${evento.clientX - limites.left}px`,
      );
      card.style.setProperty(
        "--spotlight-y",
        `${evento.clientY - limites.top}px`,
      );
    });

    grade.addEventListener("pointerout", (evento) => {
      const card = evento.target.closest(".card-curso");
      if (
        card &&
        grade.contains(card) &&
        (!evento.relatedTarget || !card.contains(evento.relatedTarget))
      ) {
        card.style.removeProperty("--spotlight-x");
        card.style.removeProperty("--spotlight-y");
      }
    });
  });
}

window.ativarRevelacoes = ativarRevelacoes;
window.ativarSpotlightCursos = ativarSpotlightCursos;
window.imagemCursoHTML = imagemCursoHTML;
window.cartoesEsqueleto = cartoesEsqueleto;

document.addEventListener("layout-pronto", () => {
  ativarRevelacoes();
  ativarSpotlightCursos();
});
