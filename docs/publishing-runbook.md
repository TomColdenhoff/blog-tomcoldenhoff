# Publishing and deployment recovery

Low-ops workflow for this repo: **Hugo** on **`main`**, **GitHub Actions** (`.github/workflows/build-and-deploy.yml`), **GitHub Pages**, **Cloudflare** at the edge. CI pins **Hugo Extended 0.158.0** in that workflow—match **`README.md`** prerequisites so local and CI stay aligned. No secrets belong in this document—use GitHub and Cloudflare dashboards only.

This workflow only deploys from **`main`** (see `on.push.branches` in `.github/workflows/build-and-deploy.yml`). The file that publishes the custom hostname to Pages is **`static/CNAME`** (copied into the site output); do not rely on a stray `CNAME` at the repository root.

## Scope (what this covers)

- Routine publish and **git-based** recovery (revert/fix + push + redeploy).
- Triaging **CI failures** and **“green but wrong”** public behavior.

## Out of scope (deferred)

- Full incident response, on-call rotations, paging, and multi-environment staging (per architecture).

**Content gates (in scope for CI):** **`build-and-deploy`** runs **`node scripts/validate-published-posts.mjs`** (published posts must use explicit **`draft: false`**, required keys, and **taxonomy rules** — lowercase hyphenated `tags`/`categories` plus ≥1 pillar category per **`docs/taxonomy-conventions.md`**), **`node scripts/check-published-slug-stability.mjs`** on pushes (detects **`slug:`** or **`url:`** override drift on already-published posts unless **`aliases`** + ack + reason or allowlist), and, after the Hugo build, **`node scripts/verify-draft-not-in-public.mjs`** plus **`node scripts/verify-taxonomy-list-pages.mjs`** (baseline post appears on expected category/tag list pages). See **`docs/publishing-checklist.md`** for draft vs production behavior.

For **safe edits vs URL-breaking changes** (slug, file moves, `hugo.toml` permalinks), see **`docs/publishing-checklist.md`** and **`docs/url-change-policy.md`**.

For DNS, TLS, and Cloudflare-specific rollback, see **`docs/dns-and-cloudflare.md`**. For build-time URL behavior, see root **`hugo.toml`** (`baseURL`, **`[build] buildDrafts`**) and the workflow file above.

---

## Checklist: routine publish

Use this in order before relying on the live site. Draft vs ship checklist: **`docs/publishing-checklist.md`**.

- [ ] Run **`node scripts/validate-published-posts.mjs`** locally if you changed frontmatter under **`content/posts/`** (optional but fast).
- [ ] Run a local production build: prefer **`hugo --gc --minify`** to mirror CI (same flags as the **Build site** step in **`build-and-deploy`**); plain `hugo` is OK for a quick check but can diverge from CI.
- [ ] Fix any Hugo errors; confirm `public/` looks reasonable if you spot-check.
- [ ] Commit changes on **`main`** (or merge a PR into `main`).
- [ ] `git push origin main`
- [ ] Open the repo **Actions** tab and confirm workflow **`build-and-deploy`** succeeds for your commit.
- [ ] Verify the public site (browser or `curl -I https://tomcoldenhoff.com/`).

---

## Checklist: deployment failed (triage order)

Work top to bottom; stop when resolved.

