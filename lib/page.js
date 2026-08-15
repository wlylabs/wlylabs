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
  COPYRIGHT_YEAR,
  LINKS,
  NAV,
  PRINCIPLES,
  PROFILE,
  PROJECTS,
  SITE_URL,
  STACK_GROUPS,
} from './data.js';
import { structuredData } from './files.js';
import { esc, r } from './tokens.js';

/** Minimal inline formatter: **bold** only, on already-escaped text. */
function fmt(text) {
  return esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

const ICONS = {
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
  arrow:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  sun: '<svg class="theme__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/></svg>',
  moon: '<svg class="theme__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2Z"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  hash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M5 9h14M5 15h14M10 4 8.5 20M15.5 4 14 20"/></svg>',
  repo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v14H6.5A1.5 1.5 0 0 0 5 18.5v-14Z"/><path d="M5 18.5A1.5 1.5 0 0 0 6.5 20H19v-3"/></svg>',
  live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5a13 13 0 0 1 0 17 13 13 0 0 1 0-17Z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 5.5A1.5 1.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A1.5 1.5 0 0 0 5.5 15"/></svg>',
  share:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4m0 0L8 8m4-4 4 4"/><path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13"/></svg>',
  print:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="2"/><path d="M7 14h10v6H7z"/></svg>',
  install:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m0 0 4-4m-4 4-4-4"/><path d="M5 17v1.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V17"/></svg>',
  theme:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor" stroke="none"/></svg>',
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
          <svg viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">
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
          <p class="chart__foot"><span>Zero knowledge</span><span>Keys on device · sealed storage</span></p>
        </div>`;
}

function hero() {
  // Only the visible line is exposed to assistive tech — without aria-hidden a
  // screen reader announces all four taglines stacked on top of each other.
  const lines = PROFILE.lines
    .map(
      (line, i) =>
        `<p class="rotator__line" data-rotator-line${i === 0 ? ' data-active="true"' : ' aria-hidden="true"'}>${esc(line)}</p>`,
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
  const cards = PROJECTS.map((project, i) => {
    // A project only gets the second call to action once it is deployed, so
    // the markup is built from the links that exist rather than a fixed pair.
    const links = [
      `<a class="card__link" href="${esc(project.url)}" rel="noopener">Open repository </a>`,
    ];

    if (project.live) {
      links.push(
        `<a class="card__link card__link--live" href="${esc(project.live)}" rel="noopener">Open live app </a>`,
      );
    }

    return `<article class="card reveal">
            <div class="card__id">
              <h3>${esc(project.name)}</h3>
              <p class="eyebrow card__kind">${esc(project.kind)}</p>
              <div class="card__links">
                ${links.join('\n                ')}
              </div>
              ${
                // "01 / 01" is noise: a counter only earns its place once
                // there is something to count through.
                PROJECTS.length > 1
                  ? `<p class="card__index">${String(i + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}</p>`
                  : ''
              }
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
          </article>`;
  }).join('\n          ');

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
        <p class="reveal">Always open to talk about client-side cryptography, privacy-first products and indie building — and to collaborate with other solo builders.</p>
        <div class="contact__actions reveal">
          <a class="btn btn--primary" href="${LINKS.github}" rel="noopener">${ICONS.github} GitHub</a>
          <a class="btn" href="${LINKS.repos}" rel="noopener">${ICONS.repo} Browse the repos</a>
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
 * Command palette
 * ------------------------------------------------------------------ */

/**
 * Every entry is server-rendered, so the palette needs no client-side data
 * model — app.js only filters DOM nodes it was handed. `data-terms` carries
 * the lowercased haystack the filter matches against.
 */
function commandItems() {
  const sections = [{ id: 'top', label: 'Top', hint: 'Back to the hero' }]
    .concat([{ id: 'about', label: 'About', hint: 'Who is behind this' }])
    .concat(NAV.map((item) => ({ id: item.id, label: item.label, hint: 'Jump to section' })));

  // Deployed apps come before the repositories: someone searching for a
  // project by name most often wants to use it, not to read it.
  const groups = [
    {
      label: 'Go to',
      items: sections.map((section) => ({
        icon: ICONS.hash,
        label: section.label,
        hint: section.hint,
        href: `/#${section.id}`,
        terms: `${section.label} ${section.hint} section jump goto`,
      })),
    },
    {
      label: 'Live apps',
      items: PROJECTS.filter((project) => project.live).map((project) => ({
        icon: ICONS.live,
        label: `${project.name} — live`,
        hint: new URL(project.live).host,
        href: project.live,
        external: true,
        terms: `${project.name} ${project.kind} live app demo deployed site try open`,
      })),
    },
    {
      label: 'Repositories',
      items: PROJECTS.map((project) => ({
        icon: ICONS.repo,
        label: project.name,
        hint: project.kind,
        href: project.url,
        external: true,
        terms: `${project.name} ${project.kind} ${project.stack.join(' ')} repo repository github code`,
      })),
    },
    {
      label: 'Elsewhere',
      items: [
        {
          icon: ICONS.github,
          label: 'GitHub profile',
          hint: 'github.com/wlylabs',
          href: LINKS.github,
          external: true,
          terms: 'github profile source code wlylabs',
        },
        {
          icon: ICONS.repo,
          label: 'All repositories',
          hint: 'Everything public',
          href: LINKS.repos,
          external: true,
          terms: 'repositories all repos browse github',
        },
      ],
    },
    {
      label: 'Actions',
      items: [
        {
          icon: ICONS.theme,
          label: 'Toggle theme',
          hint: 'Light / dark',
          action: 'theme',
          terms: 'theme toggle dark light mode appearance colour color',
        },
        {
          icon: ICONS.copy,
          label: 'Copy link to this page',
          hint: SITE_URL,
          action: 'copy-url',
          terms: 'copy link url share clipboard address',
        },
        {
          icon: ICONS.share,
          label: 'Share',
          hint: 'System share sheet',
          action: 'share',
          optional: true,
          terms: 'share send system sheet',
        },
        {
          icon: ICONS.install,
          label: 'Install this site',
          hint: 'Add to home screen',
          action: 'install',
          optional: true,
          terms: 'install app pwa home screen add standalone',
        },
        {
          icon: ICONS.print,
          label: 'Print / save as PDF',
          hint: 'One-page résumé layout',
          action: 'print',
          terms: 'print pdf save resume cv export paper',
        },
      ],
    },
  ];

  let index = 0;

  return groups
    .filter((group) => group.items.length)
    .map((group) => {
      const items = group.items
        .map((item) => {
          const id = `cmd-${index++}`;
          const attrs = [
            `id="${id}"`,
            'class="cmd__item"',
            'role="option"',
            'aria-selected="false"',
            `data-terms="${esc(`${item.label} ${item.hint} ${item.terms}`.toLowerCase())}"`,
          ];

          if (item.optional) attrs.push('data-optional', 'hidden');
          if (item.action) attrs.push(`data-action="${item.action}"`);

          const body = `<span class="cmd__icon" aria-hidden="true">${item.icon}</span>
                <span class="cmd__label">${esc(item.label)}</span>
                <span class="cmd__hint">${esc(item.hint)}</span>`;

          return item.href
            ? `<a ${attrs.join(' ')} href="${esc(item.href)}"${item.external ? ' rel="noopener"' : ''}>
                ${body}
              </a>`
            : `<button ${attrs.join(' ')} type="button">
                ${body}
              </button>`;
        })
        .join('\n              ');

      return `<div class="cmd__group" role="group" aria-label="${esc(group.label)}">
              <p class="cmd__group-label" aria-hidden="true">${esc(group.label)}</p>
              ${items}
            </div>`;
    })
    .join('\n            ');
}

