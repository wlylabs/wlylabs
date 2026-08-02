#!/usr/bin/env node
/**
 * Rasterises public/og.svg to public/og.png at 1200x630.
 *
 * Social crawlers (X, Slack, Discord, LinkedIn) will not render an SVG card,
 * so the PNG is committed. This is the one build step that needs a browser,
 * which is why it is a separate script rather than part of `npm run build` —
 * CI only verifies the reproducible output.
 *
 *   npm run og      (requires playwright to be installed locally)
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  process.stderr.write('playwright is not installed — skipping og.png\n');
  process.exit(1);
}

const svg = await readFile(join(OUT, 'og.svg'), 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(`<body style="margin:0">${svg}</body>`);
await page.screenshot({ path: join(OUT, 'og.png') });
await browser.close();

process.stdout.write('  wrote public/og.png  1200x630\n');
