/**
 * Painel administrativo — RF06.
 * Cada aba carrega os dados sob demanda. Se a sessao cair, volta ao login.
 */

const painel = {
  aviso: null,
  conteudo: null,
};

function erroPainel(erro) {
  if (erro.status === 401) {
    window.location.href = "/admin/";
    return;
  }
  mostrarAviso(painel.aviso, erro.message, "erro");
}

/* ----------------------------- Resumo ----------------------------- */

async function carregarResumo() {
  try {
    const r = await Api.get("/admin/resumo");
    document.getElementById("resumo").innerHTML = `
      <div><span>${r.cursos}</span><small>cursos ativos</small></div>
      <div><span>${r.avaliacoes_pendentes}</span><small>aguardando moderação</small></div>
      <div><span>${r.noticias_publicadas}</span><small>notícias publicadas</small></div>
      <div><span>${r.cursos_incompletos}</span><small>cursos com dados pendentes</small></div>`;
  } catch (erro) {
    erroPainel(erro);
  }
}

/* -------------------- Aba: avaliacoes e depoimentos -------------------- */

async function abaAvaliacoes(status = "pendente") {
  try {
    const itens = await Api.get(`/admin/avaliacoes?status=${status}`);

    painel.conteudo.innerHTML = `
      <div class="filtros">
        <div class="campo">
          <label for="status-avaliacao">Status</label>
          <select id="status-avaliacao">
            <option value="pendente" ${status === "pendente" ? "selected" : ""}>Aguardando análise</option>
            <option value="aprovada" ${status === "aprovada" ? "selected" : ""}>Aprovadas</option>
            <option value="rejeitada" ${status === "rejeitada" ? "selected" : ""}>Rejeitadas</option>
          </select>
        </div>
      </div>
      ${
        itens.length
          ? itens
              .map(
                (item) => `
        <article class="avaliacao">
          <div class="avaliacao__cabecalho">
            <span>
              <span class="etiqueta">${escapar(item.tipo)}</span>
              ${escapar(item.aluno)} &middot; ${escapar(item.curso)}
            </span>
            <span>${formatarData(item.data_avaliacao)}</span>
          </div>
          ${item.nota ? estrelas(item.nota) : ""}
          <p>${escapar(item.comentario)}</p>
          <div>
            ${status !== "aprovada" ? `<button class="botao botao--primario botao--pequeno" data-aprovar="${item.id_avaliacao}">Aprovar</button>` : ""}
            ${status !== "rejeitada" ? `<button class="botao botao--contorno botao--pequeno" data-rejeitar="${item.id_avaliacao}">Rejeitar</button>` : ""}
          </div>
        </article>`,
              )
              .join("")
          : '<div class="vazio">Nada nesta fila.</div>'
      }`;

    document
      .getElementById("status-avaliacao")
      .addEventListener("change", (e) => {
        abaAvaliacoes(e.target.value);
      });

    painel.conteudo
      .querySelectorAll("[data-aprovar], [data-rejeitar]")
      .forEach((botao) => {
        botao.addEventListener("click", async () => {
          const id = botao.dataset.aprovar || botao.dataset.rejeitar;
          const novoStatus = botao.dataset.aprovar ? "aprovada" : "rejeitada";
          try {
            const r = await Api.patch(`/admin/avaliacoes/${id}`, {
              status: novoStatus,
            });
            mostrarAviso(painel.aviso, r.mensagem, "ok");
            abaAvaliacoes(status);
            carregarResumo();
          } catch (erro) {
            erroPainel(erro);
          }
        });
      });
  } catch (erro) {
    erroPainel(erro);
  }
}

/* --------------------------- Aba: cursos --------------------------- */

