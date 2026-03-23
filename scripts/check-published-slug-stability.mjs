/**
 * Fail if a previously published post's slug or url override changes without policy compliance.
 * Uses validatePublishablePost() — same rules as validate-published-posts (draft, keys, taxonomy pillars).
 * If taxonomy rules change, update docs/taxonomy-conventions.md and keep slug-stability tests aligned.
 */

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  parsePostFrontmatter,
  validatePublishablePost,
} from './published-post-frontmatter.mjs';

const REPO_ROOT = resolve(import.meta.dirname, '..');
const ALLOWLIST = resolve(REPO_ROOT, 'docs/url-change-allowlist.txt');

/** @param {string} argv */
function parseArgs(argv) {
  const isCi = argv.includes('--ci');
  let base = null;
  let head = null;
  const bi = argv.indexOf('--base');
  if (bi !== -1 && argv[bi + 1]) {
    base = argv[bi + 1];
  }
  const hi = argv.indexOf('--head');
  if (hi !== -1 && argv[hi + 1]) {
    head = argv[hi + 1];
  }
  return { isCi, base, head };
}

/** @returns {Set<string>} */
function loadAllowlist() {
  const set = new Set();
  if (!existsSync(ALLOWLIST)) {
    return set;
  }
  const text = readFileSync(ALLOWLIST, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) {
      continue;
    }
    set.add(t.replaceAll('\\', '/'));
  }
  return set;
}

/**
 * @param {Record<string, unknown>} data
 * @returns {boolean}
 */
function normalizeUrlChangeAck(data) {
  if (!('url_change_ack' in data)) {
    return false;
  }
  const v = data.url_change_ack;
  if (v === true || v === false) {
    return v;
  }
  if (v === 'true' || v === 'false') {
    return v === 'true';
  }
  return false;
}

/**
 * @param {Record<string, unknown>} data
 * @returns {boolean}
 */
function hasNonEmptyAliases(data) {
  if (!('aliases' in data)) {
    return false;
  }
  const a = data.aliases;
  if (!Array.isArray(a) || a.length === 0) {
    return false;
  }
  return a.every((x) => typeof x === 'string' && x.trim() !== '');
}

/**
 * @param {string | null | undefined} source
 * @param {string} filePath
 * @returns {{ kind: 'missing' } | { kind: 'draft' } | { kind: 'invalid' } | { kind: 'published', slug: string, permalinkUrl: string | null, urlChangeAck: boolean, reason: string, hasAliases: boolean }}
 */
export function classifyPublishedSlugState(source, filePath) {
  if (source == null || source === '') {
    return { kind: 'missing' };
  }
  const r = parsePostFrontmatter(source, filePath);
  if ('error' in r) {
    return { kind: 'invalid' };
  }
  const v = validatePublishablePost(r.data, filePath);
  if ('skip' in v && v.skip) {
    return { kind: 'draft' };
  }
  if ('errors' in v && v.errors) {
    return { kind: 'invalid' };
  }
  const slug = String(r.data.slug).trim();
  let permalinkUrl = null;
  if (typeof r.data.url === 'string' && r.data.url.trim() !== '') {
    permalinkUrl = r.data.url.trim();
  }
  const urlChangeAck = normalizeUrlChangeAck(r.data);
  const reason =
    typeof r.data.url_change_reason === 'string'
      ? r.data.url_change_reason.trim()
      : '';
  const hasAliases = hasNonEmptyAliases(r.data);
  return {
    kind: 'published',
    slug,
    permalinkUrl,
    urlChangeAck,
    reason,
    hasAliases,
  };
}

/**
 * @param {{ kind: string, slug?: string, permalinkUrl?: string | null, urlChangeAck?: boolean, reason?: string, hasAliases?: boolean }} oldState
 * @param {{ kind: string, slug?: string, permalinkUrl?: string | null, urlChangeAck?: boolean, reason?: string, hasAliases?: boolean }} newState
 */
