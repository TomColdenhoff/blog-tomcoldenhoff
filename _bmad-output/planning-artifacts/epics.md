---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
inputDocuments:
  - /Users/tomcoldenhoff/Developer/tomcoldenhoff.com/_bmad-output/planning-artifacts/prd.md
  - /Users/tomcoldenhoff/Developer/tomcoldenhoff.com/_bmad-output/planning-artifacts/architecture.md
  - /Users/tomcoldenhoff/Developer/tomcoldenhoff.com/_bmad-output/planning-artifacts/ux-design.md
---

# tomcoldenhoff.com - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for tomcoldenhoff.com, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Publisher can create blog posts in Markdown with structured frontmatter metadata.  
FR2: Publisher can edit and update existing posts while preserving canonical URLs.  
FR3: Publisher can publish posts through a Git-based workflow that triggers site deployment.  
FR4: Publisher can organize posts by categories and tags aligned to key topics.  
FR5: Publisher can mark posts as draft or published.  
FR6: Publisher can maintain an About page as core static content.  
FR7: Publisher can maintain reusable content templates for consistent article structure.  
FR8: Visitors can browse a homepage that lists recent and/or featured posts.  
FR9: Visitors can open individual post pages with readable long-form formatting.  
FR10: Visitors can navigate posts by category/tag taxonomy.  
FR11: Visitors can access archive-style browsing of older content.  
FR12: Visitors can move between related posts using internal linking.  
FR13: Visitors can access all key pages and content on mobile and desktop browsers.  
FR14: Visitors can discover core site sections through clear navigation.  
FR15: Visitors can consume content without account creation.  
FR16: System can generate unique title and description metadata for each page/post.  
FR17: System can expose crawlable URLs for all public pages/posts.  
FR18: System can generate and publish XML sitemap output.  
FR19: System can generate and publish RSS feed output.  
FR20: System can provide robots directives for search crawlers.  
FR21: System can expose social sharing metadata (Open Graph and equivalent social tags).  
FR22: Publisher can connect and verify the property in Google Search Console.  
FR23: System can integrate Cloudflare Web Analytics for production traffic measurement.  
FR24: Publisher can verify Cloudflare analytics collection is active after deployment.  
FR25: Publisher can view top pages, referrers, and visit trends for published content.  
FR26: Publisher can use analytics insights to prioritize content updates and future topics.  
FR27: Publisher can correlate Cloudflare analytics trends with Search Console signals.  
FR28: System can build and deploy static output to GitHub Pages from repository changes.  
FR29: System can support custom domain configuration for production site hosting.  
FR30: System can support Cloudflare-proxied DNS configuration for analytics enablement.  
FR31: Publisher can recover from failed deployments by correcting content/config and redeploying.  
FR32: Publisher can maintain a low-ops publishing cycle suitable for a solo owner.  
FR33: System can keep content and site configuration under version control.  
FR34: Visitors can navigate core content using keyboard-accessible interactions.  
FR35: System can present semantic heading/content structure across pages/posts.  
FR36: Publisher can provide alt text for meaningful images.  
FR37: System can present content with sufficient visual contrast using theme defaults/config.  
FR38: Visitors can access readable typography and spacing across common viewport sizes.

### NonFunctional Requirements

NFR1: Public pages shall meet an LCP target of <= 2.5s on typical mobile connections for home and post templates.  
NFR2: Public content shall be delivered through cacheable static assets to maintain low-latency global access.  
NFR3: Content-only build and deploy cycles should complete in <= 10 minutes under normal update conditions.  
NFR4: Production traffic shall be served exclusively over HTTPS.  
NFR5: Production DNS/CDN configuration shall apply Cloudflare security defaults suitable for a public content site.  
NFR6: Repository and deployment access shall follow least-privilege access practices.  
NFR7: No credentials, tokens, or secrets shall be committed to the content repository.  
NFR8: The platform shall support at least 10x traffic growth from baseline without application-server architecture changes.  
NFR9: Information architecture and taxonomy shall remain usable with at least several hundred published posts.  
NFR10: Core pages shall meet a practical WCAG 2.1 AA baseline for semantic structure, keyboard access, contrast, and alt text usage.  
NFR11: Newly published content shall follow accessibility-friendly formatting standards (heading hierarchy, descriptive links, image descriptions).  
NFR12: Cloudflare Web Analytics integration shall remain operational across content, template, and deployment updates.  
NFR13: Google Search Console verification and indexing visibility shall be maintained in production.  
NFR14: GitHub Pages deployment integration shall produce deterministic, repeatable build outputs from repository state.