- [ ] **Actions:** Open **Actions** → latest **`build-and-deploy`** run for `main`. Identify which **job** failed (`build` vs **`deploy`**). Open that job’s log first.
- [ ] **Submodule / theme:** If checkout or theme errors appear, ensure `themes/PaperMod` is present: `git submodule update --init --recursive` locally, commit submodule pointer if needed, push.
- [ ] **Validate published post frontmatter:** Failures list **`content/posts/...`** paths via `::error file=...`—fix missing keys, wrong types, or add explicit **`draft: false`** for posts that should publish. Reproduce with **`node scripts/validate-published-posts.mjs`** locally.
- [ ] **Taxonomy / pillars:** Messages mention invalid `tags`/`categories` or missing pillar — read **`docs/taxonomy-conventions.md`**. Use inline **`tags: [a, b]`** / **`categories: [software]`** (not YAML block lists under the key). Pillar slugs are **`entrepreneurship`**, **`ai`**, **`software`**, **`science`**.
- [ ] **Verify draft exclusion:** If this step fails, a **`draft: true`** post still produced **`public/posts/<slug>/index.html`**—check **`slug`**, Hugo version flags, and that CI did not pass **`--buildDrafts`**. Reproduce after local **`hugo --gc --minify`** with **`node scripts/verify-draft-not-in-public.mjs`**.
- [ ] **Hugo validate steps:** Failures in “Validate Hugo project” point to `hugo.toml`, missing theme, or bad content/frontmatter—match messages to `hugo config` / `hugo list all` locally.
- [ ] **Build step:** Failures in “Build site” come from templates, content, or assets—reproduce with `hugo --gc --minify` locally.
- [ ] **Deploy step:** If **`build`** succeeded but **`deploy`** failed, read the **Deploy to GitHub Pages** log. Check **Settings → Pages** (source **GitHub Actions**), **`github-pages`** environment, and that the workflow’s `permissions` / OIDC requirements still match [GitHub’s deploy-pages docs](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)—not a Hugo problem.
- [ ] **Wrong branch:** This pipeline only runs on pushes to **`main`**. If your fix lives on another branch, **merge to `main`** (or open and merge a PR) so Actions runs; pushing only to a feature branch will not update production.
- [ ] **Fix and redeploy:** Apply the fix on `main` (or a branch merged to `main`), push, or **re-run** the failed workflow if the fix is already on `main` (see [Re-running workflows and jobs](https://docs.github.com/en/actions/managing-workflow-runs/re-running-workflows-and-jobs)).
- [ ] **Still broken after green CI?** Go to [Site looks wrong but CI is green](#site-looks-wrong-but-ci-is-green).

---

## Standard publish path

1. **Local check:** From the repo root, run Hugo **Extended** (see **`README.md`** for version). Prefer `hugo --gc --minify` to match CI. Resolve errors before pushing.
2. **Commit:** Stage and commit with a clear message.
3. **Push `main`:** `git push origin main` (triggers **`build-and-deploy`** on push).
4. **Confirm CI:** In **Actions**, the run for your commit should complete with **build** then **deploy** success.
5. **Verify:** Load the site; optional `curl -I https://tomcoldenhoff.com/` for headers.

Manual runs: the workflow also supports **`workflow_dispatch`** if you need to trigger without a new commit.

**Overlapping pushes:** The workflow uses **`concurrency`** with **`cancel-in-progress: true`**, so a newer push can cancel an in-flight run. If Actions looks confusing after rapid commits, open the run for the **commit you care about** (or wait for the latest to finish).

---

## Failed CI / red workflow

1. Open the failing run under **Actions** and expand the failed step.
2. **Common causes:**
   - **Submodules:** `actions/checkout` uses `submodules: recursive`; if PaperMod is missing or outdated, update submodules locally and push.
   - **Published post validation / draft exclusion / taxonomy lists:** Node must be available on the runner (ubuntu-latest includes it). Run **`node scripts/validate-published-posts.mjs`**, **`hugo --gc --minify`**, then **`node scripts/verify-draft-not-in-public.mjs`** and **`node scripts/verify-taxonomy-list-pages.mjs`** locally.
   - **Slug / URL stability:** If **`check-published-slug-stability`** fails, **`slug:`** or **`url:`** changed on an already-published post without policy, **`head`** frontmatter is invalid for a touched file, or ack is missing **`aliases`**. Follow **`docs/url-change-policy.md`** or restore prior values. Reproduce with **`node scripts/check-published-slug-stability.mjs --base origin/main --head HEAD`**.
   - **`hugo config` / `hugo list all`:** Invalid config, missing theme, or content issues—run the same commands locally.
   - **`hugo --gc --minify`:** Build-time errors—fix locally until the command exits 0.
3. **Redeploy:** After fixing, push to `main`, or use **Re-run jobs** / **Re-run all jobs** on GitHub ([docs](https://docs.github.com/en/actions/managing-workflow-runs/re-running-workflows-and-jobs)). An empty commit (`git commit --allow-empty -m "chore: trigger deploy" && git push`) is acceptable if you need a new run without code changes.

---

## Git recovery (rollback vs fix-forward)

**Prefer `git revert` on shared `main`:** creates a new commit that undoes a bad commit without rewriting history—safe for solo workflow and GitHub Pages.

```bash
# Undo the effects of one bad commit (creates a revert commit)
git revert <bad-commit-sha>
git push origin main
```

**`git reset --hard` on `main`** only if you are certain no one else relies on the current tip and you accept force-push risk—generally avoid on `main`; use revert instead.

**Restore last known-good deploy:** Identify the last good commit (e.g. via `git log`), then either revert the bad range or fix content/config in a new commit and push—either path triggers a fresh **`build-and-deploy`** run.

---

## Site looks wrong but CI is green

Symptoms: Actions succeeded but visitors see old HTML, wrong domain, or odd TLS—often **edge/cache**, **wrong `baseURL`**, or **browser**.

| Symptom | Where to look |
|--------|----------------|
| Stale pages or assets | **Cloudflare:** purge cache for the site if you use aggressive caching; allow a few minutes after deploy. |
| Wrong absolute URLs / links | **`hugo.toml` `baseURL`** must match production; CI does not override `--baseURL`. |
| Old content in one browser only | Hard refresh or private window; confirm not a local cache issue. |
| DNS / HTTPS / proxy mismatch | **`docs/dns-and-cloudflare.md`** — not duplicated here. |
| Expected deploy missing / “wrong” content | Confirm the commit you want is on **`main`** and that **`build-and-deploy`** succeeded for that SHA—feature branches do not deploy until merged. |

**Decision:** If the problem is **build output** or **git content**, fix in repo and push. If it is **DNS/TLS/proxy**, follow **`docs/dns-and-cloudflare.md`** and Cloudflare/GitHub settings—do not “fix” DNS by changing Hugo alone.

---

## Emergency bypass

Not required for this project. Recovery stays **Git + GitHub Actions + GitHub Pages** only—no undocumented one-off shell scripts that embed tokens or secrets.
