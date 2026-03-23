import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyPublishedSlugState,
  evaluateSlugChange,
} from './check-published-slug-stability.mjs';

const published = `---
title: "Hello"
date: 2026-03-23T12:00:00Z
slug: hello-world
description: "x"
tags: []
categories: [software]
draft: false
---
Body`;

const publishedB = published.replace('slug: hello-world', 'slug: new-slug');

const publishedAck = publishedB.replace(
  'draft: false',
  `draft: false
url_change_ack: true
url_change_reason: "typo fix; aliases added"
aliases: ["/posts/hello-world/"]
`,
);

const publishedAckNoAliases = publishedB.replace(
  'draft: false',
  `draft: false
url_change_ack: true
url_change_reason: "typo fix"
`,
);

test('classifyPublishedSlugState missing', () => {
  assert.deepEqual(classifyPublishedSlugState(null, 'p.md'), { kind: 'missing' });
});

test('classifyPublishedSlugState draft', () => {
  const d = published.replace('draft: false', 'draft: true');
  assert.equal(classifyPublishedSlugState(d, 'p.md').kind, 'draft');
});

test('classifyPublishedSlugState published', () => {
  const s = classifyPublishedSlugState(published, 'p.md');
  assert.equal(s.kind, 'published');
  assert.equal(s.slug, 'hello-world');
  assert.equal(s.urlChangeAck, false);
  assert.equal(s.permalinkUrl, null);
});

test('classifyPublishedSlugState coerces url_change_ack string true', () => {
  const y = published.replace(
    'draft: false',
    `draft: false
url_change_ack: "true"
url_change_reason: "x"
aliases: ["/old/"]`,
  );
  const s = classifyPublishedSlugState(y, 'p.md');
  assert.equal(s.kind, 'published');
  assert.equal(s.urlChangeAck, true);
});

test('evaluateSlugChange allows new publish', () => {
  const newS = classifyPublishedSlugState(published, 'p.md');
  const r = evaluateSlugChange(
    { kind: 'missing' },
    newS,
    'content/posts/x.md',
    new Set(),
  );
  assert.equal(r.ok, true);
});

test('evaluateSlugChange allows body-only published', () => {
  const a = classifyPublishedSlugState(published, 'p.md');
  const b = classifyPublishedSlugState(`${published}\nMore`, 'p.md');
  const r = evaluateSlugChange(a, b, 'content/posts/x.md', new Set());
  assert.equal(r.ok, true);
});

test('evaluateSlugChange rejects silent slug change', () => {
  const a = classifyPublishedSlugState(published, 'p.md');
  const b = classifyPublishedSlugState(publishedB, 'p.md');
  const r = evaluateSlugChange(a, b, 'content/posts/x.md', new Set());
  assert.equal(r.ok, false);
  assert.ok(r.message && r.message.includes('slug'));
});

test('evaluateSlugChange allows ack + reason + aliases', () => {
  const a = classifyPublishedSlugState(published, 'p.md');
  const b = classifyPublishedSlugState(publishedAck, 'p.md');
  const r = evaluateSlugChange(a, b, 'content/posts/x.md', new Set());
  assert.equal(r.ok, true);
});

test('evaluateSlugChange rejects ack + reason without aliases', () => {
  const a = classifyPublishedSlugState(published, 'p.md');
  const b = classifyPublishedSlugState(publishedAckNoAliases, 'p.md');
  const r = evaluateSlugChange(a, b, 'content/posts/x.md', new Set());
  assert.equal(r.ok, false);
  assert.ok(r.message && r.message.includes('aliases'));
});

test('evaluateSlugChange rejects ack without reason', () => {
  const bad = publishedB.replace(
    'draft: false',
    `draft: false
url_change_ack: true
aliases: ["/posts/hello-world/"]
`,
  );
  const a = classifyPublishedSlugState(published, 'p.md');
  const b = classifyPublishedSlugState(bad, 'p.md');
  const r = evaluateSlugChange(a, b, 'content/posts/x.md', new Set());
  assert.equal(r.ok, false);
});

test('evaluateSlugChange allowlist', () => {
  const a = classifyPublishedSlugState(published, 'p.md');
  const b = classifyPublishedSlugState(publishedB, 'p.md');
  const r = evaluateSlugChange(
    a,
    b,
    'content/posts/x.md',
    new Set(['content/posts/x.md']),
  );
  assert.equal(r.ok, true);
});

test('evaluateSlugChange detects url override change', () => {
  const withUrl = published.replace(
    'draft: false',
    `draft: false
url: /custom/hello/
`,
  );
  const withUrl2 = published.replace(
    'draft: false',
    `draft: false
url: /custom/hello-v2/
`,
  );
  const a = classifyPublishedSlugState(withUrl, 'p.md');
  const b = classifyPublishedSlugState(withUrl2, 'p.md');
  const r = evaluateSlugChange(a, b, 'content/posts/x.md', new Set());
  assert.equal(r.ok, false);
  assert.ok(r.message && r.message.includes('url override'));
});
