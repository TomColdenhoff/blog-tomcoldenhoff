---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
inputDocuments:
  - /Users/tomcoldenhoff/Developer/tomcoldenhoff.com/_bmad-output/planning-artifacts/prd.md
  - /Users/tomcoldenhoff/Developer/tomcoldenhoff.com/_bmad-output/planning-artifacts/product-brief-tomcoldenhoff.com-2026-03-23.md
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-23'
project_name: 'tomcoldenhoff.com'
user_name: 'Tom'
date: '2026-03-23'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The product defines a focused but complete static publishing capability set (38 FRs) spanning authoring, taxonomy, delivery, discoverability, measurement, and operations.

Architecturally, these requirements imply:
- A clear content model with reusable post/page templates and strict frontmatter conventions.
- A deterministic static build/deploy pipeline with version-controlled content and configuration.
- Information architecture support for homepage listing, post detail, taxonomy, archives, and internal linking.
- SEO primitives as first-class outputs (meta, sitemap, robots, RSS, social tags), not post-launch add-ons.
- Operational loops for publish -> measure -> optimize content using analytics and search data.
- Baseline accessibility and responsive behavior embedded into theme/template and editorial standards.

Because this is a solo-operated system, architectural simplicity and repeatability matter more than feature breadth.

**Non-Functional Requirements:**
NFRs strongly shape architecture toward a low-runtime, static-first approach:
- Performance: mobile-friendly LCP target and cacheable static delivery.
- Security: HTTPS-only, Cloudflare security defaults, least-privilege repo/deployment access, no secrets in repo.
- Scalability: must absorb 10x traffic growth without app-server redesign.
- Accessibility: practical WCAG 2.1 AA baseline through semantic structure and content practices.
- Integration resilience: Cloudflare analytics, Search Console verification, and GitHub Pages deployment must remain stable through updates.

These NFRs favor minimal client-side scripting, strict configuration management, and validation checks in publishing workflows.

**Scale & Complexity:**
Scope is intentionally constrained to a content-first web platform with low system complexity and high quality expectations.

- Primary domain: Web static content publishing
- Complexity level: Low
- Estimated architectural components: 8-10 core components (content model, templates/layouts, taxonomy/navigation, SEO layer, build/deploy pipeline, domain/DNS/CDN edge config, analytics integration, quality/accessibility guardrails, operations playbooks)

### Technical Constraints & Dependencies

- Static-site architecture (Hugo + PaperMod) is a foundational technology constraint.
- Deployment dependency on GitHub Pages pipeline and repository workflows.
- Domain/traffic dependency on Cloudflare proxying to satisfy Cloudflare analytics requirement.
- SEO and discovery depend on correct metadata/frontmatter and crawlable route structure.
- Search Console visibility depends on persistent verification and sitemap/indexing hygiene.
- Publishing cadence and optimization loops depend on low operational overhead suitable for a solo owner.

### Cross-Cutting Concerns Identified

- **Content governance:** frontmatter consistency, slug/canonical stability, taxonomy hygiene.
- **SEO integrity:** metadata completeness, sitemap/RSS correctness, internal linking quality.
- **Operational reliability:** deterministic builds, recoverable deployment failures, repeatable release workflow.
- **Observability for decisions:** analytics/search data continuity to guide editorial prioritization.
- **Accessibility baseline:** semantic templates + editorial practices (headings, alt text, descriptive links).
- **Performance discipline:** preserve lightweight theme/config and avoid runtime bloat as scope grows.

## Starter Template Evaluation

### Primary Technology Domain

Web static content platform (Hugo-based MPA) based on project requirements analysis.

### Starter Options Considered

1) **Hugo CLI + PaperMod (recommended)**
- Directly matches PRD constraints (static, SEO-first, low-ops, GitHub Pages compatible).
- Minimal architectural overhead and strong maintainability for solo publishing.
- Mature docs and ecosystem for content-focused sites.

2) **Astro blog starter**
- Strong modern DX and content tooling, but introduces migration cost and diverges from explicit PRD stack direction.
- Better fit if future interactive UI complexity is expected to increase substantially.

3) **Next.js static export starter**
- Flexible and popular, but adds framework/runtime complexity beyond MVP needs.
- Overpowered for current static-content-first architecture goals.

### Selected Starter: Hugo CLI + PaperMod

**Rationale for Selection:**
This option is the closest fit to explicit product requirements: static generation, SEO-first structure, simple publishing workflow, low operational complexity, and compatibility with GitHub Pages + Cloudflare edge setup.

**Initialization Command:**

