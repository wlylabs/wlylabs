#!/usr/bin/env node
/**
 * Renders every asset in the manifest into `public/`.
 *
 *   npm run build    write the files
 *   npm run check    verify the committed files match the generators (CI)
 */

import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ASSETS } from '../lib/assets.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');
const check = process.argv.includes('--check');

await mkdir(OUT, { recursive: true });

const drift = [];

for (const [name, render] of Object.entries(ASSETS)) {
  const svg = render();
  const path = join(OUT, name);

  if (check) {
    const current = await readFile(path, 'utf8').catch(() => null);
    if (current !== svg) drift.push(name);
    continue;
  }

  await writeFile(path, svg, 'utf8');
  process.stdout.write(`  wrote public/${name}  ${(svg.length / 1024).toFixed(1)} kB\n`);
}

// Anything left in public/ that the manifest no longer produces is stale.
const stray = (await readdir(OUT)).filter((f) => f.endsWith('.svg') && !(f in ASSETS));

if (!check) {
  for (const name of stray) {
    await unlink(join(OUT, name));
    process.stdout.write(`  pruned public/${name}\n`);
  }
}

if (check) {
  drift.push(...stray.map((n) => `${n} (stale)`));
  if (drift.length) {
    process.stderr.write(
      `public/ is out of date with lib/assets.js:\n${drift.map((n) => `  - ${n}`).join('\n')}\n` +
        `Run \`npm run build\` and commit the result.\n`,
    );
    process.exit(1);
  }
  process.stdout.write(`  ${Object.keys(ASSETS).length} assets up to date\n`);
}