function commandPalette() {
  return `<dialog class="cmd" data-cmd aria-label="Search and commands">
      <div class="cmd__panel">
        <div class="cmd__field">
          <span class="cmd__field-icon" aria-hidden="true">${ICONS.search}</span>
          <input
            class="cmd__input"
            data-cmd-input
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-autocomplete="list"
            aria-label="Search sections, repositories and actions"
            placeholder="Search sections, repos, actions…"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            enterkeyhint="go"
          />
          <button class="cmd__close" data-cmd-close type="button" aria-label="Close">Esc</button>
        </div>
        <div class="cmd__list" id="cmd-list" role="listbox" aria-label="Results" data-cmd-list>
            ${commandItems()}
          <p class="cmd__empty" data-cmd-empty hidden>Nothing matches that.</p>
        </div>
        <p class="cmd__foot">
          <span><kbd>&#8593;</kbd><kbd>&#8595;</kbd> move</span>
          <span><kbd>&#8629;</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </p>
      </div>
    </dialog>`;
}

/* ------------------------------------------------------------------ *
 * Document
 * ------------------------------------------------------------------ */

/**
 * The `<head>` both documents share. `title`/`description` differ per page;
 * everything else — icons, manifest, social cards — is identical.
 */
function head({ title, description, robots }) {
  // A data block, never executed, so `script-src 'self'` does not apply to it.
  // `<` is escaped anyway so no string in the graph can close the element.
  const graph = JSON.stringify(
    structuredData(STACK_GROUPS.flatMap((group) => group.items)),
  ).replace(/</g, '\\u003c');

  return `  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="author" content="${esc(PROFILE.name)}" />
  ${
    // A noindex page must not also claim the home page as its canonical —
    // that is a contradictory pair of signals. It just opts out.
    robots
      ? `<meta name="robots" content="${robots}" />`
      : `<link rel="canonical" href="${SITE_URL}/" />`
  }
  <meta name="color-scheme" content="light dark" />
  <meta name="theme-color" content="#ffffff" data-theme-color-light />
  <meta name="theme-color" content="#0d1117" data-theme-color-dark />

  <meta property="og:type" content="profile" />
  <meta property="og:site_name" content="${esc(PROFILE.name)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${SITE_URL}/" />
  <meta property="og:image" content="${SITE_URL}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(`${PROFILE.name} — ${PROFILE.role.toLowerCase()}`)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${SITE_URL}/og.png" />
  <meta name="twitter:image:alt" content="${esc(`${PROFILE.name} — ${PROFILE.role.toLowerCase()}`)}" />

  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <meta name="apple-mobile-web-app-title" content="${esc(PROFILE.name)}" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-capable" content="yes" />
  <link rel="stylesheet" href="/styles.css" />
  <script type="application/ld+json">${graph}</script>
  <script src="/theme.js"></script>`;
}

