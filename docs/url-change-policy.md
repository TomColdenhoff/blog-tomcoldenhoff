# URL and slug change policy

Published posts must keep **stable public URLs** so links, search indexes, and bookmarks keep working. This document is the controlled process for any change that would break an existing URL.

**Related:** [Publishing checklist](publishing-checklist.md) (safe edits vs URL-changing operations), [Publishing runbook](publishing-runbook.md) (CI triage).

## When changing a slug or permalink is allowed

- **Rare corrections** (typo in slug, wrong slug at first publish) when you accept the operational cost.
- Only with **mitigation** so old URLs do not 404 without warning (see below).
- Prefer fixing **display title** and **body** instead of changing **`slug`** when the goal is wording only.
- Changing optional front matter **`url:`** (permalink override) is treated like a slug change: it can change the public path and requires the same mitigation and CI rules.

## Required mitigation

1. **Hugo `aliases`** — Add the **previous** URL path(s) as aliases on the post so Hugo emits redirect pages. See [Hugo — URLs and aliases](https://gohugo.io/content-management/urls/#aliases).
2. **Same change set** — Slug/path change, aliases, and any allowlist or ack front matter land in the **same commit/PR** as the content move (no silent follow-up).

## What CI enforces

On pushes to **`main`**, **`scripts/check-published-slug-stability.mjs`** compares the previous commit to the new one. For a post that was **already published** in the old revision, it fails if **`slug:`** or **`url:`** (when present) would change the permalink **unless**:

- The path is listed in **`docs/url-change-allowlist.txt`**, or
- **`url_change_ack: true`**, a non-empty **`url_change_reason`**, and a **non-empty `aliases` YAML array** (each entry a non-empty string) are all present on the **new** revision.

**`url_change_ack`** may be written as boolean **`true`** or quoted **`"true"`** (same coercion style as **`draft`** in this repo).

Use an **inline array** for **`aliases`** so it matches the simple frontmatter parser used in CI, for example:

```yaml
aliases: ["/posts/old-slug/", "/posts/legacy-path/"]
```

## Escape hatches (CI + audit)

If you must change the **`slug:`** or **`url:`** of a post that was **already published** (`draft: false` in Git history), do **one** of:

### A. Documented front matter ack (preferred for one-offs)

Example:

```yaml
url_change_ack: true
url_change_reason: "Short human reason, e.g. fix slug typo; old URL covered by aliases."
aliases: ["/posts/previous-slug/"]
```

- **`url_change_reason`** must be a **non-empty** string (audit trail).
- **`aliases`** must be a **non-empty** array of strings (CI-enforced when using this path).

### B. Allowlist (rare bulk / automation)

Paths listed in **`docs/url-change-allowlist.txt`** (one repo-relative path per line, `#` comments allowed) **skip** the permalink comparison for that file. Use sparingly; prefer (A) for normal edits.

## Limitations of automation

- **Git rename as delete + add:** If a post is moved so Git shows one deleted path and one added path, the new path has no **`base`** revision—the script cannot compare to the old published slug. Review **`git diff`** manually for moves.
- **Pull requests:** The workflow runs on **push to `main`** (and **`workflow_dispatch`**), not on every PR. Run **`check-published-slug-stability.mjs`** locally against **`origin/main`** before merging if you want an early signal.

## Local verification

Compare your branch to `main` before pushing:

```bash
git fetch origin main
node scripts/check-published-slug-stability.mjs --base origin/main --head HEAD
```

CI runs **`scripts/check-published-slug-stability.mjs`** on pushes to **`main`** (see `.github/workflows/build-and-deploy.yml`) when GitHub provides a valid `before` SHA.

## Manual review recipe

If you cannot run the script, at least:

```bash
git diff origin/main...HEAD -- content/posts/
```

Inspect any change to **`slug:`**, **`url:`**, or file rename under **`content/posts/`** against this policy.
