/** Pagina individual do curso — RF02, RF04 e RF08. */

function blocoTexto(titulo, valor) {
  return `
    <h2>${titulo}</h2>
    <p>${valor ? escapar(valor) : '<span class="pendente">Informação pendente de validação pela coordenação</span>'}</p>`;
}

function listaAvaliacoes(itens, vazio) {
  if (!itens.length) return `<div class="vazio">${vazio}</div>`;
  return itens.map((item) => `
    <article class="avaliacao">
      <div class="avaliacao__cabecalho">
        <span>${escapar(item.aluno)}${item.turma ? ' — ' + escapar(item.turma) : ''}</span>
        <span>${formatarData(item.data_avaliacao)}</span>
      </div>
      ${item.nota ? estrelas(item.nota) : ''}
      <p>${escapar(item.comentario)}</p>
    </article>`).join('');
}

async function carregarCurso() {
  const alvo = document.getElementById('detalhe-curso');
  const id = Number(parametro('id'));

  if (!Number.isInteger(id)) {
    alvo.innerHTML = '<div class="aviso aviso--erro">Curso não informado. <a href="/cursos.html">Ver lista de cursos</a>.</div>';
    return;
  }

  try {
    const curso = await Api.get(`/cursos/${id}`);
    document.title = `${curso.nome} | CEEP Curitiba`;

    const cabecalho = document.querySelector('.cabecalho-pagina .container');
    cabecalho.innerHTML = `
      <p class="trilha"><a href="/">Início</a> / <a href="/cursos.html">Cursos</a> / ${escapar(curso.nome)}</p>
      <h1>${escapar(curso.nome)}</h1>
      <p>${curso.area ? escapar(curso.area) : 'Eixo tecnológico a confirmar'}
         ${curso.media_notas ? ` &middot; nota média ${curso.media_notas} em ${curso.total_avaliacoes} avaliações` : ''}</p>`;

    const disciplinas = curso.disciplinas.length
      ? `<div class="tabela-rolagem">
           <table class="tabela">
             <thead><tr><th>Disciplina</th><th>Carga horária</th><th>Professor</th></tr></thead>
             <tbody>${curso.disciplinas.map(d => `
               <tr>
                 <td>${escapar(d.nome)}</td>
                 <td>${d.carga_horaria ? escapar(d.carga_horaria) + ' h' : '—'}</td>
                 <td>${d.professor ? escapar(d.professor) : '—'}</td>
               </tr>`).join('')}</tbody>
           </table>
         </div>`
      : '<div class="vazio">A matriz curricular deste curso ainda não foi cadastrada.</div>';

    alvo.innerHTML = `
      <div class="colunas-artigo">
        <div>
          ${blocoTexto('Sobre o curso', curso.descricao)}
          ${blocoTexto('Perfil do egresso', curso.perfil_egresso)}
          ${blocoTexto('Requisitos de ingresso', curso.requisitos_ingresso)}

          <h2>Disciplinas</h2>
          ${disciplinas}

          <h2 style="margin-top:var(--e-4)">Avaliações de alunos</h2>
          ${listaAvaliacoes(curso.avaliacoes, 'Este curso ainda não tem avaliações aprovadas.')}

          <h2 style="margin-top:var(--e-4)">Depoimentos de egressos</h2>
          ${listaAvaliacoes(curso.depoimentos, 'Este curso ainda não tem depoimentos aprovados.')}
        </div>

        <aside class="caixa-lateral">
          <h3>Informações do curso</h3>
          <ul class="lista-limpa">
            <li><strong>Turno:</strong> ${ouPendente(curso.turno)}</li>
            <li><strong>Duração:</strong> ${ouPendente(curso.duracao)}</li>
            <li><strong>Vagas:</strong> ${ouPendente(curso.vagas)}</li>
            <li><strong>Eixo:</strong> ${ouPendente(curso.area)}</li>
          </ul>
          <p style="margin-top:var(--e-2)">
            <a class="botao botao--primario botao--pequeno" href="/comparador.html?a=${curso.id_curso}">Comparar com outro curso</a>
          </p>
          <p><a class="botao botao--contorno botao--pequeno" href="/como-ingressar.html">Como ingressar</a></p>
          <p><a href="/area-do-aluno.html">Avaliar este curso</a></p>
        </aside>
      </div>`;
  } catch (erro) {
    alvo.innerHTML = `<div class="aviso aviso--erro">${escapar(erro.message)} <a href="/cursos.html">Ver todos os cursos</a>.</div>`;
  }
}

document.addEventListener('layout-pronto', carregarCurso);
