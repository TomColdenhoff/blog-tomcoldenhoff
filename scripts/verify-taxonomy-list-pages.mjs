#!/usr/bin/env node
/**
 * After a production Hugo build, assert baseline taxonomy list pages list the fixture post.
 * Expects content/posts/hello-world.md with categories [software] and tag baseline (see repo).
 *
 * Usage: node scripts/verify-taxonomy-list-pages.mjs [publicDir]
 * CI:    node scripts/verify-taxonomy-list-pages.mjs --ci
 */

import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { constants as fsConstants } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const positionalArgs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const publicDir = path.resolve(REPO_ROOT, positionalArgs[0] || 'public');

const ci = process.env.CI === 'true' || process.argv.includes('--ci');

/** @param {string} relFromPublic */
async function readPublicHtml(relFromPublic) {
  const abs = path.join(publicDir, relFromPublic);
  await access(abs, fsConstants.R_OK);
  return readFile(abs, 'utf8');
}

/** @param {string} msg */
function fail(msg) {
  if (ci) {
    console.error(`::error::verify-taxonomy-list-pages: ${msg}`);
  } else {
    console.error(msg);
  }
  process.exit(1);
}

async function main() {
  const slug = 'hello-world';
  const checks = [
    ['categories/software/index.html', 'category list software'],
    ['tags/baseline/index.html', 'tag list baseline'],
  ];

  for (const [rel, label] of checks) {
    let html;
    try {
      html = await readPublicHtml(rel);
    } catch {
      fail(`Missing or unreadable ${rel} under ${publicDir} — run hugo --gc --minify first (${label}).`);
    }
    if (!html.includes(slug)) {
      fail(`${rel} does not reference published post slug "${slug}" (${label}).`);
    }
  }

  console.log(
    ci ? 'Verify taxonomy list pages — OK' : 'OK: taxonomy list pages include baseline post',
  );
}

main().catch((e) => {
  fail(e instanceof Error ? e.message : String(e));
});
