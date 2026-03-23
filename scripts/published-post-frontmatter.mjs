/**
 * Minimal frontmatter parsing for Hugo post markdown (YAML between --- fences).
 * No npm dependencies — subset sufficient for architecture contract keys.
 */

/** @param {string} source */
export function stripUtf8Bom(source) {
  return source.charCodeAt(0) === 0xfeff ? source.slice(1) : source;
}

/** @param {string} source */
export function extractFrontmatterBlock(source) {
  const s = stripUtf8Bom(source);
  if (s.startsWith('+++')) {
    return {
      error:
        'Expected YAML front matter opening ---; found TOML +++ (use --- for posts in this repo).',
    };
  }
  if (!s.startsWith('---')) {
    return { error: 'Missing opening ---' };
  }
  const close = s.indexOf('\n---', 3);
  if (close === -1) {
    return { error: 'Missing closing ---' };
  }
  const inner = s.slice(3, close).replace(/^\r?\n/, '');
  return { frontmatter: inner, bodyStart: close + 4 };
}

/** @param {string} inner */
function splitTopLevelArrayItems(inner) {
  const items = [];
  let cur = '';
  let quote = null;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (quote) {
      cur += c;
      if (c === quote && inner[i - 1] !== '\\') {
        quote = null;
      }
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      cur += c;
      continue;
    }
    if (c === ',') {
      items.push(cur.trim());
      cur = '';
      continue;
    }
    cur += c;
  }
  if (cur.trim()) {
    items.push(cur.trim());
  }
  return items.map((s) => {
    const t = s.trim();
    if (
      (t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith("'") && t.endsWith("'"))
    ) {
      return t.slice(1, -1);
    }
    return t;
  });
}

/** @param {string} raw */
export function parseYamlScalarOrArray(raw) {
  const t = raw.trim();
  if (t === 'true') {
    return true;
  }
  if (t === 'false') {
    return false;
  }
  if (t === '[]') {
    return [];
  }
  if (t.startsWith('[') && t.endsWith(']')) {
    const inner = t.slice(1, -1).trim();
    if (!inner) {
      return [];
    }
    return splitTopLevelArrayItems(inner);
  }
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  return t;
}

/** @param {string} frontmatter */
export function parseSimpleYaml(frontmatter) {
  /** @type {Record<string, unknown>} */
  const data = {};
  const lines = frontmatter.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const idx = trimmed.indexOf(':');
    if (idx === -1) {
      continue;
    }
    const key = trimmed.slice(0, idx).trim();
    const rest = trimmed.slice(idx + 1).trim();
    data[key] = parseYamlScalarOrArray(rest);
  }
  return data;
}

/**
 * Coerce YAML-quoted booleans (`draft: "true"`) to real booleans; reject invalid draft types.
 * Mutates `data.draft` when coercion applies.
 *
 * @param {Record<string, unknown>} data
 * @param {string} filePath
 * @returns {{ ok: true } | { error: string }}
 */
export function normalizeDraftField(data, filePath) {
  if (!('draft' in data)) {
    return { ok: true };
  }
  const v = data.draft;
  if (v === true || v === false) {
    return { ok: true };
  }
  if (v === 'true' || v === 'false') {
    data.draft = v === 'true';
    return { ok: true };
  }
  return {
    error: `${filePath}: 'draft' must be boolean true or false (got ${typeof v}: ${JSON.stringify(v)}).`,
  };
}

/**
 * @param {string} source
 * @param {string} filePath
 * @returns {{ data: Record<string, unknown> } | { error: string }}
 */
export function parsePostFrontmatter(source, filePath) {
  const ext = extractFrontmatterBlock(source);
  if ('error' in ext) {
    return { error: `${filePath}: ${ext.error}` };
  }
  try {
    const data = parseSimpleYaml(ext.frontmatter);
    const norm = normalizeDraftField(data, filePath);
    if ('error' in norm) {
      return { error: norm.error };
    }
    return { data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: `${filePath}: Failed to parse frontmatter (${msg})` };
  }
}

