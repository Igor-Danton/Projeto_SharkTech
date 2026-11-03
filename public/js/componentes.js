function cardCurso(curso) {
  const resumo = curso.descricao
    ? escapar(curso.descricao).slice(0, 150) +
      (curso.descricao.length > 150 ? "…" : "")
    : "";
  const metadados = [
    curso.turno ? `Turno: ${escapar(curso.turno)}` : "",
    formatarHoras(curso.carga_horaria_total)
      ? `Carga horária: ${formatarHoras(curso.carga_horaria_total)}`
      : "",
  ].filter(Boolean);

  return `
    <article class="card card-curso">
      <img src="/assets/img/cursos/${curso.slug}.png" alt="Capa do curso ${escapar(curso.nome)}" class="card-curso__imagem" onerror="this.style.display='none'">
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
