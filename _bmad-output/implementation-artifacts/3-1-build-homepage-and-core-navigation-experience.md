# Story 3.1: Build Homepage and Core Navigation Experience

Status: done

<!-- create-story: ultimate context engine analysis completed — comprehensive developer guide created. -->
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site visitor,
I want to quickly understand and navigate the site from the homepage,
so that I can discover relevant content with minimal friction.

**Implements:** FR8, FR14, FR15 (PRD). **Epic 3** — first story; establishes homepage + global IA before post layout (3.2), taxonomy/archive flows (3.3), related posts (3.4), and cross-browser checks (3.5).

## Acceptance Criteria

1. **Given** a visitor lands on the homepage  
   **When** the page loads  
   **Then** recent and/or featured posts are clearly listed  
   **And** core site sections are discoverable through clear navigation.

2. **Given** a visitor accesses public site routes  
   **When** they browse pages and posts  
   **Then** no account creation or login is required  
   **And** public access behavior is consistent across core content surfaces.

## Tasks / Subtasks

- [x] **Homepage content and post listing** (AC: 1)  
  - [x] Confirm PaperMod home uses the post list path (not accidental **profile mode**): avoid enabling **`params.profileMode.enabled`** unless product explicitly wants profile-style home instead of a list. [Source: `themes/PaperMod/layouts/_default/list.html` — home branches]  
  - [x] Set **`params.mainSections`** in **`hugo.toml`** (or TOML-equivalent params block) so the home list includes **`posts`** — PaperMod’s list template filters home pages with **`where site.RegularPages "Type" "in" site.Params.mainSections`**. [Source: `themes/PaperMod/layouts/_default/list.html`]  
  - [x] Add **`content/_index.md`** with **`draft: false`**, sensible **`title`** / **`description`**, and short positioning copy (optional body) so the home has explicit site context above the list, aligned with **ux-design.md §4.1** (site identity + entry to content).  
  - [x] Optionally configure **`params.homeInfoParams`** (title, subtitle, image) per PaperMod if you prefer the theme’s home intro partial over/in addition to **`_index.md`** body — document the chosen pattern so 3.2+ does not fight it. [Source: `themes/PaperMod/layouts/partials/home_info.html`, `list.html`]  
  - [x] If “featured” behavior is needed beyond reverse-chronological list, use a minimal, documented approach (e.g. **`weight`** in post frontmatter where theme respects it, or a small number of pinned posts via config) — do not build a custom parallel index unless theme/config cannot satisfy AC.

- [x] **Primary navigation and section discovery** (AC: 1)  
  - [x] Extend **`[[menu.main]]`** in **`hugo.toml`** so primary nav matches **`_bmad-output/planning-artifacts/ux-design.md` §3**: Home, Posts (or “Blog” if relabeled consistently), **taxonomy entry points** (Categories / Tags — use labels consistent with **`docs/taxonomy-conventions.md`** and actual **`/categories/`**, **`/tags/`** list routes), About.  
  - [x] Reuse existing About entry from Epic 2.5; verify URLs resolve after nav changes (**`hugo list all`**, local **`hugo server`** click-through).  
  - [x] Ensure header shows persistent nav on home, section list, and single pages (PaperMod default — regress only if adding params that hide menu). [Source: **ux-design.md §4.4**]

- [x] **Public read-only experience** (AC: 2)  
  - [x] Confirm no auth, membership, or comment flows are introduced; theme remains static MPA. [Source: **architecture.md** — Authentication & Security; **prd.md** FR15]  
  - [x] Smoke-test: home → post → about → taxonomy list pages without any login prompts.

- [x] **Verification** (AC: 1–2)  
  - [x] **`hugo config`**, **`hugo list all`**, **`hugo --gc --minify`** (match CI).  
  - [x] **`node scripts/validate-published-posts.mjs`** (no regression for post rules).  
  - [x] Manual: mobile width (~320px) — nav usable, home list readable (**ux-design.md §5**).

## Dev Notes

### Epic 3 context (cross-story)

- **3.2** will deepen single-post typography and layout; keep homepage changes compatible with default PaperMod single template.  
- **3.3** owns richer taxonomy/archive UX; this story only needs **working links** into category/tag list pages from global nav.  
- **3.4–3.5** add related posts and explicit cross-browser validation — do not block 3.1 on exhaustive browser matrices.

### Architecture compliance (mandatory)

- **PaperMod defaults first**; targeted overrides only under project **`layouts/`** if theme cannot meet AC without forking **`themes/PaperMod/`**. [Source: **architecture.md** — Frontend Architecture]  
- **Routing** remains Hugo static routes from **`content/`** structure and permalinks; do not introduce client-side routers. [Source: **architecture.md** — Frontend / Routing]  
- **NFR10**: practical WCAG 2.1 AA baseline — semantic landmarks, keyboard-reachable nav, meaningful link text in menus. [Source: **prd.md** NFR10; **ux-design.md** §7]

### Technical requirements

