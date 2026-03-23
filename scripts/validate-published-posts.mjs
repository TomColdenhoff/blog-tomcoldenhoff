#!/usr/bin/env node
/**
 * Fail-fast validation: published posts (draft: false) under content/posts/
 * must satisfy the architecture frontmatter contract.
 *
 * Usage: node scripts/validate-published-posts.mjs
 * CI:    node scripts/validate-published-posts.mjs --ci
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parsePostFrontmatter,
  validatePublishablePost,
} from './published-post-frontmatter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(REPO_ROOT, 'content', 'posts');

const ci = process.argv.includes('--ci');

/** @param {string} msg */
function logError(msg) {
  if (ci) {
    const m = msg.match(/^([^:]+):\s*(.*)$/);
    if (m) {
      const filePath = m[1];
      const rest = m[2];
      console.error(`::error file=${filePath}::${rest}`);
      return;
    }
  }
  console.error(msg);
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

async function main() {
  let hadError = false;
  for await (const abs of walkMarkdownFiles(POSTS_DIR)) {
    const rel = path.relative(REPO_ROOT, abs).split(path.sep).join('/');
    let raw;
    try {
      raw = await readFile(abs, 'utf8');
    } catch (e) {
      logError(`${rel}: Could not read file (${e})`);
      hadError = true;
      continue;
    }

    const parsed = parsePostFrontmatter(raw, rel);
    if ('error' in parsed) {
      logError(parsed.error);
      hadError = true;
      continue;
    }

    const result = validatePublishablePost(parsed.data, rel);
    if ('skip' in result) {
      continue;
    }
    if ('errors' in result) {
      for (const err of result.errors) {
        logError(err);
      }
      hadError = true;
    }
  }

  if (hadError) {
    process.exit(1);
  }
  console.log(ci ? 'Validate published posts — OK' : 'OK: published post frontmatter');
}

main().catch((e) => {
  console.error(ci ? `::error::validate-published-posts: ${e}` : e);
  process.exit(1);
});
