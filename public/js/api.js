/**
 * Camada de acesso a API.
 * Centraliza fetch, tratamento de erro e JSON em um lugar so.
 */
const Api = (() => {
  async function requisitar(caminho, opcoes = {}) {
    const resposta = await fetch(`/api${caminho}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      ...opcoes
    });

    let dados = null;
    try { dados = await resposta.json(); } catch (_) { /* resposta sem corpo */ }

    if (!resposta.ok) {
      const erro = new Error((dados && dados.erro) || 'Não foi possível concluir a operação.');
      erro.status = resposta.status;
      throw erro;
    }
    return dados;
  }

  const get = (caminho) => requisitar(caminho);
  const post = (caminho, corpo) =>
    requisitar(caminho, { method: 'POST', body: JSON.stringify(corpo) });
  const put = (caminho, corpo) =>
    requisitar(caminho, { method: 'PUT', body: JSON.stringify(corpo) });
  const patch = (caminho, corpo) =>
    requisitar(caminho, { method: 'PATCH', body: JSON.stringify(corpo) });

  return { get, post, put, patch };
})();
