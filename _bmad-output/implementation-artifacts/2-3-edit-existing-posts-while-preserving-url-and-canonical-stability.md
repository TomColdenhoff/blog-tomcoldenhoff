# Story 2.3: Edit Existing Posts While Preserving URL and Canonical Stability

Status: done

<!-- create-story: ultimate context engine analysis completed — comprehensive developer guide created. -->
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo publisher,
I want to update existing posts without breaking discoverability,
so that historical links and search equity remain intact.

**Implements:** FR2. **Epic 2** — content quality and repeatable publishing.

## Acceptance Criteria

1. **Given** an existing published post  
   **When** content is updated and redeployed  
   **Then** edits are reflected publicly without changing canonical URL by default  
   **And** slug and canonical values remain stable unless explicitly changed through a controlled process.

2. **Given** update operations over time  
   **When** changes are committed to version control  
   **Then** revision history remains traceable for rollback and audit  
   **And** updates do not introduce hidden URL-breaking side effects.

3. **Given** a slug or permalink change is attempted without an agreed redirect or canonical policy  
   **When** the change is reviewed against publishing standards  
   **Then** the change is blocked or requires an explicit documented exception  
   **And** published URLs do not silently break external links without mitigation.

## Tasks / Subtasks

- [x] **Document safe editing vs URL-changing operations** (AC: 1–2)  
  - [x] In **`docs/publishing-checklist.md`** and/or **`docs/publishing-runbook.md`**, add a concise section: what authors may change freely (body, display **`title`**, **`description`**, taxonomies per existing conventions) vs what affects public URLs (**`slug`**, optional **`url`**, moving/renaming the content file, global **`permalink`** / **`uglyurls`** / **`baseURL`** changes in **`hugo.toml`**).  
  - [x] State the default expectation: **published posts keep the same `slug` and path semantics** unless the URL-change policy is followed.  
  - [x] Tie to Hugo behavior: permalinks derive from content path + frontmatter; cite [Hugo — URLs](https://gohugo.io/content-management/urls/) and [front matter](https://gohugo.io/content-management/front-matter/) as needed (verify links in Hugo docs if unsure).

- [x] **Formalize URL / slug change governance** (AC: 3; closes architecture gap on redirect policy)  
  - [x] Add **`docs/url-change-policy.md`** (or an equivalently named, discoverable doc under **`docs/`**) that defines:  
    - When a slug/path change is allowed (e.g. rare correction with a mitigation plan).  
    - Required mitigation: e.g. **`aliases`** in post frontmatter for old paths, or another agreed static redirect mechanism — see [Hugo — aliases](https://gohugo.io/content-management/urls/#aliases).  
    - Process: explicit decision + update same PR as the content change (no silent slug edits).  
  - [x] Cross-link from **`README.md`** or the publishing checklist so authors find it before editing slugs.

- [x] **Optional CI guardrail for slug drift on published posts** (AC: 3 — recommended if low effort)  
  - [x] Extend **`scripts/`** (new small module or flag on an existing validator) so CI can detect: for **`content/posts/**/*.md`** that are **publishable** (`draft: false` per **`scripts/published-post-frontmatter.mjs`** rules), **`slug:`** must not change across the merge base vs current tree **unless** an escape hatch is used (pick one clear approach and document it):  
    - e.g. frontmatter key **`url_change_ack: true`** with a required short comment field, **or**  
    - a tracked allowlist file under **`docs/`** or **`scripts/`** for exceptional renames.  
  - [x] Wire into **`.github/workflows/build-and-deploy.yml`** only if deterministic on GitHub Actions (`fetch-depth: 0` or explicit base ref may be required for `git merge-base`). If git history is unavailable in CI, document “local/PR-only check” or use `github.event.pull_request.base.sha` pattern.  
  - [x] If full CI detection is too brittle, document the manual review checklist in **`url-change-policy.md`** and mark the automated subtask as explicitly deferred in completion notes — but prefer at least one automated or copy-paste `git diff` recipe.

- [x] **Archetype / author nudge** (AC: 1 — lightweight)  
  - [x] Add a one-line reminder in **`archetypes/posts.md`** comments: **`slug` is stable after publish; see `docs/url-change-policy.md`**.

- [x] **Verification** (AC: 1–3)  
  - [x] Edit **`content/posts/hello-world.md`** body only → `hugo --gc --minify` → confirm output path for the post unchanged (same under **`public/`** as before).  
  - [x] Documented negative case: changing **`slug`** without **`aliases`** / policy should be described as disallowed; if CI guard exists, demonstrate failing run in completion notes.

## Dev Notes

### Epic 2 context (cross-story)

- **2.1** defined the post archetype and required frontmatter; **`slug`** is created at **`hugo new`** time from the filename — authors must understand persistence implications.  
- **2.2** added **`validate-published-posts.mjs`**, **`published-post-frontmatter.mjs`**, draft fixtures, and **`build-and-deploy.yml`** validation — extend patterns rather than new pipelines where possible.  
- **2.4** will normalize taxonomy conventions; this story should not redefine tag/category rules.  
- **2.5** owns About page; out of scope unless a link from runbook is natural.

### Architecture compliance (mandatory)

- **Preserve URL/slug stability** for published content unless an explicit redirect plan exists. [Source: `_bmad-output/planning-artifacts/architecture.md` — Enforcement Guidelines]  
- **Slugs:** lowercase kebab-case, stable after publish. [Source: architecture.md — Naming Patterns]  
- **Canonical URL-related fields** must be explicit and stable when used. [Source: architecture.md — Format Patterns]  
- **Posts under `content/posts/`** only; no parallel trees. [Source: architecture.md — Structure Patterns]  
- **Do not edit `themes/PaperMod/`** directly. [Source: architecture.md — Structure / Enforcement]  
- **Fail-fast CI** if adding checks: file path + rule + hint. [Source: architecture.md — Process Patterns]  
- Architecture **important gap:** formalize redirect policy for slug changes — this story’s **`url-change-policy.md`** is the intended resolution.

### Technical requirements

| Topic | Requirement |
|--------|-------------|
| Hugo | Extended **0.158.0** in CI; permalink behavior from **`hugo.toml`** + front matter |
| Canonical / OG | PaperMod + Hugo defaults; changing **`baseURL`** affects absolute URLs site-wide — call out in docs |
| Git | All edits versioned; revert = checkout previous commit + redeploy (align with runbook) |
| Validation | Reuse existing Node tooling style (minimal deps); **`::error::`** in CI if new checks added |

### File structure requirements

| Path | Action |
|------|--------|
| `docs/publishing-checklist.md`, `docs/publishing-runbook.md` | Safe edit + URL stability sections |
| `docs/url-change-policy.md` | New: redirect/alias governance |
| `archetypes/posts.md` | Short slug-stability reminder |
| `scripts/*.mjs`, `.github/workflows/build-and-deploy.yml` | Optional slug-drift CI |

### Testing / verification

- `hugo --gc --minify` after representative edits.  
- Optional: `node scripts/validate-published-posts.mjs` (and new script if added).  
- Compare **`public/posts/<slug>/`** (or ugly URL equivalent) before/after body-only edit.

### Previous story intelligence (2.2)

- Published posts must set **`draft: false`** explicitly; validators enforce types and required keys.  
- **`verify-draft-not-in-public.mjs`**: parse CLI carefully — optional path args must not consume **`--ci`**.  
- CI order: validation before Hugo; post-build draft leak check after **`hugo --gc --minify`**.  
- **`content/posts/hello-world.md`** and **`draft-fixture-not-listed.md`** are the primary fixtures for publish/draft behavior — reuse for URL stability checks.

### Git intelligence summary

- Recent history includes **CI**, **CNAME**, and **docs** commits — keep workflow changes consistent with **`build-and-deploy.yml`** style (`set -euo pipefail`, pinned actions, clear step names).

### Latest technical information

- Hugo URL management and **aliases**: [Hugo content management — URLs](https://gohugo.io/content-management/urls/).  
- Front matter reference: [Hugo — front matter](https://gohugo.io/content-management/front-matter/).

### Project context reference

- No **`project-context.md`** in repo; use **`architecture.md`**, **`prd.md`**, **`epics.md`**, **`ux-design.md`**, and prior story files under **`_bmad-output/implementation-artifacts/`**.

## References

- Epics: `_bmad-output/planning-artifacts/epics.md` — Epic 2, Story 2.3  
- PRD: `_bmad-output/planning-artifacts/prd.md` — FR2  
- Architecture: `_bmad-output/planning-artifacts/architecture.md` — naming, URL stability, enforcement, gap on redirect policy  
- UX: `_bmad-output/planning-artifacts/ux-design.md` — stable slugs in checklist expectations  
- Prior stories: `_bmad-output/implementation-artifacts/2-2-publish-draft-and-final-posts-through-content-workflow.md`, `2-1-create-standard-post-archetype-with-required-frontmatter.md`  
- Config: `hugo.toml`, `archetypes/posts.md`  
- CI: `.github/workflows/build-and-deploy.yml`

## Dev Agent Record

### Agent Model Used

Composer (Cursor agent)

### Debug Log References

### Completion Notes List

- **`docs/url-change-policy.md`** defines aliases, **`url_change_ack`** + **`url_change_reason`**, allowlist **`docs/url-change-allowlist.txt`**, local **`git diff`** recipe, and CI behavior.
- **`docs/publishing-checklist.md`** and **`docs/publishing-runbook.md`** document safe edits vs URL-changing fields and triage for slug-stability CI failures.
- **`scripts/check-published-slug-stability.mjs`** compares Git **`before`/`after`** on push (and **`HEAD^`/`HEAD`** on `workflow_dispatch`); uses **`execFileSync`** (no shell); detects **`slug`** and **`url`** override drift; requires **`aliases`** + ack + reason when mitigating; fails on invalid **`head`** frontmatter for touched posts; **`--ci`** emits **`::error file=...::`**. Tests cover ack/aliases, **`url`** drift, and quoted **`url_change_ack`**. CLI entry guarded so **`node --test`** imports do not run **`main()`**.
- **`README.md`** links URL policy and documents the local **`--base origin/main --head HEAD`** invocation.
- **`archetypes/posts.md`** reminds authors that **`slug`** is stable after publish.
- **`content/posts/hello-world.md`** body-only edit; **`hugo --gc --minify`** → **`public/posts/hello-world/index.html`** still present (permalink unchanged).
- **Negative case:** unit test **`evaluateSlugChange`** fails for silent slug change; manual CI failure would show the same message when **`slug:`** changes on a previously published post without ack/allowlist.

### File List

- `docs/url-change-policy.md` (includes CI rules, limitations, inline **`aliases`** note)
- `docs/url-change-allowlist.txt`
- `docs/publishing-checklist.md`
- `docs/publishing-runbook.md`
- `README.md`
- `archetypes/posts.md`
- `scripts/check-published-slug-stability.mjs`
- `scripts/check-published-slug-stability.test.mjs`
- `.github/workflows/build-and-deploy.yml`
- `content/posts/hello-world.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-03-24 — Story 2.3: URL/slug policy docs, slug stability CI script + tests, checklist/runbook/README updates, archetype note, hello-world body verification edit.
- 2026-03-24 — Code review follow-up: shell-safe git, **`url`** override checks, **`aliases`** required with ack, invalid head fails closed, **`url_change_ack`** string coercion, zero-file CI log line, policy limitations section, story marked **done**.

## Senior Developer Review (AI)

**Review date:** 2026-03-24  
**Outcome (initial):** **Changes requested** (2026-03-24).  
**Outcome (final):** **Approved** after follow-up implementation (2026-03-24).

**Layers:** Single-session adversarial review (Blind Hunter + Edge Case Hunter + Acceptance Auditor roles); formal `workflow.xml` / `code-review/workflow.yaml` paths are not present in this repo; executed `_bmad/bmm/workflows/4-implementation/bmad-code-review/workflow.md`.

**Triage summary:** 0 intent_gap, 0 bad_spec, 5 patch, 2 defer, 0 reject.

### Action Items

- [x] **[High]** **`scripts/check-published-slug-stability.mjs`:** `execSync` builds shell strings (`git show ${ref}:${p}`, `git diff ... ${base} ${head}`). Malicious or accidental **`--base` / `--head`** values could inject shell metacharacters. Use `execFileSync('git', [...], { cwd })` (or validate refs as strict `[0-9a-f]{40}` / known-safe refnames) so arguments are never interpreted by a shell.
- [x] **[High]** **Policy vs CI:** `docs/url-change-policy.md` requires Hugo **`aliases`** when changing slugs; **`url_change_ack` + `url_change_reason`** alone satisfies the script. AC3 (“without agreed redirect or canonical policy”) is only partially automated—either enforce a non-empty **`aliases`** (or `url` mitigation) in front matter when slug changes with ack, or amend the policy to say aliases are author-checked only.
- [x] **[Med]** **Rename bypass:** A **`git mv`** that appears as delete + add yields a “new” path with no **`base`** blob → **`oldState.kind === 'missing'`** → slug change is not compared to the old published post. Document this limitation in **`docs/url-change-policy.md`** or add rename-pair detection (harder).
- [x] **[Med]** **`url:` front matter:** Checklist/policy call out optional **`url`**; the script never compares **`url:`** between revisions, so permalink overrides can change without CI signal. Defer to a follow-up or document.
- [x] **[Low]** **Unparseable new revision:** If the **`head`** version fails frontmatter parse (**`invalid`**), **`evaluateSlugChange`** returns OK—slug drift could hide behind a broken file until **`validate-published-posts`** runs (order is correct today, but the coupling is fragile). Consider failing closed when **`head`** content exists but parses **`invalid`** for a path touched in the diff.
- [x] **[Low]** **CI UX:** When no post files changed, the slug step exits 0 with no **`check-published-slug-stability: OK`** line—minor log clarity.
- [x] **[Low]** **Tests:** Add a test that **`url_change_ack: "true"`** (string) is rejected or coerced consistently with **`published-post-frontmatter.mjs`** (today only boolean **`true`** counts).

### Review Follow-ups (AI)

- [x] [AI-Review] [High] Shell-safe git invocation (**`check-published-slug-stability.mjs`**).
- [x] [AI-Review] [High] Align alias requirement with automation or docs.
- [x] [AI-Review] [Med] Rename bypass documentation or detection.

**Deferred (accepted):** PR-only early signal (run script locally before merge); multiline YAML **`aliases`** not parsed by simple frontmatter parser—use inline **`aliases: ["/path/"]`** for CI compatibility (documented in policy).
