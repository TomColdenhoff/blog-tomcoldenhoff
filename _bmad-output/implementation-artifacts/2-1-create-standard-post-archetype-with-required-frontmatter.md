# Story 2.1: Create Standard Post Archetype With Required Frontmatter

Status: done

<!-- create-story: context analysis completed — ready for dev-story. -->
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo publisher,
I want a reusable post template with required metadata fields,
so that every new post starts with consistent, valid structure.

**Implements:** FR1, FR7. **Epic 2** — content quality and repeatable publishing.

## Acceptance Criteria

1. **Given** a new post is created  
   **When** the archetype/template is used  
   **Then** required frontmatter fields are pre-populated: `title`, `date`, `slug`, `description`, `tags`, `categories`, `draft`  
   **And** field formats align with agreed conventions: date as ISO-compatible `YYYY-MM-DD` (or full datetime Hugo accepts), `tags` and `categories` as YAML/TOML arrays (not comma strings), `draft` as a boolean.

2. **Given** the template is used for authoring  
   **When** a draft is prepared for publication  
   **Then** the template body includes clear guidance (comments and/or a short scaffold) for consistent article structure and readability  
   **And** the result stays compatible with Hugo + PaperMod build expectations (no invalid frontmatter types).

## Tasks / Subtasks

- [x] **Post archetype file** (AC: 1)  
  - [x] Add **`archetypes/posts.md`** as the section archetype for **`content/posts/`** (Hugo resolves `posts` section → `archetypes/posts.md`). [Source: Hugo archetypes — section match]  
  - [x] Pre-populate required keys: `title`, `date`, `slug`, `description`, `tags`, `categories`, `draft` using Hugo archetype template functions where appropriate (e.g. YAML `date: '{{ .Date }}'` to match default archetype datetime string on Hugo 0.158+, or `now.Format "2006-01-02"` for date-only; `{{ .File.ContentBaseName }}` for slug seed; title from base name).  
  - [x] Use **one** frontmatter format consistently in that file (**YAML `---`** recommended for readable arrays; TOML `+++` is acceptable if you align the whole archetype — do not mix delimiters in one file).

- [x] **Reconcile `archetypes/default.md`** (AC: 1–2)  
  - [x] Today **`archetypes/default.md`** is TOML with only `date`, `draft`, `title` — insufficient for posts. Either narrow **`default`** to non-post content only (short comment at top) **or** align it so it does not contradict the post contract. Avoid two competing “full post” templates without documentation.

- [x] **Authoring scaffold** (AC: 2)  
  - [x] Below frontmatter, include optional markdown structure (e.g. Summary / Main / Conclusion) and/or HTML comments reminding: one H1 policy per UX (title vs body — follow PaperMod: typically title from frontmatter, body starts H2). [Source: `_bmad-output/planning-artifacts/ux-design.md` §7–9]

- [x] **Verification** (AC: 1–2)  
  - [x] Run **`hugo new content/posts/verify-archetype-sample.md`** (or equivalent path under `content/posts/`), confirm generated file contains all required keys and valid types.  
  - [x] Remove the sample file **or** convert it to a harmless draft placeholder — do not leave accidental published content.  
  - [x] Run **`hugo`** (or `hugo --gc --minify` to match CI) and confirm build succeeds. Baseline toolchain: **Hugo Extended 0.158.0+** per `README.md` and `.github/workflows/build-and-deploy.yml`.

## Dev Notes

### Epic 2 context (cross-story)

- **2.2** will tighten draft vs published behavior in listings/build; this story should default **`draft: true`** in the archetype so new posts are safe by default.  
- **2.4** will standardize taxonomy term style (lowercase hyphenated); archetype can use empty arrays and a one-line comment as reminder.  
- **2.5** covers About page — out of scope here unless touching non-post archetypes.

### Handoff from Epic 1 (no prior Epic 2 story)

- **Story 1.4** established **`docs/publishing-runbook.md`**, **`README`** publishing section, and CI **`build-and-deploy`**. Do not duplicate runbook content; link only if you add a one-line pointer under “where to create posts.”  
- **Operational:** no secrets in repo (NFR7); archetype is static template text only.

### Architecture compliance (mandatory)

