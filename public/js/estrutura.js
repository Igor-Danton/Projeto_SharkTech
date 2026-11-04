/** Página de estrutura, laboratórios e biblioteca. */

function cartoes(lista) {
  return lista
    .map((item) => `<div class="card"><h3>${escapar(item)}</h3></div>`)
    .join("");
}

document.addEventListener("layout-pronto", () => {
  const infra = DadosCeep.infraestrutura;

  document.getElementById("infraestrutura").innerHTML = cartoes(
    infra.confirmada,
  );
  document.getElementById("laboratorios").innerHTML = cartoes(
    infra.laboratoriosTecnicos,
  );

  document.getElementById("texto-biblioteca").textContent =
    infra.biblioteca.texto;
});
