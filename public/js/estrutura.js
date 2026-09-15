/** Pagina de estrutura, laboratorios e biblioteca. */

function cartoes(lista) {
  return lista.map(item => `<div class="card"><h3>${escapar(item)}</h3></div>`).join('');
}

document.addEventListener('layout-pronto', () => {
  const infra = DadosCeep.infraestrutura;

  document.getElementById('infraestrutura').innerHTML = cartoes(infra.confirmada);
  document.getElementById('laboratorios').innerHTML = cartoes(infra.laboratoriosTecnicos);

  const obs = document.getElementById('observacao-laboratorios');
  obs.innerHTML = `
    <span class="historico">Dado histórico: ${escapar(infra.quantidadeLaboratorios.valor)}</span>
    <br>${escapar(infra.quantidadeLaboratorios.observacao)}`;

  document.getElementById('texto-biblioteca').textContent = infra.biblioteca.texto;
  document.getElementById('acervo-biblioteca').innerHTML = infra.biblioteca.acervo
    ? escapar(infra.biblioteca.acervo)
    : '<span class="pendente">Tamanho do acervo: informação pendente de fonte atualizada.</span>';
});