### Additional Requirements

- Starter template requirement: initialize project using Hugo CLI + PaperMod as the first implementation story; architecture explicitly selects this stack and provides initialization command.
- Infrastructure must use GitHub Pages as origin with Cloudflare as DNS/CDN proxy layer.
- CI/CD must run validation + build + deploy on push to `main` via GitHub Actions.
- Data model must be Markdown + structured frontmatter with required fields (`title`, `date`, `slug`, `description`, `tags`, `categories`, `draft`).
- CI validation must fail fast for missing required frontmatter, invalid metadata types, broken internal links, and invalid Hugo config/build failures.
- Theme customization must be override-first in `layouts/`; avoid direct edits to vendored `themes/PaperMod`.
- URL and slug stability must be preserved for published content unless explicit redirect/canonical strategy is defined.
- Integration requirements include Cloudflare Web Analytics and Google Search Console verification + sitemap/indexing workflow continuity.
- Security implementation constraints include no credentials in repo, GitHub Actions secrets/provider dashboards only, HTTPS/TLS enforcement, least-privilege repository/deployment access.
- Deployment recovery must support git-based rollback/revert and redeploy flow.
- Content and taxonomy conventions require lowercase, hyphenated taxonomy terms and stable kebab-case slugs.
- Monitoring/observability baseline is Cloudflare analytics + Search Console + CI status checks for operational telemetry.
- Build/runtime architecture must remain static-delivery-first with no custom runtime API in MVP.
- Architecture notes important implementation clarifications: define CI rule contract details, define slug-change redirect policy, and keep optional hosting artifacts (e.g., `netlify.toml`) out of MVP critical path.

### UX Design Requirements

Companion UX specification: `ux-design.md` (lightweight IA, navigation, responsive behavior, and accessibility interaction patterns). Story-level UX-DR items may be added there as implementation detail is refined.

### FR Coverage Map

FR1: Epic 2 - Markdown post authoring with required frontmatter
FR2: Epic 2 - Post updates while preserving canonical URLs
FR3: Epic 1 - Git-based publishing workflow trigger
FR4: Epic 2 - Category and tag organization
FR5: Epic 2 - Draft and published state management
FR6: Epic 2 - About page maintenance
FR7: Epic 2 - Reusable content template management
FR8: Epic 3 - Homepage listing for recent/featured posts
FR9: Epic 3 - Readable long-form post page experience
FR10: Epic 3 - Taxonomy navigation by category/tag
FR11: Epic 3 - Archive browsing for older content
FR12: Epic 3 - Related content internal linking
FR13: Epic 3 - Cross-device access on mobile and desktop
FR14: Epic 3 - Clear global/site navigation
FR15: Epic 3 - Public content consumption without accounts
FR16: Epic 4 - Unique page/post title and description metadata
FR17: Epic 4 - Crawlable public URL exposure
FR18: Epic 4 - XML sitemap generation and publication
FR19: Epic 4 - RSS feed generation and publication
FR20: Epic 4 - Robots directives for crawlers
FR21: Epic 4 - Open Graph/social metadata output
FR22: Epic 4 - Google Search Console connection and verification
FR23: Epic 5 - Cloudflare Web Analytics integration
FR24: Epic 5 - Verification of active analytics collection
FR25: Epic 5 - Top pages/referrers/visit trend visibility
FR26: Epic 5 - Analytics-driven content prioritization
FR27: Epic 5 - Correlation of analytics with Search Console signals
FR28: Epic 1 - GitHub Pages static build and deployment
FR29: Epic 1 - Custom domain configuration support
FR30: Epic 1 - Cloudflare-proxied DNS support
FR31: Epic 1 - Recovery path for failed deployments
FR32: Epic 1 - Low-ops solo publishing workflow
FR33: Epic 1 - Version control for content and configuration
FR34: Epic 6 - Keyboard-accessible core content interactions
FR35: Epic 6 - Semantic heading/content structure across pages
FR36: Epic 6 - Alt text support for meaningful images
FR37: Epic 6 - Sufficient visual contrast via theme/config
FR38: Epic 3 - Readable typography and spacing at common viewports

