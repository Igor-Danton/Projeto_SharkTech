(() => {
  const imagens = [
    ["Cantina", "cantina.webp"],
    ["Coordenação", "coordenacao.webp"],
    ["Espaço livre", "espaco-livre.webp"],
    ["Espaço livre 2", "espaco-livre-2.webp"],
    ["Espaço livre 3", "espaco-livre-3.webp"],
    ["Espaço livre 4", "espaco-livre-4.webp"],
    ["Pintura da parede", "pintura-parede.webp"],
    ["Quadra", "quadra.webp"],
    ["Sala 1", "sala-1.webp"],
    ["Sala 2", "sala-2.webp"],
    ["Sala 3", "sala-3.webp"],
    ["Sala 4", "sala-4.webp"],
    ["Sala 6", "sala-6.webp"],
    ["Sala 7 — altas habilidades", "sala-7-altas-hab.webp"],
  ];

  function montarEstrutura(alvo) {
    const laboratorios = DadosCeep.infraestrutura.laboratoriosTecnicos;

    alvo.innerHTML = `
      <section class="secao estrutura-institucional" aria-labelledby="titulo-estrutura">
        <div class="container">
          <div class="secao__titulo">
            <h2 id="titulo-estrutura">Estrutura e laboratórios</h2>
            <p>Conheça os espaços da escola e os laboratórios que apoiam a formação técnica.</p>
          </div>

          <div class="estrutura-galeria" aria-label="Fotografias dos espaços da escola">
            <div class="estrutura-galeria__palco">
              <div class="estrutura-galeria__slides" data-carrossel tabindex="0" aria-label="Carrossel de fotografias. Use as setas do teclado para navegar.">
                ${imagens
                  .map(
                    ([nome, arquivo], indice) => `
                      <figure class="estrutura-galeria__slide"${indice ? " hidden" : ""}>
                        <img
                          src="/assets/img/estrutura/${arquivo}"
                          alt="Fotografia de ${escapar(nome)} no CEEP Curitiba."
                          width="1920"
                          height="1440"
                          ${indice ? 'loading="lazy"' : 'fetchpriority="high"'}
                          decoding="async"
                        />
                        <figcaption class="estrutura-galeria__legenda">${escapar(nome)}</figcaption>
                      </figure>
                    `,
                  )
                  .join("")}
              </div>
              <button class="estrutura-galeria__seta estrutura-galeria__seta--anterior" type="button" data-carrossel-anterior aria-label="Ver fotografia anterior">‹</button>
              <button class="estrutura-galeria__seta estrutura-galeria__seta--proxima" type="button" data-carrossel-proxima aria-label="Ver próxima fotografia">›</button>
            </div>

            <div class="estrutura-galeria__controles">
              <p class="estrutura-galeria__posicao" data-carrossel-status aria-live="polite"></p>
              <div class="estrutura-galeria__pontos" aria-label="Selecionar fotografia">
                ${imagens
                  .map(
                    ([nome], indice) => `
                      <button
                        type="button"
                        class="estrutura-galeria__ponto"
                        data-carrossel-ir="${indice}"
                        aria-label="Fotografia ${indice + 1}: ${escapar(nome)}"
                        aria-pressed="${indice === 0}"
                      ></button>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          </div>

          <section class="estrutura-laboratorios" id="laboratorios-tecnicos" aria-labelledby="titulo-laboratorios">
            <div class="estrutura-laboratorios__cabecalho">
              <h3 id="titulo-laboratorios">Laboratórios técnicos</h3>
              <p>Áreas técnicas presentes na formação do CEEP Curitiba.</p>
            </div>
            <ul class="estrutura-laboratorios__lista">
              ${laboratorios
                .map(
                  (nome) =>
                    `<li class="estrutura-laboratorios__item">${escapar(nome)}</li>`,
                )
                .join("")}
            </ul>
          </section>

          <section class="estrutura-video" id="biblioteca" aria-labelledby="titulo-video">
            <div class="estrutura-video__texto">
              <h3 id="titulo-video">Biblioteca</h3>
              <p>
                Conheça o espaço da biblioteca e o ambiente destinado à leitura,
                pesquisa e aprendizagem dos estudantes.
              </p>
            </div>
            <video
              class="estrutura-video__player"
              controls
              muted
              playsinline
              preload="none"
              poster="/assets/img/estrutura/video-poster.webp"
              aria-label="Vídeo da biblioteca do CEEP Curitiba"
              data-video-estrutura
            >
              <source src="/assets/img/estrutura/apresentacao-institucional.mp4" type="video/mp4" />
              Seu navegador não consegue reproduzir este vídeo.
            </video>
            <p class="estrutura-video__status" data-video-status aria-live="polite">Sem áudio. A reprodução começa quando o vídeo entra na tela.</p>
          </section>
        </div>
      </section>
    `;

    configurarCarrossel(alvo);
    configurarVideo(alvo);
  }

  function configurarCarrossel(alvo) {
    const carrossel = alvo.querySelector("[data-carrossel]");
    const slides = [...alvo.querySelectorAll(".estrutura-galeria__slide")];
    const pontos = [...alvo.querySelectorAll("[data-carrossel-ir]")];
    const status = alvo.querySelector("[data-carrossel-status]");
    let atual = 0;
    let inicioToque = null;

    function mostrar(indice) {
      atual = (indice + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = i !== atual;
        if (i === atual) slide.querySelector("img").loading = "eager";
      });
      pontos.forEach((ponto, i) =>
        ponto.setAttribute("aria-pressed", String(i === atual)),
      );
      status.textContent = `Fotografia ${atual + 1} de ${slides.length}: ${imagens[atual][0]}`;
    }

    alvo.addEventListener("click", (evento) => {
      if (evento.target.closest("[data-carrossel-anterior]")) {
        mostrar(atual - 1);
      } else if (evento.target.closest("[data-carrossel-proxima]")) {
        mostrar(atual + 1);
      } else {
        const ponto = evento.target.closest("[data-carrossel-ir]");
        if (ponto) mostrar(Number(ponto.dataset.carrosselIr));
      }
    });

    carrossel.addEventListener("keydown", (evento) => {
      if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        mostrar(atual - 1);
      } else if (evento.key === "ArrowRight") {
        evento.preventDefault();
        mostrar(atual + 1);
      }
    });

    carrossel.addEventListener("pointerdown", (evento) => {
      if (evento.target.closest("button")) return;
      inicioToque = evento.clientX;
    });
    carrossel.addEventListener("pointerup", (evento) => {
      if (inicioToque === null) return;
      const deslocamento = evento.clientX - inicioToque;
      inicioToque = null;
      if (Math.abs(deslocamento) > 45) {
        mostrar(atual + (deslocamento < 0 ? 1 : -1));
      }
    });
    carrossel.addEventListener("pointercancel", () => {
      inicioToque = null;
    });

    mostrar(0);
  }

  function configurarVideo(alvo) {
    const video = alvo.querySelector("[data-video-estrutura]");
    const status = alvo.querySelector("[data-video-status]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      status.textContent =
        "Sem áudio. Use os controles para iniciar o vídeo da biblioteca.";
      return;
    }
    if (!("IntersectionObserver" in window)) {
      status.textContent =
        "Sem áudio. A reprodução automática não está disponível neste navegador; use os controles para iniciar.";
      return;
    }

    let pausadoPelaPessoa = false;
    let videoVisivel = false;
    let pausaDeVisibilidade = false;

    video.addEventListener("pause", () => {
      if (pausaDeVisibilidade) {
        pausaDeVisibilidade = false;
      } else {
        pausadoPelaPessoa = true;
      }
    });
    video.addEventListener("play", () => {
      pausadoPelaPessoa = false;
      status.textContent =
        "Sem áudio. Use os controles para pausar ou navegar pelo vídeo.";
    });

    const observador = new IntersectionObserver(
      ([entrada]) => {
        videoVisivel = entrada.isIntersecting;
        if (entrada.isIntersecting) {
          if (pausadoPelaPessoa || video.ended) return;
          video.autoplay = true;
          if (video.paused) {
            video
              .play()
              .then(() => {
                if (!videoVisivel && !video.paused) {
                  pausaDeVisibilidade = true;
                  video.pause();
                }
              })
              .catch((erro) => {
                if (erro.name !== "AbortError" && videoVisivel) {
                  status.textContent =
                    "A reprodução automática não está disponível. Use os controles para iniciar o vídeo.";
                }
              });
          }
        } else {
          video.autoplay = false;
          if (!video.paused) {
            pausaDeVisibilidade = true;
            video.pause();
          }
        }
      },
      { threshold: 0.5 },
    );

    observador.observe(video);
  }

  document.addEventListener("layout-pronto", () => {
    const alvo = document.getElementById("estrutura-institucional");
    if (!alvo) return;

    montarEstrutura(alvo);

    if (
      location.hash === "#laboratorios-tecnicos" ||
      location.hash === "#biblioteca"
    ) {
      requestAnimationFrame(() => {
        document
          .getElementById(location.hash.slice(1))
          ?.scrollIntoView({ block: "start" });
      });
    }
  });
})();
