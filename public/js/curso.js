/** Página individual do curso — RF02, RF04 e RF08. */

function blocoTexto(titulo, valor) {
  if (!valor || !String(valor).trim()) return "";

  return `
    <h2>${titulo}</h2>
    <p>${escapar(valor)}</p>`;
}

function listaAvaliacoes(itens, vazio) {
  if (!itens.length) return `<div class="vazio">${vazio}</div>`;

  return itens
    .map(
      (item) => `
    <article class="avaliacao">
      <div class="avaliacao__cabecalho">
        <span>${escapar(item.aluno)}${
          item.turma ? " — " + escapar(item.turma) : ""
        }</span>
        <span>${formatarData(item.data_avaliacao)}</span>
      </div>
      ${item.nota ? estrelas(item.nota) : ""}
      <p>${escapar(item.comentario)}</p>
    </article>`,
    )
    .join("");
}

const celula = (v) => (v === null || v === undefined ? "—" : escapar(v));

function disciplinasTemDistribuicao(disciplinas) {
  return disciplinas.some(
    (item) =>
      item.grupo_curricular ||
      [1, 2, 3].some((numero) =>
        ["aulas", "horas"].some((tipo) => {
          const valor = item[`${tipo}_s${numero}`];
          return valor !== null && valor !== undefined;
        }),
      ),
  );
}

