/** Area do aluno: envio de avaliacoes e depoimentos — RF03. */

async function carregarCursosNoFormulario() {
  const select = document.getElementById("av-curso");
  const cursos = await Api.get("/cursos");
  select.innerHTML = ['<option value="">Selecione…</option>']
    .concat(
      cursos.map(
        (c) => `<option value="${c.id_curso}">${escapar(c.nome)}</option>`,
      ),
    )
    .join("");
}

function montarSistemasOficiais() {
  const alvo = document.getElementById("sistemas-oficiais-lista");
  if (!alvo) return;
  alvo.innerHTML = DadosCeep.sistemasOficiais
    .map(
      (s) => `
    <li style="margin-bottom:var(--e-1)">
      <a href="${s.url}" target="_blank" rel="noopener">${escapar(s.nome)}</a>
    </li>`,
    )
    .join("");
}

document.addEventListener("layout-pronto", async () => {
  const form = document.getElementById("form-avaliacao");
  const aviso = document.getElementById("aviso-avaliacao");
  const botao = document.getElementById("botao-enviar");
  const campoNota = document.getElementById("campo-nota");

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

  // depoimento nao tem nota
  form.tipo.addEventListener("change", () => {
    campoNota.hidden = form.tipo.value === "depoimento";
  });

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    botao.disabled = true;
    aviso.hidden = true;

    try {
      const resposta = await Api.post("/avaliacoes", {
        tipo: form.tipo.value,
        id_curso: form.id_curso.value,
        nota: form.tipo.value === "depoimento" ? null : Number(form.nota.value),
        nome: form.nome.value,
        email: form.email.value,
        turma: form.turma.value,
        comentario: form.comentario.value,
      });
      mostrarAviso(aviso, resposta.mensagem, "ok");
      form.reset();
      campoNota.hidden = false;
    } catch (erro) {
      mostrarAviso(aviso, erro.message, "erro");
    } finally {
      botao.disabled = false;
    }
  });
});
