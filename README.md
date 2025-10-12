# Musico – Versionamento com Git/GitHub

Este projeto foi preparado para controle de versões com Git e publicação via GitHub Pages.

## Estrutura adicionada
- `.gitignore` para ignorar arquivos de sistema, builds e segredos.
- `.gitattributes` para normalizar finais de linha e marcar binários.
- Workflow do GitHub Actions em `.github/workflows/pages.yml` para publicar a partir do branch `main`.

## Como publicar no GitHub
1. Crie um repositório vazio no GitHub (sem adicionar README/License).
2. No terminal local, configure o repositório remoto e faça o push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<SEU_USUARIO>/<SEU_REPOSITORIO>.git
   git push -u origin main
   ```
3. Em Settings → Pages do repositório, confirme a origem "GitHub Actions" (será selecionada automaticamente após o primeiro deploy).

## Boas práticas
- Nunca commite segredos (use `.env` local, que já está no `.gitignore`).
- Commits pequenos e descritivos.
- Para alterações grandes, crie branches e Pull Requests.

## Pasta do site
O workflow publica o conteúdo da raiz do projeto (`path: .`). Se desejar publicar outra pasta (ex.: `docs/`), ajuste o `path` no arquivo `.github/workflows/pages.yml`.

