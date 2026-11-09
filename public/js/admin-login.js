const formLogin = document.getElementById("form-login");
const avisoLogin = document.getElementById("aviso-login");
const botaoEntrar = document.getElementById("botao-entrar");

if (formLogin) {
  Api.get("/auth/me")
    .then(() => {
      window.location.href = "/admin/painel.html";
    })
    .catch(() => {});

  formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = String(formLogin.elements.email?.value || "").trim();
    const senha = String(formLogin.elements.senha?.value || "");

    if (!email || !senha.trim()) {
      mostrarAviso(
        avisoLogin,
        "Informe e-mail e senha para continuar.",
        "erro",
      );
      return;
    }

    if (!botaoEntrar) return;

    botaoEntrar.disabled = true;
    if (avisoLogin) avisoLogin.hidden = true;

    try {
      await Api.post("/auth/login", { email, senha });
      window.location.href = "/admin/painel.html";
    } catch (erro) {
      mostrarAviso(
        avisoLogin,
        erro?.message || "Não foi possível entrar no painel.",
        "erro",
      );
    } finally {
      botaoEntrar.disabled = false;
    }
  });
}