export function evaluateSlugChange(oldState, newState, relPath, allowlist) {
  if (newState.kind !== 'published') {
    return { ok: true };
  }
  if (oldState.kind !== 'published') {
    return { ok: true };
  }

  const slugSame = oldState.slug === newState.slug;
  const oldU = oldState.permalinkUrl ?? null;
  const newU = newState.permalinkUrl ?? null;
  const urlSame = oldU === newU;
  if (slugSame && urlSame) {
    return { ok: true };
  }

  const norm = relPath.replaceAll('\\', '/');
  if (allowlist.has(norm)) {
    return { ok: true };
  }

  const parts = [];
  if (!slugSame) {
    parts.push(`slug "${oldState.slug}" → "${newState.slug}"`);
  }
  if (!urlSame) {
    parts.push(`url override changed`);
  }
  const changeSummary = parts.join('; ');

  if (newState.urlChangeAck && newState.reason.length === 0) {
    return {
      ok: false,
      message: `${relPath}: ${changeSummary} but url_change_reason is empty (required when url_change_ack is true). See docs/url-change-policy.md.`,
    };
  }

  if (newState.urlChangeAck && newState.reason.length > 0 && !newState.hasAliases) {
    return {
      ok: false,
      message: `${relPath}: ${changeSummary} with url_change_ack requires a non-empty aliases array (Hugo redirect targets for the old URL). See docs/url-change-policy.md.`,
    };
  }

  if (newState.urlChangeAck && newState.reason.length > 0 && newState.hasAliases) {
    return { ok: true };
  }

  return {
    ok: false,
    message: `${relPath}: permalink-breaking change (${changeSummary}) for a published post. Add Hugo aliases, url_change_ack: true, url_change_reason, or list the path in docs/url-change-allowlist.txt. See docs/url-change-policy.md.`,
  };
}

/** @param {string[]} args */
function execGit(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    cwd: REPO_ROOT,
  });
}

/** @param {string} ref @param {string} path */
function gitShow(ref, path) {
  const p = path.replaceAll('\\', '/');
  try {
    return execGit(['show', `${ref}:${p}`]);
  } catch {
    return null;
  }
}

/** @param {string} base @param {string} head */
function listChangedPosts(base, head) {
  const out = execGit([
    'diff',
    '--name-only',
    base,
    head,
    '--',
    'content/posts',
  ]);
  return out
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((f) => f.endsWith('.md'));
}

function resolveRefs(parsed) {
  if (parsed.base && parsed.head) {
    return { base: parsed.base, head: parsed.head };
  }
  try {
    const head = execGit(['rev-parse', 'HEAD']).trim();
    const parent = execGit(['rev-parse', 'HEAD^']).trim();
    return { base: parent, head };
  } catch {
    return null;
  }
}

function main() {
  const parsed = parseArgs(process.argv.slice(2));
  const allowlist = loadAllowlist();

  let range = null;
  if (parsed.base && parsed.head) {
    range = { base: parsed.base, head: parsed.head };
  } else {
    range = resolveRefs(parsed);
  }

  if (!range) {
    console.log(
      'check-published-slug-stability: no git range (single commit or not a git repo); skip.',
    );
    process.exit(0);
  }

  const files = listChangedPosts(range.base, range.head);
  if (files.length === 0) {
    console.log(
      'check-published-slug-stability: OK (no post files changed in range)',
    );
    process.exit(0);
  }

  let failed = false;
  for (const f of files) {
    const oldSrc = gitShow(range.base, f);
    const newSrc = gitShow(range.head, f);
    if (newSrc == null) {
      continue;
    }
    const rel = relative(REPO_ROOT, resolve(REPO_ROOT, f)).replaceAll('\\', '/');
    const oldState = classifyPublishedSlugState(oldSrc, rel);
    const newState = classifyPublishedSlugState(newSrc, rel);

    if (newState.kind === 'invalid') {
      failed = true;
      const msg = `${rel}: head revision has invalid or unpublishable frontmatter; fix before merge (slug/url stability check could not evaluate).`;
      if (parsed.isCi) {
        console.error(`::error file=${rel}::${msg}`);
      } else {
        console.error(msg);
      }
      continue;
    }

    const result = evaluateSlugChange(oldState, newState, rel, allowlist);
    if (!result.ok) {
      failed = true;
      if (parsed.isCi) {
        console.error(`::error file=${rel}::${result.message}`);
      } else {
        console.error(result.message);
      }
    }
  }

  if (failed) {
    process.exit(1);
  }
  console.log('check-published-slug-stability: OK');
}

const isCli =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isCli) {
  main();
}
