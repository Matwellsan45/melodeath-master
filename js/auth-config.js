// Preencha com seu domínio e clientId do Auth0
// Instruções de configuração no README ao final
window.AUTH_CONFIG = {
  domain: "dev-rz6kxrc6mzvhlnpu.us.auth0.com",
clientId: "LFzyVteOmIY6T0BncrdkarotuVzV9hGq",
  // Se usar APIs protegidas, defina audience aqui
  // audience: "https://sua-api/",
  authorizationParams: {
    redirect_uri: "http://127.0.0.1:5500/"
  }
  // Para controle de autorização baseada em papéis (roles),
  // configure um claim customizado no Auth0 e aponte aqui
  // rolesClaim: "https://seu-dominio/roles"
};

  