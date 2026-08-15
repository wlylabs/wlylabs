/**
 * SVG generators for the wlylabs profile.
 *
 * These are plain string templates with the layout maths done in JS, so the
 * same module can be pre-rendered to `public/*.svg` at build time and served
 * live from the edge (`api/banner.js`).
 *
 * Two deliberate constraints, both because GitHub proxies README images
 * through camo and renders them in a sandboxed <img>:
 *
 *   1. System font stacks only — an external font request would be blocked.
 *   2. Colours live in a <style> block, not in fill attributes, so a single
 *      file can carry both palettes and switch on `prefers-color-scheme`.
 *      That keeps the README to one relative URL per asset, which is the only
 *      form GitHub is guaranteed to rewrite correctly on every branch.
 *
 * CSS inside an SVG loaded as an image still applies — including media queries
 * and animations — while scripts and network requests do not.
 */

import { PROFILE } from './data.js';
import { FONT_MONO, THEMES, esc, monoWidth, r, theme } from './tokens.js';

/* ------------------------------------------------------------------ *
 * Palette plumbing
 * ------------------------------------------------------------------ */

/**
 * Emits the colour rules for one palette, scoped to `ns` so two assets can
 * never fight over a class name if they are ever inlined side by side.
 */
function palette(ns, t) {
  return [
    `.${ns}bg{fill:${t.bg};}`,
    `.${ns}grid{stroke:${t.grid};stroke-opacity:${t.gridOpacity};}`,
    `.${ns}edge{stroke:${t.border};}`,
    `.${ns}surf{fill:${t.surface};stroke:${t.border};}`,
    `.${ns}tx{fill:${t.text};}`,
    `.${ns}mu{fill:${t.muted};}`,
    `.${ns}fa{fill:${t.faint};}`,
    `.${ns}hair{stroke:${t.hairline};}`,
    `.${ns}aa{fill:${t.accentA};}`,
    `.${ns}ab{fill:${t.accentB};}`,
    `.${ns}sa{stop-color:${t.accentA};}`,
    `.${ns}sb{stop-color:${t.accentB};}`,
    `.${ns}s-area-t{stop-color:${t.accentA};stop-opacity:0.34;}`,
    `.${ns}s-area-b{stop-color:${t.accentA};stop-opacity:0;}`,
    `.${ns}s-glow-a{stop-color:${t.glowA};stop-opacity:${t.glowOpacity};}`,
    `.${ns}s-glow-b{stop-color:${t.glowB};stop-opacity:${r(t.glowOpacity * 1.15)};}`,
    `.${ns}s-clear-a{stop-color:${t.glowA};stop-opacity:0;}`,
    `.${ns}s-clear-b{stop-color:${t.glowB};stop-opacity:0;}`,
  ].join('');
}

/**
 * `auto` (the default) ships both palettes in one file and lets the reader's
 * colour scheme pick. `dark` / `light` pin a single palette, which is what the
 * live endpoint uses when a caller asks for one explicitly.
 */
function palettes(ns, mode) {
  if (mode === 'dark' || mode === 'light') return palette(ns, theme(mode));
  return (
    palette(ns, THEMES.light) +
    `@media (prefers-color-scheme:dark){${palette(ns, THEMES.dark)}}`
  );
}

/* ------------------------------------------------------------------ *
 * Shared fragments
 * ------------------------------------------------------------------ */

function gridPattern(id, ns, step = 40) {
  return `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
      <path class="${ns}grid" d="M${step} 0H0V${step}" fill="none" stroke-width="1"/>
    </pattern>`;
}

/**
 * Exponential curve, sampled as a polyline — the decorative motif shared by
 * the hero, the banner endpoint and the social card.
 * `pathLength="1"` lets the draw-in animation use normalised dash units.
 */
export function curvePath(x0, x1, top, base, k = 2.45, samples = 72) {
  const denom = Math.exp(k) - 1;
  let d = '';
  for (let i = 0; i <= samples; i += 1) {
    const s = i / samples;
    const f = (Math.exp(k * s) - 1) / denom;
    const x = x0 + (x1 - x0) * s;
    const y = base - (base - top) * f;
    d += `${i === 0 ? 'M' : 'L'}${r(x)},${r(y)}`;
  }
  return d;
}

/* ------------------------------------------------------------------ *
 * Hero banner
 * ------------------------------------------------------------------ */

