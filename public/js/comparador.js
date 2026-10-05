/** Comparador de exatamente dois cursos. */

function formatarHorasComparador(valor) {
  return valor
    ? `${Number(valor).toLocaleString('pt-BR')} h`
    : null;
}

const LINHAS_COMPARACAO = [
  { rotulo: 'Eixo tecnológico', campo: 'area' },
  { rotulo: 'Turno', campo: 'turno' },
  {
    rotulo: 'Carga horária total',
    campo: 'carga_horaria_total',
    fmt: formatarHorasComparador
  },
  {
    rotulo: 'Código do itinerário',
    campo: 'codigo_itinerario'
  },
  { rotulo: 'Vagas', campo: 'vagas' },
  { rotulo: 'Descrição', campo: 'descricao' },
  { rotulo: 'Perfil do egresso', campo: 'perfil_egresso' },
  {
    rotulo: 'Requisitos de ingresso',
    campo: 'requisitos_ingresso'
  }
];

async function preencherSelects() {
  const a = document.getElementById('curso-a');
  const b = document.getElementById('curso-b');

  if (!a || !b) {
    throw new Error('Campos de comparação não encontrados na página.');
  }

  const cursos = await Api.get('/cursos');

  const opcoes = ['<option value="">Selecione…</option>']
    .concat(
      cursos.map(
        (c) =>
          `<option value="${c.id_curso}">${escapar(c.nome)}</option>`
      )
    )
    .join('');

  a.innerHTML = opcoes;
  b.innerHTML = opcoes;

  const preSelecionado = parametro('a');

  if (preSelecionado) {
    a.value = preSelecionado;
  }
}

async function comparar(idA, idB) {
  const alvo = document.getElementById('resultado-comparacao');
  const aviso = document.getElementById('aviso-comparar');

  aviso.hidden = true;
  alvo.innerHTML = '<p>Comparando…</p>';

  try {
    const [cursoA, cursoB] = await Api.get(
      `/cursos/comparar?a=${idA}&b=${idB}`
    );

    alvo.innerHTML = `
      <div class="tabela-rolagem">
        <table class="tabela tabela-comparacao">
          <thead>
            <tr>
              <th>Item</th>
              <th>
                <a href="/curso.html?id=${cursoA.id_curso}">
                  ${escapar(cursoA.nome)}
                </a>
              </th>
              <th>
                <a href="/curso.html?id=${cursoB.id_curso}">
                  ${escapar(cursoB.nome)}
                </a>
              </th>
            </tr>
          </thead>

          <tbody>
            ${LINHAS_COMPARACAO.map(
              (linha) => `
              <tr>
                <th scope="row">${escapar(linha.rotulo)}</th>

                <td>${ouPendente(
                  linha.fmt
                    ? linha.fmt(cursoA[linha.campo])
                    : cursoA[linha.campo]
                )}</td>

                <td>${ouPendente(
                  linha.fmt
                    ? linha.fmt(cursoB[linha.campo])
                    : cursoB[linha.campo]
                )}</td>
              </tr>`
            ).join('')}
          </tbody>
        </table>
      </div>`;
  } catch (erro) {
    alvo.innerHTML = '';
    mostrarAviso(aviso, erro.message, 'erro');
  }
}

document.addEventListener('layout-pronto', async () => {
  const form = document.getElementById('form-comparar');
  const aviso = document.getElementById('aviso-comparar');

  try {
    await preencherSelects();
  } catch (erro) {
    console.error('Erro ao carregar cursos para comparação:', erro);

    mostrarAviso(
      aviso,
      'Não foi possível carregar a lista de cursos.',
      'erro'
    );

    return;
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const a = document.getElementById('curso-a').value;
    const b = document.getElementById('curso-b').value;

    if (!a || !b) {
      return mostrarAviso(
        aviso,
        'Escolha os dois cursos.',
        'erro'
      );
    }

    if (a === b) {
      return mostrarAviso(
        aviso,
        'Escolha dois cursos diferentes.',
        'erro'
      );
    }

    comparar(a, b);
  });
});