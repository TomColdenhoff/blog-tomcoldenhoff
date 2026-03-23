# DNS, Cloudflare, and GitHub Pages (production)

This site uses **GitHub Pages** as origin and **Cloudflare** for DNS, proxy (orange cloud), and TLS at the edge. It implements Story 1.3 / FR29–FR30.

## Canonical URL

- **Apex:** `https://tomcoldenhoff.com/` (see root `hugo.toml` `baseURL`).
- **www:** not the canonical hostname in this repo; add a redirect in Cloudflare (Page Rule or Redirect Rules) if you also serve `www.tomcoldenhoff.com`.

## One-time: GitHub repository

1. **Settings → Pages → Custom domain** — enter `tomcoldenhoff.com` (and optionally `www.tomcoldenhoff.com` if you use it).
2. Enable **Enforce HTTPS** when GitHub allows it (after DNS validates).
3. The build copies `static/CNAME` into the published site so GitHub Pages keeps the hostname mapping across deploys.

No TLS private keys or API tokens belong in the repository.

## One-time: Cloudflare DNS

Use the [GitHub Pages IP addresses and hostname](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) that match your setup (apex vs `www`).

Typical patterns:

| Hostname            | Type   | Target / value                                      | Proxy        |
|---------------------|--------|-----------------------------------------------------|--------------|
| `tomcoldenhoff.com` | A      | GitHub’s documented A records for Pages (apex)      | **Proxied**  |
| `www` (optional)    | CNAME  | `<user>.github.io` or your Pages default hostname   | **Proxied**  |

**Orange cloud (proxied)** must be on for the production hostnames so Cloudflare edge features and later Web Analytics (Epic 5) behave as designed (FR30).

DNS propagation can take minutes to hours. Use `dig tomcoldenhoff.com +short` to confirm records.

## SSL/TLS mode (Cloudflare)

- Prefer **Full (strict)** when the origin presents a valid certificate (GitHub Pages does for `*.github.io` / custom domain).
- Use **Full** if you must accept the origin cert without full chain validation (less ideal).
- Avoid **Flexible** for this site: it terminates HTTPS only between the visitor and Cloudflare and can break correct HTTPS semantics to the origin.

Document any change here if you switch modes for troubleshooting.

## CI builds and `baseURL`

Production builds use **`hugo.toml` `baseURL`** (no `--baseURL` override in GitHub Actions) so absolute URLs in HTML, RSS, and sitemap match the custom domain.

## Verification

After DNS and GitHub show “Valid configuration”:

```bash
curl -I https://tomcoldenhoff.com/
```

Expect `HTTP/2 200` (or `HTTP/1.1 200`), `server` indicating GitHub/Fastly, and a valid certificate in the browser (no mixed-content warnings on normal pages).

## Failure modes (diagnosis)

| Symptom | Likely cause | What to check |
|--------|----------------|---------------|
| Browser: “DNS_PROBE_FINISHED_NXDOMAIN” | DNS missing/wrong | Cloudflare DNS records; `dig`; registrar nameservers pointed to Cloudflare |
| GitHub Pages: domain “DNS check failed” | Wrong A/CNAME or not propagated | Compare records to [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site); wait for TTL |
| **Grey cloud** (DNS only) | Proxy off | Turn **proxied** on for the site hostnames (orange cloud) |
| SSL errors / infinite redirect | Wrong SSL mode or HTTP/HTTPS loop | Cloudflare SSL/TLS mode; Page Rules; “Always Use HTTPS” vs GitHub “Enforce HTTPS” |
| Old content or 404 on apex | Wrong custom domain in repo or missing `CNAME` | Repo **Settings → Pages**; rebuild after `static/CNAME` exists |
| Certificate mismatch | Hostname not added in GitHub custom domains | Add exact hostname in GitHub Pages settings |

## Rollback / correction

1. **GitHub:** Temporarily clear or change **Custom domain** in **Settings → Pages** to restore default `*.github.io` behavior (then fix DNS and re-add).
2. **Cloudflare:** Switch affected records to **DNS only** (grey cloud) briefly to isolate proxy/TLS issues (not a long-term production posture).
3. **DNS:** Revert to last known-good A/CNAME values from this doc or your registrar history.
4. **Repo:** Re-deploy from `main` after fixing `hugo.toml` / `static/CNAME` if the published hostname changed.

After changes, re-run `curl -I` and confirm GitHub Pages shows a valid custom domain.
