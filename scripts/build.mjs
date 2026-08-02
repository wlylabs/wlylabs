#!/usr/bin/env node
/**
 * Builds `public/` — the directory Vercel serves and the directory the README
 * points at.
 *
 *   npm run build    write index.html, the static site files and the SVGs
 *   npm run check    verify the committed output matches its sources (CI)
 *
 * Everything in public/ is generated. Sources live in lib/ (content and
 * generators) and site/ (stylesheet and client scripts).
 */

import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ASSETS } from '../lib/assets.js';
import { page } from '../lib/page.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');
const SITE = join(ROOT, 'site');

/** Copied verbatim from site/ so the CSP can stay free of 'unsafe-inline'. */
const COPIED = ['styles.css', 'theme.js', 'app.js'];

/** Binary output produced by `npm run og`; not reproducible without Chromium. */
const KEEP = new Set(['og.png']);

const check = process.argv.includes('--check');

await mkdir(OUT, { recursive: true });

const files = new Map();

files.set('index.html', page());
for (const [name, render] of Object.entries(ASSETS)) files.set(name, render());
for (const name of COPIED) files.set(name, await readFile(join(SITE, name), 'utf8'));

const drift = [];

for (const [name, contents] of files) {
  const path = join(OUT, name);

  if (check) {
    const current = await readFile(path, 'utf8').catch(() => null);
    if (current !== contents) drift.push(name);
    continue;
  }

  await writeFile(path, contents, 'utf8');
  process.stdout.write(`  ${name.padEnd(16)} ${(contents.length / 1024).toFixed(1)} kB\n`);
}

// Anything left in public/ that is neither generated nor deliberately kept.
const stray = (await readdir(OUT)).filter((f) => !files.has(f) && !KEEP.has(f));

if (check) {
  drift.push(...stray.map((name) => `${name} (stale)`));

  if (drift.length) {
    process.stderr.write(
      `public/ is out of date with its sources:\n${drift.map((n) => `  - ${n}`).join('\n')}\n` +
        'Run `npm run build` and commit the result.\n',
    );
    process.exit(1);
  }

  process.stdout.write(`  ${files.size} files up to date\n`);
} else {
  for (const name of stray) {
    await unlink(join(OUT, name));
    process.stdout.write(`  pruned ${name}\n`);
  }
}
