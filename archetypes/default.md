---
date: '{{ .Date }}'
draft: true
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: ""
---

<!--
  Static page (not a blog post). Full publisher checklist: docs/publishing-checklist.md (section "Static pages").
  Use draft: true while drafting; set draft: false when the page should ship in production (hugo.toml buildDrafts = false).
  Start body sections at ## — the theme typically renders title as the page heading (same pattern as archetypes/posts.md).
-->

## Section

Replace with page content.
