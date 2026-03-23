# Story 2.4: Implement Taxonomy Conventions for Categories and Tags

Status: done

<!-- create-story: ultimate context engine analysis completed — comprehensive developer guide created. -->
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo publisher,
I want predictable category and tag organization,
so that content remains navigable and scalable as the post library grows.

**Implements:** FR4. **Epic 2** — content structure and taxonomy hygiene before reader-facing navigation polish in Epic 3.

## Acceptance Criteria

1. **Given** taxonomy metadata is authored in posts  
   **When** categories and tags are defined  
   **Then** terms follow lowercase hyphenated conventions  
   **And** taxonomy metadata format remains consistent across content.

2. **Given** taxonomy assignments exist on published posts  
   **When** users browse taxonomy pages  
   **Then** category and tag listings render correctly  
   **And** taxonomy supports core topic pillars across entrepreneurship, AI, software, and science content.

## Tasks / Subtasks

- [x] **Define and document conventions** (AC: 1–2)  
  - [x] Add **`docs/taxonomy-conventions.md`** (or a clearly named equivalent under **`docs/`**) specifying:  
    - **Term format:** each tag and category string must be lowercase ASCII, words separated by single hyphens, no leading/trailing hyphens, no spaces — recommend regex `^[a-z0-9]+(-[a-z0-9]+)*$` (adjust only if you document why).  
    - **Pillar categories:** the canonical primary buckets are the four slugs **`entrepreneurship`**, **`ai`**, **`software`**, **`science`** (align with product IA and architecture examples).  
    - **Usage rule for published posts:** at least **one** `categories` entry must be one of the four pillars (primary shelf). Multiple categories allowed only if all satisfy the same term-format rule; prefer a single pillar per post unless you document an exception pattern.  
    - **`tags`:** optional; any number of terms obeying the same format rule; use for subtopics (e.g. `machine-learning`, `founder-ops`).  
  - [x] Cross-link from **`docs/publishing-checklist.md`** (and **`README.md`** if there is an authoring section) so authors see taxonomy rules before publishing.

- [x] **Enforce conventions in CI for publishable posts** (AC: 1)  
  - [x] Extend existing validation (prefer **`scripts/published-post-frontmatter.mjs`** + **`scripts/validate-published-posts.mjs`**) rather than a parallel pipeline: after current publishable-post checks pass, validate every string in **`tags`** and **`categories`** against the term regex.  
  - [x] Validate **pillar rule** for published posts: `categories` non-empty array containing **at least one** member in the allowed pillar set `{entrepreneurship, ai, software, science}`.  
  - [x] Emit **`::error file=...::`** messages in **`--ci`** mode consistent with existing scripts (path + rule + fix hint).  
  - [x] Add **`node --test`** coverage beside **`published-post-frontmatter.test.mjs`** (new cases or file) for: valid pillars + tags, invalid casing, spaces, empty categories on “published” fixture, tag with underscore.

- [x] **Hugo / theme configuration sanity** (AC: 2)  
  - [x] Confirm Hugo’s default **`category`** and **`tag`** taxonomies are active (no accidental **`disableKinds`** or custom **`[taxonomies]`** that would drop list pages). **`hugo.toml`** today is minimal — only add config if required for correct list output.  
  - [x] Run **`hugo --gc --minify`** and verify under **`public/`** that **category** and **tag** term pages exist for terms used on published content (e.g. **`public/categories/<pillar>/`**, **`public/tags/<term>/`** — exact paths follow Hugo’s default `plural` URLs).  
  - [x] If PaperMod menu does not yet surface taxonomy links, **do not** fully implement Epic 3.3 navigation in this story; optionally add a single-line note in **`docs/taxonomy-conventions.md`** that reader-facing nav is Epic 3.x — this story only requires **routable, correct list pages** when URLs are hit directly or linked from post metadata.

