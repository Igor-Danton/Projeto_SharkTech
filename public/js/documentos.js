/** Documentos e editais. */

async function listarDocumentos(categoria = "") {
  const alvo = document.getElementById("lista-documentos");
  if (!alvo) return;

  alvo.setAttribute("aria-busy", "true");
  alvo.innerHTML = '<tr><td colspan="4">Carregando…</td></tr>';

  try {
    const parametros = new URLSearchParams();
    if (categoria) parametros.set("categoria", categoria);
    const sufixo = parametros.size ? `?${parametros.toString()}` : "";
    const documentos = await Api.get(`/documentos${sufixo}`);

    if (!documentos.length) {
      alvo.innerHTML =
        '<tr><td colspan="4" role="status">Nenhum documento publicado nesta categoria.</td></tr>';
      return;
    }

    alvo.innerHTML = documentos
      .map(
        (documento) => `
      <tr>
        <td>
          <strong>${escapar(documento.titulo)}</strong>
          ${documento.descricao ? `<br><small>${escapar(documento.descricao)}</small>` : ""}
        </td>
        <td><span class="etiqueta">${escapar(documento.categoria || "documento")}</span></td>
        <td>${formatarData(documento.data_publicacao)}</td>
        <td><a href="${escapar(documento.url_arquivo)}" target="_blank" rel="noopener">Abrir</a></td>
      </tr>`,
      )
      .join("");
  } catch (erro) {
    alvo.innerHTML = `<tr><td colspan="4" role="alert">${escapar(erro.message)}</td></tr>`;
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
    listarDocumentos(form.categoria.value);
  });
});
