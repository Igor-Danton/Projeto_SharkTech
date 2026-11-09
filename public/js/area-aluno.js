/** Area do aluno: envio de avaliacoes e depoimentos — RF03. */

async function carregarCursosNoFormulario() {
  const select = document.getElementById("av-curso");
  if (!select) return;

  const cursos = await Api.get("/cursos");
  select.innerHTML = ['<option value="">Selecione…</option>']
    .concat(
      cursos.map(
        (curso) =>
          `<option value="${curso.id_curso}">${escapar(curso.nome)}</option>`,
      ),
    )
    .join("");
}

function montarSistemasOficiais() {
  const alvo = document.getElementById("sistemas-oficiais-lista");
  const sistemas = window.DadosCeep?.sistemasOficiais;
  if (!alvo || !Array.isArray(sistemas)) return;

  alvo.innerHTML = sistemas
    .map(
      (sistema) => `
    <li style="margin-bottom:var(--e-1)">
      <a href="${escapar(sistema.url)}" target="_blank" rel="noopener">${escapar(sistema.nome)}</a>
    </li>`,
    )
    .join("");
}

document.addEventListener("layout-pronto", async () => {
  const form = document.getElementById("form-avaliacao");
  if (!form) return;

  const aviso = document.getElementById("aviso-avaliacao");
  const botao = document.getElementById("botao-enviar");
  const campoNota = document.getElementById("campo-nota");
  const seletorTipo = form.elements.tipo;

  montarSistemasOficiais();

  try {
    await carregarCursosNoFormulario();
  } catch (_) {
    mostrarAviso(
      aviso,
      "Não foi possível carregar a lista de cursos. Recarregue a página.",
      "erro",
    );
  }

  seletorTipo?.addEventListener("change", () => {
    if (campoNota) campoNota.hidden = seletorTipo.value === "depoimento";
  });

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (!botao) return;

    botao.disabled = true;
    if (aviso) aviso.hidden = true;

    try {
      const resposta = await Api.post("/avaliacoes", {
        tipo: seletorTipo.value,
        id_curso: form.elements.id_curso.value,
        nota:
          seletorTipo.value === "depoimento"
            ? null
            : Number(form.elements.nota.value),
        nome: form.elements.nome.value,
        email: form.elements.email.value,
        turma: form.elements.turma.value,
        comentario: form.elements.comentario.value,
      });
      mostrarAviso(aviso, resposta.mensagem, "ok");
      form.reset();
      if (campoNota) campoNota.hidden = false;
    } catch (erro) {
      mostrarAviso(aviso, erro.message, "erro");
    } finally {
      botao.disabled = false;
    }
  });
});
