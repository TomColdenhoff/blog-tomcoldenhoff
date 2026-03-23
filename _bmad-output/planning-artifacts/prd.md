---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - /Users/tomcoldenhoff/Developer/tomcoldenhoff.com/_bmad-output/planning-artifacts/product-brief-tomcoldenhoff.com-2026-03-23.md
workflowType: 'prd'
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - tomcoldenhoff.com

**Author:** Tom
**Date:** 2026-03-23

## Executive Summary

tomcoldenhoff.com is a focused content platform designed for aspiring entrepreneurs and AI-curious builders who need practical, high-signal guidance across entrepreneurship, AI, software engineering, and adjacent scientific thinking. The product solves a trust-and-utility gap in current content ecosystems: readers can find abundant information, but struggle to find credible, applied insight they can use immediately for real decisions and execution.

The product vision is to publish concise, opinionated, and implementation-aware writing that helps readers improve judgment, accelerate learning, and take better action. In the near term, the product delivers this through a Hugo + PaperMod blog deployed on GitHub Pages with strong SEO foundations and lightweight analytics to maximize discoverability and learning feedback loops.

### What Makes This Special

The core differentiator is a founder + engineer perspective: content is shaped by both business execution realities and technical implementation constraints. This is combined with a science-backed but practical framing that prioritizes transferable mental models over trend-driven commentary.

The key insight is that audiences in this space do not primarily need more information volume; they need filtered, experience-grounded interpretation that turns complexity into decisions. The product is positioned as a trusted signal source in a noisy, increasingly AI-generated content landscape.

## Project Classification

- **Project Type:** web_app (content-focused website/blog)
- **Domain:** general (entrepreneurship, AI, software, scientific exploration)
- **Complexity:** low
- **Project Context:** greenfield

## Success Criteria

### User Success

- Readers consistently extract at least one actionable idea per post (decision, experiment, or implementation step).
- Users perceive content as high-signal and trustworthy compared to generic alternatives.
- Returning readership grows because posts remain practical, specific, and reusable.

### Business Success

- Within 3 months: site is stable, indexed, and publishing at a sustainable cadence.
- Within 12 months: measurable growth in organic discovery and repeat audience.
- The blog strengthens personal authority in founder-engineer + applied AI/software topics.

### Technical Success

- Reliable GitHub Pages deployment with Hugo + PaperMod and low-maintenance publishing workflow.
- Baseline SEO completeness on all core pages/posts (metadata, sitemap, robots, RSS, social cards).
- Analytics and Search Console are configured and producing decision-useful data.

### Measurable Outcomes

- Publish cadence: minimum 1-2 quality posts per month.
- Organic clicks: month-over-month growth trend after indexing baseline.
- Engagement: stable or improving engaged session/time-on-page trend.
- Return visitors: increasing share over time.
- Baseline technical quality: no broken core pages, mobile-friendly rendering, acceptable page performance.

## Product Scope

### MVP - Minimum Viable Product

- Hugo blog with PaperMod theme deployed on GitHub Pages.
- Core pages: Home, Post template, About, and at least one initial post.
- SEO baseline configured.
- One analytics solution implemented and verified.
- Content taxonomy suitable for entrepreneurship/AI/tech topics.

### Growth Features (Post-MVP)

- Archives/tags refinement and internal linking strategy.
- Pillar content and multi-post series.
- Optional newsletter/follow channel and conversion tracking.
- Enhanced content operations (editorial calendar, update workflow for older posts).

### Vision (Future)

- Become a trusted reference source for practical founder-engineer insights.
- Build compounding authority through evergreen high-signal posts.
- Expand distribution and influence while preserving quality-over-volume standards.

## User Journeys

### Journey 1: Primary User Success Path - Aspiring Entrepreneur ("Milan")

**Opening Scene:** Milan is validating a startup idea and overwhelmed by generic advice online.  
**Rising Action:** He finds a search result from tomcoldenhoff.com, reads a post, then follows internal links to related posts on AI, product strategy, and execution trade-offs.  
**Climax:** He applies one framework from the post to make a concrete decision (for example, narrowing scope or choosing a go-to-market experiment).  
**Resolution:** He returns to the site as a trusted source when making future founder decisions.

### Journey 2: Primary User Edge Case - AI-Curious Builder ("Sophie")

**Opening Scene:** Sophie wants to build with AI but lacks confidence in tool and architecture choices.  
**Rising Action:** She reads a post but initially cannot map the advice to her project context. She uses related posts/tags and examples to compare alternatives.  
**Climax:** She identifies a practical path and ships a small experiment.  
**Resolution:** She bookmarks the site and revisits for implementation-minded perspective when she hits uncertainty.

