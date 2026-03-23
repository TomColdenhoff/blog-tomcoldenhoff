# Story 2.2: Publish Draft and Final Posts Through Content Workflow

Status: done

<!-- create-story: context analysis completed — ready for dev-story. -->
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo publisher,
I want to manage draft versus published states for posts,
so that I can stage content safely before release.

**Implements:** FR5. **Epic 2** — content quality and repeatable publishing.

## Acceptance Criteria

1. **Given** a post is marked as draft (`draft: true`)  
   **When** production build and deploy run (same as CI: `hugo --gc --minify` without draft flags)  
   **Then** draft content is excluded from generated `public/` output  
   **And** draft items are not exposed in public listing, RSS, or sitemap output produced by that build.

2. **Given** draft state is switched to published (`draft: false`, with valid required frontmatter)  
   **When** deployment completes successfully  
   **Then** the post appears in public pages and listings appropriate to PaperMod + current `hugo.toml`  
   **And** the Git-based editorial workflow (commit → push `main` → `build-and-deploy`) preserves predictable release behavior.

3. **Given** frontmatter or content is invalid for a post that would be **published** (not draft — i.e. `draft` is `false` or omitted per Hugo defaults)  
   **When** production build or deploy runs  
   **Then** the pipeline **fails** before deploy (fail-fast), per architecture process patterns  
   **And** CI logs use `::error::` (or equivalent) so the publisher can identify the **file path** and **what failed** (missing required key, wrong type, Hugo error).

## Tasks / Subtasks