## Epic List

### Epic 1: Launch the Publishing Foundation
Enable Tom to initialize, configure, and reliably deploy the Hugo + PaperMod site so the platform is live, secure, versioned, and operationally recoverable.
**FRs covered:** FR3, FR28, FR29, FR30, FR31, FR32, FR33

### Epic 2: Publish and Manage High-Quality Content
Enable Tom to create, edit, structure, and maintain reusable content with consistent metadata and taxonomy so publishing is fast and repeatable.
**FRs covered:** FR1, FR2, FR4, FR5, FR6, FR7

### Epic 3: Deliver Reader Discovery and Reading Experience
Enable visitors to discover, navigate, and consume content smoothly across devices through clear information architecture and readable presentation.
**FRs covered:** FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR38

### Epic 4: Achieve Search Visibility and Distribution Readiness
Enable content to be indexed, shareable, and discoverable through complete SEO and crawler/social metadata outputs.
**FRs covered:** FR16, FR17, FR18, FR19, FR20, FR21, FR22

### Epic 5: Close the Measurement and Optimization Loop
Enable Tom to measure performance and search outcomes, then use those insights to improve content strategy over time.
**FRs covered:** FR23, FR24, FR25, FR26, FR27

### Epic 6: Enforce Accessibility and Quality Baselines
Enable all users to access content inclusively while ensuring long-term quality standards are preserved in templates and publishing.
**FRs covered:** FR34, FR35, FR36, FR37

## Epic 1: Launch the Publishing Foundation

Enable Tom to initialize, configure, and reliably deploy the Hugo + PaperMod site so the platform is live, secure, versioned, and operationally recoverable.

### Story 1.1: Initialize Hugo + PaperMod Project Repository

As a solo publisher,
I want a Hugo site initialized with PaperMod and version control,
So that I can start publishing from a stable, architecture-aligned baseline.

**Implements:** FR33

**Acceptance Criteria:**

**Given** a new repository
**When** the setup workflow is executed
**Then** a Hugo site with PaperMod is initialized using the selected starter approach
**And** the project structure includes core directories/config needed for content, layouts, static assets, and theme usage

**Given** the baseline repository state
**When** initial files are committed
**Then** baseline site/config files are tracked in version control
**And** no credentials, tokens, or secrets are committed

### Story 1.2: Configure Deterministic GitHub Pages Build and Deploy Pipeline

As a solo publisher,
I want repository changes to trigger deterministic static build and deployment to GitHub Pages,
So that publishing is repeatable and reliable.

**Implements:** FR3, FR28

**Acceptance Criteria:**

**Given** a commit to `main`
**When** CI runs
**Then** validation and build steps execute before deploy
**And** deployment is blocked if validation/build fails

**Given** a successful pipeline run
**When** deployment completes
**Then** static output is published to GitHub Pages
**And** CI output clearly indicates pass/fail outcomes for validation and build steps

**Given** the workflow configuration is invalid or a required CI step errors
**When** the pipeline runs
**Then** deploy is skipped
**And** failure output identifies the failed step with a remediation hint

### Story 1.3: Configure Custom Domain and Cloudflare-Proxy DNS

As a site owner,
I want production traffic routed through a custom domain and Cloudflare proxy,
So that the site is reachable on a branded domain with edge capabilities and secure transport.

**Implements:** FR29, FR30

**Acceptance Criteria:**

**Given** domain ownership and DNS access
**When** GitHub Pages domain settings and Cloudflare DNS are configured
**Then** the site resolves correctly on the custom production domain
**And** Cloudflare proxy is active for the production hostname

**Given** production traffic reaches the site
**When** users access the domain
**Then** requests are served via HTTPS
**And** TLS and edge protections align with baseline architecture expectations

**Given** DNS records, proxy mode, or TLS settings are misconfigured
**When** users or monitoring checks hit the production hostname
**Then** the failure mode is diagnosable (e.g., wrong proxy, certificate, or resolution)
**And** documented rollback or correction steps restore HTTPS and correct routing

### Story 1.4: Add Deployment Recovery and Low-Ops Publishing Runbook

As a solo publisher,
I want a simple documented recovery workflow for failed deployments,
So that I can quickly restore service without high operational burden.

**Implements:** FR31, FR32

**Acceptance Criteria:**

