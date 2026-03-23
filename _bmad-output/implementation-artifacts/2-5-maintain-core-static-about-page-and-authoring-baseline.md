# Story 2.5: Maintain Core Static About Page and Authoring Baseline

Status: done

<!-- create-story: ultimate context engine analysis completed — comprehensive developer guide created. -->
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo publisher,
I want a maintained About page and clear baseline authoring standards,
so that visitors understand site context and content quality stays consistent.

**Implements:** FR6. **Epic 2** — closes content authoring baseline before Epic 3 reader-facing IA/navigation polish.

## Acceptance Criteria

1. **Given** baseline site content is being prepared  
   **When** the About page is created or updated  
   **Then** it is published as a core static page  
   **And** it follows metadata and accessibility expectations aligned with other key pages.

2. **Given** ongoing content operations  
   **When** publishing checklists or guidance are referenced  
   **Then** authoring standards remain repeatable and low-friction  
   **And** contributors can follow the same process for consistent output quality.

## Tasks / Subtasks

- [x] **Ship core About content** (AC: 1)  
  - [x] Add **`content/about.md`** (single static page; architecture example uses root-level **`content/about.md`**, not under **`content/posts/`**).  
  - [x] Frontmatter: at minimum **`title`**, **`description`**, and **`draft: false`** when the page should publish (mirror the explicit draft pattern used for posts in CI). Include a stable **`date`** (ISO **`YYYY-MM-DD`**) so list ordering and feeds behave predictably.  
  - [x] Body: real placeholder or minimal authentic copy (site purpose, who you are); use semantic Markdown (**`##`** subsections; assume theme renders page **`title`** as primary heading — avoid **`#`** in body unless you verify theme behavior).  
  - [x] Run **`hugo --gc --minify`** and confirm **`public/about/`** (or PaperMod’s equivalent permalink for that file) exists and renders.

- [x] **Discoverability (minimal, aligned with UX)** (AC: 1)  
  - [x] Ensure About is reachable without typing the URL: add a **PaperMod main menu** entry in **`hugo.toml`** (e.g. **`[[menu.main]]`** with **`name`**, **`url`**, **`weight`**) pointing at the built About URL.  
  - [x] Keep labels consistent with **`_bmad-output/planning-artifacts/ux-design.md`** (About in primary nav). Epic 3.1 may refine full IA; this story only needs a correct, obvious link.

- [x] **Authoring baseline docs** (AC: 2)  
  - [x] Extend **`docs/publishing-checklist.md`** with a short **“Static pages (non-posts)”** section: required frontmatter for pages you intend to publish (**`title`**, **`description`**, **`draft`**, **`date`**), note that **post-only** rules (**`slug`**, **`tags`**, **`categories`**, pillar taxonomy) apply to **`content/posts/`** only unless product expands validators.  
  - [x] Update **`archetypes/default.md`** comments (and frontmatter hints if needed) so **`hugo new content/about.md`** (or other pages) documents the page contract and links to the checklist.  
  - [x] Cross-link from **`README.md`** authoring area if there is one (mirror how taxonomy points to **`docs/taxonomy-conventions.md`**).

- [x] **Verification** (AC: 1–2)  
  - [x] **`hugo list all`** includes the About page as non-draft when **`draft: false`**.  
  - [x] **`node scripts/validate-published-posts.mjs`** still passes (unchanged behavior for posts).  
  - [x] Optional manual: keyboard-nav to About from header; skim rendered HTML for a sensible **`title`** / meta description (full SEO depth is Epic 4).

## Dev Notes

### Epic 2 context (cross-story)

- **2.1–2.4** established posts under **`content/posts/`**, archetype **`archetypes/posts.md`**, taxonomy CI, slug stability — **do not** conflate those rules with static pages unless you intentionally extend validators.  
- **2.3** owns post URL/slug policy; if About URL ever changes, document mitigations (aliases) consistent with **`docs/url-change-policy.md`** spirit for any bookmarked URL.  
- **Epic 3** owns homepage, reading layout, and richer navigation; keep About work minimal and shippable.

### Architecture compliance (mandatory)

- Static pages live under **`content/`** with kebab-case paths; **no** direct edits to **`themes/PaperMod/`**; overrides only under **`layouts/`** if theme gaps block acceptance. [Source: `_bmad-output/planning-artifacts/architecture.md` — Structure Patterns]  
- Post schema (**`title`**, **`date`**, **`slug`**, **`description`**, **`tags`**, **`categories`**, **`draft`**) is the **post** contract; About is a **regular page** — use Hugo/PaperMod-appropriate frontmatter and document the delta in the checklist. [Source: architecture.md — Data Architecture / Naming Patterns]  
- Dates: ISO-like strings compatible with Hugo. Booleans as real booleans. [Source: architecture.md — Format Patterns]  
- NFR10: practical WCAG 2.1 AA baseline — semantic headings, meaningful **`description`**, descriptive link text if linking out from About. [Source: `prd.md` NFR10; `ux-design.md` §4]

### Technical requirements

