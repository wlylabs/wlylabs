#!/usr/bin/env node
/**
 * Rasterises the launcher icons that `manifest.webmanifest` and iOS point at.
 *
 * Chrome will install a site from an SVG icon alone, but Android's launcher
 * and the iOS home screen both want a PNG — so these four are committed
 * alongside og.png rather than generated in CI.
 *
 *   npm run icons     (requires playwright to be installed locally)
 */

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { appIcon } from '../lib/assets.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  process.stderr.write('playwright is not installed — skipping the icons\n');
  process.exit(1);
}

const TARGETS = [
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-maskable.png', size: 512, maskable: true },
  // iOS composites its own rounded mask over this one, so it wants full bleed.
  { file: 'apple-touch-icon.png', size: 180, maskable: true },
];

const browser = await chromium.launch();

for (const { file, size, maskable } of TARGETS) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<body style="margin:0">${appIcon({ maskable }).replace(/width="512" height="512"/, `width="${size}" height="${size}"`)}</body>`,
  );
  await page.screenshot({ path: join(OUT, file), omitBackground: false });
  await page.close();
  process.stdout.write(`  wrote public/${file}  ${size}x${size}\n`);
}

await browser.close();
