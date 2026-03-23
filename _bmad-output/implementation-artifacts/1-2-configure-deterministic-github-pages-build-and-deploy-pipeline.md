# Story 1.2: Configure Deterministic GitHub Pages Build and Deploy Pipeline

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo publisher,
I want repository changes to trigger deterministic static build and deployment to GitHub Pages,
so that publishing is repeatable and reliable.

**Implements:** FR3, FR28. **Aligns with:** NFR3 (timely deploy cycles), NFR7 (no secrets in repo), NFR14 (deterministic, repeatable build outputs).

## Acceptance Criteria

1. **Given** a commit to `main`  
   **When** CI runs  
   **Then** validation and build steps execute **before** any deploy step  
   **And** deployment is blocked if validation or build fails.

2. **Given** a successful pipeline run  
   **When** deployment completes  
   **Then** static output is published to GitHub Pages  
   **And** CI output clearly indicates pass/fail outcomes for validation and build steps (e.g. named steps or jobs with unambiguous success/failure in the Actions UI).

3. **Given** the workflow configuration is invalid or a required CI step errors  
   **When** the pipeline runs  
   **Then** deploy is skipped  
   **And** failure output identifies the failed step with a short remediation hint (what to check next).

## Tasks / Subtasks

- [x] Add `.github/workflows/build-and-deploy.yml` using the **stable workflow name** from architecture (`build-and-deploy`). (AC: 1–3)
- [x] Trigger on `push` to `main` (and optionally `workflow_dispatch` for manual runs). Match repository default branch; if the repo still uses `master`, document and align—or rename default branch to `main` per architecture. (AC: 1)
- [x] **Checkout** with **git submodules** initialized (`actions/checkout` with `submodules: recursive` or equivalent) so `themes/PaperMod` is present in CI. (AC: 1–2)
- [x] **Configure GitHub Pages** in the build job: `actions/configure-pages@v5` (or current v5+); capture `base_url` for the Hugo build when needed. (AC: 2)
- [x] **Install Hugo Extended** in CI at a **pinned version** aligned with `README.md` (baseline **0.158.0+** as of Story 1.1); prefer `peaceiris/actions-hugo` with `extended: true` or an equivalent supported install path. Do not silently use a non-Extended binary if the theme requires Extended. (AC: 1–2)
- [x] **Validation step(s)** — run **before** the production build artifact is produced, with a clearly named step (e.g. `Validate Hugo project`):
  - Minimum acceptable gate for this story: deterministic checks that fail fast on misconfiguration (e.g. `hugo config` if available for the pinned Hugo version, or an explicit `hugo list all` / config sanity check that exits non-zero on failure).  
  - **Scope note:** Full `scripts/validate-frontmatter.mjs` and `scripts/check-links.mjs` are **architecture targets** but are **not required** to exist in this story unless you add them here; Epic 2+ may introduce those scripts—do not block Story 1.2 on absent Node validation if AC is met with Hugo-native gates. If you add placeholder scripts, wire them explicitly and document follow-up stories. (AC: 1, 3)
- [x] **Build step** — named distinctly from validation (e.g. `Build site`): run `hugo` with production-oriented flags (`--gc --minify` as appropriate) and pass **`--baseURL`** compatible with GitHub Pages when using `configure-pages` output (e.g. `${{ steps.pages.outputs.base_url }}/`) so assets resolve correctly on the Pages URL **until** Story 1.3 custom domain work is finalized. Document interaction with root `hugo.toml` `baseURL`. (AC: 2)
- [x] **Upload + deploy** — `actions/upload-pages-artifact@v3` (or current compatible major) for `./public`; **deploy job** `needs: build` (or the job that produced the artifact), `permissions` for `pages: write` and `id-token: write`, `environment: github-pages`, `actions/deploy-pages@v4` (or current compatible major). Ensure failed build never reaches deploy. (AC: 1–3)
- [x] **Concurrency** — use a `concurrency` group (e.g. `pages`) so overlapping pushes do not corrupt deployments; `cancel-in-progress: true` is acceptable for solo publishing. (AC: 2)
- [x] **Failure UX** — use `::error` or clear echo lines in custom steps so logs state what failed and what to fix (submodules missing, Hugo version mismatch, build error path). (AC: 3)
- [x] **Repository settings (document in README or `docs/`)** — GitHub **Pages** source must be set to **GitHub Actions** (not legacy branch deploy) for `deploy-pages` to work. Document required one-time setup. (AC: 2)
- [x] **Secrets** — no tokens in YAML; use `GITHUB_TOKEN` / OIDC as provided by Actions. (AC: all, NFR7)
- [x] **Out of scope:** Custom domain, Cloudflare, DNS (Story 1.3); full operational runbook (Story 1.4); separate `content-validation.yml` workflow can wait until script-based validation exists—optional stub only if it does not duplicate `build-and-deploy` without value.

## Dev Notes

### Previous story intelligence (Story 1.1)

- Hugo **Extended** **v0.158.0+** documented in `README.md`; CI must match Extended + compatible version band.
- PaperMod at `themes/PaperMod` via **git submodule** — CI must check out submodules or builds will fail with missing theme.
- Root `hugo.toml` sets `baseURL = 'https://tomcoldenhoff.com/'` — for GitHub Pages staging URL, override via `--baseURL` from `configure-pages` in CI to avoid broken links/asset paths on `*.github.io` until custom domain is wired in Story 1.3.
- Initial site layout is minimal; validation should not assume `scripts/` exists unless you create it in this story.

