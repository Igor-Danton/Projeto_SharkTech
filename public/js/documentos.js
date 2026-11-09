/** Documentos e editais. */

async function listarDocumentos(categoria = "") {
  const alvo = document.getElementById("lista-documentos");
  if (!alvo) return;

  const parametros = new URLSearchParams();
  if (categoria) parametros.set("categoria", categoria);

  alvo.setAttribute("aria-busy", "true");
  alvo.innerHTML = '<tr><td colspan="4">Carregando…</td></tr>';

  try {
    const documentos = await Api.get(
      `/documentos${parametros.size ? `?${parametros.toString()}` : ""}`,
    );

    if (!Array.isArray(documentos) || !documentos.length) {
      alvo.innerHTML =
        '<tr><td colspan="4" role="status">Nenhum documento publicado nesta categoria.</td></tr>';
      return;
    }

    alvo.innerHTML = documentos
      .map(
        (documento) => `
      <tr>
        <td>
          <strong>${escapar(documento.titulo || "Documento sem título")}</strong>
          ${documento.descricao ? `<br><small>${escapar(documento.descricao)}</small>` : ""}
        </td>
        <td><span class="etiqueta">${escapar(documento.categoria || "Documento")}</span></td>
        <td>${formatarData(documento.data_publicacao)}</td>
        <td><a href="${escapar(documento.url_arquivo || "#")}" target="_blank" rel="noopener">Abrir</a></td>
      </tr>`,
      )
      .join("");
  } catch (erro) {
    alvo.innerHTML = `<tr><td colspan="4" role="alert">${escapar(
      erro && erro.message ? erro.message : "Não foi possível carregar os documentos.",
    )}</td></tr>`;
  } finally {
    alvo.setAttribute("aria-busy", "false");
  }
}

document.addEventListener("layout-pronto", () => {
  const form = document.getElementById("filtros-documentos");
  if (!form) return;

  listarDocumentos();

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    listarDocumentos(form.elements.categoria.value);
  });
});
