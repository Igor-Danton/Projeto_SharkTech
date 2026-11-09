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
    if (!botaoEntrar) return;

    botaoEntrar.disabled = true;
    if (avisoLogin) avisoLogin.hidden = true;

    try {
      await Api.post("/auth/login", {
        email: formLogin.elements.email.value.trim(),
        senha: formLogin.elements.senha.value,
      });
      window.location.href = "/admin/painel.html";
    } catch (erro) {
      if (avisoLogin) {
        mostrarAviso(avisoLogin, erro.message, "erro");
      }
      botaoEntrar.disabled = false;
    }
  });
}