- [x] **Align authoring templates and sample content** (AC: 1–2)  
  - [x] Update **`archetypes/posts.md`** comments: replace the “standardized in Epic 2.4” placeholder with a pointer to **`docs/taxonomy-conventions.md`** and an example **`categories: [software]`** + **`tags: [example-topic]`** (or keep arrays empty but document required pillar before publish).  
  - [x] Update **`content/posts/hello-world.md`** (and any other **published** post) so it passes the new validator: assign a pillar category and optional valid tags.

- [x] **Verification** (AC: 1–2)  
  - [x] **`node scripts/validate-published-posts.mjs`** (with **`--ci`** locally if applicable) passes.  
  - [x] **`hugo list all`** and **`hugo --gc --minify`** succeed.  
  - [x] Spot-check generated HTML for one category and one tag list page for correct post membership and readable layout (PaperMod defaults).

## Dev Notes

### Epic 2 context (cross-story)

- **2.1** established the post archetype and required **`tags`** / **`categories`** as YAML arrays.  
- **2.2** wired **`validate-published-posts.mjs`** and publishable-post rules — extend that stack for taxonomy shape, not a duplicate validator entry point.  
- **2.3** owns slug/URL stability; **do not** change slug policy here. Taxonomy **term** changes can alter taxonomy URLs — document briefly in **`docs/taxonomy-conventions.md`** (renaming a tag/category is a URL change for that term’s list page; prefer stable terms).  
- **2.5** owns About page — out of scope unless a cross-link from taxonomy doc is natural.

### Architecture compliance (mandatory)

- Taxonomy terms: **lowercase, hyphen-separated** (e.g. `ai-agents`, `startup-strategy`). [Source: `_bmad-output/planning-artifacts/architecture.md` — Naming Patterns]  
- **Tags/categories as arrays**, not comma-separated strings. [Source: architecture.md — Format Patterns]  
- **Add or update CI validation** when introducing new content conventions. [Source: architecture.md — Enforcement Guidelines / Process Patterns]  
- Posts under **`content/posts/`**; **no direct edits** to **`themes/PaperMod/`**; overrides in **`layouts/`** only if needed (prefer zero theme edits for this story). [Source: architecture.md — Structure Patterns]  
- **Fail-fast CI** with file path + rule + remediation hint. [Source: architecture.md — Process Patterns]

### Technical requirements

| Topic | Requirement |
|--------|-------------|
| Hugo | **0.158.0** extended in CI; default taxonomies **`categories`** / **`tags`** unless explicitly configured |
| Validation | Reuse **`published-post-frontmatter.mjs`** parsers; keep **no npm deps** for validators |
| Term validation | Implement shared helper e.g. `isValidTaxonomyTerm(s)` + `PILLAR_CATEGORIES` constant exported or mirrored in test file |
| Draft posts | Existing behavior: **`draft: true`** skips publishable validation — do not require pillar/tags on drafts unless product asks |

### File structure requirements

| Path | Action |
|------|--------|
| `docs/taxonomy-conventions.md` | New: canonical rules, examples, pillar list, URL stability note |
| `docs/publishing-checklist.md` | Link to taxonomy doc |
| `scripts/published-post-frontmatter.mjs` | Add taxonomy validation functions used by publishable-post path |
| `scripts/validate-published-posts.mjs` | Invoke new checks (or import single validate export) |
| `scripts/*.test.mjs` | New tests for taxonomy rules |
| `archetypes/posts.md` | Point to doc; exemplar values in comments |
| `content/posts/hello-world.md` | Valid pillar + tags for CI |
| `hugo.toml` | Only if needed for taxonomy/list correctness |

### Testing / verification

- **`node --test`** for scripts touching validation.  
- **`node scripts/validate-published-posts.mjs`**  
- **`hugo --gc --minify`** + inspect **`public/categories/`**, **`public/tags/`**

### Previous story intelligence (2.3)

- Validators use **`::error file=...::`** in CI; keep consistency.  
- **`published-post-frontmatter.mjs`** is the right seam for new field rules (arrays already type-checked).  
- Story **2.3** completion notes stress **shell-safe** patterns and **fail-closed** parsing — if taxonomy validation runs after frontmatter parse errors, order should remain: parse → existing publishable checks → taxonomy checks.

