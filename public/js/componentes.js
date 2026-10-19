function cardCurso(curso) {
  const resumo = curso.descricao
    ? escapar(curso.descricao).slice(0, 150) +
      (curso.descricao.length > 150 ? "…" : "")
    : '<span class="pendente">Descrição pendente de validação pela coordenação</span>';

  return `
    <article class="card card-curso">
      <span class="card-curso__area">${curso.area ? escapar(curso.area) : "Eixo a confirmar"}</span>

      <h3>
        <a href="/curso.html?id=${curso.id_curso}">
          ${escapar(curso.nome)}
        </a>
      </h3>

      <p>${resumo}</p>

      <div class="card-curso__meta">
        <span>Turno: ${curso.turno ? escapar(curso.turno) : "—"}</span>
        <span>Carga horária: ${formatarHoras(curso.carga_horaria_total) || "—"}</span>
      </div>

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