```bash
hugo new site tomcoldenhoff-com && cd tomcoldenhoff-com && git init && git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
Go-based static generation pipeline (no application server runtime required for content delivery).

**Styling Solution:**
PaperMod default styling and theme system, with optional Hugo asset pipeline customizations.

**Build Tooling:**
Hugo build pipeline with static output in `public/`, straightforward CI integration for GitHub Pages Actions deployment.

**Testing Framework:**
No mandatory app-level framework by default; quality gates can be added as lint/check scripts for markdown/frontmatter/link integrity.

**Code Organization:**
Standard Hugo content/layout archetype structure (`content/`, `layouts/`, `themes/`, `static/`, `config`), which aligns with predictable AI-agent implementation patterns.

**Development Experience:**
Fast local dev loop via `hugo server`, deterministic static builds, simple Git-based publishing workflow.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Content data architecture is file-based (Markdown + frontmatter in Git), with a strict frontmatter contract and CI validation gates.
- Infrastructure flow is GitHub Pages origin hosting with Cloudflare DNS/CDN proxy and GitHub Actions deployment on push to `main`.
- Security baseline is defined as no end-user auth for MVP, least-privilege repository access, no secrets in repo, and HTTPS/edge protection defaults.

**Important Decisions (Shape Architecture):**
- API/communication remains static-delivery-first with no custom runtime API in MVP.
- Frontend architecture keeps PaperMod as baseline with minimal layout overrides and no SPA-style global state layer.
- Operational quality standards include fail-fast CI for broken links/frontmatter/config and ongoing observability via Cloudflare analytics + Search Console.

**Deferred Decisions (Post-MVP):**
- Preview/staging environment model (deferred until collaboration/deployment complexity grows).
- Runtime API surface (REST/GraphQL) and application-level auth (deferred until interactive features require them).
- Advanced monitoring/log aggregation tooling beyond CI + analytics + Search Console (deferred for simplicity).

### Data Architecture

- **Primary data model:** Markdown files with structured frontmatter metadata under version control.
- **Schema strategy:** required fields include `title`, `date`, `slug`, `description`, `tags`, `categories`, `draft` (plus optional social/SEO fields).
- **Validation strategy:** CI must fail on missing required frontmatter, malformed metadata, and broken internal links.
- **Migration approach:** additive schema evolution with safe defaults so old content remains publishable.
- **Caching approach:** rely on static hosting and CDN edge caching (no app-layer cache subsystem).

### Authentication & Security

- **Authentication method:** none for end users in MVP (public read-only website).
- **Authorization pattern:** repository and deployment access controls with least privilege.
- **Secret handling:** no credentials in repository; use GitHub Actions secrets and provider dashboards only.
- **Transport/security controls:** HTTPS enforced, Cloudflare TLS and baseline edge protections enabled.
- **API security:** no custom API in MVP, so security focus remains on integration hygiene and deployment/access control.

### API & Communication Patterns

- **API design:** no custom REST/GraphQL API in MVP architecture.
- **Communication model:** build-time generation and static asset delivery only.
- **Third-party integrations:** Cloudflare Web Analytics and Google Search Console verification/sitemap workflows.
- **Error handling standard:** fail-fast CI checks for configuration, link integrity, and content schema validity.
- **Rate limiting:** delegated to Cloudflare edge protections; no app-level rate limiter required.

### Frontend Architecture

- **Component architecture:** PaperMod defaults first, with minimal targeted overrides in `layouts/`.
- **State management:** none at global app layer for MVP (non-SPA architecture).
- **Routing strategy:** Hugo static routing and permalink conventions derived from content structure.
- **Performance strategy:** constrained third-party scripts, optimized assets/images, and lightweight theme discipline.
- **Bundle strategy:** leverage Hugo/PaperMod defaults and periodic Lighthouse-style audits as guardrails.

### Infrastructure & Deployment

- **Hosting strategy:** GitHub Pages as origin with Cloudflare as DNS/CDN proxy.
- **CI/CD approach:** GitHub Actions pipeline on `main` with validation + build + deploy steps.
- **Environment model:** single production environment for MVP; preview environments optional later.
- **Monitoring/observability:** Cloudflare Web Analytics, Google Search Console, and CI status checks as core operational telemetry.
- **Scaling strategy:** static delivery + CDN caching for horizontal scale without server orchestration complexity.
- **Recovery strategy:** git-based rollback/revert and redeploy for rapid recovery from bad content/config changes.

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize Hugo + PaperMod repository structure.
2. Define/enforce frontmatter schema and content validation checks in CI.
3. Configure GitHub Actions build/deploy for GitHub Pages.
4. Connect custom domain and Cloudflare proxy/TLS settings.
5. Enable analytics and Search Console verification.
6. Add content templates and publish initial posts under defined conventions.

**Cross-Component Dependencies:**
- Frontmatter schema quality directly affects SEO, discoverability, and deployment reliability.
- CI validation depends on agreed naming/structure patterns and protects deployment integrity.
- Cloudflare proxy configuration is required for analytics expectations and edge security/performance posture.
- Deployment architecture and frontend architecture are tightly coupled through Hugo output conventions and theme override boundaries.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
10+ areas where AI agents could make different choices

### Naming Patterns

**Database Naming Conventions:**
No runtime database in MVP. Treat content metadata as canonical data model.

- Frontmatter fields: `snake_case` only where Hugo expects it; otherwise prefer existing Hugo/PaperMod conventions and keep keys consistent across all content.
- Required content keys: `title`, `date`, `slug`, `description`, `tags`, `categories`, `draft`.
- Taxonomy terms: lowercase, hyphen-separated (e.g., `ai-agents`, `startup-strategy`).
- Slugs: lowercase kebab-case, stable after publish.

**API Naming Conventions:**
No custom application API in MVP.

- External integration identifiers (Search Console verification keys, analytics IDs) stored in config/secrets using descriptive uppercase env naming when applicable (e.g., `CLOUDFLARE_ANALYTICS_TOKEN`).
- No ad-hoc endpoint definitions introduced in MVP stories.

**Code Naming Conventions:**
- Files and directories in content/layouts/static: kebab-case.
- Hugo template partials: descriptive kebab-case names in `layouts/partials/`.
- Config files use standard Hugo naming (`hugo.toml|yaml`, `config/_default/*` if split config is used).
- Variables/functions in custom scripts (if any): language-standard style, but filenames remain kebab-case.

### Structure Patterns

**Project Organization:**
- `content/` for all publishable pages/posts.
- `layouts/` only for intentional theme overrides.
- `themes/PaperMod/` remains vendored/upstream; do not edit upstream theme files directly.
- `static/` for static assets.
- `archetypes/` for content templates.
- `.github/workflows/` for CI/CD and validation workflows.

**File Structure Patterns:**
- Posts under `content/posts/` (or one agreed content section) with one canonical placement pattern.
- Images colocated predictably (either page bundles or a centralized static path); choose one pattern and enforce.
- Documentation/process notes in `docs/` when needed.
- Environment/config secrets never committed; runtime secrets only in provider secret stores.

### Format Patterns

**API Response Formats:**
No custom API response contract in MVP.

**Data Exchange Formats:**
- Dates in frontmatter: ISO-like date strings compatible with Hugo (`YYYY-MM-DD` minimum).
- Boolean flags as true booleans (`true/false`), not string/number proxies.
- Tags/categories as arrays, not comma-separated strings.
- Canonical URL-related fields must be explicit and stable when used.

### Communication Patterns

**Event System Patterns:**
No internal event bus in MVP.

- CI workflow events are the canonical automation triggers.
- Workflow names should be explicit and stable (`build-and-deploy`, `content-validation`).

**State Management Patterns:**
No client-side app state layer in MVP.

- “State” is repository state + generated static output.
- Any script-generated artifacts must be deterministic from repo state.

### Process Patterns

**Error Handling Patterns:**
- Fail fast in CI for:
  - missing required frontmatter
  - invalid frontmatter types
  - broken internal links
  - invalid Hugo config/build failures
- Error output format should identify file path + rule + remediation hint.
- User-facing site failures should default to safe static behavior (no partial dynamic runtime failures).

**Loading State Patterns:**
No runtime loading-state framework required for MVP static pages.

- If optional client widgets are added later, they must degrade gracefully and not block core content rendering.

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow the agreed content schema and naming conventions exactly.
- Place files only in approved directories and avoid introducing parallel structures.
- Treat theme customization as override-first (`layouts/`) and avoid direct edits to upstream theme source.
- Add or update CI validation whenever introducing new content conventions.
- Preserve URL/slug stability for published content unless an explicit redirect plan exists.

**Pattern Enforcement:**
- CI checks are mandatory gates on pull/push before deployment.
- Pattern violations are logged in CI output and fixed in the same change set.
- Pattern updates require architecture doc update before implementation divergence.

### Pattern Examples

**Good Examples:**
- `content/posts/practical-ai-roadmap.md` with complete required frontmatter.
- taxonomy term `founder-ops` used consistently in tags/categories.
- override added at `layouts/partials/head.html` rather than editing `themes/PaperMod/...`.
- CI job fails with: `content/posts/x.md: missing required field 'description'`.

**Anti-Patterns:**
- Mixed slug styles (`MyPost`, `my_post`, `my-post`) across published posts.
- Editing theme vendor files directly in `themes/PaperMod/`.
- Introducing `content/blog/` and `content/posts/` simultaneously without a defined convention.
- Bypassing CI validation for content that later breaks deployment.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
tomcoldenhoff-com/
├── README.md
├── LICENSE
├── .gitignore
├── .editorconfig
├── .markdownlint.json
├── hugo.toml
├── netlify.toml                     # optional; keep only if future host migration is needed
├── .github/
│   └── workflows/
│       ├── build-and-deploy.yml
│       └── content-validation.yml
├── archetypes/
│   └── post.md
├── content/
│   ├── about.md
│   ├── posts/
│   │   ├── first-post.md
│   │   └── _index.md
│   ├── entrepreneurship/
│   │   └── _index.md
│   ├── ai/
│   │   └── _index.md
│   ├── software/
│   │   └── _index.md
│   └── science/
│       └── _index.md
├── data/
│   └── site/
│       └── navigation.yaml
├── layouts/
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── list.html
│   │   └── single.html
│   ├── partials/
│   │   ├── head-custom.html
│   │   ├── analytics.html
│   │   └── seo-meta.html
│   ├── shortcodes/
│   │   └── callout.html
│   └── posts/
│       └── single.html
├── static/
│   ├── images/
│   │   ├── og/
│   │   └── posts/
│   ├── icons/
│   ├── robots.txt
│   └── favicon.ico
├── assets/
│   ├── css/
│   │   └── custom.css
│   └── js/
│       └── analytics-init.js
├── themes/
│   └── PaperMod/                    # git submodule; do not edit directly
├── scripts/
│   ├── validate-frontmatter.mjs
│   ├── check-links.mjs
│   └── generate-og-fallback.mjs
├── docs/
│   ├── content-style-guide.md
│   ├── publishing-checklist.md
│   └── architecture-notes.md
└── public/                          # generated build output (gitignored)
```

### Architectural Boundaries

**API Boundaries:**
- No custom runtime API in MVP.
- External interfaces limited to:
  - GitHub Actions to GitHub Pages deployment
  - Cloudflare proxy + Web Analytics
  - Google Search Console verification/sitemap ingestion

**Component Boundaries:**
- Content boundary: all editorial data in `content/` + frontmatter contract.
- Presentation boundary: rendering and UI in `layouts/` overrides and theme templates.
- Theme boundary: upstream `themes/PaperMod/` treated as vendor dependency only.

**Service Boundaries:**
- Build service: Hugo CLI in CI/local.
- Validation service: `scripts/` checks run in CI pre-deploy.
- Delivery service: GitHub Pages origin + Cloudflare edge.

**Data Boundaries:**
- Source-of-truth data is markdown/frontmatter in git.
- Generated output confined to `public/`.
- Analytics/search telemetry consumed externally; not stored as app runtime data.

### Requirements to Structure Mapping

**Feature/Epic Mapping:**
- Content Management & Publishing -> `content/`, `archetypes/`, `docs/publishing-checklist.md`
- Site Experience & Discovery -> `layouts/_default/`, `layouts/posts/`, taxonomy sections in `content/*/_index.md`
- SEO & Distribution -> `layouts/partials/seo-meta.html`, `static/robots.txt`, Hugo sitemap/RSS config in `hugo.toml`
- Analytics & Insights -> `layouts/partials/analytics.html`, Cloudflare/Search Console setup docs in `docs/`
- Deployment & Operations -> `.github/workflows/`, `scripts/`, root config files
- Accessibility & Quality Baseline -> theme/layout templates + content standards in `docs/content-style-guide.md`

**Cross-Cutting Concerns:**
- Frontmatter schema governance -> `scripts/validate-frontmatter.mjs` + CI
- Link integrity -> `scripts/check-links.mjs` + CI
- URL/slug stability -> `content/posts/*` conventions + publishing checklist
- Performance guardrails -> lightweight assets in `assets/`, override discipline in `layouts/`

### Integration Points

**Internal Communication:**
- Content files feed Hugo renderer.
- Layout partials compose page rendering.
- Validation scripts gate commits/deploys in CI workflows.

**External Integrations:**
- Cloudflare Web Analytics script injection/partial.
- Google Search Console verification/meta/sitemap workflows.
- GitHub Pages deployment action.

**Data Flow:**
1. Author writes markdown in `content/posts/`.
2. CI runs schema/link/build checks.
3. Hugo builds static output to `public/`.
4. GitHub Pages serves origin.
5. Cloudflare caches/serves edge and collects analytics.
6. Search engines consume sitemap/metadata.

### File Organization Patterns

**Configuration Files:**
- Root-level Hugo and repository configs.
- CI workflow YAMLs in `.github/workflows/`.
- No secrets committed; use GitHub/Cloudflare secret stores.

**Source Organization:**
- Content in `content/`, presentation in `layouts/`, static files in `static/`, optional pipeline assets in `assets/`.

**Test Organization:**
- Validation as script-based checks in `scripts/` executed by CI (instead of app test framework for MVP).

**Asset Organization:**
- Static media in `static/images/...`.
- Optional transformable assets in `assets/`.
- OG image fallbacks generated via script where needed.

### Development Workflow Integration

**Development Server Structure:**
- Local editing in `content/` + `layouts/`.
- `hugo server` for live preview.

**Build Process Structure:**
- `scripts/*` validations run first.
- Hugo compile generates deterministic static output.

**Deployment Structure:**
- Push to `main` triggers workflow.
- Successful validation/build deploys to GitHub Pages.
- Cloudflare remains proxy/CDN/security/analytics layer.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All core decisions are compatible. The selected stack (Hugo + PaperMod + GitHub Pages + Cloudflare) aligns with static-first constraints, SEO requirements, and low-ops goals. No contradictory runtime architecture choices were identified.

**Pattern Consistency:**
Implementation patterns support architectural decisions. Naming, structure, and process rules reinforce deterministic builds, schema consistency, and deployment reliability.

**Structure Alignment:**
The defined project structure supports all major decisions, including clear boundaries for content, presentation, CI validation, and deployment/integration touchpoints.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
No epics file was provided; coverage was validated against FR categories from the PRD and mapped into explicit directories/components in the structure section.

**Functional Requirements Coverage:**
All major FR categories are represented:
- content authoring/publishing
- discovery/navigation/taxonomy
- SEO/distribution artifacts
- analytics and insight loops
- deployment/operations
- accessibility baseline

**Non-Functional Requirements Coverage:**
- Performance: static generation + CDN edge caching + minimal JS discipline
- Security: HTTPS, least privilege, no repo secrets, Cloudflare edge protections
- Scalability: static architecture supports traffic growth without server redesign
- Accessibility: semantic structure + editorial/accessibility guidance
- Integration resilience: Cloudflare/Search Console/GitHub Pages integration paths defined

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical decisions are documented with clear rationale and boundaries. Version-specific runtime dependencies are minimal due to static architecture and starter constraints.

**Structure Completeness:**
Project tree is concrete and implementation-oriented, with CI, content, layout overrides, assets, scripts, and docs locations specified.

**Pattern Completeness:**
Major conflict vectors between AI agents are covered (naming, placement, validation, override policy, workflow conventions).

### Gap Analysis Results

**Critical Gaps:** None identified.

**Important Gaps:**
1. CI rule contract should be explicitly listed (required frontmatter keys, allowed types, link-check scope, failure thresholds).
2. URL change governance should include explicit redirect/canonical policy for slug changes.
3. Optional hosting artifacts should be clarified to avoid implementation ambiguity (`netlify.toml` optional but out-of-path for MVP).

**Nice-to-Have Gaps:**
- Add a compact "definition of done" checklist for each content publish.
- Add sample frontmatter schema file/example to accelerate consistent implementation.
- Add lightweight rollback runbook for failed deploys.

### Validation Issues Addressed

No blocking issues found. Important gaps are documented for refinement in implementation planning or first setup stories.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Strong alignment between requirements and architectural constraints
- Low-complexity architecture that matches solo-operator goals
- Clear AI-agent consistency guardrails
- Concrete structure-to-requirement mapping

**Areas for Future Enhancement:**
- Tighten CI validation contract details
- Formalize redirect policy for slug changes
- Add richer operational runbooks as scope expands

### Implementation Handoff

**AI Agent Guidelines:**
- Follow architectural decisions exactly as documented
- Apply consistency patterns before introducing new conventions
- Respect structure boundaries and theme override policy
- Update architecture documentation before introducing architectural divergence
- For user-facing surfaces, treat the lightweight UX specification (`ux-design.md` in planning artifacts) as the companion to PRD for navigation, responsive behavior, and interaction/accessibility patterns unless superseded by an updated UX doc.

**First Implementation Priority:**
Initialize repository with Hugo + PaperMod, then implement CI validation gates before content scale-out.
