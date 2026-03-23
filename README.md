# tomcoldenhoff.com

Personal site source: [Hugo](https://gohugo.io/) with the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme (git submodule at `themes/PaperMod`).

Planning and BMAD artifacts live under `_bmad-output/` and `_bmad/`; they are separate from the Hugo site.

## Prerequisites

- **Hugo Extended** — baseline targets **0.158.0** or newer (any OS/CI). Install from [Hugo’s documentation](https://gohugo.io/installation/) for your platform; confirm the binary is Extended:

  ```bash
  hugo version
  ```

  The output must include `extended` (required for this theme and typical asset pipelines).

- **Git** with submodule support (`git submodule update --init --recursive` after clone).

## Commands

```bash
# Development server
hugo server

# Production build (output in public/, gitignored)
hugo
```

## Theme

PaperMod is added as a submodule; do not copy theme files into the repo. Update the submodule pointer when you intentionally upgrade the theme.

## GitHub Pages (CI)

The site deploys with **GitHub Actions** via `.github/workflows/build-and-deploy.yml` on every push to `main` (and manual `workflow_dispatch`). The workflow validates (`hugo config`, `hugo list all` — successful `hugo config` is quiet in CI to keep logs readable), builds with `configure-pages` **base URL** for GitHub Pages, uploads `public/`, and deploys with `actions/deploy-pages`. If the default branch is not `main`, add it under `on.push.branches` in that file or rename the default branch to `main`.

**One-time repository setup** (required for deploy to work):

1. In the GitHub repo: **Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions** (not “Deploy from a branch”).  
   If Source stays on a branch, the `deploy-pages` job will not publish this workflow’s artifact.

`hugo.toml` keeps `baseURL` for the production hostname; CI passes `--baseURL` from GitHub Pages so assets resolve on the `*.github.io` URL until custom domain configuration is applied separately.