function tabelaSeries(series) {
  if (!series.length) {
    return '<div class="vazio">A carga horária por série ainda não foi cadastrada.</div>';
  }

  const temDistribuicaoCompleta = series.some(
    (s) =>
      s.formacao_geral_semanal !== null ||
      s.aprofundamento_semanal !== null ||
      s.diversificada_semanal !== null,
  );
  const carga = (aulas, horas) =>
    [
      aulas !== null && aulas !== undefined
        ? `${escapar(aulas)} aulas/semana`
        : "",
      horas !== null && horas !== undefined ? `${escapar(horas)} h/ano` : "",
    ]
      .filter(Boolean)
      .join(" · ") || "—";

  return `
    <div class="tabela-rolagem">
      <table class="tabela">
        <thead>
          <tr>
            <th>Série</th>
            ${
              temDistribuicaoCompleta
                ? `
                  <th>Formação Geral Básica</th>
                  <th>Aprofundamento</th>
                  <th>Itinerário técnico-profissional</th>
                  <th>Parte diversificada</th>
                  <th>Total</th>`
                : `
                  <th>Itinerário técnico (aulas/semana)</th>
                  <th>Itinerário técnico (h/ano)</th>
                  <th>Total (aulas/semana)</th>
                  <th>Total (h/ano)</th>`
            }
          </tr>
        </thead>
        <tbody>
          ${series
            .map(
              (s) => `
          <tr>
            <td>${escapar(s.serie)}ª</td>
            ${
              temDistribuicaoCompleta
                ? `
                  <td>${carga(s.formacao_geral_semanal, s.formacao_geral_anual)}</td>
                  <td>${carga(s.aprofundamento_semanal, s.aprofundamento_anual)}</td>
                  <td>${carga(s.itinerario_semanal, s.itinerario_anual)}</td>
                  <td>${carga(s.diversificada_semanal, s.diversificada_anual)}</td>
                  <td>${carga(s.total_semanal, s.total_anual)}</td>`
                : `
                  <td>${celula(s.itinerario_semanal)}</td>
                  <td>${celula(s.itinerario_anual)}</td>
                  <td>${celula(s.total_semanal)}</td>
                  <td>${celula(s.total_anual)}</td>`
            }
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function tabelaComum(linhas, bloco, serie) {
  const itens = linhas.filter((l) => l.bloco === bloco);

  if (!itens.length) return "";

  const numeroSerie = Number(serie);
  const campoAulas = `aulas_s${numeroSerie}`;
  const campoHoras = `horas_s${numeroSerie}`;
  const val = (aulas, horas) =>
    [
      aulas !== null && aulas !== undefined
        ? `${escapar(aulas)} aulas/semana`
        : "",
      horas !== null && horas !== undefined ? `${escapar(horas)} h/ano` : "",
    ]
      .filter(Boolean)
      .join(" · ");
  const observacoes = [
    ...new Set(itens.map((item) => item.observacao).filter(Boolean)),
  ];

  return `
    <div class="tabela-rolagem">
      <table class="tabela">
        <thead>
          <tr>
            <th>Componente</th>
            ${
              serie
                ? "<th>Carga horária</th>"
                : "<th>1ª série</th><th>2ª série</th><th>3ª série</th>"
            }
          </tr>
        </thead>
        <tbody>
          ${itens
            .map(
              (l) => `
          <tr>
            <td>${escapar(l.nome)}</td>
            ${
              serie
                ? `<td>${val(l[campoAulas], l[campoHoras]) || "—"}</td>`
                : `<td>${val(l.aulas_s1, l.horas_s1) || "—"}</td>
                   <td>${val(l.aulas_s2, l.horas_s2) || "—"}</td>
                   <td>${val(l.aulas_s3, l.horas_s3) || "—"}</td>`
            }
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    ${observacoes.map((observacao) => `<p class="trilha">${escapar(observacao)}</p>`).join("")}`;
}

function blocoDisciplinas(disciplinas, serie) {
  if (!disciplinas.length) {
    return '<div class="vazio">Os componentes técnicos deste curso ainda não foram cadastrados.</div>';
  }

  const gruposCurriculares = [
    ...new Set(
      disciplinas.map((item) => item.grupo_curricular).filter(Boolean),
    ),
  ];
  const numeroSerie = Number(serie);
  const campoAulas = `aulas_s${numeroSerie}`;
  const campoHoras = `horas_s${numeroSerie}`;
  const temDistribuicaoPorSerie = disciplinasTemDistribuicao(disciplinas);

  if (gruposCurriculares.length) {
    const carga = (aulas, horas) =>
      [
        aulas !== null && aulas !== undefined
          ? `${escapar(aulas)} aulas/semana`
          : "",
        horas !== null && horas !== undefined ? `${escapar(horas)} h/ano` : "",
      ]
        .filter(Boolean)
        .join(" · ") || "—";

    return gruposCurriculares
      .map((grupo) => {
        const itens = disciplinas.filter(
          (item) => item.grupo_curricular === grupo,
        );
        return `
          <h3 style="margin-top:var(--e-3)">${escapar(grupo)}</h3>
          <div class="tabela-rolagem">
            <table class="tabela">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Componente</th>
                  ${
                    serie
                      ? "<th>Carga horária</th>"
                      : "<th>1ª série</th><th>2ª série</th><th>3ª série</th>"
                  }
                </tr>
              </thead>
              <tbody>
                ${itens
                  .map(
                    (item) => `
                      <tr>
                        <td>${item.codigo_componente ? escapar(item.codigo_componente) : "—"}</td>
                        <td>${escapar(item.nome)}</td>
                        ${
                          serie
                            ? `<td>${carga(item[campoAulas], item[campoHoras])}</td>`
                            : `<td>${carga(item.aulas_s1, item.horas_s1)}</td>
                               <td>${carga(item.aulas_s2, item.horas_s2)}</td>
                               <td>${carga(item.aulas_s3, item.horas_s3)}</td>`
                        }
                      </tr>`,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>`;
      })
      .join("");
  }

  if (serie && temDistribuicaoPorSerie) {
    const carga = (aulas, horas) =>
      [
        aulas !== null && aulas !== undefined
          ? `${escapar(aulas)} aulas/semana`
          : "",
        horas !== null && horas !== undefined ? `${escapar(horas)} h/ano` : "",
      ]
        .filter(Boolean)
        .join(" · ") || "—";

    return `
      <div class="tabela-rolagem">
        <table class="tabela">
          <thead>
            <tr><th>Componente</th><th>Carga horária</th></tr>
          </thead>
          <tbody>
            ${disciplinas
              .map(
                (item) => `
                  <tr>
                    <td>${escapar(item.nome)}</td>
                    <td>${carga(item[campoAulas], item[campoHoras])}</td>
                  </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>`;
  }

  const temDetalhe = disciplinas.some((d) => d.carga_horaria || d.professor);

  if (temDetalhe) {
    return `
      <div class="tabela-rolagem">
        <table class="tabela">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Carga horária</th>
              <th>Professor</th>
            </tr>
          </thead>
          <tbody>
            ${disciplinas
              .map(
                (d) => `
            <tr>
              <td>${escapar(d.nome)}</td>
              <td>${
                d.carga_horaria ? escapar(d.carga_horaria) + " h" : "—"
              }</td>
              <td>${d.professor ? escapar(d.professor) : "—"}</td>
            </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>`;
  }

  return `
    <ul>
      ${disciplinas.map((d) => `<li>${escapar(d.nome)}</li>`).join("")}
    </ul>
    <p class="trilha">
      A carga horária de cada componente e a distribuição por série
      não constam na matriz consolidada.
    </p>`;
}

function matrizAccordion(series, comum, disciplinas, gruposMatriz) {
  return `
      <h2>Matriz curricular por série</h2>
      <p class="trilha">
        Aulas semanais e horas anuais são apresentadas separadamente.
        Traços indicam informações não especificadas na fonte.
      </p>
      <div class="matriz-series">
        ${series
          .map((serie, indice) => {
            const componentesComuns = gruposMatriz
              .map(([bloco, titulo]) => {
                const tabela = tabelaComum(comum, bloco, serie.serie);
                return tabela
                  ? `<h3 class="matriz-serie__titulo">${titulo}</h3>${tabela}`
                  : "";
              })
              .join("");
            const componentesTecnicos = disciplinasTemDistribuicao(disciplinas)
              ? `<h3 class="matriz-serie__titulo">Componentes técnicos</h3>
                 ${blocoDisciplinas(disciplinas, serie.serie)}`
              : "";
            const total = [
              serie.total_semanal !== null && serie.total_semanal !== undefined
                ? `${escapar(serie.total_semanal)} aulas por semana`
                : "",
              serie.total_anual !== null && serie.total_anual !== undefined
                ? `${escapar(serie.total_anual)} h por ano`
                : "",
            ]
              .filter(Boolean)
              .join(" · ");

            return `
              <details class="matriz-serie"${indice === 0 ? " open" : ""}>
                <summary>${escapar(serie.serie)}ª série${total ? ` — ${total}` : ""}</summary>
                <div class="matriz-serie__conteudo">
                  <h3 class="matriz-serie__titulo">Carga horária</h3>
                  ${tabelaSeries([serie])}
                  ${componentesComuns}
                  ${componentesTecnicos}
                  ${
                    !componentesComuns && !componentesTecnicos
                      ? '<p class="vazio">A matriz desta série ainda não foi cadastrada.</p>'
                      : ""
                  }
                </div>
              </details>`;
          })
          .join("")}
      </div>`;
}

async function carregarCurso() {
  const alvo = document.getElementById("detalhe-curso");
  const id = Number(parametro("id"));

  if (!Number.isInteger(id) || id < 1) {
    alvo.setAttribute("aria-busy", "false");
    alvo.innerHTML =
      '<div class="aviso aviso--erro">Curso não informado. <a href="/cursos.html">Ver lista de cursos</a>.</div>';
    return;
  }

  alvo.setAttribute("aria-busy", "true");
  alvo.innerHTML = `
      <div class="detalhe-esqueleto" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <p>Carregando informações do curso…</p>`;

  try {
    const [curso, comum] = await Promise.all([
      Api.get(`/cursos/${id}`),
      Api.get(`/cursos/matriz-comum?curso=${encodeURIComponent(id)}`),
    ]);

    document.title = `${curso.nome} | CEEP Curitiba`;

    const cabecalho = document.querySelector(".cabecalho-pagina .container");
    const destaquesCurso = [
      curso.area ? escapar(curso.area) : "",
      curso.media_notas
        ? `nota média ${escapar(curso.media_notas)} em ${escapar(curso.total_avaliacoes)} avaliações`
        : "",
    ].filter(Boolean);

    cabecalho.innerHTML = `
      <p class="trilha">
        <a href="/">Início</a> /
        <a href="/cursos.html">Cursos</a> /
        ${escapar(curso.nome)}
      </p>
      <h1>${escapar(curso.nome)}</h1>
      ${destaquesCurso.length ? `<p>${destaquesCurso.join(" · ")}</p>` : ""}`;

    const informacoesCurso = [
      curso.codigo_matriz
        ? `<li><strong>Código do curso na matriz:</strong> ${escapar(curso.codigo_matriz)}</li>`
        : "",
      curso.modalidade
        ? `<li><strong>Modalidade:</strong> ${escapar(curso.modalidade)}</li>`
        : "",
      curso.carga_horaria_minima
        ? `<li><strong>Carga horária mínima:</strong> ${escapar(formatarHoras(curso.carga_horaria_minima))}</li>`
        : "",
      curso.carga_horaria_total
        ? `<li><strong>Carga horária total:</strong> ${escapar(formatarHoras(curso.carga_horaria_total))}</li>`
        : "",
      curso.turno
        ? `<li><strong>Turno:</strong> ${escapar(curso.turno)}</li>`
        : "",
      curso.codigo_itinerario
        ? `<li><strong>Código do itinerário:</strong> ${escapar(curso.codigo_itinerario)}</li>`
        : "",
      curso.area
        ? `<li><strong>Eixo:</strong> ${escapar(curso.area)}</li>`
        : "",
      curso.ano_implantacao
        ? `<li><strong>Ano de implantação:</strong> ${escapar(curso.ano_implantacao)}</li>`
        : "",
      curso.dias_letivos_anuais
        ? `<li><strong>Dias letivos anuais:</strong> ${escapar(curso.dias_letivos_anuais)}</li>`
        : "",
    ]
      .filter(Boolean)
      .join("");

    const gruposMatriz = [
      ["FGB", "Formação Geral Básica"],
      ["Parte Diversificada", "Parte Diversificada"],
      ["PFO", "Parte Flexível Obrigatória"],
    ];
    const series = curso.series || [];
    const matrizPorGrupo = gruposMatriz
      .map(([bloco, titulo]) => {
        const tabela = tabelaComum(comum, bloco);
        return tabela
          ? `<h3 class="matriz-serie__titulo">${titulo}</h3>${tabela}`
          : "";
      })
      .join("");
    const matrizHtml = series.length
      ? `
          ${matrizAccordion(series, comum, curso.disciplinas, gruposMatriz)}
          ${
            curso.disciplinas.length &&
            !disciplinasTemDistribuicao(curso.disciplinas)
              ? `
                <h2 class="matriz-serie__titulo">Componentes técnicos</h2>
                ${blocoDisciplinas(curso.disciplinas)}`
              : ""
          }`
      : `
          <h2>Carga horária por série</h2>
          ${tabelaSeries(series)}
          ${
            curso.disciplinas.length || !matrizPorGrupo
              ? `
                <h2 class="matriz-serie__titulo">Componentes técnicos</h2>
                ${blocoDisciplinas(curso.disciplinas)}`
              : ""
          }
          ${
            matrizPorGrupo
              ? `
            <h2 class="matriz-serie__titulo">
              Matriz curricular por componente
            </h2>
            <p class="trilha">
              Aulas semanais e horas anuais são apresentadas separadamente.
              Traços indicam informações não especificadas na fonte.
            </p>
            ${matrizPorGrupo}`
              : ""
          }`;
    alvo.setAttribute("aria-busy", "false");
    alvo.innerHTML = `
      <div class="colunas-artigo">
        <div>
          <figure class="curso-detalhe__capa">
            ${window.imagemCursoHTML(curso)}
          </figure>
          ${blocoTexto("Sobre o curso", curso.descricao)}
          ${blocoTexto("Perfil do egresso", curso.perfil_egresso)}
          ${blocoTexto("Requisitos de ingresso", curso.requisitos_ingresso)}

          ${matrizHtml}

          <h2 style="margin-top:var(--e-4)">Avaliações de alunos</h2>
          ${listaAvaliacoes(
            curso.avaliacoes,
            "Este curso ainda não tem avaliações aprovadas.",
          )}

          <h2 style="margin-top:var(--e-4)">Depoimentos de egressos</h2>
          ${listaAvaliacoes(
            curso.depoimentos,
            "Este curso ainda não tem depoimentos aprovados.",
          )}
        </div>

        <aside class="caixa-lateral">
          <h3>Informações do curso</h3>

          <ul class="lista-limpa">${informacoesCurso}</ul>

          <p style="margin-top:var(--e-2)">
            <a
              class="botao botao--primario botao--pequeno"
              href="/comparador.html?a=${curso.id_curso}"
            >
              Comparar com outro curso
            </a>
          </p>

          <p>
            <a
              class="botao botao--contorno botao--pequeno"
              href="/como-ingressar.html"
            >
              Como ingressar
            </a>
          </p>

          <p>
            <a href="/area-do-aluno.html">Avaliar este curso</a>
          </p>
        </aside>
      </div>`;
  } catch (erro) {
    alvo.setAttribute("aria-busy", "false");
    const retry =
      erro.status === 404
        ? ""
        : `<button class="botao botao--contorno botao--pequeno" type="button" data-tentar-curso>
            Tentar novamente
          </button>`;
    alvo.innerHTML = `<div class="aviso aviso--erro" role="alert">
      <p>${
        erro.status === 404
          ? "Curso não encontrado."
          : `Não foi possível carregar as informações do curso. ${escapar(erro.message)}`
      }</p>
      <p><a href="/cursos.html">Ver todos os cursos</a></p>
      ${retry}
    </div>`;
  }
}

document.addEventListener("layout-pronto", () => {
  document
    .getElementById("detalhe-curso")
    .addEventListener("click", (evento) => {
      if (evento.target.closest("[data-tentar-curso]")) carregarCurso();
    });
  carregarCurso();
});
