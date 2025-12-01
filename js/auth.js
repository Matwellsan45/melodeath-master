(function () {
  let auth0Client = null;

  async function initAuth() {
    try {
      if (!window.createAuth0Client) {
        console.warn("Auth0 SPA SDK não carregado");
        showLoggedOutUI(true);
        return;
      }
      const cfg = window.AUTH_CONFIG || {};
      if (!cfg.domain || !cfg.clientId) {
        console.warn("AUTH_CONFIG ausente ou incompleto");
        showLoggedOutUI(true);
        return;
      }

      auth0Client = await createAuth0Client({
        domain: cfg.domain,
        clientId: cfg.clientId,
        authorizationParams: Object.assign(
          { redirect_uri: window.location.origin },
          cfg.authorizationParams || {}
        ),
        cacheLocation: cfg.cacheLocation || "memory",
      });

      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        try {
          await auth0Client.handleRedirectCallback();
        } catch (e) {
          console.error("Erro no callback de login:", e);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const isAuth = await auth0Client.isAuthenticated();
      if (isAuth) {
        const user = await auth0Client.getUser();
        showLoggedInUI(user);
      } else {
        showLoggedOutUI();
      }

      wireEvents();
      guardContent();
    } catch (err) {
      console.error("Falha ao inicializar auth:", err);
      showLoggedOutUI(true);
    }
  }

  function wireEvents() {
    const loginBtn = document.getElementById("btn-login");
    if (loginBtn) {
      loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!auth0Client) return;
        auth0Client.loginWithRedirect();
      });
    }
    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!auth0Client) return;
        auth0Client.logout({
          logoutParams: { returnTo: window.location.origin },
        });
      });
    }
  }

  function showLoggedInUI(user) {
    const loginBtn = document.getElementById("btn-login");
    const logoutBtn = document.getElementById("btn-logout");
    const greeting = document.getElementById("user-greeting");
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (greeting) {
      greeting.style.display = "inline-block";
      greeting.textContent = user && user.name ? `Olá, ${user.name}` : "Conectado";
    }
    toggleAuthClasses(true);
  }

  function showLoggedOutUI(disabled = false) {
    const loginBtn = document.getElementById("btn-login");
    const logoutBtn = document.getElementById("btn-logout");
    const greeting = document.getElementById("user-greeting");
    if (loginBtn) {
      loginBtn.style.display = "inline-block";
      if (disabled) {
        loginBtn.setAttribute("disabled", "disabled");
        loginBtn.title = "Configuração de OAuth ausente";
      } else {
        loginBtn.removeAttribute("disabled");
        loginBtn.title = "";
      }
    }
    if (logoutBtn) logoutBtn.style.display = "none";
    if (greeting) greeting.style.display = "none";
    toggleAuthClasses(false);
  }

  function toggleAuthClasses(isLoggedIn) {
    document
      .querySelectorAll(".auth-only-logged-in")
      .forEach((el) => (el.style.display = isLoggedIn ? "" : "none"));
    document
      .querySelectorAll(".auth-only-logged-out")
      .forEach((el) => (el.style.display = isLoggedIn ? "none" : ""));
  }

  async function guardContent() {
    const requiresAuth = document.querySelectorAll("[data-requires-auth]");
    const requiresRole = document.querySelectorAll("[data-requires-role]");

    let isAuth = false;
    let roles = [];
    try {
      isAuth = auth0Client ? await auth0Client.isAuthenticated() : false;
      if (isAuth) {
        const user = await auth0Client.getUser();
        const claimKey =
          (window.AUTH_CONFIG && window.AUTH_CONFIG.rolesClaim) ||
          "https://example.com/roles";
        const claimed = user && (user[claimKey] || user.roles);
        if (Array.isArray(claimed)) roles = claimed;
      }
    } catch (e) {
      console.warn("Erro ao apurar papéis/estado:", e);
    }

    requiresAuth.forEach((el) => (el.style.display = isAuth ? "" : "none"));
    requiresRole.forEach((el) => {
      const required = el.getAttribute("data-requires-role");
      const ok = isAuth && required ? roles.includes(required) : false;
      el.style.display = ok ? "" : "none";
    });
  }

  window.initAuth = initAuth;
})();

