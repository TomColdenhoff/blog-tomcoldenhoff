import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseYamlScalarOrArray,
  parseSimpleYaml,
  parsePostFrontmatter,
  validatePublishablePost,
  stripUtf8Bom,
  extractFrontmatterBlock,
  normalizeDraftField,
  isValidTaxonomyTerm,
  PILLAR_CATEGORIES,
  taxonomyTermPatternHint,
  TAXONOMY_TERM_RE,
} from './published-post-frontmatter.mjs';

test('parseYamlScalarOrArray', () => {
  assert.equal(parseYamlScalarOrArray('true'), true);
  assert.equal(parseYamlScalarOrArray('false'), false);
  assert.deepEqual(parseYamlScalarOrArray('[]'), []);
  assert.deepEqual(parseYamlScalarOrArray('[a, b]'), ['a', 'b']);
  assert.equal(parseYamlScalarOrArray('"x y"'), 'x y');
  assert.equal(parseYamlScalarOrArray('plain'), 'plain');
});

test('parseSimpleYaml multiline keys from archetype-like sample', () => {
  const y = `title: "Hello"
date: '2026-03-23T12:00:00Z'
slug: hello-world
description: ""
tags: []
categories: []
draft: false`;
  const d = parseSimpleYaml(y);
  assert.equal(d.title, 'Hello');
  assert.equal(d.draft, false);
  assert.deepEqual(d.tags, []);
  assert.deepEqual(d.categories, []);
});

test('validatePublishablePost skips drafts', () => {
  const r = validatePublishablePost(
    { draft: true, title: 'x', slug: 'x', date: '2026-01-01', description: '', tags: [], categories: [] },
    'p.md',
  );
  assert.equal('skip' in r && r.skip, true);
});

test('validatePublishablePost requires explicit draft false', () => {
  const r = validatePublishablePost(
    { title: 't', date: '2026-01-01', slug: 's', description: '', tags: [], categories: [] },
    'p.md',
  );
  assert.ok('errors' in r && r.errors && r.errors.length > 0);
});

test('validatePublishablePost accepts minimal valid publish', () => {
  const r = validatePublishablePost(
    {
      title: 'T',
      date: '2026-03-23T12:00:00Z',
      slug: 't',
      description: '',
      tags: [],
      categories: ['software'],
      draft: false,
    },
    'p.md',
  );
  assert.equal('ok' in r && r.ok, true);
});

test('validatePublishablePost accepts pillar plus optional tags', () => {
  const r = validatePublishablePost(
    {
      title: 'T',
      date: '2026-03-23T12:00:00Z',
      slug: 't',
      description: '',
      tags: ['machine-learning', 'agents'],
      categories: ['ai'],
      draft: false,
    },
    'p.md',
  );
  assert.equal('ok' in r && r.ok, true);
});

test('validatePublishablePost rejects empty categories on publish', () => {
  const r = validatePublishablePost(
    {
      title: 'T',
      date: '2026-03-23T12:00:00Z',
      slug: 't',
      description: '',
      tags: [],
      categories: [],
      draft: false,
    },
    'p.md',
  );
  assert.ok('errors' in r && r.errors?.some((e) => e.includes('pillar')));
});

test('validatePublishablePost rejects categories without a pillar', () => {
  const r = validatePublishablePost(
    {
      title: 'T',
      date: '2026-03-23T12:00:00Z',
      slug: 't',
      description: '',
      tags: [],
      categories: ['hugo'],
      draft: false,
    },
    'p.md',
  );
  assert.ok('errors' in r && r.errors?.some((e) => e.includes('pillar')));
});

test('validatePublishablePost rejects invalid tag casing', () => {
  const r = validatePublishablePost(
    {
      title: 'T',
      date: '2026-03-23T12:00:00Z',
      slug: 't',
      description: '',
      tags: ['BadTag'],
      categories: ['software'],
      draft: false,
    },
    'p.md',
  );
  assert.ok('errors' in r && r.errors?.some((e) => e.includes("'tags'")));
});

