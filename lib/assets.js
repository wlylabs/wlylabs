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

import { FONT_MONO, THEMES, esc, monoWidth, r, theme } from './tokens.js';

const HERO_LINES = [
  'Solo builder. Full stack of one.',
  'Bonding-curve ERC20s, proven with Foundry.',
  'Streaming LLM apps that fail over at the edge.',
  'Pipelines that keep running while I sleep.',
];

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
 * Exponential bonding curve, sampled as a polyline.
 * `pathLength="1"` lets the draw-in animation use normalised dash units.
 */
function curvePath(x0, x1, top, base, k = 2.45, samples = 72) {
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
  const name = esc(options.name ?? 'wlylabs');
  const eyebrow = esc(options.eyebrow ?? 'INDEPENDENT  ·  SOLO BUILDER');
  const status = esc(options.status ?? 'SHIPPING');
  const lines = (options.lines ?? HERO_LINES).slice(0, 6).map(esc);

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

  const label = `${name} — solo builder across smart contracts, edge AI and automation`;

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
    <text class="${ns}fa" x="${plotX0}" y="90" font-size="12" letter-spacing="2.8">PRICE / SUPPLY</text>
    ${gridLines}
    <line class="${ns}hair" x1="${plotX0}" y1="${plotBase}" x2="${plotX1}" y2="${plotBase}" stroke-width="1"/>
    <path class="h-fill" d="${area}" fill="url(#h-area)"/>
    <path class="h-curve" d="${curve}" pathLength="1" fill="none" stroke="url(#h-bar)" stroke-width="2.5" stroke-linecap="round"/>
    <g class="h-tip">
      <circle class="${ns}ab" cx="${plotX1}" cy="${plotTop}" r="11" opacity="0.16"/>
      <circle class="${ns}ab" cx="${plotX1}" cy="${plotTop}" r="4.5"/>
    </g>
    <text class="${ns}fa" x="${plotX1}" y="${plotBase + 26}" font-size="12" letter-spacing="1.4" text-anchor="end">constant product  ·  reserve-backed</text>
  </g>
</svg>
`;
}

/* ------------------------------------------------------------------ *
 * Stack grid
 * ------------------------------------------------------------------ */

const STACK_GROUPS = [
  {
    label: 'ONCHAIN',
    items: [
      'Solidity 0.8.26',
      'Foundry',
      'OpenZeppelin',
      'EIP-1167 clones',
      'Uniswap v4',
      'wagmi',
      'viem',
      'Slither',
    ],
  },
  {
    label: 'APPLICATION',
    items: [
      'TypeScript',
      'Next.js 14',
      'React',
      'Node.js',
      'Tailwind',
      'RainbowKit',
      'Supabase',
      'Postgres RLS',
      'PWA',
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [
      'Groq',
      'Gemini',
      'OpenRouter',
      'Hugging Face',
      'FLUX.1-schnell',
      'Qwen2.5-VL',
      'SSE streaming',
      'Pyodide',
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      'Vercel Edge',
      'GitHub Actions',
      'Fork tests',
      'Fuzz + invariant',
      'Python 3.11',
      'CSP · HSTS',
      'Rate limiting',
    ],
  },
];

export function stack(options = {}) {
  const groups = options.groups ?? STACK_GROUPS;

  const W = 1200;
  const PAD = 34;
  const MAX_X = W - PAD;
  const FONT = 15;
  const CHIP_H = 34;
  const GAP_X = 9;
  const GAP_Y = 9;
  const LABEL_LEAD = 22;
  const GROUP_GAP = 26;
  const ns = 's-';

  let y = PAD + 4;
  const body = [];

  groups.forEach((group, gi) => {
    const accent = gi % 2 === 0 ? `${ns}aa` : `${ns}ab`;
    body.push(
      `<text class="${accent}" x="${PAD}" y="${y + 10}" font-size="12" letter-spacing="3.4">${esc(group.label)}</text>`,
    );
    y += LABEL_LEAD;

    let x = PAD;
    group.items.forEach((item) => {
      const w = Math.round(monoWidth(item, FONT) + 32);
      if (x + w > MAX_X) {
        x = PAD;
        y += CHIP_H + GAP_Y;
      }
      body.push(
        `<g transform="translate(${x} ${y})">` +
          `<rect class="${ns}surf" width="${w}" height="${CHIP_H}" rx="9"/>` +
          `<text class="${ns}tx" x="${r(w / 2)}" y="${r(CHIP_H / 2 + FONT * 0.36)}" font-size="${FONT}" text-anchor="middle">${esc(item)}</text>` +
          `</g>`,
      );
      x += w + GAP_X;
    });

    y += CHIP_H + (gi === groups.length - 1 ? 0 : GROUP_GAP);
  });

  const H = y + PAD;
  const label = 'Stack — onchain, application, intelligence and operations tooling';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    <style>
      ${palettes(ns, options.theme)}
      .s-mono{font-family:${FONT_MONO};}
    </style>
  </defs>
  <rect class="${ns}bg" width="${W}" height="${H}" rx="14"/>
  <rect class="${ns}edge" x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="none"/>
  <g class="s-mono">
    ${body.join('\n    ')}
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
 * Manifest consumed by the build script
 * ------------------------------------------------------------------ */

export const ASSETS = {
  'hero.svg': () => hero(),
  'stack.svg': () => stack(),
  'rule.svg': () => rule(),
  'btn-x.svg': () =>
    button({ label: 'FOLLOW @WLY0X_', glyph: 'x', accent: '#D97757', alt: 'Follow @wly0x_ on X' }),
  'btn-repos.svg': () =>
    button({ label: 'BROWSE THE REPOS', glyph: 'arrow', accent: '#8B5CF6', alt: 'Browse the repositories' }),
};
