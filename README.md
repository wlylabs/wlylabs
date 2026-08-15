<!--
  wlylabs — GitHub profile README

  A cover, not a copy. The full profile lives on the site in this repository
  (lib/data.js → lib/page.js → public/index.html, deployed on Vercel); this
  page carries only what a visitor needs before deciding to click through.

  Every image is a generated SVG committed to public/, so nothing here depends
  on a third-party badge service that can go down.
-->

<div align="center">

<img src="public/hero.svg" width="100%" alt="wlylabs — solo builder of end-to-end encrypted web apps" />

<a href="https://wlylabs.vercel.app"><img src="public/btn-site.svg" alt="Open the wlylabs site" /></a>
&nbsp;
<a href="https://github.com/wlylabs?tab=repositories"><img src="public/btn-repos.svg" alt="Browse the repositories" /></a>

</div>

<br />

Independent **solo builder** — no team, no standups. I own every layer of what I
ship: the **cryptography**, **the app in front of it** (Next.js, PWA, offline),
and **the platform behind it** (edge middleware, rate limits, a per-request CSP).

I build **AI-native**, but nothing ships on vibes alone: key derivation lands
with tests, endpoints land with rate limits and a nonce CSP, and the threat
model is written down before the feature is.

<br />

| Project | | |
| :--- | :--- | :--- |
| **[Purbo](https://github.com/wlylabs/purbo)** | zero-knowledge password manager | A 24-word recovery phrase is the vault's only root: it derives both the key that encrypts entries and the key that authenticates to the server, which holds ciphertext and nothing else. Live at **[purbo.vercel.app](https://purbo.vercel.app)**. |

**[The full profile — work, capabilities, stack and principles — is on the site.](https://wlylabs.vercel.app)**

<br />

<img src="public/rule.svg" width="100%" alt="" />

<details>
<summary><sub>How this profile is built</sub></summary>

<br />

This repository is both the GitHub profile and the site it points at. One
content file feeds both, so a fact can only ever be edited in one place.

```
lib/data.js       every fact on the profile — projects, capabilities, stack
lib/page.js       renders the site and the 404 page from that data
lib/files.js      manifest, robots.txt, sitemap.xml, schema.org graph
lib/assets.js     renders the SVGs this README uses, and the app icons
site/             stylesheet, client scripts and service worker, copied verbatim
public/           generated output; the directory Vercel serves
```

```
npm run build     rebuild public/ from the sources
npm run check     fail if the committed output drifted (runs in CI)
npm run dev       build, then serve public/ on :3000
npm run og        re-rasterise the social card (needs a local browser)
npm run icons     re-rasterise the PWA and iOS icons (needs a local browser)
```

**The site.** Static HTML rendered at build time, no framework and no runtime
dependencies. It reads end to end with JavaScript blocked — the theme toggle,
command palette, rotating tagline, scroll reveal and nav highlighting are
enhancements on top, and every control that needs scripting stays hidden until
its handler is attached, so the page never shows a dead affordance.

**Getting around.** <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> (or <kbd>/</kbd>) opens a
command palette: sections, repositories, copy-to-clipboard, theme, share,
install, print. It filters on substrings across every keyword and on a
subsequence of the label, so `cpylnk` finds *Copy link to this page*. On a phone
it opens
as a bottom sheet with a 16px input, which is the threshold below which iOS
Safari zooms the page on focus.

**Print.** The stylesheet has a real print form, so "save as PDF" produces a
one-page résumé rather than a screenshot: chrome dropped, the dark palette
forced back to ink, link targets spelled out after their labels, and page breaks
kept out of the middle of a card.

**Offline.** [`site/sw.js`](site/sw.js) caches the shell — documents
network-first so a reader online always sees the live page, assets
stale-while-revalidate, `/api` and `/banner` never. Its cache is named after a
digest of everything in `public/`, computed at build time, so a deploy that
changes one byte invalidates the previous cache and no version is ever
maintained by hand.

**Headers.** Because no styles or scripts are inline, the
Content-Security-Policy in [`vercel.json`](vercel.json) needs no
`unsafe-inline`: `default-src 'none'` with `self` for scripts, styles, images,
worker and manifest, plus nosniff, `Referrer-Policy`, frame-deny,
`Permissions-Policy` and HSTS. It is matched against every path *without* a file
extension, which covers the document, the 404 page and any future clean URL
while deliberately excluding the SVGs — served on an SVG response,
`default-src 'none'` would also apply to that file's own `<style>` block, which
is what carries its palette.

**The README images.** Each SVG carries both palettes in one document and
switches on `prefers-color-scheme`, so this page needs a single relative URL per
image — the form GitHub is guaranteed to rewrite on every branch — rather than a
`<picture>` srcset or an absolute URL pinned to a branch name. Only system font
stacks are used, because camo blocks external font requests, and motion is gated
behind `prefers-reduced-motion`.

**The banner endpoint.** The same generator runs as a Vercel edge function, so
the hero can be rendered live with different copy:

```
/banner
/banner?theme=dark
/banner?name=wlylabs&status=OPEN%20TO%20WORK
/banner?lines=One%20line|Another%20line
```

</details>