### Journey 3: Admin/Operations Journey - Solo Publisher (Tom)

**Opening Scene:** Tom drafts a new post and wants fast publish with minimal operational overhead.  
**Rising Action:** He writes Markdown content, commits to repo, and GitHub Pages deploys automatically.  
**Climax:** Deployment succeeds; metadata, sitemap, and analytics update correctly.  
**Resolution:** He monitors performance signals (search clicks, engagement, return visits) and adjusts future content topics.

### Journey 4: Support/Troubleshooting Journey - Content Quality/SEO Recovery

**Opening Scene:** A post underperforms or has indexing issues.  
**Rising Action:** Tom checks analytics and search data, identifies weak title/meta/internal linking, and updates the post.  
**Climax:** The revised post gains better indexing/engagement.  
**Resolution:** A lightweight optimization loop becomes part of publishing routine.

### Journey Requirements Summary

These journeys reveal requirements for:
- Clear content discovery (home/list pages, categories/tags, internal linking)
- Strong article readability and practical structure
- Reliable publishing/deployment pipeline
- Baseline SEO instrumentation (metadata, sitemap, robots, canonical hygiene)
- Analytics + Search Console feedback loop for continuous improvement

## Web App Specific Requirements

### Project-Type Overview

tomcoldenhoff.com is a static, content-first web application built with Hugo and PaperMod, optimized for discoverability, readability, and low operational overhead. The product prioritizes fast page delivery, search visibility, and clear information architecture over dynamic app complexity.

### Technical Architecture Considerations

- Rendering model: static-site generation (MPA), pre-rendered pages for SEO and performance.
- Hosting/deployment: GitHub Pages with Git-based publishing workflow.
- Performance orientation: lightweight theme/config, minimal client-side JavaScript, mobile-first rendering.
- SEO-first architecture: crawlable routes, semantic heading structure, sitemap/RSS/robots, clean permalinks.
- Content operations: Markdown-first authoring with consistent frontmatter metadata.

### Browser Matrix & Compatibility

- Support latest stable versions of major evergreen browsers (Chrome, Safari, Firefox, Edge) on desktop and mobile.
- Ensure responsive layout for common viewport sizes.
- Graceful degradation if optional enhancements are unavailable.

### Responsive Design Requirements

- Reading experience must be strong on mobile and desktop.
- Typography, spacing, and code/content blocks must remain legible at small widths.
- Navigation and taxonomy links must remain usable via touch.

### SEO Strategy Requirements

- Unique and descriptive title/meta description per post/page.
- Open Graph and social metadata where supported.
- Sitemap and RSS enabled and valid.
- Internal linking and taxonomy strategy for topic clusters (entrepreneurship, AI, software, science).
- Search Console verification and indexing monitoring.

### Accessibility Level

- Practical WCAG 2.1 AA baseline:
  - semantic HTML and heading order
  - alt text for meaningful images
  - sufficient color contrast
  - keyboard-accessible navigation
  - clear focus states

### Analytics Requirements

- Cloudflare Web Analytics is required for MVP analytics tracking.
- Site should be configured behind Cloudflare proxy to enable Cloudflare analytics collection.
- Track at minimum page views, referrers, and top pages, then correlate with Search Console trends.

### Implementation Considerations

- Keep MVP intentionally simple: no heavy client-side framework, no real-time dependencies, no complex user auth.
- Preserve maintainability with clear content templates and repeatable publishing process.
- Validate SEO/performance/accessibility/analytics at launch and during each post release cycle.
- Maintain story-level requirement traceability in implementation artifacts (each story references implemented FR IDs).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP with fast execution.  
**Resource Requirements:** Solo builder (Tom) with optional light support for DNS/Cloudflare setup.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Reader discovers post via search and consumes actionable content.
- Reader navigates related posts/tags for deeper exploration.
- Publisher writes, commits, deploys, and reviews analytics outcomes.

**Must-Have Capabilities:**
- Hugo + PaperMod site deployed on GitHub Pages
- Core pages: Home, Post, About, basic taxonomy
- SEO baseline (metadata, sitemap, robots, RSS, social metadata)
- Cloudflare Web Analytics integrated and verified
- Search Console connected
- Initial content set (About + first 1-3 posts)
- Simple internal linking between relevant posts

### Post-MVP Features

**Phase 2 (Post-MVP):**
- Pillar content clusters and stronger topical architecture
- Content refresh loop for older posts using performance data
- Optional newsletter/follow channel integration
- Richer archive/tag navigation and related-post optimization

**Phase 3 (Expansion):**
- Advanced distribution workflows (cross-posting/syndication)
- Deeper analytics dashboards and editorial experiments
- Optional interactive tools/resources for readers
- Brand/system expansion around talks, products, or courses

