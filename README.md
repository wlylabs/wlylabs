<!--
  wlylabs — GitHub profile README

  A cover, not a copy. The full profile lives on the site in this repository
  (lib/data.js → lib/page.js → public/index.html, deployed on Vercel); this
  page carries only what a visitor needs before deciding to click through.

  Every image is a generated SVG committed to public/, so nothing here depends
  on a third-party badge service that can go down.
-->

<div align="center">

<img src="public/hero.svg" width="100%" alt="wlylabs — solo builder across smart contracts, edge AI and automation" />

<a href="https://wlylabs.vercel.app"><img src="public/btn-site.svg" alt="Open the wlylabs site" /></a>
&nbsp;
<a href="https://x.com/wly0x_"><img src="public/btn-x.svg" alt="Follow @wly0x_ on X" /></a>
&nbsp;
<a href="https://github.com/wlylabs?tab=repositories"><img src="public/btn-repos.svg" alt="Browse the repositories" /></a>

</div>

<br />

Independent **solo builder** — no team, no standups. The work spans three layers
and I own all of them: **onchain** (Solidity contracts that hold real ETH),
**the app in front of it** (Next.js, wallets, auth, PWA), and **the automation
behind it** (edge functions, AI pipelines, scheduled CI).

I build **AI-native**, but nothing ships on vibes alone: contracts land with fuzz
and invariant suites, endpoints land with rate limits and a CSP, and every repo
has CI that has to go green first.

<br />

| Project | | |
| :--- | :--- | :--- |
| **[Folio](https://github.com/wlylabs/Folio)** | token launchpad | ERC20s that are their own bonding-curve market maker, live with real ETH. 300+ Foundry tests. |
| **[wlybot](https://github.com/wlylabs/wlybot)** | AI chat assistant | Streaming chat PWA on one edge function, with three-provider failover resolved before the first byte. |
| **[wlystock](https://github.com/wlylabs/wlystock)** | AI stock photo pipeline | Prompt library to submission-ready stock photography, unattended, with a fallback at every stage. |

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
lib/page.js       renders the site from that data
lib/assets.js     renders the SVGs this README uses
site/             stylesheet and client scripts, copied verbatim
public/           generated output; the directory Vercel serves
```

```
npm run build     rebuild public/ from the sources
npm run check     fail if the committed output drifted (runs in CI)
npm run dev       build, then serve public/ on :3000
npm run og        re-rasterise the social card (needs a local browser)
```

**The site.** Static HTML rendered at build time, no framework and no runtime
dependencies. It reads end to end with JavaScript blocked — the theme toggle,
rotating tagline, scroll reveal and nav highlighting are enhancements on top.
Because no styles or scripts are inline, the Content-Security-Policy in
[`vercel.json`](vercel.json) needs no `unsafe-inline`: `default-src 'none'` with
`self` for scripts, styles and images, plus nosniff, `Referrer-Policy`,
frame-deny, `Permissions-Policy` and HSTS.

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
