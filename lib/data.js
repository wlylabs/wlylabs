/**
 * Single source of truth for everything the profile says.
 *
 * The Vercel site (lib/page.js), the generated SVG assets (lib/assets.js) and
 * the README cover all read from this file, so a fact can only ever be edited
 * in one place.
 */

/** Deployed site. Change this one string if the project lands on another domain. */
export const SITE_URL = 'https://wlylabs.vercel.app';

/**
 * Footer copyright year. Deliberately a constant rather than `new Date()`:
 * the build has to be reproducible, and a clock-derived year would make
 * `npm run check` fail on 1 January against output built the day before.
 */
export const COPYRIGHT_YEAR = 2026;

export const PROFILE = {
  name: 'wlylabs',
  handle: '@w0x___',
  role: 'Independent solo builder',
  eyebrow: 'INDEPENDENT  ·  SOLO BUILDER',
  status: 'SHIPPING',
  title: 'wlylabs — solo builder shipping zero-knowledge, offline-first web apps',
  description:
    'Independent solo builder. Client-side cryptography where the key never leaves the browser, authentication with no account to breach, and installable apps that keep working with the network off.',
  lines: [
    'Solo builder. Full stack of one.',
    'Vaults the server is unable to read.',
    'Keys derived on the device, never uploaded.',
    'Apps that still open with the network off.',
  ],
  intro: [
    "I'm an independent **solo builder**. No team, no standups — just an idea, a terminal, and a clean commit history.",
    'The work spans three layers and I own all of them: **the cryptography** (key hierarchies, AEAD, password stretching that runs in the browser), **the app around it** (Next.js, React, offline-first PWAs), and **the edge in front of it** (per-request CSP nonces, rate limits, serverless storage that only ever holds ciphertext).',
    'I build **AI-native** — designing, writing and reviewing alongside AI — but nothing ships on vibes alone: key hierarchies land with tests that prove what they derive, endpoints land with rate limits and a nonce CSP, and the design is written down next to the code so the trade-offs stay honest.',
  ],
};

export const LINKS = {
  x: 'https://x.com/w0x___',
  github: 'https://github.com/wlylabs',
  repos: 'https://github.com/wlylabs?tab=repositories',
};

/** `live` is optional: only projects with a deployed app carry one. */
export const PROJECTS = [
  {
    name: 'Purbo',
    kind: 'zero-knowledge password manager',
    url: 'https://github.com/wlylabs/purbo',
    live: 'https://purbo.vercel.app',
    summary:
      'A password vault opened the way a wallet is: 24 words are the only root, and every entry is sealed in the browser before it touches the network. The same phrase derives both the key that decrypts the vault and the key that authenticates it, so "signed in" and "can decrypt" are one fact rather than two.',
    highlights: [
      'No sign-up and no identity provider — Ed25519 challenge–response derived from the phrase',
      'Passphrase, recovery phrase or passkey: three independent paths to one root key',
      'AES-256-GCM per entry, bound to its owner and record so a blob cannot be relocated',
      'Installable PWA over a hand-written service worker that never caches /api',
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind v4',
      'WebCrypto',
      'Argon2id',
      'HKDF-SHA-256',
      'BIP39',
      'Ed25519',
      'WebAuthn PRF',
      'Upstash KV',
      'PWA',
    ],
  },
];

export const CAPABILITIES = [
  {
    title: 'Applied cryptography',
    body: 'Key hierarchies with domain-separated HKDF subkeys, AES-256-GCM sealed against associated data so a ciphertext cannot be moved between records, Argon2id at 64 MiB, and keys held as non-extractable CryptoKeys with the intermediates zeroed.',
    refs: ['purbo/lib/crypto', 'purbo/lib/vault'],
  },
  {
    title: 'Auth without accounts',
    body: 'Ed25519 challenge–response signed by a key the phrase derives, single-use nonces redeemed with an atomic read-and-delete, the origin taken from the request URL rather than a header, and session tokens that are an HMAC tag rather than a JWT.',
    refs: ['purbo/lib/auth', 'purbo/app/api/auth'],
  },
  {
    title: 'Offline-first PWA',
    body: 'Hand-written service workers — navigations network-first, hashed assets cache-first, /api never cached at all — with ciphertext kept in IndexedDB so an installed app opens and decrypts with no connection, and updates that wait for consent instead of reloading mid-use.',
    refs: ['purbo/public/sw.js', 'purbo/lib/storage'],
  },
  {
    title: 'Security-minded by default',
    body: 'A per-request nonce CSP with strict-dynamic instead of an allowlist there are known bypasses for, HSTS preload, COOP/CORP isolation, frame-ancestors none, WebAuthn scoped to self, request bodies validated at the wire, and rate limits on every route.',
    refs: ['purbo/proxy.ts', 'purbo/lib/server'],
  },
  {
    title: 'Product polish',
    body: 'Installable apps, offline routes, themes applied before first paint, safe-area layouts, auto-lock and clipboard expiry, icons rasterised from signed distance fields so no image toolchain enters the dependency tree.',
    refs: ['purbo/app/vault', 'purbo/components'],
  },
  {
    title: 'Build & CI',
    body: 'Typecheck · lint · test · build before anything ships, tests that assert what a key hierarchy actually derives, and reproducible builds a CI job re-runs to prove the committed output still matches its sources.',
    refs: ['purbo/tests', 'wlylabs/scripts/build.mjs'],
  },
];

export const STACK_GROUPS = [
  {
    label: 'CRYPTOGRAPHY',
    items: [
      'WebCrypto',
      'AES-256-GCM',
      'HKDF-SHA-256',
      'Argon2id',
      'BIP39',
      'Ed25519',
      'WebAuthn PRF',
      'HMAC-SHA-256',
    ],
  },
  {
    label: 'APPLICATION',
    items: [
      'TypeScript',
      'Next.js 16',
      'React 19',
      'Node.js',
      'Tailwind v4',
      'IndexedDB',
      'Service workers',
      'PWA',
    ],
  },
  {
    label: 'PLATFORM',
    items: [
      'Vercel',
      'Upstash / Vercel KV',
      'Edge middleware',
      'Nonce CSP',
      'HSTS preload',
      'COOP · CORP',
      'Rate limiting',
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      'GitHub Actions',
      'Reproducible builds',
      'Typecheck · lint · test',
      'Threat modelling',
      'Zod wire validation',
      'Generated assets',
    ],
  },
];

export const PRINCIPLES = [
  {
    title: 'Problem first',
    body: 'I start from what has to be true, never from the boilerplate.',
  },
  {
    title: 'Ship in slices',
    body: 'Small, frequent iterations over big-bang releases.',
  },
  {
    title: 'Write down the why',
    body: "The reasoning lives next to the code, so future me doesn't re-litigate it.",
  },
  {
    title: 'Prove it, don’t assume it',
    body: 'Tests and CI decide when something is done — not how finished it feels.',
  },
];

export const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'stack', label: 'Stack' },
  { id: 'principles', label: 'Principles' },
  { id: 'contact', label: 'Contact' },
];