- **Frontmatter contract:** `title`, `date`, `slug`, `description`, `tags`, `categories`, `draft` are the required content keys for the data model. [Source: `_bmad-output/planning-artifacts/architecture.md` — Data Architecture / Naming]  
- **Formats:** dates ISO-like; booleans real booleans; tags/categories as arrays. [Source: architecture.md — Format Patterns]  
- **Layout:** `archetypes/` for templates; posts live under **`content/posts/`** as the canonical post path pattern. [Source: architecture.md — Structure Patterns, Project Structure]  
- **Theme:** do not edit **`themes/PaperMod/`**; archetype changes are repo-owned.  
- **Future CI:** architecture references `scripts/validate-frontmatter.mjs` + `content-validation` workflow — **not required to implement in 2.1** unless you need it to prove validity; manual `hugo` verification is enough for this story.

### Technical requirements

| Topic | Requirement |
|--------|----------------|
| Hugo | Extended, **0.158.0** baseline (match CI `peaceiris/actions-hugo`) |
| Archetype path | `archetypes/posts.md` for `content/posts/*` |
| Required keys | `title`, `date`, `slug`, `description`, `tags`, `categories`, `draft` |
| PaperMod | Verify frontmatter types match what PaperMod expects for lists/meta (string title/description, array taxonomies, bool draft) |

### File structure requirements

| Path | Action |
|------|--------|
| `archetypes/posts.md` | Create or replace with full post template |
| `archetypes/default.md` | Clarify scope vs `posts` archetype |
| `content/posts/` | May need to exist for `hugo new`; create `_index.md` only if required by theme for list pages — follow existing repo; do not introduce `content/blog/` parallel tree |

### Testing / verification

- `hugo new content/posts/<name>.md` → inspect file.  
- `hugo` / `hugo --gc --minify` — zero errors.  
- Optional: `hugo list all` to confirm new draft appears as expected.

### Previous story intelligence

- Not applicable (first story in Epic 2). Use **`1-4-add-deployment-recovery-and-low-ops-publishing-runbook.md`** only for doc/CI naming consistency if you reference workflows.

### Git intelligence

- Not extracted (repository may be uninitialized in some workspaces). Follow file patterns from Epic 1 stories and `README.md`.

### Latest technical notes (Hugo archetypes)

- Archetypes are Go templates; use `{{ .Date }}`, `{{ .File.ContentBaseName }}`, and `replace`/`title` as needed. See [Hugo archetypes](https://gohugo.io/content-management/archetypes/) for current behavior with `hugo new content/...`.

### Project context reference

- No `project-context.md` in repo; rely on `architecture.md`, `prd.md`, `epics.md`, this file.

## References

- Epics: `_bmad-output/planning-artifacts/epics.md` — Epic 2, Story 2.1  
- PRD: `_bmad-output/planning-artifacts/prd.md` — FR1, FR7  
- Architecture: `_bmad-output/planning-artifacts/architecture.md` — data model, structure, format patterns  
- UX: `_bmad-output/planning-artifacts/ux-design.md` — headings, authoring checklist expectations  
- README / CI: `README.md`, `.github/workflows/build-and-deploy.yml`

## Dev Agent Record

### Agent Model Used

Composer (Cursor agent)

### Debug Log References

### Completion Notes List

- Implemented **`archetypes/posts.md`** with YAML frontmatter: required keys (`title`, `date`, `slug`, `description`, `tags`, `categories`, `draft`), `date: '{{ .Date }}'` aligned with **`archetypes/default.md`**, arrays as `[]`, `draft: true` by default.
- **`archetypes/default.md`**: TOML for non-post pages; HTML comment above `+++` (not inside frontmatter) points authors to `hugo new content/posts/<slug>.md`.
- Body scaffold: section headings with replace-me guidance in HTML comments only (avoids shipping italic boilerplate); taxonomy + `description` hints in comments after frontmatter.
- **`README.md`**: one-line `hugo new content/posts/<slug>.md` under Commands.
- **`content/posts/.gitkeep`**: keeps canonical posts section path in git for fresh clones.
- Post–code-review patch pass: frontmatter comment leak, date alignment, README pointer, scaffold/SEO hints, story task example corrected for Hugo 0.158 archetypes.
- Verified with `hugo new` + `hugo --gc --minify` (Hugo Extended 0.158.0).
- Owner sign-off: story marked **done** after code-review patches and acceptance (2026-03-23).

### File List

- `archetypes/posts.md`
- `archetypes/default.md`
- `README.md`
- `content/posts/.gitkeep`
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (story lifecycle updates from dev-story)

### Change Log

- 2026-03-23 — Story 2.1: add `posts` section archetype (YAML), reconcile `default` archetype scope, authoring scaffold; verified with `hugo new` + production build.
- 2026-03-23 — Code-review follow-up: archetype/HTML comment hygiene, `date` aligned with default, README post command, `.gitkeep` for `content/posts/`, story task text + File List accuracy.
- 2026-03-23 — Status **done** (post-review acceptance).
