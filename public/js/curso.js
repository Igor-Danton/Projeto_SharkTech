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

function tabelaSeries(series) {
  if (!series.length) {
    return '<div class="vazio">A carga horária por série ainda não foi cadastrada.</div>';
  }

  return `
    <div class="tabela-rolagem">
      <table class="tabela">
        <thead>
          <tr>
            <th>Série</th>
            <th>Itinerário técnico (aulas/semana)</th>
            <th>Itinerário técnico (h/ano)</th>
            <th>Total (aulas/semana)</th>
            <th>Total (h/ano)</th>
          </tr>
        </thead>
        <tbody>
          ${series
            .map(
              (s) => `
          <tr>
            <td>${escapar(s.serie)}ª</td>
            <td>${celula(s.itinerario_semanal)}</td>
            <td>${celula(s.itinerario_anual)}</td>
            <td>${celula(s.total_semanal)}</td>
            <td>${celula(s.total_anual)}</td>
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function tabelaComum(linhas, bloco) {
  const itens = linhas.filter((l) => l.bloco === bloco);

  if (!itens.length) return "";

  const val = (aulas, horas) => {
    if (aulas === null || aulas === undefined) return "";

    return (
      escapar(aulas) +
      (horas !== null && horas !== undefined ? ` · ${escapar(horas)} h` : "")
    );
  };

  return `
    <div class="tabela-rolagem">
      <table class="tabela">
        <thead>
          <tr>
            <th>Componente</th>
            <th>1ª série</th>
            <th>2ª série</th>
            <th>3ª série</th>
          </tr>
        </thead>
        <tbody>
          ${itens
            .map(
              (l) => `
          <tr>
            <td>${escapar(l.nome)}</td>
            <td>${val(l.aulas_s1, l.horas_s1) || "—"}</td>
            <td>${val(l.aulas_s2, l.horas_s2) || "—"}</td>
            <td>${val(l.aulas_s3, l.horas_s3) || "—"}</td>
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function blocoDisciplinas(disciplinas) {
  if (!disciplinas.length) {
    return '<div class="vazio">Os componentes técnicos deste curso ainda não foram cadastrados.</div>';
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

async function carregarCurso() {
  const alvo = document.getElementById("detalhe-curso");
  const id = Number(parametro("id"));

  if (!Number.isInteger(id)) {
    alvo.innerHTML =
      '<div class="aviso aviso--erro">Curso não informado. <a href="/cursos.html">Ver lista de cursos</a>.</div>';
    return;
  }

  try {
    const [curso, comum] = await Promise.all([
      Api.get(`/cursos/${id}`),
      Api.get("/cursos/matriz-comum").catch(() => []),
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
    ]
      .filter(Boolean)
      .join("");

    alvo.innerHTML = `
      <div class="colunas-artigo">
        <div>
          ${blocoTexto("Sobre o curso", curso.descricao)}
          ${blocoTexto("Perfil do egresso", curso.perfil_egresso)}
          ${blocoTexto("Requisitos de ingresso", curso.requisitos_ingresso)}

          <h2>Carga horária por série</h2>
          ${tabelaSeries(curso.series || [])}

          <h2 style="margin-top:var(--e-4)">Componentes técnicos</h2>
          ${blocoDisciplinas(curso.disciplinas)}

          ${
            comum.length
              ? `
            <h2 style="margin-top:var(--e-4)">
              Formação Geral Básica (comum a todos os cursos)
            </h2>
            <p class="trilha">
              Disciplinas da formação geral distribuídas pelas três séries.
              Os valores mostram aulas semanais e subtotais em horas anuais.
            </p>
            ${tabelaComum(comum, "FGB")}

            <h2 style="margin-top:var(--e-4)">
              Parte Flexível Obrigatória
            </h2>
            ${tabelaComum(comum, "PFO")}`
              : ""
          }

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
    alvo.innerHTML = `<div class="aviso aviso--erro">
      ${escapar(erro.message)}
      <a href="/cursos.html">Ver todos os cursos</a>.
    </div>`;
  }
}

document.addEventListener("layout-pronto", carregarCurso);
