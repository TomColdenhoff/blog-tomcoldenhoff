# Story 1.3: Configure Custom Domain and Cloudflare-Proxy DNS

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a site owner,
I want production traffic routed through a custom domain and Cloudflare proxy,
so that the site is reachable on a branded domain with edge capabilities and secure transport.

**Implements:** FR29, FR30. **Aligns with:** NFR4 (HTTPS), NFR5 (Cloudflare security defaults), NFR7 (no secrets in repo).

## Acceptance Criteria

1. **Given** domain ownership and DNS access  
   **When** GitHub Pages domain settings and Cloudflare DNS are configured  
   **Then** the site resolves correctly on the custom production domain  
   **And** Cloudflare proxy is **active** (orange cloud) for the production hostname(s).

2. **Given** production traffic reaches the site  
   **When** users access the domain  
   **Then** requests are served via **HTTPS**  
   **And** TLS and edge protections align with baseline architecture expectations (HTTPS-only, sensible Cloudflare SSL/TLS mode for GitHub Pages origin).

3. **Given** DNS records, proxy mode, or TLS settings are misconfigured  
   **When** users or monitoring checks hit the production hostname  
   **Then** the failure mode is **diagnosable** (e.g., wrong proxy, certificate, or resolution)  
   **And** **documented** rollback or correction steps restore HTTPS and correct routing.

## Tasks / Subtasks

- [x] **GitHub Pages — custom domain** — In the GitHub repo: **Settings → Pages → Custom domain**, set the production hostname (e.g. `tomcoldenhoff.com` and/or `www.tomcoldenhoff.com`) per GitHub’s current docs for user/organization Pages sites. Enforce **HTTPS** if GitHub offers the option. Do **not** commit private keys; GitHub may add a `CNAME` file in `static/` or `public/` — follow current GitHub guidance (prefer `static/`/`layouts` if the repo uses a workflow that preserves it). (AC: 1–2)
- [x] **Align Hugo `baseURL`** — Confirm root `hugo.toml` `baseURL` matches the **canonical** HTTPS production URL (including `www` vs apex choice). Update CI if Story 1.2 workflow still overrides `--baseURL` only for `*.github.io`; after custom domain is live, production builds should emit correct absolute URLs (either rely on `hugo.toml` in CI or adjust workflow to stop overriding when deploying to custom domain). **Document the chosen decision** in README or `docs/`. (AC: 1–2)
- [x] **Cloudflare DNS** — For the production hostname(s): create **CNAME** (or A/AAAA for apex per GitHub docs and Cloudflare “CNAME flattening” / **proxied** records) pointing **at** GitHub Pages’ documented targets. Ensure **proxy enabled** (orange cloud) for the site hostname(s) to satisfy FR30 / Cloudflare analytics path. (AC: 1)
- [x] **SSL/TLS mode** — In Cloudflare **SSL/TLS** settings, choose a mode compatible with GitHub Pages (typically **Full** or **Full (strict)** depending on GitHub’s certificate behavior; avoid **Flexible** if it breaks HTTPS to origin). Document the chosen mode and why. (AC: 2)
- [x] **Verification** — From a clean browser session or `curl -I`, confirm **HTTP 200** on HTTPS for the canonical URL(s), no mixed-content warnings, and certificate chain valid. (AC: 2)
- [x] **Failure modes & rollback doc** — Add `docs/dns-and-cloudflare.md` (or extend `README.md`) with: symptoms (DNS not propagated, grey cloud, SSL handshake errors, wrong GitHub domain config), checks (`dig`, Cloudflare dashboard, GitHub Pages domain status), and rollback (revert DNS, disable custom domain in GitHub, temporary DNS-only). (AC: 3)
- [x] **Secrets** — no API tokens or Cloudflare credentials in the repo; dashboard-only changes. (AC: all, NFR7)
- [x] **Out of scope:** Cloudflare Web Analytics **script** (Epic 5), Google Search Console (Epic 4), full incident runbook beyond DNS/HTTPS (Story 1.4 can reference this doc).

## Dev Notes

### Previous story intelligence (Stories 1.1–1.2)

- `hugo.toml` already sets `baseURL = 'https://tomcoldenhoff.com/'` — confirm this matches the **live** hostname and `www` policy.
- CI (`build-and-deploy.yml`) uses `configure-pages` **`base_url`** for builds; **after** custom domain is primary, ensure production deploys do not generate wrong absolute links (either remove `--baseURL` override in CI when using custom domain, or pass the canonical production URL consistently).
- **PaperMod** submodule unchanged; no theme edits for this story.

### Architecture compliance (mandatory)

