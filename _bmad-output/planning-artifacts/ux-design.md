# UX Design Specification — tomcoldenhoff.com (lightweight)

**Project:** tomcoldenhoff.com  
**Date:** 2026-03-23  
**Status:** MVP companion to PRD + architecture  
**Stack context:** Hugo + PaperMod, static MPA, GitHub Pages + Cloudflare

## 1. Purpose and scope

This document captures **implementation-oriented UX decisions** for the content site: information architecture, page behavior, responsive and accessibility expectations. It does not replace PaperMod; it constrains overrides and content patterns so the experience stays consistent with PRD FR8–FR15, FR34–FR38, and NFR10–NFR11.

## 2. Personas and goals

| Persona | Goal |
|--------|------|
| Reader (founder/builder) | Find and read high-signal posts; explore related topics; trust the site on mobile. |
| Publisher (Tom) | Publish quickly; keep navigation and templates predictable; avoid UX regressions on deploy. |

## 3. Information architecture

- **Primary nav:** Home, Posts (or Blog label consistent with theme), taxonomy entry points (categories/tags as configured), About.
- **Home:** Recent posts list and/or featured block; short site positioning; clear path to latest content.
- **Post:** Single-column reading focus; optional related links section; no account or paywall chrome.
- **Taxonomy / archive:** List views with clear post titles, dates, and excerpt or summary where theme supports it.
- **About:** Static page; same header/footer as rest of site.

## 4. Page-level behavior

### 4.1 Home

- Above-the-fold: site identity + primary nav + entry to content.
- Post list: reverse chronological or featured-first per config; each item links to post detail.
- No empty states without explanation once at least one post exists; if zero posts, show minimal placeholder copy for pre-launch only.

### 4.2 Post (long-form)

- Readable measure (line length) and vertical rhythm aligned with PaperMod defaults unless overridden in `assets/css/custom.css`.
- Headings: one H1 per page (title); logical H2–H3 order in body content (authoring rule).
- Code blocks: horizontal scroll on small viewports; preserve monospace and padding.
- Images: meaningful images use alt text per authoring guide; decorative images marked empty alt where appropriate.

### 4.3 Taxonomy and archive

- Breadcrumb or back-to-home path if theme supports; otherwise ensure nav always exposes Home.
- Empty taxonomy: show empty state message, not broken layout.

### 4.4 Global chrome

- Header: persistent nav on all core templates.
- Footer: optional links (About, RSS, privacy if added later) — keep minimal for MVP.

## 5. Responsive design

- **Mobile-first:** layout and typography must be usable from ~320px width upward.
- **Touch:** tap targets for nav and in-content links meet comfortable spacing (avoid dense link clusters without spacing).
- **Breakpoints:** defer to PaperMod; document any custom breakpoint only when adding overrides.

## 6. Browser and platform

- Target: latest stable Chrome, Safari, Firefox, Edge (desktop + mobile) per PRD.
- Graceful degradation: core content and nav work without optional enhancements.

## 7. Accessibility (WCAG 2.1 AA practical baseline)

- Semantic landmarks and heading order (templates + content).
- Keyboard: all interactive nav and links reachable; visible focus states (theme default or enhanced in overrides).
- Color: sufficient contrast for body text and nav on default and dark mode if enabled.
- Forms: N/A for MVP public read-only site unless newsletter added later.

## 8. States and feedback

- **Loading:** static site — no global loading spinner required; avoid layout shift on font load where possible.
- **Errors:** 404 page is readable, links back Home; custom 404 template if needed.
- **External tools:** analytics must not block first paint (defer/non-blocking injection per architecture).

## 9. Content authoring UX (publisher-facing)

- Publishing checklist references: heading hierarchy, descriptive link text, alt text, stable slugs.
- Internal linking: prefer contextual links in prose; related-post blocks optional per theme.

## 10. Traceability

| UX area | PRD alignment |
|--------|----------------|
| Nav + home + lists | FR8, FR10, FR11, FR14, FR15 |
| Post readability | FR9, FR38 |
| Cross-device | FR13 |
| A11y | FR34–FR37, NFR10–NFR11 |

## 11. Open decisions (fill during implementation)

- Exact nav labels and taxonomy labels in theme config.
- Whether to use PaperMod “featured” or home list only.
- Optional dark mode default vs reader toggle.