export function hero(options = {}) {
  const name = esc(options.name ?? PROFILE.name);
  const eyebrow = esc(options.eyebrow ?? PROFILE.eyebrow);
  const status = esc(options.status ?? PROFILE.status);
  const lines = (options.lines ?? PROFILE.lines).slice(0, 6).map(esc);

  const W = 1200;
  const H = 320;
  const PAD = 56;
  const ns = 'h-';

  // Rotating tagline: each line owns an equal slice of one cycle.
  const cycle = lines.length * 3.4;
  const slice = 100 / lines.length;
  const keyframes = `@keyframes h-cyc{0%{opacity:0;}${r(slice * 0.08)}%{opacity:1;}${r(
    slice * 0.86,
  )}%{opacity:1;}${r(slice)}%{opacity:0;}100%{opacity:0;}}`;
  const lineRules = lines
    .map(
      (_, i) =>
        `.h-l${i}{animation:h-cyc ${r(cycle)}s ${r((cycle / lines.length) * i)}s infinite;}`,
    )
    .join('');

  const statusW = Math.round(monoWidth(status, 12, 2.6)) + 46;

  // Chart geometry
  const plotX0 = 700;
  const plotX1 = 1144;
  const plotTop = 112;
  const plotBase = 250;
  const curve = curvePath(plotX0, plotX1, plotTop, plotBase);
  const area = `${curve}L${plotX1},${plotBase}L${plotX0},${plotBase}Z`;
  const gridLines = [0.25, 0.5, 0.75]
    .map((f) => {
      const y = r(plotBase - (plotBase - plotTop) * f);
      return `<line class="${ns}hair" x1="${plotX0}" y1="${y}" x2="${plotX1}" y2="${y}" stroke-width="1" stroke-dasharray="2 6" opacity="0.7"/>`;
    })
    .join('\n    ');

  const label = `${name} — solo builder of end-to-end encrypted web apps`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    ${gridPattern('h-grid', ns)}
    <linearGradient id="h-word" x1="0" y1="0" x2="1" y2="0.6">
      <stop class="${ns}sa" offset="0%"/>
      <stop class="${ns}sa" offset="58%"/>
      <stop class="${ns}sb" offset="100%"/>
    </linearGradient>
    <linearGradient id="h-bar" x1="0" y1="0" x2="1" y2="0">
      <stop class="${ns}sa" offset="0%"/>
      <stop class="${ns}sb" offset="100%"/>
    </linearGradient>
    <linearGradient id="h-area" x1="0" y1="0" x2="0" y2="1">
      <stop class="${ns}s-area-t" offset="0%"/>
      <stop class="${ns}s-area-b" offset="100%"/>
    </linearGradient>
    <radialGradient id="h-glow-a" cx="0.5" cy="0.5" r="0.5">
      <stop class="${ns}s-glow-a" offset="0%"/>
      <stop class="${ns}s-clear-a" offset="100%"/>
    </radialGradient>
    <radialGradient id="h-glow-b" cx="0.5" cy="0.5" r="0.5">
      <stop class="${ns}s-glow-b" offset="0%"/>
      <stop class="${ns}s-clear-b" offset="100%"/>
    </radialGradient>
    <style>
      ${palettes(ns, options.theme)}
      .h-mono{font-family:${FONT_MONO};}
      ${keyframes}
      .h-line{opacity:0;}
      ${lineRules}
      @keyframes h-draw{from{stroke-dashoffset:1;}to{stroke-dashoffset:0;}}
      @keyframes h-rise{from{opacity:0;}to{opacity:1;}}
      @keyframes h-pulse{0%,100%{opacity:1;}50%{opacity:0.25;}}
      .h-curve{stroke-dasharray:1;stroke-dashoffset:1;animation:h-draw 2.2s cubic-bezier(.22,.61,.36,1) .15s forwards;}
      .h-fill{opacity:0;animation:h-rise 1.2s ease-out 1.5s forwards;}
      .h-tip{opacity:0;animation:h-rise .4s ease-out 2.2s forwards;}
      .h-dot{animation:h-pulse 2.4s ease-in-out infinite;}
      @media (prefers-reduced-motion: reduce){
        .h-line{animation:none;opacity:0;}
        .h-l0{opacity:1;}
        .h-curve{animation:none;stroke-dashoffset:0;}
        .h-fill,.h-tip{animation:none;opacity:1;}
        .h-dot{animation:none;}
      }
    </style>
  </defs>

  <rect class="${ns}bg" width="${W}" height="${H}" rx="14"/>
  <rect width="${W}" height="${H}" rx="14" fill="url(#h-grid)"/>
  <ellipse cx="120" cy="40" rx="520" ry="320" fill="url(#h-glow-a)"/>
  <ellipse cx="1080" cy="320" rx="560" ry="340" fill="url(#h-glow-b)"/>
  <rect class="${ns}edge" x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="none"/>

  <g class="h-mono">
    <text class="${ns}mu" x="${PAD}" y="84" font-size="14" letter-spacing="4.2">${eyebrow}</text>
    <text x="${PAD}" y="170" font-size="76" font-weight="700" letter-spacing="-2" fill="url(#h-word)">${name}</text>
    <rect x="${PAD}" y="190" width="96" height="4" rx="2" fill="url(#h-bar)"/>

    <g transform="translate(${PAD} 234)">
      <text class="${ns}aa" x="0" y="0" font-size="19">&#8250;</text>
      ${lines
        .map(
          (line, i) =>
            `<text class="${ns}tx h-line h-l${i}" x="20" y="0" font-size="19">${line}</text>`,
        )
        .join('\n      ')}
    </g>

    <g transform="translate(${PAD} 256)">
      <rect class="${ns}surf" x="0" y="0" width="${statusW}" height="34" rx="17"/>
      <circle class="${ns}aa h-dot" cx="19" cy="17" r="4"/>
      <text class="${ns}mu" x="32" y="22" font-size="12" letter-spacing="2.6">${status}</text>
    </g>
  </g>

  <g class="h-mono">
    <text class="${ns}fa" x="${plotX0}" y="90" font-size="12" letter-spacing="2.8">ZERO KNOWLEDGE</text>
    ${gridLines}
    <line class="${ns}hair" x1="${plotX0}" y1="${plotBase}" x2="${plotX1}" y2="${plotBase}" stroke-width="1"/>
    <path class="h-fill" d="${area}" fill="url(#h-area)"/>
    <path class="h-curve" d="${curve}" pathLength="1" fill="none" stroke="url(#h-bar)" stroke-width="2.5" stroke-linecap="round"/>
    <g class="h-tip">
      <circle class="${ns}ab" cx="${plotX1}" cy="${plotTop}" r="11" opacity="0.16"/>
      <circle class="${ns}ab" cx="${plotX1}" cy="${plotTop}" r="4.5"/>
    </g>
    <text class="${ns}fa" x="${plotX1}" y="${plotBase + 26}" font-size="12" letter-spacing="1.4" text-anchor="end">keys on device  ·  sealed storage</text>
  </g>
</svg>
`;
}

/* ------------------------------------------------------------------ *
 * Divider — one gradient, readable on either canvas
 * ------------------------------------------------------------------ */

export function rule() {
  const W = 1200;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="4" viewBox="0 0 ${W} 4" role="presentation" aria-hidden="true">
  <defs>
    <linearGradient id="r-line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#D97757" stop-opacity="0"/>
      <stop offset="28%" stop-color="#D97757" stop-opacity="0.85"/>
      <stop offset="72%" stop-color="#8B5CF6" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect y="1" width="${W}" height="2" rx="1" fill="url(#r-line)"/>
</svg>
`;
}