- [x] **Confirm and document Hugo draft behavior** (AC: 1–2)  
  - [x] State explicitly: CI **`hugo --gc --minify`** does **not** pass `-D` / `--buildDrafts`; Hugo’s default for a **production build** is to **exclude** drafts. [Source: [Hugo front matter — draft](https://gohugo.io/content-management/front-matter/#draft)]  
  - [x] Document local parity: **`hugo server`** shows drafts by default (authoring convenience); use **`hugo server --buildDrafts=false`** when you need to preview “what production would ship.”  
  - [x] Optional but recommended: set **`[build] buildDrafts = false`** in **`hugo.toml`** if your Hugo version supports it on the `build` table—only if it does not conflict with current config; otherwise document defaults in **`README.md`** or **`docs/publishing-checklist.md`** (create checklist file if missing and architecture expects it).

- [x] **Prove draft exclusion in repo** (AC: 1)  
  - [x] Add a **small, intentional fixture** under **`content/posts/`** with **`draft: true`** (e.g. clearly named `draft-fixture-not-listed.md` or similar) **or** document a repeatable manual check—prefer a **tracked** fixture so CI continuously proves exclusion.  
  - [x] After `hugo --gc --minify`, assert the fixture’s public URL path does **not** exist under **`public/`** (no HTML for that post; no leak into list pages). Document the exact check (command or script) in the story completion notes.

- [x] **Published-post validation gate** (AC: 3)  
  - [x] Implement a **script** under **`scripts/`** (e.g. `validate-published-posts.mjs` or extend a single `validate-frontmatter.mjs` if you prefer one entrypoint) that:  
    - Scans **`content/posts/**/*.md`** (adjust if your canonical section differs—must match **`architecture.md`**).  
    - Treats a file as **publishable** when frontmatter **`draft`** is not truthy (`false` or absent—remember Hugo treats **missing `draft` as published**).  
    - For each publishable file, enforces the **required keys** and types from architecture: `title`, `date`, `slug`, `description`, `tags`, `categories`, `draft` (recommend requiring **explicit** `draft: false` for publishable posts to avoid ambiguity—if you adopt that rule, enforce it in the script and mention it in docs).  
  - [x] Emit **file path + rule** on failure; exit non-zero.  
  - [x] Wire the script into **`.github/workflows/build-and-deploy.yml`** **before** **`hugo --gc --minify`** (and after checkout/submodules), with **`::error::`** messages consistent with existing validate steps.

- [x] **Docs alignment** (AC: 1–3)  
  - [x] Update **`docs/publishing-runbook.md`**: remove or narrow the “Epic 2+ validation not required” wording if it now contradicts this story; add where to look when **published-post validation** fails.  
  - [x] **`README.md`**: one short bullet on draft vs production build if not already clear.

- [x] **Verification** (AC: 1–3)  
  - [x] Local: run the new script + `hugo --gc --minify`; confirm draft fixture absent from `public/`.  
  - [x] Negative test: temporarily set a publishable post to **invalid** frontmatter (e.g. drop `description`) and confirm the script fails with a clear path; revert before commit.  
  - [x] Positive test: flip fixture or a real post to **`draft: false`** with full valid frontmatter and confirm it appears in `public/` and list output as expected.

## Dev Notes

### Epic 2 context (cross-story)

- **2.1** established **`archetypes/posts.md`** with **`draft: true`** by default and the full frontmatter contract—this story **enforces** that contract for anything that ships.  
- **2.3** will focus on URL/canonical stability when editing—do not redesign permalink strategy here; only ensure draft/publish behavior is correct.  
- **2.4 / 2.5** are downstream; keep taxonomy and About scope out unless a doc link is natural.

### Architecture compliance (mandatory)

- **Fail-fast CI** for invalid metadata on content that would publish; errors must identify **file + rule**. [Source: `_bmad-output/planning-artifacts/architecture.md` — Process Patterns / Error Handling]  
- **Required content keys:** `title`, `date`, `slug`, `description`, `tags`, `categories`, `draft`. [Source: architecture.md — Data Architecture / Naming]  
- **Formats:** ISO-like dates; booleans as booleans; `tags` / `categories` as arrays. [Source: architecture.md — Format Patterns]  
- **Posts live under `content/posts/`**; do not introduce a parallel `content/blog/` tree. [Source: architecture.md — Structure Patterns]  
- **Do not edit `themes/PaperMod/` directly**; config/scripts/docs only unless a layout override is strictly required (unlikely for this story).  
- **`content-validation.yml`** is described in architecture but **not present** yet—either add a minimal workflow later or fold checks into **`build-and-deploy.yml`** for now (preferred minimal scope: extend **`build-and-deploy.yml`** only).

### Technical requirements

| Topic | Requirement |
|--------|----------------|
| Hugo | Extended **0.158.0** in CI (`peaceiris/actions-hugo`); match locally per **`README.md`** |
| Production build | `hugo --gc --minify` with **`HUGO_ENVIRONMENT=production`** as in CI; no `--buildDrafts` |
| Draft semantics | Hugo excludes `draft: true` from non-draft builds; missing `draft` means **not** draft—validation must account for this |
| CI | Validation script exits non-zero on violations; integrate into **`build-and-deploy.yml`** |

### File structure requirements

| Path | Action |
|------|--------|
| `scripts/*.mjs` (or `.sh`) | Add published-post / frontmatter validation |
| `.github/workflows/build-and-deploy.yml` | Add validation step(s) with clear errors |
| `hugo.toml` | Optional explicit `[build]` draft settings; only if supported/clean |
| `content/posts/` | Optional draft fixture for smoke-proof |
| `docs/publishing-runbook.md`, `README.md` | Align with new gate |

### Testing / verification

- `node scripts/<your-validator>.mjs` (or `npm test` if you add a package—**prefer zero new deps** unless repo already uses them).  
- `hugo --gc --minify` after validation.  
- Inspect `public/posts/` (or generated permalinks) for presence/absence of draft vs published content.

### Previous story intelligence (2.1)

- Post archetype is YAML with required keys and **`draft: true`** default—publish path is **flip to `draft: false`** when ready.  
- **`archetypes/default.md`** is scoped to non-post pages; post workflow is **`hugo new content/posts/<slug>.md`**.  
- Verification pattern from 2.1: `hugo new` + `hugo --gc --minify`; reuse for this story with draft/publish cases.

### Git intelligence summary

- Recent commits emphasize **CI (`build-and-deploy`)**, **CNAME**, and **docs**—follow existing workflow style (`set -euo pipefail`, `::error::` messages, pinned Hugo version).

### Latest technical notes

- Hugo draft front matter and build inclusion: [Hugo docs — draft](https://gohugo.io/content-management/front-matter/#draft).  
- Confirm behavior for **RSS** and **sitemap** with your PaperMod/Hugo version; both should respect draft exclusion in a standard production build.

### Project context reference

- No `project-context.md` in repo; use **`architecture.md`**, **`prd.md`**, **`epics.md`**, and this file.

## References

- Epics: `_bmad-output/planning-artifacts/epics.md` — Epic 2, Story 2.2  
- PRD: `_bmad-output/planning-artifacts/prd.md` — FR5  
- Architecture: `_bmad-output/planning-artifacts/architecture.md` — data model, CI failure patterns, structure  
- UX: `_bmad-output/planning-artifacts/ux-design.md` — authoring / checklist expectations  
- Prior story: `_bmad-output/implementation-artifacts/2-1-create-standard-post-archetype-with-required-frontmatter.md`  
- CI: `.github/workflows/build-and-deploy.yml`  
- Runbook: `docs/publishing-runbook.md`

## Dev Agent Record

### Agent Model Used

Composer (Cursor agent)

### Debug Log References

### Completion Notes List

- Added **`[build] buildDrafts = false`** in **`hugo.toml`**; documented **`hugo server --buildDrafts=false`** and CI parity in **`README.md`** and **`docs/publishing-checklist.md`**.
- **`content/posts/draft-fixture-not-listed.md`** (`draft: true`) proves drafts never ship; **`scripts/verify-draft-not-in-public.mjs`** checks pretty + ugly HTML paths and **`sitemap.xml` / `index.xml` / `posts/index.xml`** for draft slugs after build (CI + local).
- **`content/posts/hello-world.md`** (`draft: false`) proves published path: appears in **`public/posts/hello-world/`**, home/post lists, **`index.xml`**, **`sitemap.xml`**; draft title/slug absent from **`public/`** (grep).
- **`scripts/published-post-frontmatter.mjs`** + **`scripts/validate-published-posts.mjs`**: publishable posts must set **`draft: false`** explicitly; UTF-8 BOM strip; **`draft: "true"` / `"false"`** coercion; clear error for TOML **`+++`** opening; validates required keys/types; **`--ci`** emits **`::error file=...::`** for GitHub Actions.
- **`scripts/published-post-frontmatter.test.mjs`**: **`node --test`** coverage (BOM, quoted draft, TOML rejection, validation rules).
- **`.github/workflows/build-and-deploy.yml`**: **`actions/setup-node@v4`** (Node 20); validate step before Hugo; verify-draft step after **`hugo --gc --minify`**.
- **`docs/publishing-runbook.md`**: replaced outdated “Epic 2+ validation not required” note; triage for new steps.

### File List

- `hugo.toml`
- `.github/workflows/build-and-deploy.yml`
- `scripts/published-post-frontmatter.mjs`
- `scripts/validate-published-posts.mjs`
- `scripts/verify-draft-not-in-public.mjs`
- `scripts/published-post-frontmatter.test.mjs`
- `content/posts/draft-fixture-not-listed.md`
- `content/posts/hello-world.md`
- `docs/publishing-checklist.md`
- `docs/publishing-runbook.md`
- `README.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-03-23 — Story 2.2: draft vs production documentation, frontmatter CI gate, post-build draft exclusion check, fixtures, Node tests, runbook/README updates.
- 2026-03-23 — Code review: fixed **`verify-draft-not-in-public.mjs`** CLI parsing so **`--ci`** is not treated as the output directory (CI check now reads real **`public/`**); removed dead code in **`validate-published-posts.mjs`** / **`published-post-frontmatter.mjs`**.
- 2026-03-23 — Post-review hardening: BOM + **`draft`** string coercion + TOML hint in **`published-post-frontmatter.mjs`**; verify script checks ugly URLs + RSS/sitemap XML; **Node 20** in CI; tests expanded; story marked **done**.

## Senior Developer Review (AI)

**Review date:** 2026-03-23  
**Outcome:** **Approved** for completion after critical argv fix; follow-up hardening applied same release (see Change Log).

### Action Items

- [x] **[High]** **`verify-draft-not-in-public.mjs`**: With invocation `node …/verify-draft-not-in-public.mjs --ci`, **`process.argv[2]`** was **`--ci`**, so **`publicDir`** resolved to **`<repo>/--ci`**, not **`public/`**. The step always “passed” without inspecting Hugo output. **Fix:** treat only non-`--*` args as the optional public directory path.
- [x] **[Low]** **`validate-published-posts.mjs`**: Remove no-op **`replace(/^content\//, 'content/')`** in **`logError`**.
- [x] **[Low]** **`published-post-frontmatter.mjs`**: Remove unreachable post-check **`draft !== false`** after **`draft === false`** has been enforced.

### Review Follow-ups (AI)

- [x] [AI-Review] [High] argv / **`publicDir`** bug (**`verify-draft-not-in-public.mjs`**).
- [x] [AI-Review] [Low] Dead / redundant code in validator modules.
