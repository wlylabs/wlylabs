/**
 * Renders the Vercel site — one static, self-contained HTML document built
 * from lib/data.js at deploy time.
 *
 * Everything is server-rendered: with JavaScript blocked the page still reads
 * end to end, and app.js only adds the theme toggle, the rotating tagline,
 * scroll reveal and nav highlighting on top of it.
 */

import { curvePath } from './assets.js';
import {
  CAPABILITIES,
  LINKS,
  NAV,
  PRINCIPLES,
  PROFILE,
  PROJECTS,
  SITE_URL,
  STACK_GROUPS,
} from './data.js';
import { esc, r } from './tokens.js';

/** Minimal inline formatter: **bold** only, on already-escaped text. */
function fmt(text) {
  return esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

const ICONS = {
  x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.53 3h3.17l-6.93 7.92L21.94 21h-6.38l-5-6.54L4.83 21H1.66l7.41-8.47L2 3h6.54l4.52 5.98L17.53 3Zm-1.11 16.13h1.75L7.66 4.78H5.78l10.64 14.35Z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
  arrow:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  sun: '<svg class="theme__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/></svg>',
  moon: '<svg class="theme__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2Z"/></svg>',
};

/* ------------------------------------------------------------------ *
 * Fragments
 * ------------------------------------------------------------------ */

function chart() {
  const W = 440;
  const H = 208;
  const x0 = 6;
  const x1 = 434;
  const top = 16;
  const base = 176;
  const curve = curvePath(x0, x1, top, base);
  const area = `${curve}L${x1},${base}L${x0},${base}Z`;
  const grid = [0.25, 0.5, 0.75]
    .map((f) => {
      const y = r(base - (base - top) * f);
      return `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--border)" stroke-dasharray="2 6"/>`;
    })
    .join('');

  return `<div class="chart reveal">
          <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="An exponential bonding curve: price rising with supply along a constant-product reserve">
            <title>Bonding curve — price against supply</title>
            <defs>
              <linearGradient id="curve-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="var(--accent-bright)"/>
                <stop offset="100%" stop-color="var(--violet)"/>
              </linearGradient>
              <linearGradient id="curve-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--accent-bright)" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="var(--accent-bright)" stop-opacity="0"/>
              </linearGradient>
            </defs>
            ${grid}
            <line x1="${x0}" y1="${base}" x2="${x1}" y2="${base}" stroke="var(--border)"/>
            <path class="chart__area" d="${area}" fill="url(#curve-area)"/>
            <path class="chart__curve" d="${curve}" pathLength="1" fill="none" stroke="url(#curve-stroke)" stroke-width="2.5" stroke-linecap="round"/>
            <g class="chart__tip">
              <circle cx="${x1}" cy="${top}" r="11" fill="var(--violet)" opacity="0.16"/>
              <circle cx="${x1}" cy="${top}" r="4.5" fill="var(--violet)"/>
            </g>
          </svg>
          <p class="chart__foot"><span>Price / supply</span><span>Constant product · reserve-backed</span></p>
        </div>`;
}

function hero() {
  const lines = PROFILE.lines
    .map(
      (line, i) =>
        `<p class="rotator__line" data-rotator-line${i === 0 ? ' data-active="true"' : ''}>${esc(line)}</p>`,
    )
    .join('\n              ');

  return `<section class="hero" id="top">
      <div class="wrap hero__inner">
        <div>
          <p class="eyebrow">${esc(PROFILE.eyebrow)}</p>
          <h1>${esc(PROFILE.name)}</h1>
          <div class="hero__bar"></div>
          <div class="rotator">
            <span class="rotator__caret" aria-hidden="true">&#8250;</span>
            <div class="rotator__stage">
              ${lines}
            </div>
          </div>
          <div class="hero__meta">
            <span class="pill"><span class="pill__dot"></span>${esc(PROFILE.status)}</span>
            <span class="eyebrow">${esc(PROFILE.handle)}</span>
          </div>
          <div class="hero__actions">
            <a class="btn btn--primary" href="#work">Selected work ${ICONS.arrow}</a>
            <a class="btn" href="${LINKS.github}" rel="noopener">${ICONS.github} GitHub</a>
          </div>
        </div>
        ${chart()}
      </div>
    </section>`;
}

function sectionHead(title, id) {
  return `<div class="section__head reveal">
          <h2 id="${id}-title">${esc(title)}</h2>
          <span class="rule" aria-hidden="true"></span>
        </div>`;
}

function work() {
  const cards = PROJECTS.map(
    (project, i) => `<article class="card reveal">
            <div class="card__id">
              <h3>${esc(project.name)}</h3>
              <p class="eyebrow card__kind">${esc(project.kind)}</p>
              <a class="card__link" href="${esc(project.url)}" rel="noopener">Open repository </a>
              <p class="card__index">${String(i + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}</p>
            </div>
            <div>
              <p class="card__summary">${esc(project.summary)}</p>
              <ul class="card__points">
                ${project.highlights.map((h) => `<li>${esc(h)}</li>`).join('\n                ')}
              </ul>
              <ul class="chips">
                ${project.stack.map((s) => `<li>${esc(s)}</li>`).join('\n                ')}
              </ul>
            </div>
          </article>`,
  ).join('\n          ');

  return `<section id="work" aria-labelledby="work-title">
      <div class="wrap">
        ${sectionHead('Selected work', 'work')}
        <div class="work">
          ${cards}
        </div>
      </div>
    </section>`;
}

function capabilities() {
  const tiles = CAPABILITIES.map(
    (item) => `<article class="tile reveal">
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.body)}</p>
            <ul class="tile__refs">
              ${item.refs.map((ref) => `<li>${esc(ref)}</li>`).join('\n              ')}
            </ul>
          </article>`,
  ).join('\n          ');

  return `<section id="capabilities" aria-labelledby="capabilities-title">
      <div class="wrap">
        ${sectionHead('Capabilities', 'capabilities')}
        <p class="section__lead reveal">Each one points at the code that demonstrates it, so none of this has to be taken on trust.</p>
        <div class="grid">
          ${tiles}
        </div>
      </div>
    </section>`;
}

function stack() {
  const groups = STACK_GROUPS.map(
    (group) => `<div class="stack__group reveal">
            <p class="eyebrow stack__label">${esc(group.label)}</p>
            <ul class="stack__items">
              ${group.items.map((item) => `<li>${esc(item)}</li>`).join('\n              ')}
            </ul>
          </div>`,
  ).join('\n          ');

  return `<section id="stack" aria-labelledby="stack-title">
      <div class="wrap">
        ${sectionHead('Stack', 'stack')}
        <div class="stack">
          ${groups}
        </div>
      </div>
    </section>`;
}

function principles() {
  const tiles = PRINCIPLES.map(
    (item) => `<article class="tile tile--num reveal">
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.body)}</p>
          </article>`,
  ).join('\n          ');

  return `<section id="principles" aria-labelledby="principles-title">
      <div class="wrap">
        ${sectionHead('How I build', 'principles')}
        <div class="grid principles">
          ${tiles}
        </div>
      </div>
    </section>`;
}

function contact() {
  return `<section id="contact" class="contact" aria-labelledby="contact-title">
      <div class="wrap">
        ${sectionHead('Contact', 'contact')}
        <p class="reveal">Always open to talk about onchain products, AI apps and indie building — and to collaborate with other solo builders.</p>
        <div class="contact__actions reveal">
          <a class="btn btn--primary" href="${LINKS.x}" rel="noopener">${ICONS.x} ${esc(PROFILE.handle)}</a>
          <a class="btn" href="${LINKS.repos}" rel="noopener">${ICONS.github} Browse the repos</a>
        </div>
      </div>
    </section>`;
}

function about() {
  return `<section id="about" aria-labelledby="about-title">
      <div class="wrap">
        ${sectionHead('About', 'about')}
        <div class="grid grid--prose">
          ${PROFILE.intro.map((p) => `<p class="tile tile--prose reveal">${fmt(p)}</p>`).join('\n          ')}
        </div>
      </div>
    </section>`;
}

/* ------------------------------------------------------------------ *
 * Document
 * ------------------------------------------------------------------ */

export function page() {
  const navLinks = NAV.map(
    (item) => `<li><a data-nav-link href="#${item.id}">${esc(item.label)}</a></li>`,
  ).join('\n            ');

  const year = new Date().getUTCFullYear();

  return `<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(PROFILE.title)}</title>
  <meta name="description" content="${esc(PROFILE.description)}" />
  <link rel="canonical" href="${SITE_URL}/" />
  <meta name="color-scheme" content="light dark" />
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#0d1117" media="(prefers-color-scheme: dark)" />

  <meta property="og:type" content="profile" />
  <meta property="og:site_name" content="${esc(PROFILE.name)}" />
  <meta property="og:title" content="${esc(PROFILE.title)}" />
  <meta property="og:description" content="${esc(PROFILE.description)}" />
  <meta property="og:url" content="${SITE_URL}/" />
  <meta property="og:image" content="${SITE_URL}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(PROFILE.title)}" />
  <meta name="twitter:description" content="${esc(PROFILE.description)}" />
  <meta name="twitter:image" content="${SITE_URL}/og.png" />

  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/styles.css" />
  <script src="/theme.js"></script>
</head>
<body>
  <a class="skip" href="#work">Skip to content</a>

  <header class="nav" data-nav>
    <div class="wrap nav__inner">
      <a class="nav__mark" href="#top"><span>wly</span>labs</a>
      <nav aria-label="Sections">
        <ul class="nav__links">
            ${navLinks}
        </ul>
      </nav>
      <button class="theme" type="button" data-theme-toggle aria-label="Switch to dark theme">
        ${ICONS.sun}${ICONS.moon}
      </button>
    </div>
  </header>

  <main>
    ${hero()}
    ${about()}
    ${work()}
    ${capabilities()}
    ${stack()}
    ${principles()}
    ${contact()}
  </main>

  <footer class="foot">
    <div class="wrap foot__inner">
      <span>© ${year} ${esc(PROFILE.name)} · built and deployed by one person</span>
      <span>Generated from <a href="${LINKS.github}/wlylabs" rel="noopener">wlylabs/wlylabs</a> · running on Vercel</span>
    </div>
  </footer>

  <script src="/app.js" defer></script>
</body>
</html>
`;
}