**Given** a failed deployment caused by content or configuration changes
**When** I apply a fix or revert and trigger redeploy
**Then** the site returns to a healthy deployed state
**And** recovery can be completed without introducing ad hoc manual steps

**Given** routine publishing operations
**When** I follow the documented checklist
**Then** the workflow remains low-ops and repeatable for a solo owner
**And** rollback/redeploy guidance is available in concise runbook form

**Given** a partial or ambiguous failure (e.g., site up but wrong branch or stale assets)
**When** the runbook troubleshooting path is followed
**Then** the publisher can determine whether to fix forward or revert
**And** a successful redeploy restores expected public behavior

## Epic 2: Publish and Manage High-Quality Content

Enable Tom to create, edit, structure, and maintain reusable content with consistent metadata and taxonomy so publishing is fast and repeatable.

### Story 2.1: Create Standard Post Archetype With Required Frontmatter

As a solo publisher,
I want a reusable post template with required metadata fields,
So that every new post starts with consistent, valid structure.

**Implements:** FR1, FR7

**Acceptance Criteria:**

**Given** a new post is created
**When** the archetype/template is used
**Then** required frontmatter fields are pre-populated (`title`, `date`, `slug`, `description`, `tags`, `categories`, `draft`)
**And** field formats align with agreed conventions including date format, arrays for tags/categories, and boolean draft state

**Given** the template is used for authoring
**When** a draft is prepared for publication
**Then** template guidance supports consistent article structure and readability
**And** content remains compatible with validation and build expectations

### Story 2.2: Publish Draft and Final Posts Through Content Workflow

As a solo publisher,
I want to manage draft versus published states for posts,
So that I can stage content safely before release.

**Implements:** FR5

**Acceptance Criteria:**

**Given** a post is marked as draft
**When** production build and deploy run
**Then** draft content is excluded from public output
**And** draft items are not exposed in public listing and routing

**Given** draft state is switched to published
**When** deployment completes successfully
**Then** the post appears in public pages and listings
**And** the Git-based editorial workflow preserves predictable release behavior

**Given** frontmatter or build configuration is invalid for a post marked published
**When** production build or deploy runs
**Then** the pipeline fails or blocks publish per agreed policy
**And** the publisher receives a clear error pointing to the offending file or field

### Story 2.3: Edit Existing Posts While Preserving URL and Canonical Stability

As a solo publisher,
I want to update existing posts without breaking discoverability,
So that historical links and search equity remain intact.

**Implements:** FR2

**Acceptance Criteria:**

**Given** an existing published post
**When** content is updated and redeployed
**Then** edits are reflected publicly without changing canonical URL by default
**And** slug and canonical values remain stable unless explicitly changed through controlled process

**Given** update operations over time
**When** changes are committed to version control
**Then** revision history remains traceable for rollback and audit
**And** updates do not introduce hidden URL-breaking side effects

**Given** a slug or permalink change is attempted without an agreed redirect or canonical policy
**When** the change is reviewed against publishing standards
**Then** the change is blocked or requires explicit documented exception
**And** published URLs do not silently break external links without mitigation

### Story 2.4: Implement Taxonomy Conventions for Categories and Tags

As a solo publisher,
I want predictable category and tag organization,
So that content remains navigable and scalable as the post library grows.

**Implements:** FR4

**Acceptance Criteria:**

**Given** taxonomy metadata is authored in posts
**When** categories and tags are defined
**Then** terms follow lowercase hyphenated conventions
**And** taxonomy metadata format remains consistent across content

**Given** taxonomy assignments exist on published posts
**When** users browse taxonomy pages
**Then** category and tag listings render correctly
**And** taxonomy supports core topic pillars across entrepreneurship, AI, software, and science content

### Story 2.5: Maintain Core Static About Page and Authoring Baseline

As a solo publisher,
I want a maintained About page and clear baseline authoring standards,
So that visitors understand site context and content quality stays consistent.

**Implements:** FR6

**Acceptance Criteria:**

**Given** baseline site content is being prepared
**When** the About page is created or updated
**Then** it is published as a core static page
**And** it follows metadata and accessibility expectations aligned with other key pages

**Given** ongoing content operations
**When** publishing checklists or guidance are referenced
**Then** authoring standards remain repeatable and low-friction
**And** contributors can follow the same process for consistent output quality

## Epic 3: Deliver Reader Discovery and Reading Experience

