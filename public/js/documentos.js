/** Documentos e editais. */

async function listarDocumentos(categoria = "") {
  const alvo = document.getElementById("lista-documentos");
  alvo.innerHTML = '<tr><td colspan="4">Carregando…</td></tr>';

  try {
    const documentos = await Api.get(
      `/documentos${categoria ? `?categoria=${categoria}` : ""}`,
    );
    if (!documentos.length) {
      alvo.innerHTML =
        '<tr><td colspan="4">Nenhum documento publicado nesta categoria.</td></tr>';
      return;
    }
    alvo.innerHTML = documentos
      .map(
        (d) => `
      <tr>
        <td>
          <strong>${escapar(d.titulo)}</strong>
          ${d.descricao ? `<br><small>${escapar(d.descricao)}</small>` : ""}
        </td>
        <td><span class="etiqueta">${escapar(d.categoria)}</span></td>
        <td>${formatarData(d.data_publicacao)}</td>
        <td><a href="${escapar(d.url_arquivo)}" target="_blank" rel="noopener">Abrir</a></td>
      </tr>`,
      )
      .join("");
  } catch (erro) {
    alvo.innerHTML = `<tr><td colspan="4">${escapar(erro.message)}</td></tr>`;
  }
}

document.addEventListener("layout-pronto", () => {
  const form = document.getElementById("filtros-documentos");
  listarDocumentos();
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    listarDocumentos(form.categoria.value);
  });
});
