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
  handle: '@gaptekcat',
  role: 'Independent solo builder',
  eyebrow: 'INDEPENDENT  ·  SOLO BUILDER',
  status: 'SHIPPING',
  title: 'wlylabs — solo builder of end-to-end encrypted web apps',
  description:
    'Independent solo builder. Purbo is a zero-knowledge password manager: keys derived in the browser from a 24-word phrase, ciphertext-only storage, and a server that cannot read a vault.',
  lines: [
    'Solo builder. Full stack of one.',
    'Zero-knowledge by construction, not by policy.',
    'Keys live in the browser. Servers see bytes.',
    'Signed in and able to decrypt are one fact.',
  ],
  intro: [
    "I'm an independent **solo builder**. No team, no standups — just an idea, a terminal, and a clean commit history.",
    'Right now that means **Purbo**: a password manager with no sign-up, no email and no identity provider, where a 24-word recovery phrase derives both the key that encrypts a vault and the key that authenticates it to the server. I own every layer of it — the **cryptography**, the **app** in front of it (Next.js, PWA, offline), and the **platform** behind it (edge middleware, rate limits, a per-request CSP).',
    'I build **AI-native** — designing, writing and reviewing alongside AI — but nothing ships on vibes alone: key derivation lands with tests, endpoints land with rate limits and a nonce CSP, and the threat model is written down before the feature is.',
  ],
};

export const LINKS = {
  x: 'https://x.com/gaptekcat',
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
      'A password manager built around a web3 wallet flow: you create a vault and get a 24-word recovery phrase that is its only root. Every entry is sealed in the browser before it touches the network, so the server holds ciphertext, a revision counter and nothing else.',
    highlights: [
      'No sign-up, no email, no identity provider',
      'Three independent paths to the root key: passphrase, recovery phrase, passkey',
      'Ed25519 challenge–response derived from the phrase itself, so "signed in" and "can decrypt" are one fact',
      'Installable PWA with a hand-written service worker that never caches /api/',
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind v4',
      'WebCrypto',
      'AES-256-GCM',
      'HKDF-SHA-256',
      'Argon2id',
      'BIP39',
      'Ed25519',
      'WebAuthn PRF',
      'Upstash KV',
      'Vercel',
    ],
  },
];

export const CAPABILITIES = [
  {
    title: 'Applied cryptography',
    body: 'AES-256-GCM sealed with associated data that binds every ciphertext to its owner and its own record, HKDF-SHA-256 domain separation, Argon2id at 64 MiB and 3 passes, BIP39 seed derivation, and non-extractable WebCrypto keys with intermediates zeroed after use.',
    refs: ['purbo/lib/crypto', 'purbo/lib/vault/keyring.ts'],
  },
  {
    title: 'Auth without accounts',
    body: 'Ed25519 challenge–response signed by a key the recovery phrase derives: single-use nonces redeemed atomically, the origin taken from the request URL and folded into the signed message, and HMAC session tags rather than JWTs. Login is deliberately not an account-existence oracle.',
    refs: ['purbo/lib/auth', 'purbo/app/api/auth'],
  },
  {
    title: 'Passkeys as key material',
    body: "WebAuthn's PRF extension yields a 32-byte secret only one authenticator can reproduce, released behind a biometric or device PIN, wrapping a copy of the root key that is stored as ciphertext. The server verifies no assertion and holds no credential public key.",
    refs: ['purbo/lib/auth/passkey.ts', 'purbo/app/api/auth/passkey'],
  },
  {
    title: 'Security-minded by default',
    body: 'A per-request nonce CSP with strict-dynamic instead of an allowlist, HSTS preload, frame-ancestors none, COOP/CORP isolation, rate limits on every route, zod-validated bodies, and step-up confirmation in front of export and deletion.',
    refs: ['purbo/proxy.ts', 'purbo/lib/server'],
  },
  {
    title: 'Offline-first product',
    body: 'An installable PWA whose service worker is written by hand rather than generated: /api/ is never cached under any strategy, cross-origin responses are never stored, navigations fall back to an offline route, and an update never applies itself while a vault is unlocked.',
    refs: ['purbo/public/sw.js', 'purbo/lib/storage'],
  },
  {
    title: 'Product polish',
    body: 'Themes applied before first paint, command palettes, safe-area layouts, masked fields with clipboard entries that expire, icons rasterised from signed distance fields so no image toolchain enters the dependency tree, SEO and OG images.',
    refs: ['purbo/components', 'purbo/scripts/generate-icons.mjs'],
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
      'PBKDF2-HMAC-SHA512',
      'Ed25519',
      'BIP39',
      'WebAuthn PRF',
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
      'PWA',
      'Service workers',
      'IndexedDB',
    ],
  },
  {
    label: 'PLATFORM',
    items: [
      'Vercel',
      'Edge middleware',
      'Upstash KV',
      'Zod',
      'HMAC sessions',
      'Rate limiting',
      'GitHub Actions',
    ],
  },
  {
    label: 'HARDENING',
    items: [
      'Nonce CSP',
      'strict-dynamic',
      'HSTS preload',
      'COOP · CORP',
      'frame-ancestors none',
      'Auto-lock',
      'Step-up confirmation',
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
    body: 'Tests and a typechecker decide when something is done, not a feeling.',
  },
];

export const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'stack', label: 'Stack' },
  { id: 'principles', label: 'Principles' },
  { id: 'contact', label: 'Contact' },
];
