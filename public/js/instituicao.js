/** Paginas "A instituição" e "Contato": dados vindos de dados.js. */

function montarLinhaTempo() {
  const alvo = document.getElementById('linha-tempo');
  if (!alvo) return;
  alvo.innerHTML = DadosCeep.historia.map((item) => `
    <li>
      <span class="linha-tempo__ano">${escapar(item.ano)}</span>
      <h3 style="margin:0.2rem 0">${escapar(item.titulo)}</h3>
      <p>${escapar(item.texto)}</p>
      ${item.classe === 'pendente' ? '<span class="pendente">Detalhamento pendente</span>' : ''}
    </li>`).join('');
}

function montarTabelaIndicadores() {
  const alvo = document.getElementById('tabela-indicadores');
  if (!alvo) return;

  const linhas = [];
  linhas.push(['Matrículas', '1.137', 'Censo Escolar 2025']);
  linhas.push(['Professores', '121', 'Censo Escolar 2025']);
  linhas.push(['IDEB — Ensino Médio', '5,7', 'IDEB 2025']);
  DadosCeep.fluxo.forEach(f => linhas.push([f.rotulo, f.valor, f.fonte]));
  DadosCeep.aprendizagem.itens.forEach(i =>
    linhas.push([`Aprendizagem adequada — ${i.area}`, `${i.percentual}%`, DadosCeep.aprendizagem.fonte])
  );

  alvo.innerHTML = linhas.map(([indicador, valor, fonte]) => `
    <tr><td>${escapar(indicador)}</td><td>${escapar(valor)}</td><td>${escapar(fonte)}</td></tr>
  `).join('');
}

function montarIdentificacao() {
  const alvo = document.getElementById('identificacao');
  if (!alvo) return;
  const c = DadosCeep.contato;
  alvo.innerHTML = `
    <li><strong>Nome:</strong> ${escapar(c.nome)}</li>
    <li><strong>Endereço:</strong> ${escapar(c.endereco)}, ${escapar(c.bairro)}</li>
    <li><strong>Cidade:</strong> ${escapar(c.cidade)} — ${escapar(c.estado)}</li>
    <li><strong>CEP:</strong> ${escapar(c.cep)}</li>
    <li><strong>Telefone:</strong> ${escapar(c.telefone)}</li>
    <li><strong>Código INEP:</strong> ${escapar(c.inep)}</li>
    <li><strong>Dependência:</strong> Estadual</li>
    <li><strong>Localização:</strong> Urbana</li>
    <li><strong>Etapa:</strong> Ensino Médio — curso técnico integrado</li>`;
}

document.addEventListener('layout-pronto', () => {
  montarLinhaTempo();
  montarTabelaIndicadores();
  montarIdentificacao();
});