async function abaCursos() {
  try {
    const [cursos, areas] = await Promise.all([
      Api.get("/cursos"),
      Api.get("/cursos/areas"),
    ]);

    painel.conteudo.innerHTML = `
      <p>Selecione um curso para completar as informações que ainda estão pendentes no site.</p>
      <div class="filtros">
        <div class="campo">
          <label for="curso-editar">Curso</label>
          <select id="curso-editar">
            <option value="">Selecione…</option>
            ${cursos.map((c) => `<option value="${c.id_curso}">${escapar(c.nome)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div id="editor-curso"></div>`;

    document
      .getElementById("curso-editar")
      .addEventListener("change", async (e) => {
        const editor = document.getElementById("editor-curso");
        if (!e.target.value) {
          editor.innerHTML = "";
          return;
        }

        const curso = await Api.get(`/cursos/${e.target.value}`);
        editor.innerHTML = `
        <form class="formulario" id="form-curso">
          <div class="campo">
            <label for="c-nome">Nome</label>
            <input id="c-nome" value="${escapar(curso.nome)}" required>
          </div>
          <div class="campo">
            <label for="c-area">Eixo tecnológico</label>
            <select id="c-area">
              <option value="">Não definido</option>
              ${areas.map((a) => `<option value="${a.id_area}" ${a.nome === curso.area ? "selected" : ""}>${escapar(a.nome)}</option>`).join("")}
            </select>
          </div>
          <div class="campo">
            <label for="c-turno">Turno</label>
            <input id="c-turno" value="${curso.turno ? escapar(curso.turno) : ""}" placeholder="Ex.: Manhã e tarde">
          </div>
          <div class="campo">
            <label for="c-duracao">Duração</label>
            <input id="c-duracao" value="${curso.duracao ? escapar(curso.duracao) : ""}" placeholder="Ex.: 3 anos">
          </div>
          <div class="campo">
            <label for="c-vagas">Vagas</label>
            <input id="c-vagas" type="number" min="0" value="${curso.vagas ?? ""}">
          </div>
          <div class="campo">
            <label for="c-descricao">Descrição</label>
            <textarea id="c-descricao">${curso.descricao ? escapar(curso.descricao) : ""}</textarea>
          </div>
          <div class="campo">
            <label for="c-perfil">Perfil do egresso</label>
            <textarea id="c-perfil">${curso.perfil_egresso ? escapar(curso.perfil_egresso) : ""}</textarea>
          </div>
          <div class="campo">
            <label for="c-requisitos">Requisitos de ingresso</label>
            <textarea id="c-requisitos">${curso.requisitos_ingresso ? escapar(curso.requisitos_ingresso) : ""}</textarea>
          </div>
          <button class="botao botao--primario" type="submit">Salvar curso</button>
        </form>`;

        document
          .getElementById("form-curso")
          .addEventListener("submit", async (evento) => {
            evento.preventDefault();
            try {
              const r = await Api.put(`/admin/cursos/${curso.id_curso}`, {
                nome: document.getElementById("c-nome").value,
                id_area: document.getElementById("c-area").value || null,
                turno: document.getElementById("c-turno").value,
                duracao: document.getElementById("c-duracao").value,
                vagas: document.getElementById("c-vagas").value,
                descricao: document.getElementById("c-descricao").value,
                perfil_egresso: document.getElementById("c-perfil").value,
                requisitos_ingresso:
                  document.getElementById("c-requisitos").value,
                imagem_capa: curso.imagem_capa,
              });
              mostrarAviso(painel.aviso, r.mensagem, "ok");
              carregarResumo();
            } catch (erro) {
              erroPainel(erro);
            }
          });
      });
  } catch (erro) {
    erroPainel(erro);
  }
}

/* -------------------------- Aba: noticias -------------------------- */

async function abaNoticias() {
  try {
    const noticias = await Api.get("/admin/noticias");

    painel.conteudo.innerHTML = `
      <form class="formulario" id="form-noticia" style="margin-bottom:var(--e-3)">
        <h3>Nova notícia ou comunicado</h3>
        <div class="campo">
          <label for="n-titulo">Título</label>
          <input id="n-titulo" required>
        </div>
        <div class="campo">
          <label for="n-categoria">Categoria</label>
          <select id="n-categoria">
            <option value="noticia">Notícia</option>
            <option value="comunicado">Comunicado</option>
            <option value="evento">Evento</option>
          </select>
        </div>
        <div class="campo">
          <label for="n-resumo">Resumo</label>
          <input id="n-resumo" maxlength="300">
        </div>
        <div class="campo">
          <label for="n-conteudo">Texto</label>
          <textarea id="n-conteudo" required></textarea>
        </div>
        <div class="campo">
          <label><input type="checkbox" id="n-publicada" style="width:auto"> Publicar agora</label>
        </div>
        <button class="botao botao--primario" type="submit">Salvar notícia</button>
      </form>

      <div class="tabela-rolagem">
        <table class="tabela">
          <thead><tr><th>Título</th><th>Categoria</th><th>Data</th><th>Situação</th></tr></thead>
          <tbody>
            ${
              noticias.length
                ? noticias
                    .map(
                      (n) => `
              <tr>
                <td>${escapar(n.titulo)}</td>
                <td>${escapar(n.categoria)}</td>
                <td>${formatarData(n.data_publicacao)}</td>
                <td>
                  <button class="botao botao--contorno botao--pequeno"
                          data-publicar="${n.id_noticia}" data-valor="${n.publicada ? 0 : 1}">
                    ${n.publicada ? "Publicada — despublicar" : "Rascunho — publicar"}
                  </button>
                </td>
              </tr>`,
                    )
                    .join("")
                : '<tr><td colspan="4">Nenhuma notícia cadastrada.</td></tr>'
            }
          </tbody>
        </table>
      </div>`;

    document
      .getElementById("form-noticia")
      .addEventListener("submit", async (evento) => {
        evento.preventDefault();
        try {
          const r = await Api.post("/admin/noticias", {
            titulo: document.getElementById("n-titulo").value,
            categoria: document.getElementById("n-categoria").value,
            resumo: document.getElementById("n-resumo").value,
            conteudo: document.getElementById("n-conteudo").value,
            publicada: document.getElementById("n-publicada").checked,
          });
          mostrarAviso(painel.aviso, r.mensagem, "ok");
          abaNoticias();
          carregarResumo();
        } catch (erro) {
          erroPainel(erro);
        }
      });

    painel.conteudo.querySelectorAll("[data-publicar]").forEach((botao) => {
      botao.addEventListener("click", async () => {
        try {
          await Api.patch(`/admin/noticias/${botao.dataset.publicar}`, {
            publicada: botao.dataset.valor === "1",
          });
          abaNoticias();
          carregarResumo();
        } catch (erro) {
          erroPainel(erro);
        }
      });
    });
  } catch (erro) {
    erroPainel(erro);
  }
}

/* ------------------------- Aba: documentos ------------------------- */

async function abaDocumentos() {
  try {
    const documentos = await Api.get("/admin/documentos");

    painel.conteudo.innerHTML = `
      <form class="formulario" id="form-documento" style="margin-bottom:var(--e-3)">
        <h3>Novo documento</h3>
        <div class="campo">
          <label for="d-titulo">Título</label>
          <input id="d-titulo" required>
        </div>
        <div class="campo">
          <label for="d-categoria">Tipo</label>
          <select id="d-categoria">
            <option value="edital">Edital</option>
            <option value="formulario">Formulário</option>
            <option value="regulamento">Regulamento</option>
            <option value="calendario">Calendário</option>
            <option value="outro">Outro</option>
          </select>
        </div>
        <div class="campo">
          <label for="d-descricao">Descrição</label>
          <input id="d-descricao" maxlength="300">
        </div>
        <div class="campo">
          <label for="d-url">Link do arquivo</label>
          <input id="d-url" required placeholder="https://…">
          <p class="campo__ajuda">Endereço do PDF já hospedado.</p>
        </div>
        <button class="botao botao--primario" type="submit">Salvar documento</button>
      </form>

      <div class="tabela-rolagem">
        <table class="tabela">
          <thead><tr><th>Título</th><th>Tipo</th><th>Data</th></tr></thead>
          <tbody>
            ${
              documentos.length
                ? documentos
                    .map(
                      (d) => `
              <tr>
                <td><a href="${escapar(d.url_arquivo)}" target="_blank" rel="noopener">${escapar(d.titulo)}</a></td>
                <td>${escapar(d.categoria)}</td>
                <td>${formatarData(d.data_publicacao)}</td>
              </tr>`,
                    )
                    .join("")
                : '<tr><td colspan="3">Nenhum documento cadastrado.</td></tr>'
            }
          </tbody>
        </table>
      </div>`;

    document
      .getElementById("form-documento")
      .addEventListener("submit", async (evento) => {
        evento.preventDefault();
        try {
          const r = await Api.post("/admin/documentos", {
            titulo: document.getElementById("d-titulo").value,
            categoria: document.getElementById("d-categoria").value,
            descricao: document.getElementById("d-descricao").value,
            url_arquivo: document.getElementById("d-url").value,
          });
          mostrarAviso(painel.aviso, r.mensagem, "ok");
          abaDocumentos();
        } catch (erro) {
          erroPainel(erro);
        }
      });
  } catch (erro) {
    erroPainel(erro);
  }
}

/* ------------------------------ Inicio ------------------------------ */

const ABAS = {
  avaliacoes: abaAvaliacoes,
  cursos: abaCursos,
  noticias: abaNoticias,
  documentos: abaDocumentos,
};

document.addEventListener("DOMContentLoaded", async () => {
  painel.aviso = document.getElementById("aviso-painel");
  painel.conteudo = document.getElementById("conteudo-aba");

  try {
    const { usuario } = await Api.get("/auth/me");
    document.getElementById("usuario-logado").textContent = usuario.nome;
  } catch (_) {
    window.location.href = "/admin/";
    return;
  }

  carregarResumo();
  abaAvaliacoes();

  document.querySelectorAll(".abas button").forEach((botao) => {
    botao.addEventListener("click", () => {
      document
        .querySelectorAll(".abas button")
        .forEach((b) => b.setAttribute("aria-selected", String(b === botao)));
      painel.aviso.hidden = true;
      ABAS[botao.dataset.aba]();
    });
  });

  document.getElementById("botao-sair").addEventListener("click", async () => {
    await Api.post("/auth/logout", {});
    window.location.href = "/admin/";
  });
});