Enable visitors to discover, navigate, and consume content smoothly across devices through clear information architecture and readable presentation.

### Story 3.1: Build Homepage and Core Navigation Experience

As a site visitor,
I want to quickly understand and navigate the site from the homepage,
So that I can discover relevant content with minimal friction.

**Implements:** FR8, FR14, FR15

**Acceptance Criteria:**

**Given** a visitor lands on the homepage
**When** the page loads
**Then** recent and/or featured posts are clearly listed
**And** core site sections are discoverable through clear navigation

**Given** a visitor accesses public site routes
**When** they browse pages and posts
**Then** no account creation or login is required
**And** public access behavior is consistent across core content surfaces

### Story 3.2: Implement Readable Post Page Layout for Long-Form Content

As a reader,
I want individual posts to be easy to read on desktop and mobile,
So that I can consume long-form insights comfortably.

**Implements:** FR9, FR38

**Acceptance Criteria:**

**Given** a visitor opens an individual post page
**When** content renders
**Then** typography and spacing support long-form readability
**And** layout remains legible at common viewport widths

**Given** post content includes structured headings and sections
**When** users scan or read through the article
**Then** semantic structure supports clear content hierarchy
**And** reading flow remains consistent across devices

### Story 3.3: Enable Taxonomy and Archive Browsing Flows

As a reader,
I want to browse posts by topic and by time,
So that I can explore the content library efficiently.

**Implements:** FR10, FR11

**Acceptance Criteria:**

**Given** posts include category and tag metadata
**When** users access taxonomy pages
**Then** content is listed correctly by category and tag
**And** taxonomy routes remain navigable from core UI paths

**Given** older posts exist
**When** users access archive-style views
**Then** previously published content is discoverable in coherent order
**And** transitions between archive/list and post detail pages remain intuitive

### Story 3.4: Add Internal Related-Content Navigation Between Posts

As a reader,
I want links to related posts while reading,
So that I can continue learning across connected topics.

**Implements:** FR12

**Acceptance Criteria:**

**Given** a user is reading a published post
**When** related or contextual internal links are available
**Then** links are visible and understandable within the reading experience
**And** linked routes resolve correctly without broken navigation paths

**Given** topic clusters evolve over time
**When** internal links are maintained in content updates
**Then** readers can progress through connected posts naturally
**And** linking supports deeper discovery across core themes

### Story 3.5: Validate Cross-Browser and Responsive Access Baseline

As a visitor,
I want a consistent content experience across common browsers and devices,
So that I can reliably use the site regardless of platform.

**Implements:** FR13

**Acceptance Criteria:**

**Given** latest stable versions of major evergreen browsers on desktop and mobile
**When** users load homepage, post, taxonomy, and about pages
**Then** core rendering and navigation are functional
**And** content remains readable without browser-specific breakage

**Given** touch and keyboard interactions on supported devices
**When** users navigate core content flows
**Then** primary interactions remain usable
**And** responsive behavior preserves readability and navigation clarity

## Epic 4: Achieve Search Visibility and Distribution Readiness

Enable content to be indexed, shareable, and discoverable through complete SEO and crawler/social metadata outputs.

### Story 4.1: Implement Page and Post Metadata Model for SEO and Social

As a publisher,
I want each page and post to output unique SEO and social metadata,
So that search engines and social platforms understand and represent content correctly.

**Implements:** FR16, FR21

**Acceptance Criteria:**

**Given** any public page or post
**When** it is rendered
**Then** unique title and description metadata are present
**And** Open Graph and social metadata are included in rendered output

**Given** site metadata configuration and content frontmatter
**When** pages are generated
**Then** metadata values are derived consistently from configured sources
**And** no manual per-build metadata patching is required

### Story 4.2: Ensure Crawlable Public URL and Canonical Routing Hygiene

As a publisher,
I want all public content routes to be crawlable and stable,
So that indexing quality and discoverability are preserved.

**Implements:** FR17

**Acceptance Criteria:**

**Given** public pages and posts are deployed
**When** crawlers request content URLs
**Then** routes are publicly accessible and crawlable
**And** URL patterns remain consistent with permalink and slug conventions

**Given** canonical URL settings for content
**When** pages are served to crawlers and users
**Then** canonical behavior avoids duplicate-content ambiguity
**And** default update flows do not unintentionally alter canonical paths