/** Sticky header. Shared by the site and the 404 page so navigation never dead-ends. */
function header() {
  const navLinks = NAV.map(
    (item) => `<li><a data-nav-link href="/#${item.id}">${esc(item.label)}</a></li>`,
  ).join('\n            ');

  return `<header class="nav" data-nav>
    <div class="wrap nav__inner">
      <a class="nav__mark" href="/#top"><span>wly</span>labs</a>
      <nav aria-label="Sections">
        <ul class="nav__links">
            ${navLinks}
        </ul>
      </nav>
      <button class="cmd__open" type="button" data-cmd-open aria-haspopup="dialog" aria-label="Search and commands">
        ${ICONS.search}<span class="cmd__open-keys" aria-hidden="true"><kbd data-cmd-mod>Ctrl</kbd><kbd>K</kbd></span>
      </button>
      <button class="theme" type="button" data-theme-toggle aria-label="Switch to dark theme">
        ${ICONS.sun}${ICONS.moon}
      </button>
    </div>
    <div class="nav__progress" data-progress aria-hidden="true"><span></span></div>
  </header>`;
}

function footer() {
  return `<footer class="foot">
    <div class="wrap foot__inner">
      <span>© ${COPYRIGHT_YEAR} ${esc(PROFILE.name)} · built and deployed by one person</span>
      <span>Generated from <a href="${LINKS.github}/wlylabs" rel="noopener">wlylabs/wlylabs</a> · running on Vercel</span>
    </div>
  </footer>`;
}

/** Floating scroll-to-top control; app.js reveals it once past the hero. */
function toTop() {
  return `<button class="totop" type="button" data-totop aria-label="Back to top">${ICONS.up}</button>`;
}

export function page() {
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
${head({ title: PROFILE.title, description: PROFILE.description })}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>

  ${header()}

  <main id="main" tabindex="-1">
    ${hero()}
    ${about()}
    ${work()}
    ${capabilities()}
    ${stack()}
    ${principles()}
    ${contact()}
  </main>

  ${footer()}

  ${toTop()}
  ${commandPalette()}

  <script src="/app.js" defer></script>
</body>
</html>
`;
}

/**
 * Served by Vercel for any unmatched path. Same shell as the site, so a
 * mistyped URL still lands somewhere navigable rather than on a bare error.
 */
export function notFound() {
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
${head({
  title: `Not found — ${PROFILE.name}`,
  description: 'That page does not exist on wlylabs.',
  robots: 'noindex, follow',
})}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>

  ${header()}

  <main id="main" tabindex="-1">
    <section class="hero missing" id="top">
      <div class="wrap">
        <p class="eyebrow">ERROR · 404</p>
        <h1>404</h1>
        <div class="hero__bar"></div>
        <p class="missing__lead">That page does not exist. Nothing was lost — the site is one document, and everything on it is a scroll away.</p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="/">Back to the profile ${ICONS.arrow}</a>
          <a class="btn" href="${LINKS.repos}" rel="noopener">${ICONS.github} Browse the repos</a>
        </div>
      </div>
    </section>
  </main>

  ${footer()}

  ${toTop()}
  ${commandPalette()}

  <script src="/app.js" defer></script>
</body>
</html>
`;
}
