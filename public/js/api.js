window.Api = (() => {
  const requisitar = async (caminho, opcoes = {}) => {
    const resposta = await fetch(`/api${caminho}`, {
      ...opcoes,
      headers: {
        "Content-Type": "application/json",
        ...(opcoes.headers || {}),
      },
      credentials: opcoes.credentials || "same-origin",
    });

    const conteudo = await resposta.text();
    let dados = null;
    try {
      dados = conteudo ? JSON.parse(conteudo) : null;
    } catch (_) {
      // Retain the HTTP status when the server returns a non-JSON response.
    }

    if (!resposta.ok) {
      const mensagem =
        dados && typeof dados === "object" && dados.erro
          ? dados.erro
          : `Erro na requisição (${resposta.status})`;
      const erro = new Error(mensagem);
      erro.status = resposta.status;
      throw erro;
    }

    return dados;
  };

  const get = (caminho) => requisitar(caminho);
  const post = (caminho, corpo) =>
    requisitar(caminho, { method: "POST", body: JSON.stringify(corpo) });
  const put = (caminho, corpo) =>
    requisitar(caminho, { method: "PUT", body: JSON.stringify(corpo) });
  const patch = (caminho, corpo) =>
    requisitar(caminho, { method: "PATCH", body: JSON.stringify(corpo) });
  const del = (caminho) => requisitar(caminho, { method: "DELETE" });

  return { get, post, put, patch, del };
})();