**Given** a public URL returns a non-200 or is excluded from build output unexpectedly
**When** crawl or smoke checks run
**Then** the issue is detectable before treating the release as SEO-complete
**And** remediation targets the specific route or build exclusion cause

### Story 4.3: Generate and Publish XML Sitemap and RSS Feed

As a publisher,
I want sitemap and RSS outputs generated automatically,
So that search engines and subscribers can discover new and updated content efficiently.

**Implements:** FR18, FR19

**Acceptance Criteria:**

**Given** a successful build and deploy
**When** site artifacts are published
**Then** an XML sitemap is available and valid
**And** an RSS feed is available with currently published content

**Given** ongoing publishing updates
**When** new content is released
**Then** sitemap and RSS outputs update automatically
**And** no manual regeneration steps are required

**Given** the build succeeds but sitemap or RSS is malformed or empty when content exists
**When** automated validation runs
**Then** the pipeline fails or blocks deploy per policy
**And** logs identify whether Hugo config, content scope, or output path is wrong

### Story 4.4: Configure Robots Directives for Search Crawlers

As a publisher,
I want explicit robots directives for crawlers,
So that indexing behavior is intentional and aligned with public content strategy.

**Implements:** FR20

**Acceptance Criteria:**

**Given** production site output
**When** crawlers request robots directives
**Then** robots configuration is publicly available
**And** directives allow discovery of intended public content

**Given** deployment and content updates
**When** site is rebuilt and redeployed
**Then** robots behavior remains consistent
**And** key pages are not accidentally blocked

**Given** robots configuration would block core public routes
**When** pre-deploy checks compare robots rules against an allowlist of required paths
**Then** the deploy is blocked or flagged
**And** the publisher corrects rules before release

### Story 4.5: Connect and Verify Google Search Console Property

As a publisher,
I want Search Console connected and verified,
So that I can monitor indexing and search performance from launch onward.

**Implements:** FR22

**Acceptance Criteria:**

**Given** production domain is live
**When** Search Console verification is configured
**Then** property verification succeeds
**And** indexing visibility can be monitored from the verified property

**Given** sitemap availability in production
**When** Search Console ingestion workflows are executed
**Then** sitemap is submitted or discoverable in Search Console
**And** the setup supports ongoing monitoring after future deploys

**Given** verification token or DNS verification is misconfigured
**When** Search Console verification is attempted
**Then** failure is diagnosable with documented retry steps
**And** production deploy is not falsely marked SEO-complete until verification succeeds or an explicit exception is recorded

## Epic 5: Close the Measurement and Optimization Loop

Enable Tom to measure performance and search outcomes, then use those insights to improve content strategy over time.

### Story 5.1: Integrate Cloudflare Web Analytics in Production

As a publisher,
I want Cloudflare Web Analytics integrated into the production site,
So that I can measure real traffic behavior with minimal overhead.

**Implements:** FR23

**Acceptance Criteria:**

**Given** production traffic is served through Cloudflare proxy
**When** analytics integration is configured in site output
**Then** Cloudflare analytics data collection begins for public page views
**And** integration remains compatible with static-site rendering patterns

**Given** analytics is enabled
**When** users browse core pages and posts
**Then** telemetry is captured without introducing unnecessary runtime complexity
**And** integration does not require account-gated user flows

**Given** Cloudflare proxy is off or analytics snippet is missing or blocked
**When** post-deploy verification runs
**Then** missing collection is detected before marking analytics complete
**And** remediation steps reference DNS/proxy and template injection checks

### Story 5.2: Verify Analytics Collection After Deployment Changes

As a publisher,
I want to verify analytics collection remains active after releases,
So that measurement reliability is preserved over time.

**Implements:** FR24

**Acceptance Criteria:**

**Given** a new deployment has completed
**When** post-deploy verification is performed
**Then** analytics collection status can be confirmed as active
**And** verification steps are clear and repeatable

**Given** analytics collection is interrupted by configuration drift
**When** verification checks run
**Then** the issue is detectable
**And** remediation actions can be executed without high operational overhead

**Given** analytics dashboard or API is temporarily unavailable
**When** verification runs
**Then** the check degrades gracefully (e.g., retry or alternate signal) without false success
**And** the publisher knows whether to wait, retry, or fix configuration

### Story 5.3: Expose Decision-Useful Traffic and Referrer Views