### Git intelligence summary

- Repo may not be **`git init`** in all environments; no story requirement to add git-based taxonomy checks — file-level CI is sufficient.

### Latest technical information

- Hugo taxonomies overview: [Hugo — Taxonomies](https://gohugo.io/content-management/taxonomies/)  
- Default **`tags`** and **`categories`** are built-in; custom `[taxonomies]` only if renaming plurals or adding kinds.

### Project context reference

- No **`project-context.md`** in repo; use **`architecture.md`**, **`prd.md`**, **`epics.md`**, **`ux-design.md`**, and **`_bmad-output/implementation-artifacts/2-3-*.md`**.

## References

- Epics: `_bmad-output/planning-artifacts/epics.md` — Epic 2, Story 2.4  
- PRD: `_bmad-output/planning-artifacts/prd.md` — FR4, NFR9 (taxonomy usable at scale)  
- Architecture: `_bmad-output/planning-artifacts/architecture.md` — naming, format, enforcement, example `founder-ops`  
- UX: `_bmad-output/planning-artifacts/ux-design.md` — §4.3 taxonomy/archive, empty taxonomy state  
- Prior stories: `2-3-edit-existing-posts-while-preserving-url-and-canonical-stability.md`, `2-2-publish-draft-and-final-posts-through-content-workflow.md`, `2-1-create-standard-post-archetype-with-required-frontmatter.md`  
- CI: `.github/workflows/build-and-deploy.yml` (validation before Hugo build)

## Dev Agent Record

### Agent Model Used

Composer (Cursor agent); follow-up patches after code review (same).

### Debug Log References

### Completion Notes List

- Added **`docs/taxonomy-conventions.md`** (term regex, four pillars, published vs draft, URL stability, Epic 3 nav scope).
- Extended **`validatePublishablePost`** in **`scripts/published-post-frontmatter.mjs`** with **`TAXONOMY_TERM_RE`**, **`PILLAR_CATEGORIES`**, **`isValidTaxonomyTerm`**, per-term validation, and ≥1 pillar rule; errors cite **`docs/taxonomy-conventions.md`**.
- **`scripts/published-post-frontmatter.test.mjs`**: pillar + tags happy path; failures for empty categories, non-pillar-only, bad tag casing, underscore, spaces; export smoke test.
- **`scripts/check-published-slug-stability.test.mjs`**: published fixture now **`categories: [software]`** so **`classifyPublishedSlugState`** stays aligned with publishable rules.
- **`docs/publishing-checklist.md`**, **`README.md`**, **`archetypes/posts.md`**, **`content/posts/hello-world.md`** updated for authoring and sample data.
- **`hugo.toml`** unchanged — default taxonomies sufficient; production build produces **`public/categories/software/`**, **`public/tags/baseline/`**, **`public/tags/site-setup/`**, plus taxonomy indexes.
- Ran **`node --test`** (both test files), **`node scripts/validate-published-posts.mjs --ci`**, **`hugo --gc --minify`**, **`node scripts/verify-draft-not-in-public.mjs --ci`** — all pass.
- **Code review follow-up:** **`taxonomyTermPatternHint()`** + **`String(TAXONOMY_TERM_RE)`** for validator errors; integration tests **`parsePostFrontmatter` → `validatePublishablePost`**; **`docs/publishing-runbook.md`** taxonomy triage; **`docs/taxonomy-conventions.md`** inline-YAML + term URL clarification; **`scripts/verify-taxonomy-list-pages.mjs`** + CI step after build; comment on slug-stability coupling; README commands paragraph.

### File List

- `docs/taxonomy-conventions.md`
- `docs/publishing-checklist.md`
- `docs/publishing-runbook.md`
- `README.md`
- `archetypes/posts.md`
- `content/posts/hello-world.md`
- `scripts/published-post-frontmatter.mjs`
- `scripts/published-post-frontmatter.test.mjs`
- `scripts/check-published-slug-stability.mjs`
- `scripts/check-published-slug-stability.test.mjs`
- `scripts/verify-taxonomy-list-pages.mjs`
- `.github/workflows/build-and-deploy.yml`
- `_bmad-output/implementation-artifacts/2-4-implement-taxonomy-conventions-for-categories-and-tags.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-03-24 — Story 2.4: taxonomy docs, CI validation in **`published-post-frontmatter.mjs`**, tests, checklist/README/archetype/hello-world, slug-stability test fixture alignment; story marked **review**.
- 2026-03-24 — Senior Developer Review (AI): adversarial code review recorded below; outcome **Changes requested** (documentation/tests/ops polish; no correctness blockers identified).
- 2026-03-24 — Review follow-ups implemented; story marked **done**.

## Senior Developer Review (AI)

**Review date:** 2026-03-24  
**Scope:** Story 2.4 implementation (taxonomy docs, **`published-post-frontmatter.mjs`**, tests, **`hello-world`** sample, checklist/README).  
**Outcome (final):** **Approved** — review patch items addressed in follow-up commit.

**Layers:** Blind Hunter + Edge Case Hunter + Acceptance Auditor (single session; formal `workflow.xml` / `code-review/workflow.yaml` paths not present in repo).

**Triage summary:** 0 intent_gap, 0 bad_spec, 6 patch, 3 defer, 0 reject.

### Action Items

- [x] **[Med] Missing integration-style test** — Tests call **`validatePublishablePost`** with plain objects only. Add at least one test that runs **`parsePostFrontmatter`** on a markdown string (inline `tags` / `categories`) then validates, so real frontmatter parsing + taxonomy rules stay wired together.
- [x] **[Med] Runbook gap** — **`docs/publishing-runbook.md`** does not mention taxonomy or pillar CI failures; add a short triage bullet linking **`docs/taxonomy-conventions.md`** and the validator error shape.
- [x] **[Low] Regex drift in error copy** — Error strings hard-code `/^[a-z0-9]+(-[a-z0-9]+)*$/` while the source of truth is **`TAXONOMY_TERM_RE`**. Build messages from **`TAXONOMY_TERM_RE.source`** (or a shared helper) so future edits cannot diverge.
- [x] **[Low] URL stability doc accuracy** — **`docs/taxonomy-conventions.md`** points readers at **`docs/url-change-policy.md`** for taxonomy URL changes; that policy is post/slug-centric. Clarify that taxonomy term moves are usually handled via stable terms, Hugo term **`aliases`** (if used), or explicit content strategy—not the post slug policy alone.
- [x] **[Low] AC2 automation gap** — Acceptance criterion 2 was satisfied by manual spot-check only. Optional: a tiny script or test that greps built **`public/categories/<pillar>/`** / **`public/tags/<tag>/`** for **`hello-world`** slug or title to guard regressions in CI (or document “manual” explicitly in story if you accept the gap).
- [x] **[Low] Coupling reminder** — **`classifyPublishedSlugState`** reuses **`validatePublishablePost`**; taxonomy rules now define “published” for slug stability. Add a one-line comment in **`check-published-slug-stability.mjs`** pointing to **`docs/taxonomy-conventions.md`** so future taxonomy relaxations update both.

### Deferred (accepted / pre-existing)

- **YAML expressiveness:** **`parseSimpleYaml`** only supports single-line / inline `tags` and **`categories`** arrays (pre-existing). **`docs/taxonomy-conventions.md`** now requires inline **`[]`** for CI alignment; block-style lists remain unsupported by the validator.
- **Numeric-only terms:** Values like **`2024`** match the regex and pass as tags; harmless unless product wants to forbid purely numeric labels.
- **`logError` colon split:** **`validate-published-posts.mjs`** splits the first **`:`** for **`::error file=`**; paths containing **`:`** (unusual) could mis-attribute (pre-existing pattern).

### Review follow-ups (resolved)

- [x] Integration tests, runbook, regex hint helper, taxonomy URL doc clarification, **`verify-taxonomy-list-pages.mjs`** + workflow, slug-stability header comment; inline-YAML note added under deferred item in **`docs/taxonomy-conventions.md`**.