### Risk Mitigation Strategy

**Technical Risks:**  
Keep stack minimal; avoid custom theme forks early; validate deployment + DNS + analytics setup before content push.

**Market Risks:**  
Publish quickly, measure real engagement signals, and iterate topics based on organic traction and return visitors.

**Resource Risks:**  
Prioritize cadence over feature expansion; if time-constrained, reduce feature scope before reducing publishing consistency.

## Functional Requirements

### Content Management & Publishing

- FR1: Publisher can create blog posts in Markdown with structured frontmatter metadata.
- FR2: Publisher can edit and update existing posts while preserving canonical URLs.
- FR3: Publisher can publish posts through a Git-based workflow that triggers site deployment.
- FR4: Publisher can organize posts by categories and tags aligned to key topics.
- FR5: Publisher can mark posts as draft or published.
- FR6: Publisher can maintain an About page as core static content.
- FR7: Publisher can maintain reusable content templates for consistent article structure.

### Site Experience & Discovery

- FR8: Visitors can browse a homepage that lists recent and/or featured posts.
- FR9: Visitors can open individual post pages with readable long-form formatting.
- FR10: Visitors can navigate posts by category/tag taxonomy.
- FR11: Visitors can access archive-style browsing of older content.
- FR12: Visitors can move between related posts using internal linking.
- FR13: Visitors can access all key pages and content on mobile and desktop browsers.
- FR14: Visitors can discover core site sections through clear navigation.
- FR15: Visitors can consume content without account creation.

### SEO & Content Distribution

- FR16: System can generate unique title and description metadata for each page/post.
- FR17: System can expose crawlable URLs for all public pages/posts.
- FR18: System can generate and publish XML sitemap output.
- FR19: System can generate and publish RSS feed output.
- FR20: System can provide robots directives for search crawlers.
- FR21: System can expose social sharing metadata (Open Graph and equivalent social tags).
- FR22: Publisher can connect and verify the property in Google Search Console.

### Analytics & Insights

- FR23: System can integrate Cloudflare Web Analytics for production traffic measurement.
- FR24: Publisher can verify Cloudflare analytics collection is active after deployment.
- FR25: Publisher can view top pages, referrers, and visit trends for published content.
- FR26: Publisher can use analytics insights to prioritize content updates and future topics.
- FR27: Publisher can correlate Cloudflare analytics trends with Search Console signals.

### Deployment & Operations

- FR28: System can build and deploy static output to GitHub Pages from repository changes.
- FR29: System can support custom domain configuration for production site hosting.
- FR30: System can support Cloudflare-proxied DNS configuration for analytics enablement.
- FR31: Publisher can recover from failed deployments by correcting content/config and redeploying.
- FR32: Publisher can maintain a low-ops publishing cycle suitable for a solo owner.
- FR33: System can keep content and site configuration under version control.

### Accessibility & Quality Baseline

- FR34: Visitors can navigate core content using keyboard-accessible interactions.
- FR35: System can present semantic heading/content structure across pages/posts.
- FR36: Publisher can provide alt text for meaningful images.
- FR37: System can present content with sufficient visual contrast using theme defaults/config.
- FR38: Visitors can access readable typography and spacing across common viewport sizes.

## Non-Functional Requirements

### Performance

- NFR1: Public pages shall meet an LCP target of <= 2.5s on typical mobile connections for home and post templates.
- NFR2: Public content shall be delivered through cacheable static assets to maintain low-latency global access.
- NFR3: Content-only build and deploy cycles should complete in <= 10 minutes under normal update conditions.

### Security

- NFR4: Production traffic shall be served exclusively over HTTPS.
- NFR5: Production DNS/CDN configuration shall apply Cloudflare security defaults suitable for a public content site.
- NFR6: Repository and deployment access shall follow least-privilege access practices.
- NFR7: No credentials, tokens, or secrets shall be committed to the content repository.

### Scalability

- NFR8: The platform shall support at least 10x traffic growth from baseline without application-server architecture changes.
- NFR9: Information architecture and taxonomy shall remain usable with at least several hundred published posts.

### Accessibility

- NFR10: Core pages shall meet a practical WCAG 2.1 AA baseline for semantic structure, keyboard access, contrast, and alt text usage.
- NFR11: Newly published content shall follow accessibility-friendly formatting standards (heading hierarchy, descriptive links, image descriptions).

### Integration

- NFR12: Cloudflare Web Analytics integration shall remain operational across content, template, and deployment updates.
- NFR13: Google Search Console verification and indexing visibility shall be maintained in production.
- NFR14: GitHub Pages deployment integration shall produce deterministic, repeatable build outputs from repository state.