As a publisher,
I want visibility into top pages, referrers, and trend data,
So that I can evaluate which content is performing.

**Implements:** FR25

**Acceptance Criteria:**

**Given** analytics data is being collected
**When** the reporting interface is reviewed
**Then** top pages, referrers, and visit trend views are available
**And** data is interpretable for content-level decisions

**Given** periodic content performance reviews
**When** metrics are compared over time
**Then** stable or improving engagement patterns can be assessed
**And** reporting supports month-over-month directional analysis

### Story 5.4: Add Content Optimization Workflow Using Analytics and Search Console

As a publisher,
I want a repeatable workflow that combines analytics and search signals,
So that I can prioritize updates and new posts based on evidence.

**Implements:** FR26, FR27

**Acceptance Criteria:**

**Given** Cloudflare analytics and Search Console signals are available
**When** a content review cycle is executed
**Then** traffic and indexing/search signals can be correlated for key content
**And** outcomes produce a prioritized action list for updates or new topics

**Given** recurring editorial planning sessions
**When** the workflow is used
**Then** optimization decisions are evidence-based and documented
**And** the process remains lightweight for a solo owner cadence

**Given** one data source is missing or stale for a review cycle
**When** the workflow is executed
**Then** the gap is documented and does not block the rest of the review
**And** actions are tagged as data-pending versus content-pending

## Epic 6: Enforce Accessibility and Quality Baselines

Enable all users to access content inclusively while ensuring long-term quality standards are preserved in templates and publishing.

### Story 6.1: Enforce Semantic Structure Across Core Templates and Content

As a reader using diverse assistive and browsing contexts,
I want pages and posts to use semantic structure consistently,
So that content hierarchy is understandable and accessible.

**Implements:** FR35

**Acceptance Criteria:**

**Given** core page templates and post layouts
**When** content is rendered
**Then** heading hierarchy and semantic elements are consistently applied
**And** template structure supports clear navigation landmarks and meaningful document flow

**Given** routine quality checks on published pages
**When** semantic structure is reviewed
**Then** semantic regressions are detectable
**And** identified regressions can be corrected without redesigning unrelated features

### Story 6.2: Ensure Keyboard-Accessible Core Navigation and Interaction

As a keyboard user,
I want to navigate core site experiences without a mouse,
So that I can access content and controls effectively.

**Implements:** FR34

**Acceptance Criteria:**

**Given** homepage, post, taxonomy/archive, and about pages
**When** navigating via keyboard
**Then** core links and navigation controls are reachable and operable
**And** focus order follows a logical sequence

**Given** interactive elements in core navigation flows
**When** they receive keyboard focus
**Then** visible focus indicators are present and usable
**And** focus is not lost during normal page interaction

**Given** a keyboard trap or missing focusable control on a core page
**When** accessibility QA runs
**Then** the defect is logged with page and selector context
**And** release is blocked or exception-documented before calling the epic complete

### Story 6.3: Define and Apply Alt Text and Accessible Content Authoring Standards

As a publisher and reader,
I want meaningful images to include appropriate alt text and accessible authoring patterns,
So that content remains understandable for screen reader users.

**Implements:** FR36

**Acceptance Criteria:**

**Given** meaningful images in posts or pages
**When** content is authored and published
**Then** alt text is provided according to documented standards
**And** decorative imagery is handled without misleading assistive technology output

**Given** recurring publishing workflow
**When** content quality checks are performed
**Then** headings, descriptive links, and image descriptions follow accessibility authoring guidance
**And** standards remain repeatable for future content operations

### Story 6.4: Validate Visual Contrast and Readability Baseline

As a reader,
I want text and UI elements to maintain sufficient contrast and readability,
So that content is comfortably consumable across environments.

**Implements:** FR37

**Acceptance Criteria:**

**Given** theme defaults and custom styling for core pages
**When** contrast and readability are reviewed
**Then** primary content and navigation meet practical baseline contrast requirements
**And** typography and spacing remain readable across common viewport sizes

**Given** ongoing release and content updates
**When** quality validation runs
**Then** contrast and readability regressions are identified
**And** remediation can be applied before broader rollout

**Given** a contrast or readability regression is detected on navigation or body text
**When** validation runs before or after deploy
**Then** the failing element and theme override path are identified
**And** fix-forward or revert is chosen per runbook without silent regression to production