test('validatePublishablePost rejects tag with underscore', () => {
  const r = validatePublishablePost(
    {
      title: 'T',
      date: '2026-03-23T12:00:00Z',
      slug: 't',
      description: '',
      tags: ['bad_tag'],
      categories: ['software'],
      draft: false,
    },
    'p.md',
  );
  assert.ok('errors' in r && r.errors?.some((e) => e.includes("'tags'")));
});

test('validatePublishablePost rejects tag with spaces (invalid term)', () => {
  const r = validatePublishablePost(
    {
      title: 'T',
      date: '2026-03-23T12:00:00Z',
      slug: 't',
      description: '',
      tags: ['not valid'],
      categories: ['software'],
      draft: false,
    },
    'p.md',
  );
  assert.ok('errors' in r && r.errors?.some((e) => e.includes("'tags'")));
});

test('isValidTaxonomyTerm and PILLAR_CATEGORIES', () => {
  assert.equal(isValidTaxonomyTerm('machine-learning'), true);
  assert.equal(isValidTaxonomyTerm('AI'), false);
  assert.ok(PILLAR_CATEGORIES.includes('science'));
});

test('taxonomyTermPatternHint matches TAXONOMY_TERM_RE', () => {
  assert.equal(taxonomyTermPatternHint(), String(TAXONOMY_TERM_RE));
});

test('parsePostFrontmatter + validatePublishablePost taxonomy (happy path)', () => {
  const src = `---
title: "Integration"
date: 2026-03-23T12:00:00Z
slug: integration-post
description: ""
tags: [baseline, docs]
categories: [software]
draft: false
---
Body`;
  const p = parsePostFrontmatter(src, 'content/posts/integration-post.md');
  assert.ok('data' in p);
  const r = validatePublishablePost(/** @type {{ data: Record<string, unknown> }} */ (p).data, 'content/posts/integration-post.md');
  assert.equal('ok' in r && r.ok, true);
});

test('parsePostFrontmatter + validatePublishablePost rejects bad tag in file', () => {
  const src = `---
title: "X"
date: 2026-03-23T12:00:00Z
slug: x
description: ""
tags: [BadTag]
categories: [software]
draft: false
---
`;
  const p = parsePostFrontmatter(src, 'content/posts/x.md');
  assert.ok('data' in p);
  const r = validatePublishablePost(/** @type {{ data: Record<string, unknown> }} */ (p).data, 'content/posts/x.md');
  assert.ok('errors' in r && r.errors?.some((e) => e.includes("'tags'")));
});

test('parsePostFrontmatter from file body', () => {
  const src = `---
title: "A"
draft: true
---
Body`;
  const p = parsePostFrontmatter(src, 'f.md');
  assert.ok('data' in p);
  assert.equal(/** @type {{data: Record<string, unknown>}} */ (p).data.draft, true);
});

test('stripUtf8Bom removes BOM for front matter', () => {
  const bom = '\ufeff';
  const stripped = stripUtf8Bom(`${bom}---\ndraft: true\n---\n`);
  assert.equal(stripped.startsWith('---'), true);
});

test('parsePostFrontmatter coerces quoted draft boolean strings', () => {
  const src = `---
title: "A"
slug: a
draft: "true"
---
`;
  const p = parsePostFrontmatter(src, 'f.md');
  assert.ok('data' in p);
  assert.equal(/** @type {{data: Record<string, unknown>}} */ (p).data.draft, true);
});

test('normalizeDraftField rejects non-boolean draft values', () => {
  const data = { draft: 'yes' };
  const r = normalizeDraftField(data, 'x.md');
  assert.ok('error' in r);
});

test('extractFrontmatterBlock rejects TOML opening', () => {
  const r = extractFrontmatterBlock('+++\ntitle="x"\n+++\n');
  assert.ok('error' in r);
});