/* ------------------------------------------------------------------ *
 * Link buttons — native size, ink fill so they read on either canvas
 * ------------------------------------------------------------------ */

export function button(options = {}) {
  const label = options.label ?? 'BUTTON';
  const accent = options.accent ?? '#D97757';
  const glyph = options.glyph ?? 'arrow';
  const alt = esc(options.alt ?? label);
  const FONT = 12.5;
  const LS = 1.9;
  const H = 38;
  const W = Math.round(monoWidth(label, FONT, LS) + 62);

  const marks = {
    x: `<path d="M0 0 L11 12 M11 0 L0 12" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`,
    arrow: `<path d="M0 6 H11 M6.5 1.5 L11 6 L6.5 10.5" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${alt}">
  <title>${alt}</title>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="10" fill="#0D1117" stroke="#39414D"/>
  <g transform="translate(18 ${(H - 12) / 2})">${marks[glyph] ?? marks.arrow}</g>
  <text x="${W - 20}" y="${H / 2 + 4.4}" text-anchor="end" font-family="${FONT_MONO}" font-size="${FONT}" letter-spacing="${LS}" fill="#E6EDF3">${esc(label)}</text>
</svg>
`;
}

/* ------------------------------------------------------------------ *
 * Favicon and social card
 * ------------------------------------------------------------------ */

export function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="wlylabs">
  <title>wlylabs</title>
  <defs>
    <linearGradient id="f-g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E8895F"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="15" fill="#0D1117"/>
  <rect x="1" y="1" width="62" height="62" rx="14" fill="none" stroke="url(#f-g)" stroke-opacity="0.45" stroke-width="2"/>
  <path d="M10 44 L22 44 L34 24 L46 44 L54 44" fill="none" stroke="url(#f-g)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
}

