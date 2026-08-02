/**
 * The small non-HTML files a deployed site is expected to serve: the web app
 * manifest, robots.txt and sitemap.xml.
 *
 * They read from lib/data.js like everything else, so the installed app name,
 * the crawler's view of the site and the page itself can never disagree.
 */

import { LINKS, PROFILE, SITE_URL } from './data.js';

/** Every document the site serves, in the order a crawler should meet them. */
export const ROUTES = ['/'];

/**
 * Installable-app metadata. The SVG icon covers Chrome and Firefox at any
 * size; the rasterised PNGs exist because Android's launcher and iOS's home
 * screen will not take an SVG.
 */
export function manifest() {
  return `${JSON.stringify(
    {
      name: `${PROFILE.name} — ${PROFILE.role.toLowerCase()}`,
      short_name: PROFILE.name,
      description: PROFILE.description,
      id: '/',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'any',
      background_color: '#0d1117',
      theme_color: '#0d1117',
      categories: ['developer', 'portfolio', 'productivity'],
      icons: [
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      shortcuts: [
        { name: 'Selected work', url: '/#work' },
        { name: 'Contact', url: '/#contact' },
      ],
    },
    null,
    2,
  )}\n`;
}

export function robots() {
  return `# ${PROFILE.name} — ${SITE_URL}
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

export function sitemap() {
  // No <lastmod>: it would either be a clock read (which breaks the
  // reproducible build) or a lie, and Google ignores an unreliable one anyway.
  const urls = ROUTES.map(
    (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`,
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * schema.org graph for the page. Emitted as a `application/ld+json` data block,
 * which the HTML parser never executes — so it needs no CSP allowance.
 */
export function structuredData(knowsAbout) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: PROFILE.name,
        alternateName: PROFILE.handle,
        url: `${SITE_URL}/`,
        jobTitle: PROFILE.role,
        description: PROFILE.description,
        knowsAbout,
        sameAs: [LINKS.x, LINKS.github],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: PROFILE.name,
        description: PROFILE.description,
        inLanguage: 'en',
        author: { '@id': `${SITE_URL}/#person` },
      },
    ],
  };
}