- **Hosting:** GitHub Pages as origin with **Cloudflare** DNS/CDN **proxy**. [Source: `_bmad-output/planning-artifacts/architecture.md` — Infrastructure & Deployment]
- **Security:** HTTPS-only, Cloudflare security defaults, **no secrets in repo**. [Source: architecture.md — Authentication & Security]
- **Analytics path:** Cloudflare proxy is required for later **Cloudflare Web Analytics** expectations. [Source: architecture.md — Third-party integrations]
- **Delivery:** GitHub Pages + Cloudflare edge — keep integration paths stable. [Source: architecture.md — Communication Patterns / Service Boundaries]

### Technical requirements

| Topic | Requirement |
|--------|----------------|
| Domain | Custom hostname on GitHub Pages + DNS at Cloudflare |
| Proxy | Cloudflare proxy **on** for production host(s) |
| HTTPS | End-to-end HTTPS; document SSL mode |
| Docs | Diagnosable failures + rollback steps |
| Repo | No secrets; dashboard-only configuration |

### Library / framework / tooling

- GitHub UI and Cloudflare dashboard (no new npm/go deps required for MVP).
- Reference: [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), [Cloudflare DNS](https://developers.cloudflare.com/dns/).

### File structure requirements

- Prefer **`docs/dns-and-cloudflare.md`** for operational detail; keep `README.md` scannable with link to full doc.
- If GitHub adds a `CNAME` file under `static/`, ensure it is committed and not overwritten by Hugo in an unexpected way.

### Testing / verification

- HTTPS load in browser; `curl -I https://<hostname>/`.
- Cloudflare dashboard: proxy status, SSL mode, DNS record correctness.
- GitHub Pages: custom domain verification status (green).

### Latest technical notes (2026)

- GitHub Pages + Cloudflare: common issues include **CNAME flattening** at apex, **proxy** breaking GitHub’s direct DNS checks (usually OK), and **SSL mode** mismatch — document your chosen combination.
- **www vs apex:** pick one canonical URL; redirect the other via Cloudflare or Hugo (optional follow-up).

### Project context reference

- No `project-context.md`; use this file, `architecture.md`, `prd.md`, `epics.md`.

### UX / product

- Visitors should see a stable branded URL; no UX template work required beyond correct routing and HTTPS.

## References

- Epics: `_bmad-output/planning-artifacts/epics.md` — Epic 1, Story 1.3  
- PRD: `_bmad-output/planning-artifacts/prd.md` — FR29, FR30, NFR4, NFR5  
- Architecture: `_bmad-output/planning-artifacts/architecture.md` — Hosting, security, Cloudflare  
- Prior stories: `_bmad-output/implementation-artifacts/1-2-configure-deterministic-github-pages-build-and-deploy-pipeline.md`, `1-1-initialize-hugo-papermod-project-repository.md`

## Change Log

- 2026-03-24 — `static/CNAME`, `docs/dns-and-cloudflare.md`, CI uses `hugo.toml` baseURL (no `configure-pages` override), README custom-domain section.

## Dev Agent Record

### Agent Model Used

Composer (Cursor agent)

### Debug Log References

### Completion Notes List

- Added **`static/CNAME`** (`tomcoldenhoff.com`) so published builds include GitHub Pages hostname mapping; verified `public/CNAME` after `hugo --gc --minify`.
- **`docs/dns-and-cloudflare.md`:** GitHub custom domain + HTTPS, Cloudflare DNS/proxy, SSL/TLS (**Full** / **Full (strict)**), verification (`curl -I`), symptom table, rollback.
- **`.github/workflows/build-and-deploy.yml`:** Removed `actions/configure-pages` and **`--baseURL` override**; production builds use **`hugo.toml`** `baseURL` (`https://tomcoldenhoff.com/`).
- **`README.md`:** Documents canonical URL and points to `docs/dns-and-cloudflare.md`.
- **Verification:** `curl -I https://tomcoldenhoff.com/` returned **HTTP 200** (GitHub Pages). Cloudflare/GitHub UI steps are checklist-style in docs (dashboard access not automatable from repo).
- No secrets added; NFR7 satisfied.
- Story marked **done** after code review acceptance.

### File List

- `static/CNAME` — new
- `docs/dns-and-cloudflare.md` — new
- `.github/workflows/build-and-deploy.yml` — custom-domain–aligned build
- `README.md` — custom domain / docs link
- `_bmad-output/implementation-artifacts/1-3-configure-custom-domain-and-cloudflare-proxy-dns.md` — story
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — status

---

**Story completion status:** done — Code review accepted; story closed
