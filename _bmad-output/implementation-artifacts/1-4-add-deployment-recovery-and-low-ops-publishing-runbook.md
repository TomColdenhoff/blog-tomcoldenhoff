# Story 1.4: Add Deployment Recovery and Low-Ops Publishing Runbook

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a solo publisher,
I want a simple documented recovery workflow for failed deployments,
so that I can quickly restore service without high operational burden.

**Implements:** FR31, FR32. **Aligns with:** architecture recovery strategy (git-based rollback/redeploy), NFR7 (no secrets in runbook).

## Acceptance Criteria

1. **Given** a failed deployment caused by content or configuration changes  
   **When** I apply a fix or revert and trigger redeploy  
   **Then** the site returns to a healthy deployed state  
   **And** recovery can be completed without introducing ad hoc manual steps.

2. **Given** routine publishing operations  
   **When** I follow the documented checklist  
   **Then** the workflow remains low-ops and repeatable for a solo owner  
   **And** rollback/redeploy guidance is available in concise runbook form.

3. **Given** a partial or ambiguous failure (e.g., site up but wrong branch or stale assets)  
   **When** the runbook troubleshooting path is followed  
   **Then** the publisher can determine whether to fix forward or revert  
   **And** a successful redeploy restores expected public behavior.

## Tasks / Subtasks

- [x] Add **`docs/publishing-runbook.md`** (or **`docs/deployment-recovery.md`** if you prefer a single focused name—pick one, link consistently) covering: (AC: 1–3)  
  - **Standard publish path:** local `hugo` check → commit → push `main` → confirm GitHub Actions **build-and-deploy** success → verify site.  
  - **Failed CI / red workflow:** read failing job log; common causes (submodule, `hugo` build, theme); fix in branch or on `main`; re-run failed job or push empty commit; link to GitHub docs for re-run.  
  - **Git recovery:** `git revert <commit>` vs `git reset` (when safe for solo `main`); restoring last known-good deploy by reverting bad commit(s).  
  - **“Site wrong but green”:** cache (Cloudflare purge considerations), wrong `baseURL`, stale browser; cross-link **`docs/dns-and-cloudflare.md`** for DNS/TLS vs **`hugo.toml`** / workflow.  
  - **Emergency bypass:** not required—keep to Git + GitHub Pages; no undocumented shell hacks with secrets.

- [x] **README** — Short **Publishing & recovery** subsection linking to the runbook (one paragraph + link). (AC: 2)

- [x] **Checklists** — Include a **repeatable checklist** (markdown task list) for routine publish and for “deployment failed” triage order. (AC: 2)

- [x] **Scope boundaries** — Explicitly defer: full incident response, on-call, multi-env staging (per architecture: deferred). Epic 2+ content validation scripts are out of scope unless only referenced as future gates. (AC: 1)

- [x] **Verification** — Run through the doc as a **dry read**: steps are ordered, commands match this repo (`main`, `.github/workflows/build-and-deploy.yml`, `hugo.toml`). (AC: 1–3)

## Dev Notes

### Previous story intelligence (Story 1.3)

- **`docs/dns-and-cloudflare.md`** already covers DNS/HTTPS rollback; **1.4** should **reference** it for edge/DNS issues vs **build/deploy** issues—avoid duplicating long DNS tables; link instead.
- **CI:** `.github/workflows/build-and-deploy.yml` — recovery story should name this workflow and **Actions** tab as first stop for deploy failures.

### Architecture compliance (mandatory)

- **Recovery strategy:** git-based **rollback/revert** and **redeploy** for bad content/config. [Source: `_bmad-output/planning-artifacts/architecture.md` — Infrastructure & Deployment / Recovery]  
- **Low-ops:** concise runbook, no mandatory extra tooling beyond Git + GitHub + Hugo. [Source: architecture.md — NFR alignment]  
- **Documentation:** `docs/` for process notes per architecture project structure. [Source: architecture.md — Project Structure]  
- **Secrets:** never document “paste token here”; use GitHub/Cloudflare dashboards only. [Source: architecture.md — Security]

### Technical requirements

