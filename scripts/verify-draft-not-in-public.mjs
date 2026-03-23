#!/usr/bin/env node
/**
 * After a production Hugo build, ensure every content/posts/*.md with draft: true
 * has no matching page under public/ (pretty + ugly URLs) and no slug in key RSS/sitemap XML.
 *
 * Usage: node scripts/verify-draft-not-in-public.mjs [publicDir]
 */

import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { constants as fsConstants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parsePostFrontmatter } from './published-post-frontmatter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(REPO_ROOT, 'content', 'posts');
// Positional args only (CI runs: node .../verify-draft-not-in-public.mjs --ci)
const positionalArgs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const publicDir = path.resolve(REPO_ROOT, positionalArgs[0] || 'public');

const ci = process.env.CI === 'true' || process.argv.includes('--ci');

/** @param {string} msg */
function fail(msg) {
  if (ci) {
    console.error(`::error::verify-draft-not-in-public: ${msg}`);
  } else {
    console.error(msg);
  }
  process.exit(1);
}

/** @param {string} dir */
async function* walkMarkdownFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (/** @type {NodeJS.ErrnoException} */ (e).code === 'ENOENT') {
      return;
    }
    throw e;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      yield* walkMarkdownFiles(full);
    } else if (ent.isFile() && ent.name.endsWith('.md') && ent.name !== '_index.md') {
      yield full;
    }
  }
}

/** @param {string} filePath */
async function assertNotExists(filePath, relForError) {
  try {
    await access(filePath, fsConstants.F_OK);
    fail(
      `Draft post '${relForError}' unexpectedly has public output at ${path.relative(REPO_ROOT, filePath)}`,
    );
  } catch (e) {
    if (/** @type {NodeJS.ErrnoException} */ (e).code !== 'ENOENT') {
      throw e;
    }
  }
}

/**
 * @param {string} slug
 * @param {string} rel
 */
async function assertDraftSlugAbsentFromFeeds(slug, rel) {
  const needles = [`/posts/${slug}/`, `/posts/${slug}.html`];
  const xmlRelPaths = ['sitemap.xml', 'index.xml', path.join('posts', 'index.xml')];

  for (const xmlRel of xmlRelPaths) {
    const full = path.join(publicDir, xmlRel);
    let text;
    try {
      text = await readFile(full, 'utf8');
    } catch (e) {
      if (/** @type {NodeJS.ErrnoException} */ (e).code === 'ENOENT') {
        continue;
      }
      throw e;
    }
    for (const n of needles) {
      if (text.includes(n)) {
        fail(
          `Draft post '${rel}' (slug=${slug}) appears in ${xmlRel} (${n}); drafts must not ship in RSS/sitemap.`,
        );
      }
    }
  }
}

async function main() {
  for await (const abs of walkMarkdownFiles(POSTS_DIR)) {
    const rel = path.relative(REPO_ROOT, abs).split(path.sep).join('/');
    const raw = await readFile(abs, 'utf8');
    const parsed = parsePostFrontmatter(raw, rel);
    if ('error' in parsed) {
      fail(parsed.error);
    }
    const { data } = parsed;
    if (data.draft !== true) {
      continue;
    }
    const slug = data.slug;
    if (typeof slug !== 'string' || !slug.trim()) {
      fail(`${rel}: draft post must include a non-empty string 'slug' for output verification.`);
    }

    const prettyHtml = path.join(publicDir, 'posts', slug, 'index.html');
    const uglyHtml = path.join(publicDir, 'posts', `${slug}.html`);
    await assertNotExists(prettyHtml, rel);
    await assertNotExists(uglyHtml, rel);
    await assertDraftSlugAbsentFromFeeds(slug, rel);
  }
  console.log(ci ? 'Verify draft exclusion from public — OK' : 'OK: no draft output in public/');
}

main().catch((e) => {
  fail(String(e));
});