/**
 * Launcher icon, rasterised by `npm run icons`. Same mark as the favicon, with
 * two variants because the two consumers crop differently:
 *
 *   square    rounded tile, used as-is for Android's `any` icon and iOS
 *   maskable  full-bleed background with the mark inside the 80% safe zone,
 *             so a launcher can clip it to a circle or a squircle
 */
export function appIcon({ maskable = false } = {}) {
  const S = 512;
  const inset = maskable ? 0 : 8;
  const box = S - inset * 2;
  // The mark occupies the safe zone when maskable, the full tile otherwise.
  const pad = maskable ? S * 0.23 : S * 0.16;
  const span = S - pad * 2;
  const x = (f) => r(pad + span * f);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" role="img" aria-label="wlylabs">
  <title>wlylabs</title>
  <defs>
    <linearGradient id="i-g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E8895F"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <rect width="${S}" height="${S}" fill="#0D1117"/>
  <rect x="${inset}" y="${inset}" width="${box}" height="${box}" rx="${maskable ? 0 : 116}" fill="#0D1117"/>
  ${maskable ? '' : `<rect x="${inset + 8}" y="${inset + 8}" width="${box - 16}" height="${box - 16}" rx="108" fill="none" stroke="url(#i-g)" stroke-opacity="0.45" stroke-width="12"/>`}
  <path d="M${x(0)} ${x(0.75)} L${x(0.27)} ${x(0.75)} L${x(0.5)} ${x(0.29)} L${x(0.73)} ${x(0.75)} L${x(1)} ${x(0.75)}" fill="none" stroke="url(#i-g)" stroke-width="${r(span * 0.115)}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
}

/**
 * 1200x630 social card. Rendered to og.png by `npm run og` (headless Chromium),
 * because most social crawlers refuse SVG.
 */
export function ogCard() {
  const W = 1200;
  const H = 630;
  const t = THEMES.dark;
  const curve = curvePath(96, 1104, 366, 520);
  const area = `${curve}L1104,520L96,520Z`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(PROFILE.title)}">
  <title>${esc(PROFILE.title)}</title>
  <defs>
    <linearGradient id="o-word" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0%" stop-color="${t.accentA}"/>
      <stop offset="55%" stop-color="${t.accentA}"/>
      <stop offset="100%" stop-color="${t.accentB}"/>
    </linearGradient>
    <linearGradient id="o-area" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.accentA}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${t.accentA}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="o-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${t.glowB}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${t.glowB}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="o-grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="${t.grid}" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#o-grid)"/>
  <ellipse cx="980" cy="560" rx="620" ry="420" fill="url(#o-glow)"/>
  <g font-family="${FONT_MONO}">
    <text x="96" y="188" font-size="22" letter-spacing="7" fill="${t.muted}">${esc(PROFILE.eyebrow)}</text>
    <text x="96" y="318" font-size="128" font-weight="700" letter-spacing="-4" fill="url(#o-word)">${esc(PROFILE.name)}</text>
    <text x="96" y="378" font-size="27" fill="${t.text}">WebCrypto  ·  Next.js  ·  PWA  ·  Zero-knowledge</text>
  </g>
  <path d="${area}" fill="url(#o-area)"/>
  <path d="${curve}" fill="none" stroke="url(#o-word)" stroke-width="4" stroke-linecap="round"/>
  <circle cx="1104" cy="366" r="9" fill="${t.accentB}"/>
  <rect x="96" y="556" width="112" height="5" rx="2.5" fill="url(#o-word)"/>
</svg>
`;
}

/* ------------------------------------------------------------------ *
 * Manifest consumed by the build script
 * ------------------------------------------------------------------ */

export const ASSETS = {
  'hero.svg': () => hero(),
  'rule.svg': () => rule(),
  'favicon.svg': () => favicon(),
  'og.svg': () => ogCard(),
  'btn-site.svg': () =>
    button({ label: 'OPEN THE SITE', glyph: 'arrow', accent: '#D97757', alt: 'Open the wlylabs site' }),
  'btn-x.svg': () =>
    button({ label: 'FOLLOW @W0X___', glyph: 'x', accent: '#D97757', alt: 'Follow @w0x___ on X' }),
  'btn-repos.svg': () =>
    button({ label: 'BROWSE THE REPOS', glyph: 'arrow', accent: '#8B5CF6', alt: 'Browse the repositories' }),
};
