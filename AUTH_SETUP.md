Auth via Auth0 — Guia de Configuração

Visão geral
- Este projeto agora inclui autenticação (login/logout) e ganchos de autorização (roles) usando Auth0 SPA SDK.
- Controles de UI foram adicionados no cabeçalho das páginas para Login/Logout e saudação do usuário.
- Você pode proteger blocos de conteúdo adicionando atributos data aos elementos.

1) Criar Aplicativo no Auth0
- Tipo: Single Page Application (SPA)
- Copie o `Domain` e `Client ID` do aplicativo.

2) Configurar URLs no Auth0
- Allowed Callback URLs: adicione a(s) origem(ns) onde servirá o site, por exemplo:
  - http://localhost:5500
  - http://localhost:8080
  - https://seu-dominio.com
- Allowed Logout URLs: as mesmas origens acima.
- Allowed Web Origins: as mesmas origens acima.

Importante: não abra os arquivos diretamente via file://. Use um servidor local (ex.: `npx serve .`, `npx http-server`, `python -m http.server`, live server do seu IDE). O SDK exige http(s).

3) Preencher configuração local
- Edite `js/auth-config.js` e preencha:
  - `domain`: Seu domínio Auth0 (`SEU-DOMINIO.auth0.com`).
  - `clientId`: O Client ID do app SPA.
  - Opcional `audience` se for chamar uma API protegida.
  - Opcional `rolesClaim` se usar autorização por papéis.

4) Testar login/logout
- Abra o site via http://localhost:PORT e clique em “Login” (canto superior direito).
- Faça logout via “Logout”. O estado persiste por aba.

5) Proteger conteúdo (Autenticação)
- Para ocultar/mostrar blocos conforme login, adicione `data-requires-auth` no elemento:
  - Ex.: `<div class="premium" data-requires-auth> ... </div>`

6) Autorizar por papéis (Roles) [Opcional]
- Configure uma Action/Rule no Auth0 para incluir um claim customizado com as roles no ID Token, por ex.: `https://seu-dominio/roles` contendo um array de strings.
- Em `js/auth-config.js`, defina `rolesClaim: "https://seu-dominio/roles"`.
- Para exigir um papel específico em um bloco de UI, use:
  - `<div data-requires-role="admin"> ... </div>`
  - O elemento aparece apenas se o usuário tiver a role.

7) Integração com API (Opcional)
- Para chamar uma API protegida, defina `audience` em `auth-config.js` e use:
  ```js
  const token = await auth0Client.getTokenSilently({ authorizationParams: { audience: AUTH_CONFIG.audience }});
  ```
  - Envie `Authorization: Bearer {token}` nas requisições.

Arquivos adicionados
- `js/auth-config.js`: preencha com Domain/ClientId.
- `js/auth.js`: inicialização Auth0, UI e ganchos de autorização.
- Páginas HTML atualizadas: inclusão dos botões de Login/Logout e scripts.

Observações
- Se você hospedar em domínio/porta diferente, ajuste as URLs permitidas no Auth0.
- Caso não preencha `auth-config.js`, o botão de Login ficará desativado.

