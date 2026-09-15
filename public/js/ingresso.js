/** Blocos de encaminhamento para os sistemas oficiais da SEED-PR. */

document.addEventListener('layout-pronto', () => {
  const alvo = document.getElementById('sistemas-oficiais');
  if (!alvo) return;

  alvo.innerHTML = DadosCeep.sistemasOficiais.map((sistema) => `
    <article class="card">
      <h3>${escapar(sistema.nome)}</h3>
      <p>${escapar(sistema.descricao)}</p>
      <div class="card__rodape">
        <a class="botao botao--primario botao--pequeno" href="${sistema.url}" target="_blank" rel="noopener">
          ${escapar(sistema.rotulo)}
        </a>
      </div>
    </article>`).join('');
});
