/** Resultados da busca por palavra-chave — RF05. */

function secaoResultado(titulo, itens, montarLink) {
  if (!itens.length) return '';
  return `
    <h2 style="margin-top:var(--e-3)">${titulo} (${itens.length})</h2>
    <ul class="lista-limpa">
      ${itens.map(item => `
        <li class="card" style="margin-bottom:var(--e-1)">
          <h3 style="margin:0">${montarLink(item)}</h3>
          ${item.resumo ? `<p>${escapar(item.resumo)}</p>` : ''}
        </li>`).join('')}
    </ul>`;
}

async function buscar(termo) {
  const alvo = document.getElementById('resultado-busca');
  alvo.innerHTML = '<p>Buscando…</p>';

  try {
    const r = await Api.get(`/busca?q=${encodeURIComponent(termo)}`);

    document.querySelector('.cabecalho-pagina h1').textContent =
      `${r.total} resultado${r.total === 1 ? '' : 's'} para “${termo}”`;

    if (r.total === 0) {
      alvo.innerHTML = `<div class="vazio">
        Nenhum resultado para “${escapar(termo)}”. Tente uma palavra mais curta,
        ou veja a <a href="/cursos.html">lista completa de cursos</a>.
      </div>`;
      return;
    }

    alvo.innerHTML =
      secaoResultado('Cursos', r.cursos, i => `<a href="/curso.html?id=${i.id}">${escapar(i.titulo)}</a>`) +
      secaoResultado('Notícias e comunicados', r.noticias, i => `<a href="/noticias.html#noticia-${i.id}">${escapar(i.titulo)}</a>`) +
      secaoResultado('Documentos', r.documentos, i => `<a href="${escapar(i.url_arquivo)}" target="_blank" rel="noopener">${escapar(i.titulo)}</a>`);
  } catch (erro) {
    alvo.innerHTML = `<div class="aviso aviso--erro">${escapar(erro.message)}</div>`;
  }
}

document.addEventListener('layout-pronto', () => {
  const termo = parametro('q');
  const campo = document.getElementById('busca-termo');

  if (!termo) {
    document.getElementById('resultado-busca').innerHTML =
      '<div class="vazio">Digite uma palavra para buscar cursos, comunicados e documentos.</div>';
    return;
  }
  campo.value = termo;
  buscar(termo);
});