| Topic | Requirement |
|--------|-------------|
| Stack | Hugo + GitHub Actions → GitHub Pages + Cloudflare edge |
| Recovery | Revert/fix in git + push; optional workflow re-run |
| Audience | Solo publisher—short steps, minimal branches |
| Links | README → runbook → dns doc |

### File structure requirements

- New doc under **`docs/`**; keep **`README.md`** as index-level pointer.
- Do not add secrets files or commit credentials.

### Testing / verification

- Author self-review: follow the checklist mentally; run `hugo` locally if verifying command snippets.

### Project context reference

- No `project-context.md`; use `architecture.md`, `prd.md`, `epics.md`, existing `docs/dns-and-cloudflare.md`.

## References

- Epics: `_bmad-output/planning-artifacts/epics.md` — Epic 1, Story 1.4  
- PRD: `_bmad-output/planning-artifacts/prd.md` — FR31, FR32  
- Architecture: `_bmad-output/planning-artifacts/architecture.md` — recovery, operations  
- Prior: `_bmad-output/implementation-artifacts/1-3-configure-custom-domain-and-cloudflare-proxy-dns.md`, `1-2-configure-deterministic-github-pages-build-and-deploy-pipeline.md`

## Senior Developer Review (AI)

**Review outcome:** Approve (after follow-up edits)

**Date:** 2026-03-23

**Summary:** Documentation story; findings were doc precision and tracking hygiene, not security regressions.

### Action Items

- [x] Restore monotonic `last_updated` in `sprint-status.yaml` when touching that file.
- [x] Runbook: distinguish **`build`** vs **`deploy`** job failures; document deploy-step triage.
- [x] Runbook: explicit **wrong branch / non-`main`** guidance (merge to `main` to deploy).
- [x] Runbook: recommend **`hugo --gc --minify`** for CI parity; cite Hugo **0.158.0** / README alignment.
- [x] Runbook: optional note on **`cancel-in-progress`** concurrency confusion.
- [x] Remove duplicate repo-root **`CNAME`**; keep **`static/CNAME`** as the published hostname file.
- [x] Story **`File List`**: include this story file and removed path.

### Review Follow-ups (AI)

- [x] [AI-Review] All items above addressed in `docs/publishing-runbook.md`, `sprint-status.yaml`, and repo root `CNAME` removal.

## Dev Agent Record

### Agent Model Used

Composer (Cursor agent)

### Debug Log References

None.

### Implementation Plan

Documentation-only story: added `docs/publishing-runbook.md` aligned with `.github/workflows/build-and-deploy.yml` (job names, `main`, Hugo steps), `hugo.toml` `baseURL`, and cross-links to `docs/dns-and-cloudflare.md`. README points to the runbook for publishing vs DNS split.

### Completion Notes List

- Added **`docs/publishing-runbook.md`**: routine publish path, failed-CI triage, `git revert` vs `reset`, “site wrong but green,” scope/out-of-scope, emergency bypass (none required), and two markdown checklists.
- README **Publishing & recovery** subsection links to the runbook and clarifies when to use the DNS doc.
- Verified locally: `hugo --gc --minify` exits 0; doc names match repo layout.
- **Code review follow-up:** runbook now covers deploy-job failures, wrong-branch / non-`main` work, CI Hugo parity (0.158.0 / `--gc --minify`), concurrency note; removed duplicate root **`CNAME`**; sprint `last_updated` corrected; **`epic-1`** and story **1-4** marked **done** in sprint-status.

### File List

- `docs/publishing-runbook.md` (new / updated)
- `README.md` (modified)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)
- `_bmad-output/implementation-artifacts/1-4-add-deployment-recovery-and-low-ops-publishing-runbook.md` (modified)
- `CNAME` (removed from repo root — canonical hostname file is `static/CNAME`)

### Change Log

- 2026-03-23 — Story 1.4: publishing/recovery runbook in `docs/`, README link, sprint status → review.
- 2026-03-23 — Code review fixes; story and Epic 1 closed in sprint-status.

---

**Story completion status:** done — Accepted after review follow-ups