| Topic | Requirement |
|--------|-------------|
| Hugo | **0.158.0** extended (CI) — same as existing workflow |
| Theme | PaperMod; menu via **`hugo.toml`** **`menu.main`** (or params block PaperMod expects) |
| Content path | **`content/about.md`** preferred to match architecture directory example |
| Validators | Do **not** silently require pillar **`categories`** on **`content/about.md`** via **`validate-published-posts.mjs`** unless you intentionally extend that script with a scoped rule (default: leave page content out of post validator) |

### File structure requirements

| Path | Action |
|------|--------|
| `content/about.md` | New: published About page |
| `hugo.toml` | Add **`[[menu.main]]`** (or params block PaperMod expects) for About |
| `docs/publishing-checklist.md` | Add static-page bullets + cross-links |
| `archetypes/default.md` | Clarify page authoring + link to checklist |
| `README.md` | Optional one-line pointer if authoring section exists |

### Testing / verification

- **`hugo list all`**, **`hugo --gc --minify`**  
- **`node scripts/validate-published-posts.mjs`** (regression guard for posts)  
- **`node --test`** for any script changes (none expected unless you add page validation)

### Previous story intelligence (2.4)

- Taxonomy and pillar rules are **post**-scoped; **`docs/taxonomy-conventions.md`** remains the reference for posts.  
- CI uses **`::error file=...::`** patterns when adding new checks — reuse if you add page-level validation later.  
- Prefer documenting conventions in **`docs/`** over one-off comments in content files.

### Git intelligence summary

- Workspace may not be a git repository in all environments; no story requirement for git-specific About checks.

### Latest technical information

- Hugo menus: [Hugo — Menus](https://gohugo.io/content-management/menus/)  
- PaperMod configuration patterns: theme samples / [PaperMod wiki](https://github.com/adityatelange/hugo-PaperMod/wiki) for **`menu.main`** and params.

### Project context reference

- No **`project-context.md`** in repo; use **`architecture.md`**, **`prd.md`**, **`epics.md`**, **`ux-design.md`**, and implementation artifacts **`2-4-*.md`**, **`2-3-*.md`**.

## References

- Epics: `_bmad-output/planning-artifacts/epics.md` — Epic 2, Story 2.5  
- PRD: `_bmad-output/planning-artifacts/prd.md` — FR6, core pages (Home, Post, About)  
- Architecture: `_bmad-output/planning-artifacts/architecture.md` — `content/about.md` example tree, structure/enforcement  
- UX: `_bmad-output/planning-artifacts/ux-design.md` — §3 IA (About in primary nav), §4.4 header/footer  
- Prior: `_bmad-output/implementation-artifacts/2-4-implement-taxonomy-conventions-for-categories-and-tags.md`  
- CI: `.github/workflows/build-and-deploy.yml`

## Dev Agent Record

### Agent Model Used

GPT-5.2 (Cursor agent)

### Debug Log References

### Completion Notes List

- Added **`content/about.md`** (YAML frontmatter, **`draft: false`**, **`##`** sections, descriptive links in colophon).
- Configured **`hugo.toml`** **`[[menu.main]]`** for **Home**, **Posts**, and **About** so About is reachable and defining `menu.main` does not collapse nav to a single item (matches **`ux-design.md`** primary nav).
- **`docs/publishing-checklist.md`**: new **Static pages (non-posts)** section + archetype reference.
- **`archetypes/default.md`**: YAML template aligned with **`archetypes/posts.md`** conventions; checklist pointers.
- **`README.md`**: `hugo new content/<page-name>.md` and static-page draft note.
- Verification: **`hugo list all`**, **`HUGO_ENVIRONMENT=production hugo --gc --minify`**, **`public/about/index.html`**, **`node scripts/validate-published-posts.mjs`**, **`node --test`** (both test files), **`verify-draft-not-in-public.mjs --ci`**, **`verify-taxonomy-list-pages.mjs`**. Built HTML includes **title**, **meta description**, and menu link to **`/about/`**.
- Code review follow-up: About colophon links to GitHub **README** and **publishing-checklist**; checklist **Before you push** split into posts vs static pages.

### File List

- `content/about.md`
- `hugo.toml`
- `docs/publishing-checklist.md`
- `archetypes/default.md`
- `README.md`
- `_bmad-output/implementation-artifacts/2-5-maintain-core-static-about-page-and-authoring-baseline.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-03-23 — Story 2.5 drafted to **ready-for-dev** (create-story workflow).
- 2026-03-23 — Implementation complete: About page, main menu, authoring docs; story → **review**.
- 2026-03-23 — Code review patches applied; story and **epic-2** → **done**.

## Senior Developer Review (AI)

**Review date:** 2026-03-23  
**Outcome:** **Approved** after two documentation/copy patches (About colophon URLs; checklist validator scope).

**Triage summary:** 0 intent_gap, 0 bad_spec, 2 patch (resolved), 1 defer, 0 reject.

### Action items (resolved)

- [x] Link repository **README** and publishing checklist from the public About page (use public GitHub URLs).
- [x] Clarify in **Before you push** that **`validate-published-posts.mjs`** applies to **`content/posts/`** only; static pages use the static-pages section.
