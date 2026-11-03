const formLogin = document.getElementById("form-login");
const avisoLogin = document.getElementById("aviso-login");
const botaoEntrar = document.getElementById("botao-entrar");

Api.get("/auth/me")
  .then(() => {
    window.location.href = "/admin/painel.html";
  })
  .catch(() => {});

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  botaoEntrar.disabled = true;
  avisoLogin.hidden = true;

  try {
    await Api.post("/auth/login", {
      email: formLogin.elements.email.value,
      senha: formLogin.elements.senha.value,
    });
    window.location.href = "/admin/painel.html";
  } catch (erro) {
    mostrarAviso(avisoLogin, erro.message, "erro");
    botaoEntrar.disabled = false;
  }
});