### Architecture compliance (mandatory)

- **CI/CD:** GitHub Actions on `main` with validation + build + deploy; workflow name **`build-and-deploy.yml`**. [Source: `_bmad-output/planning-artifacts/architecture.md` — Infrastructure & Deployment; Project Structure]
- **Workflow naming:** Prefer explicit stable names (`build-and-deploy`); optional future `content-validation.yml` when script gates exist. [Source: architecture.md — Communication Patterns]
- **Delivery:** GitHub Pages origin; deterministic static output in `public/`. [Source: architecture.md — Service Boundaries]
- **Security:** No secrets in repo; least-privilege permissions on workflow jobs. [Source: architecture.md — Authentication & Security]
- **Anti-pattern:** Do not edit `themes/PaperMod/` for pipeline fixes—fix workflow, root config, or overrides under `layouts/`. [Source: architecture.md — Theme boundary]

### Technical requirements

| Topic | Requirement |
|--------|----------------|
| Trigger | Push to `main` (architecture: canonical automation trigger) |
| Jobs | Separate **deploy** job depending on successful **build** (artifact upload) |
| Hugo | Extended binary, version pinned and documented |
| Submodules | Required for PaperMod |
| Pages | Modern **Actions** deployment (`configure-pages` + `upload-pages-artifact` + `deploy-pages`) |
| Logs | Clear step names; failures identify step + hint |

### Library / framework / Actions requirements

- **`actions/checkout@v4`** (or newer supported) with submodule option.
- **`actions/configure-pages@v5`**, **`actions/upload-pages-artifact@v3`**, **`actions/deploy-pages@v4`** — verify current README for these actions on [github.com/actions](https://github.com/actions) for any breaking changes when pinning majors.
- **`peaceiris/actions-hugo@v3`** (or maintained alternative) is a common pattern for Hugo Extended installation; confirm inputs for `extended: true` and `hugo-version`.

### File structure requirements

- Create **only** under `.github/workflows/` for this story’s automation (plus minimal doc updates under `README.md` or `docs/` for Pages setup).
- Do **not** move BMAD folders (`_bmad-output/`, `_bmad/`) into Hugo build paths; workflows run from repo root.

### Testing / verification

- Open a PR or push to `main` and confirm Actions run order: validate → build → upload → deploy.
- Confirm a **failed** `hugo` build does **not** run deploy (job skipped or workflow failure before deploy).
- Confirm published site loads (or at least artifact/build succeeds) for the GitHub Pages URL.
- Locally: `hugo` and submodule update still work as in Story 1.1.

### Latest technical information (2026)

- GitHub Pages deployment via **Actions** uses the **artifact + `deploy-pages`** flow; legacy `peaceiris/actions-gh-pages` branch pushes are avoidable for new work when following current GitHub docs.
- Keep **`permissions`** minimal: contents read on build; pages write + id-token on deploy job only.
- Hugo **Extended** is required for PaperMod-related asset pipelines; match the version pin to `README.md` to avoid “works locally, fails in CI” drift.

### Project context reference

- No `project-context.md` in repo; this file + `architecture.md` + `prd.md` + `epics.md` are authoritative for implementation.

### UX / product

- No direct UX change; ensures reliable publishing pipeline per `ux-design.md` stack context (static site, Git-based deploy).

## References

- Epics: `_bmad-output/planning-artifacts/epics.md` — Epic 1, Story 1.2  
- PRD: `_bmad-output/planning-artifacts/prd.md` — FR3, FR28, NFR3, NFR7, NFR14  
- Architecture: `_bmad-output/planning-artifacts/architecture.md` — CI/CD, project tree, boundaries, error handling  
- Previous story: `_bmad-output/implementation-artifacts/1-1-initialize-hugo-papermod-project-repository.md`  
- Theme reference workflow (upstream demo only; adapt branch, Extended, and site root): `themes/PaperMod/.github/workflows/gh-pages.yml`

## Change Log

- 2026-03-23 — Added `build-and-deploy` GitHub Actions workflow (validate → build → artifact → deploy) and README GitHub Pages setup notes.

## Dev Agent Record

### Agent Model Used

Composer (Cursor agent)

### Debug Log References

### Completion Notes List

- Implemented `.github/workflows/build-and-deploy.yml`: `main` + `workflow_dispatch`, submodule checkout, Hugo Extended 0.158.0, `configure-pages` + `--baseURL` for Pages URL, validate (`hugo config`, `hugo list all`) before build, `upload-pages-artifact` + `deploy-pages` with `needs: build`.
- Documented one-time GitHub **Settings → Pages → Source: GitHub Actions** in `README.md`.
- Regression: `hugo config`, `hugo list all`, and `hugo --gc --minify --baseURL <...>` succeed locally (no repo-level automated test runner for Actions YAML).
- Post-review fixes applied (quiet `hugo config`, per-job permissions, build `::error`, `.gitignore`); story marked **done** after review acceptance.

### File List

- `.github/workflows/build-and-deploy.yml` — new
- `README.md` — GitHub Pages / CI section
- `_bmad-output/implementation-artifacts/1-2-configure-deterministic-github-pages-build-and-deploy-pipeline.md` — story status and tasks
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story status

---

**Story completion status:** done — Code review accepted; story closed