| Topic | Requirement |
|--------|--------------|
| Hugo | **0.158.0** extended (CI) — **`.github/workflows/build-and-deploy.yml`** |
| Config | **`hugo.toml`** — `baseURL`, `theme = 'PaperMod'`, **`[build] buildDrafts = false`** for production parity |
| Home list | **`params.mainSections`** must include **`posts`** for PaperMod home listing logic |
| Content | **`content/_index.md`** for home; posts remain under **`content/posts/`** per Epic 2 |
| Taxonomy URLs | Align menu links with Hugo’s taxonomy outputs (typically **`/categories/`**, **`/tags/`** unless customized) |

### File structure requirements

| Path | Action |
|------|--------|
| `hugo.toml` | Add/update **`[params]`** (`mainSections`, optional `homeInfoParams`), extend **`menu.main`** |
| `content/_index.md` | Add home page frontmatter + optional intro copy |
| `layouts/` | Only if a minimal override is required; prefer config + content first |

### Testing / verification

- **`hugo config`**, **`hugo list all`**, **`hugo --gc --minify`**  
- **`node scripts/validate-published-posts.mjs`** (and CI-equivalent locally)  
- **`node --test`** if any scripts change (unlikely for 3.1)

### Previous story intelligence (Epic 2 closure — 2.5)

- **About** lives at **`content/about.md`** with **`[[menu.main]]`** already wired — extend nav, do not remove or break the About route.  
- Post-only validators stay scoped to **`content/posts/`**; do not extend **`validate-published-posts.mjs`** to **`_index.md`** unless you add a separate, explicit requirement.  
- **ux-design.md** noted Epic 3.1 may refine full IA — this story is the right place to finalize primary nav labels and taxonomy menu items.

### Git intelligence summary

- Workspace may not be a git repository in all environments; no story dependency on git history. Use local Hugo/Node verification.

### Latest technical information

- Hugo menus: [Hugo — Menus](https://gohugo.io/content-management/menus/)  
- Hugo homepage / section: [Hugo — Sections](https://gohugo.io/content-management/sections/)  
- PaperMod wiki / examples: [hugo-PaperMod wiki](https://github.com/adityatelange/hugo-PaperMod/wiki) — **`mainSections`**, **`homeInfoParams`**, **`profileMode`**

### Project context reference

- No **`project-context.md`** in repo; use **`architecture.md`**, **`prd.md`**, **`epics.md`**, **`ux-design.md`**, **`docs/taxonomy-conventions.md`**, and **`2-5-maintain-core-static-about-page-and-authoring-baseline.md`**.

## References

- Epics: `_bmad-output/planning-artifacts/epics.md` — Epic 3, Story 3.1  
- PRD: `_bmad-output/planning-artifacts/prd.md` — FR8, FR14, FR15  
- Architecture: `_bmad-output/planning-artifacts/architecture.md` — Frontend, routing, PaperMod discipline  
- UX: `_bmad-output/planning-artifacts/ux-design.md` — §3 IA, §4.1 Home, §4.4 Global chrome  
- Prior: `_bmad-output/implementation-artifacts/2-5-maintain-core-static-about-page-and-authoring-baseline.md`  
- CI: `.github/workflows/build-and-deploy.yml`

## Dev Agent Record

### Agent Model Used

Composer (Cursor agent), implementation session 2026-03-23

### Debug Log References

### Completion Notes List

- **Home pattern:** `content/_index.md` supplies title, meta description, and intro body above the post list. `params.homeInfoParams` and `params.profileMode.enabled` are intentionally unset so the home page remains PaperMod’s default list layout (no profile mode, no duplicate hero).
- **`mainSections`:** `posts` only so the home list matches published posts in `content/posts/`.
- **Nav:** `[[menu.main]]` extended with Categories (`/categories/`) and Tags (`/tags/`) per ux-design §3; labels align with taxonomy-conventions reader-facing naming.
- **Verification:** `hugo config` shows `mainsections = ['posts']`; `hugo list all` includes home, about, posts, taxonomies; `hugo --gc --minify` succeeds (18 pages); `node scripts/validate-published-posts.mjs` OK. Built `public/index.html` shows intro copy + “Hello world” entry and full menu on home/post/about/taxonomy templates. No lint config in repo. **Manual:** Please spot-check ~320px width in the browser with `hugo server` (nav + list readability per ux-design §5).
- **Post-review docs:** `README.md` documents production `public/` vs `hugo server`, and `--baseURL` / `--appendPort=false` when the browser port differs from Hugo’s listen port (e.g. editor port forwarding).

### Implementation Plan

1. Set `[params] mainSections` and document home-intro choice in `hugo.toml` comments.  
2. Add `content/_index.md` for site positioning and links into sections.  
3. Add Categories and Tags menu entries; keep About URL unchanged.  
4. Run Hugo + validate script; confirm HTML output.

### File List

- `hugo.toml`
- `content/_index.md`
- `README.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `_bmad-output/implementation-artifacts/3-1-build-homepage-and-core-navigation-experience.md`

## Change Log

- 2026-03-23: Story 3.1 — homepage list via `mainSections`, home `_index.md`, primary nav with Categories/Tags; verification via Hugo build and post validator.
- 2026-03-24: Marked **done** after review; README clarified `public/` vs `hugo server` and port-forwarding `--baseURL` / `--appendPort=false` for local preview.
