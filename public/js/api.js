window.Api = (() => {
  const requisitar = async (caminho, opcoes = {}) => {
    const resposta = await fetch(caminho, {
      headers: {
        "Content-Type": "application/json",
        ...(opcoes.headers || {}),
      },
      credentials: "same-origin",
      ...opcoes,
    });

    const conteudo = await resposta.text();
    const dados = conteudo ? JSON.parse(conteudo) : null;

    if (!resposta.ok) {
      const mensagem =
        dados && typeof dados === "object" && dados.erro
          ? dados.erro
          : `Erro na requisição (${resposta.status})`;
      throw new Error(mensagem);
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
