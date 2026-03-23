# Story 1.1: Initialize Hugo + PaperMod Project Repository

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo publisher,
I want a Hugo site initialized with PaperMod and version control,
so that I can start publishing from a stable, architecture-aligned baseline.

**Implements:** FR33 (version control for content and site configuration). **Aligns with:** NFR7 (no credentials, tokens, or secrets in the repository).

## Acceptance Criteria

1. **Given** a repository workspace (this repo may be non-empty: planning artifacts under `_bmad-output/`, tooling under `_bmad/` and `.cursor/` are expected and must be preserved)  
   **When** the setup workflow is executed  
   **Then** a Hugo site with **PaperMod** is initialized using the **architecture-selected** approach (Hugo CLI + theme as git submodule).  
   **And** the project structure includes the core Hugo directories and config needed for `content/`, `layouts/` overrides, `static/`, `assets/` (as applicable), and `themes/PaperMod` usage.

2. **Given** the baseline repository state  
   **When** initial files are committed to version control  
   **Then** baseline site and config files (including theme submodule reference) are tracked appropriately.  
   **And** **no** credentials, tokens, API keys, or other secrets are committed (verify `.gitignore` and file contents).

## Tasks / Subtasks

- [x] Install/use **Hugo** (Extended recommended if your theme or pipeline expects it; match local and future CI). Confirm version in `README.md`. (AC: 1)
- [x] Initialize the Hugo site at the **repository root** (`tomcoldenhoff.com`), preserving existing non-site folders (`_bmad-output/`, `_bmad/`, `.cursor/`). Use the documented pattern: `hugo new site` with the appropriate option for a non-empty directory if required (e.g. force flag per current Hugo docs). (AC: 1)
- [x] Add PaperMod per architecture: **git submodule** at `themes/PaperMod` from `https://github.com/adityatelange/hugo-PaperMod.git` — do **not** copy-paste vendor files into the repo without submodule. (AC: 1)
- [x] Configure the active theme in root config (`hugo.toml` or `hugo.yaml`/`config/` as generated): `theme = 'PaperMod'` (or equivalent for chosen config format). Ensure `hugo server` and `hugo` build succeed. (AC: 1)
- [x] Ensure standard directories exist or are created as needed: `content/`, `layouts/` (for future overrides), `static/`, `themes/`, `archetypes/`, `assets/` if used. (AC: 1)
- [x] Add/update **`.gitignore`** so build output and local artifacts are not committed: at minimum `public/`, `resources/`, `.hugo_build.lock`, OS/editor junk; never commit secrets. (AC: 2)
- [x] If the repo is not yet a git repository, run `git init`; stage the Hugo baseline + submodule; create an **initial commit** with a clear message. If git already exists, commit the new site files in a dedicated commit. (AC: 2)
- [x] **Out of scope for this story:** GitHub Actions, custom domain, Cloudflare, CI validation scripts — those belong to later stories (Epic 1 Stories 1.2+). (AC: 1, 2)

## Dev Notes

### Architecture compliance (mandatory)

- **Starter command (authoritative):** [Source: `_bmad-output/planning-artifacts/architecture.md` — Starter Template Evaluation]

  ```bash
  hugo new site tomcoldenhoff-com && cd tomcoldenhoff-com && git init && git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
  ```

  Adapt to **this** repo: folder name is `tomcoldenhoff.com` (not `tomcoldenhoff-com`); prefer **root-level** site in the existing clone so one repository holds the site and BMAD artifacts. Do **not** remove `_bmad-output/`, `_bmad/`, or `.cursor/`.

- **Theme boundary:** Treat `themes/PaperMod/` as **vendor-only**; do not edit files inside the submodule for feature work — use `layouts/` overrides later. [Source: `_bmad-output/planning-artifacts/architecture.md` — Architectural Boundaries & Anti-Patterns]

- **Security:** No secrets in repo; use provider secret stores later for Actions/integrations. [Source: `_bmad-output/planning-artifacts/architecture.md` — Authentication & Security; PRD NFR7]

- **Target structure (north star):** The architecture document lists a full tree (`content/posts/`, `layouts/partials/`, etc.). For **this story**, deliver a **minimal** Hugo + PaperMod baseline that builds; you do **not** need to create the entire future tree—only what is required to satisfy AC and a clean baseline for Story 1.2 (CI).

### Project structure notes

- Repository root: `tomcoldenhoff.com` (workspace).  
- BMAD/planning paths stay as-is alongside the Hugo site.  
- Generated output: `public/` must remain gitignored. [Source: `_bmad-output/planning-artifacts/architecture.md` — Project Structure]

### UX / product constraints

- Stack is **Hugo + PaperMod**, static MPA; defer visual UX overrides to later epics. [Source: `_bmad-output/planning-artifacts/ux-design.md` — Stack context]

### Testing / verification

- Run `hugo` (build) and optionally `hugo server` locally; confirm no errors.  
- Confirm `git status` does not show `public/` or secret material staged.  
- Submodule: `themes/PaperMod` should appear as submodule in `.gitmodules` after add.

### Latest technical notes (Hugo)

- Prefer a **current stable** Hugo release; check [Hugo releases](https://github.com/gohugoio/hugo/releases) at implementation time. Recent releases have continued config and CLI refinements—use official docs for `hugo new site` flags when the directory is not empty.

### Epic cross-story context

- **Epic 1** delivers live, versioned, recoverable publishing. This story establishes the repo + theme baseline.  
- **Story 1.2** adds deterministic GitHub Pages build/deploy — do not implement workflows here.

### References

- Epics & AC: `_bmad-output/planning-artifacts/epics.md` — Epic 1, Story 1.1  
- Architecture (starter command, structure, boundaries): `_bmad-output/planning-artifacts/architecture.md`  
- PRD FR33, NFR7: `_bmad-output/planning-artifacts/prd.md`  
- UX stack context: `_bmad-output/planning-artifacts/ux-design.md`

## Dev Agent Record

### Agent Model Used

Composer (Cursor agent)

### Debug Log References

### Completion Notes List

- Installed **Hugo Extended** via Homebrew (`hugo v0.158.0+extended+withdeploy`); version recorded in `README.md`.
- Ran `hugo new site . --force --format toml` at repo root; preserved `_bmad-output/`, `_bmad/`, and left `.cursor/` untracked (local IDE).
- Added `themes/PaperMod` as **git submodule** (`.gitmodules` + submodule commit at `themes/PaperMod`).
- Set `theme = 'PaperMod'` in `hugo.toml`; `languageCode` used per Hugo defaults (replaced generated `locale` key).
- Verified `hugo` build succeeds; `public/` and `resources/` ignored; no secrets committed.
- Initial commit: `feat(hugo): initialize Hugo site with PaperMod submodule`.

### File List

- `hugo.toml` — site config + active theme
- `.gitignore` — Hugo build output, lock file, OS/editor noise, secret patterns
- `README.md` — Hugo version and basic commands
- `.gitmodules` — PaperMod submodule
- `themes/PaperMod` — git submodule (vendor; do not edit for features)
- `archetypes/default.md` — Hugo default archetype
- `content/.gitkeep`, `layouts/.gitkeep`, `static/.gitkeep`, `assets/.gitkeep` — preserve empty baseline dirs in git

---

**Story completion status:** done
