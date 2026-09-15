/** Noticias, comunicados e eventos. */

async function listarNoticias(categoria = '') {
  const alvo = document.getElementById('lista-noticias');
  alvo.innerHTML = '<p>Carregando…</p>';

  try {
    const noticias = await Api.get(`/noticias${categoria ? `?categoria=${categoria}` : ''}`);
    if (!noticias.length) {
      alvo.innerHTML = '<div class="vazio">Nenhum item publicado nesta categoria.</div>';
      return;
    }
    alvo.innerHTML = noticias.map((n) => `
      <article class="card" id="noticia-${n.id_noticia}" style="margin-bottom:var(--e-2)">
        <span class="etiqueta">${escapar(n.categoria)}</span>
        <h3>${escapar(n.titulo)}</h3>
        <small>${formatarData(n.data_publicacao)}</small>
        <p>${escapar(n.conteudo)}</p>
      </article>`).join('');
  } catch (erro) {
    alvo.innerHTML = `<div class="aviso aviso--erro">${escapar(erro.message)}</div>`;
  }
}

document.addEventListener('layout-pronto', () => {
  const form = document.getElementById('filtros-noticias');
  listarNoticias();
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    listarNoticias(form.categoria.value);
  });
});
