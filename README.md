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
# Development server (drafts visible by default)
hugo server

# Preview production output locally (excludes drafts, mirrors CI)
hugo server --buildDrafts=false

# Production build (output in public/, gitignored)
hugo --gc --minify

# New blog post (section archetype: archetypes/posts.md)
hugo new content/posts/<slug>.md

# New static page (e.g. About): archetypes/default.md — see docs/publishing-checklist.md § Static pages
hugo new content/<page-name>.md

# Validate published posts (explicit draft: false + required frontmatter + taxonomy rules)
node scripts/validate-published-posts.mjs

# Compare branch to main: block silent slug changes on published posts (see docs/url-change-policy.md)
node scripts/check-published-slug-stability.mjs --base origin/main --head HEAD

# After production build: taxonomy list smoke (expects hello-world on software + baseline)
node scripts/verify-taxonomy-list-pages.mjs

# Tests (Node built-in runner)
node --test scripts/published-post-frontmatter.test.mjs scripts/check-published-slug-stability.test.mjs
```

**Local preview vs `public/`:** `hugo.toml` sets **`baseURL`** to the live site. A **production build** (`hugo --gc --minify`) writes HTML where internal links, canonicals, and RSS URLs use that domain. That is correct for GitHub Pages but means you must **not** rely on opening `public/index.html` directly, Live Preview on the `public/` folder, or a dumb static file server on `public/` if you expect clicks to stay on localhost—those flows will send you to **https://tomcoldenhoff.com/**. Use **`hugo server`** (or `hugo server --buildDrafts=false`) for local browsing; Hugo adjusts **`baseURL`** to the dev server origin for that session.

**`href`s and a different port than the address bar:** Hugo puts the **listen** port into absolute links (menu, canonicals, etc.). If your browser shows another port—common with **editor port forwarding** or **Simple Browser** mapping an external port to Hugo—those links target the wrong origin. Fix: pass the URL you **actually open** as `--baseURL` and turn off appending the listen port:

```bash
hugo server -p 1313 --baseURL http://127.0.0.1:YOUR_BROWSER_PORT/ --appendPort=false
```

Replace **`YOUR_BROWSER_PORT`** with the port in the address bar. Keep **`-p`** as the port Hugo binds to (what the forwarder targets). If you are not forwarding, use the default: run plain **`hugo server`** and open the exact URL printed in the terminal (`http://localhost:1313/` unless 1313 was busy and Hugo chose another).

**Drafts:** CI runs **`hugo --gc --minify`** without `-D`; **`hugo.toml`** sets **`[build] buildDrafts = false`**. Published posts under **`content/posts/`** must set **`draft: false`** explicitly—see **`docs/publishing-checklist.md`** and **`scripts/validate-published-posts.mjs`**. Static pages outside **`content/posts/`** use the same explicit **`draft`** convention; they are not covered by **`validate-published-posts.mjs`** (see checklist).

**Taxonomy:** Categories and tags on published posts follow **`docs/taxonomy-conventions.md`** (lowercase hyphenated terms; at least one pillar category: `entrepreneurship`, `ai`, `software`, or `science`).

**URLs:** Keep **`slug:`** and optional **`url:`** overrides stable after publish unless you follow **`docs/url-change-policy.md`** (non-empty **`aliases`** array + **`url_change_ack`** + **`url_change_reason`**, or allowlist). CI runs **`scripts/check-published-slug-stability.mjs`** on pushes to **`main`**.

## Theme

PaperMod is added as a submodule; do not copy theme files into the repo. Update the submodule pointer when you intentionally upgrade the theme.

## GitHub Pages (CI)

The site deploys with **GitHub Actions** via `.github/workflows/build-and-deploy.yml` on every push to `main` (and manual `workflow_dispatch`). The workflow uses **Node 20** (`actions/setup-node`) for validation scripts, validates published post frontmatter (`node scripts/validate-published-posts.mjs`), checks **slug stability** for published posts when GitHub provides a previous SHA (`node scripts/check-published-slug-stability.mjs`), runs **`hugo config`** / **`hugo list all`**, builds with **`hugo --gc --minify`** and **`HUGO_ENVIRONMENT=production`**, verifies draft posts are absent from **`public/`** and core XML feeds (`node scripts/verify-draft-not-in-public.mjs`), checks taxonomy list pages (`node scripts/verify-taxonomy-list-pages.mjs`), uploads **`public/`**, and deploys with **`actions/deploy-pages`**. Successful **`hugo config`** is quiet in CI to keep logs readable. If the default branch is not `main`, add it under `on.push.branches` in that file or rename the default branch to `main`.

**One-time repository setup** (required for deploy to work):

1. In the GitHub repo: **Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions** (not “Deploy from a branch”).  
   If Source stays on a branch, the `deploy-pages` job will not publish this workflow’s artifact.

**Custom domain (production):** Canonical site URL is `https://tomcoldenhoff.com/` (see `hugo.toml`). The repo includes `static/CNAME` so each build publishes the hostname for GitHub Pages. Full DNS, Cloudflare proxy, SSL mode, troubleshooting, and rollback are documented in **`docs/dns-and-cloudflare.md`** (Story 1.3).

### Publishing & recovery

Day-to-day publishing, failed-CI triage, git revert/redeploy, and “green but wrong site” checks are in **`docs/publishing-runbook.md`**. Use that runbook first; use **`docs/dns-and-cloudflare.md`** when the issue is DNS, TLS, or Cloudflare rather than the Hugo build.
