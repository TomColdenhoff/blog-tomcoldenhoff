# Publishing checklist (publisher-facing)

Use with **`docs/publishing-runbook.md`** for CI and deploy recovery.

## Draft vs production output

- **`hugo server`** shows **draft** posts by default so you can preview work in progress.
- To preview **what production ships**, run **`hugo server --buildDrafts=false`** (same draft exclusion as CI).
- **CI and production** use **`hugo --gc --minify`** with **`HUGO_ENVIRONMENT=production`** and **no** `-D` / `--buildDrafts`. Root **`hugo.toml`** sets **`[build] buildDrafts = false`** explicitly.

## Static pages (non-posts)

Use for files under **`content/`** outside **`content/posts/`** (e.g. **`content/about.md`**).

- [ ] **`title`** and **`description`** set (description feeds summaries and meta where the theme uses it).
- [ ] **`date`** as an ISO-style value Hugo accepts (e.g. **`2026-03-23`** or full timestamp).
- [ ] **`draft: false`** when the page should appear in production builds (same explicit pattern as posts; default archetype starts as **`draft: true`**).
- [ ] **Post-only rules do not apply** unless we extend CI: published posts under **`content/posts/`** still need **`slug`**, **`tags`**, **`categories`** (pillar taxonomy), etc., per **`archetypes/posts.md`** and **`docs/taxonomy-conventions.md`**. Static pages are **not** validated by **`scripts/validate-published-posts.mjs`** today.
- [ ] If you change a static page’s public URL later, treat it like any bookmarked URL: consider **`aliases`** and document the change (see **`docs/url-change-policy.md`** for the post-centric workflow; same care applies to page permalinks).

New page from archetype: **`hugo new content/<path>.md`** (uses **`archetypes/default.md`**).

## Before you push to `main`

- [ ] **Published posts** (`content/posts/`): **`draft: false`** only when the post is ready to go live (omit or `true` while drafting). CI enforces explicit **`draft: false`** via **`scripts/validate-published-posts.mjs`** (posts only).
- [ ] **Static pages** (outside **`content/posts/`**): use **`draft: false`** when the page should ship; the post validator does **not** scan these—see **Static pages (non-posts)** above.
- [ ] Required frontmatter on **published** posts: `title`, `date`, `slug`, `description`, `tags`, `categories`, `draft` (types per **`archetypes/posts.md`** / architecture).
- [ ] **Taxonomy:** `tags` and `categories` use lowercase hyphenated terms; published posts must include **at least one** pillar category (`entrepreneurship`, `ai`, `software`, `science`) — see **`docs/taxonomy-conventions.md`**.
- [ ] Local build: **`hugo --gc --minify`** (matches GitHub Actions).
- [ ] Optional: **`node scripts/validate-published-posts.mjs`** to catch frontmatter issues before push.
- [ ] If you only edit **body**, display **`title`**, **`description`**, or taxonomies, public URLs stay the same as long as **`slug`** (and optional **`url`**), the **`content/posts/`** file location, and global permalink settings in **`hugo.toml`** (`baseURL`, `uglyurls`, `[permalinks]`, etc.) are unchanged. Default rule: **published posts keep the same `slug`** unless you follow **`docs/url-change-policy.md`**.

## Changing URLs or slugs (read first)

Do **not** change **`slug:`** or rename/move post files for published content without mitigation—external links and SEO depend on stable URLs. See **`docs/url-change-policy.md`** (aliases, `url_change_ack`, allowlist) and [Hugo URL management](https://gohugo.io/content-management/urls/).

## References

- **`archetypes/default.md`** — template for static pages (non-posts)
- **`docs/taxonomy-conventions.md`** — categories, tags, pillar rules (CI-enforced)
- [Hugo front matter — draft](https://gohugo.io/content-management/front-matter/#draft)
- [Hugo — URLs](https://gohugo.io/content-management/urls/)
- **`docs/url-change-policy.md`** — slug/permalink changes
- **`README.md`** — commands and CI overview