const REQUIRED_KEYS = [
  'title',
  'date',
  'slug',
  'description',
  'tags',
  'categories',
  'draft',
];

/** Lowercase hyphenated ASCII taxonomy term (categories and tags). */
export const TAXONOMY_TERM_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Canonical pillar slugs; published posts must include ≥1 in `categories`. */
export const PILLAR_CATEGORIES = Object.freeze([
  'entrepreneurship',
  'ai',
  'software',
  'science',
]);

const PILLAR_SET = new Set(PILLAR_CATEGORIES);

/** String form of TAXONOMY_TERM_RE for error messages (single source of truth). */
export function taxonomyTermPatternHint() {
  return String(TAXONOMY_TERM_RE);
}

/**
 * @param {unknown} term
 * @returns {boolean}
 */
export function isValidTaxonomyTerm(term) {
  return typeof term === 'string' && TAXONOMY_TERM_RE.test(term);
}

/**
 * @param {Record<string, unknown>} data
 * @param {string} filePath
 * @returns {{ skip: true } | { ok: true } | { errors: string[] }}
 */
export function validatePublishablePost(data, filePath) {
  if (data.draft === true) {
    return { skip: true };
  }

  const errors = [];

  if (data.draft !== false) {
    errors.push(
      `${filePath}: Publishable posts must set draft: false explicitly (Hugo treats omitted draft as published; this repo requires an explicit boolean).`,
    );
    return { errors };
  }

  for (const key of REQUIRED_KEYS) {
    if (!(key in data)) {
      errors.push(`${filePath}: Missing required key '${key}' for published posts.`);
    }
  }

  if (errors.length) {
    return { errors };
  }

  if (typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push(`${filePath}: 'title' must be a non-empty string.`);
  }
  if (typeof data.date !== 'string' || data.date.trim() === '') {
    errors.push(`${filePath}: 'date' must be a non-empty string (ISO-style date/time).`);
  }
  if (typeof data.slug !== 'string' || data.slug.trim() === '') {
    errors.push(`${filePath}: 'slug' must be a non-empty string.`);
  }
  if (typeof data.description !== 'string') {
    errors.push(`${filePath}: 'description' must be a string (empty string is allowed while drafting).`);
  }
  if (!Array.isArray(data.tags)) {
    errors.push(`${filePath}: 'tags' must be a YAML array.`);
  } else if (!data.tags.every((x) => typeof x === 'string')) {
    errors.push(`${filePath}: 'tags' must be an array of strings.`);
  }
  if (!Array.isArray(data.categories)) {
    errors.push(`${filePath}: 'categories' must be a YAML array.`);
  } else if (!data.categories.every((x) => typeof x === 'string')) {
    errors.push(`${filePath}: 'categories' must be an array of strings.`);
  }

  if (errors.length) {
    return { errors };
  }

  const tags = /** @type {string[]} */ (data.tags);
  const categories = /** @type {string[]} */ (data.categories);

  const termHint = taxonomyTermPatternHint();
  for (const t of tags) {
    if (!isValidTaxonomyTerm(t)) {
      errors.push(
        `${filePath}: Invalid taxonomy term in 'tags' (${JSON.stringify(t)}): use lowercase hyphenated ASCII only, matching ${termHint} — see docs/taxonomy-conventions.md`,
      );
    }
  }
  for (const c of categories) {
    if (!isValidTaxonomyTerm(c)) {
      errors.push(
        `${filePath}: Invalid taxonomy term in 'categories' (${JSON.stringify(c)}): use lowercase hyphenated ASCII only, matching ${termHint} — see docs/taxonomy-conventions.md`,
      );
    }
  }
  if (!categories.some((c) => PILLAR_SET.has(c))) {
    errors.push(
      `${filePath}: 'categories' must include at least one pillar: ${PILLAR_CATEGORIES.join(', ')} — see docs/taxonomy-conventions.md`,
    );
  }

  if (errors.length) {
    return { errors };
  }
  return { ok: true };
}
