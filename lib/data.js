/**
 * Single source of truth for everything the profile says.
 *
 * The Vercel site (lib/page.js), the generated SVG assets (lib/assets.js) and
 * the README cover all read from this file, so a fact can only ever be edited
 * in one place.
 */

/** Deployed site. Change this one string if the project lands on another domain. */
export const SITE_URL = 'https://wlylabs.vercel.app';

export const PROFILE = {
  name: 'wlylabs',
  handle: '@wly0x_',
  eyebrow: 'INDEPENDENT  ·  SOLO BUILDER',
  status: 'SHIPPING',
  title: 'wlylabs — solo builder across smart contracts, edge AI and automation',
  description:
    'Independent solo builder. Bonding-curve ERC20s proven with Foundry, streaming LLM apps on the edge, and pipelines that publish their own artifacts.',
  lines: [
    'Solo builder. Full stack of one.',
    'Bonding-curve ERC20s, proven with Foundry.',
    'Streaming LLM apps that fail over at the edge.',
    'Pipelines that keep running while I sleep.',
  ],
  intro: [
    "I'm an independent **solo builder**. No team, no standups — just an idea, a terminal, and a clean commit history.",
    'The work spans three layers and I own all of them: **onchain** (Solidity contracts that hold real ETH), **the app in front of it** (Next.js, wallets, auth, PWA), and **the automation behind it** (edge functions, AI pipelines, scheduled CI).',
    'I build **AI-native** — designing, writing and reviewing alongside AI — but nothing ships on vibes alone: contracts land with fuzz and invariant suites, endpoints land with rate limits and a CSP, and every repo has CI that has to go green first.',
  ],
};

export const LINKS = {
  x: 'https://x.com/wly0x_',
  github: 'https://github.com/wlylabs',
  repos: 'https://github.com/wlylabs?tab=repositories',
};

export const PROJECTS = [
  {
    name: 'Folio',
    kind: 'token launchpad',
    url: 'https://github.com/wlylabs/Folio',
    summary:
      'Every token launch is published as an article. Each launch clones an ERC20 that is its own bonding-curve market maker — buys and sells price off one constant-product curve, so the reserve always covers every circulating token.',
    highlights: [
      'Live on Robinhood Chain with real ETH',
      'Uniswap v4 migration path at graduation',
      '300+ Foundry tests: unit, fuzz, invariant, adversarial, gas',
      'SIWE sign-in behind Postgres row-level security',
    ],
    stack: [
      'Solidity 0.8.26',
      'Foundry',
      'EIP-1167',
      'Uniswap v4',
      'OpenZeppelin',
      'Slither',
      'Next.js 14',
      'TypeScript',
      'wagmi',
      'viem',
      'RainbowKit',
      'Supabase',
    ],
  },
  {
    name: 'wlybot',
    kind: 'AI chat assistant',
    url: 'https://github.com/wlylabs/wlybot',
    summary:
      'Mobile-first chat PWA running on one edge function. Streams from Groq, falls through to Gemini, then OpenRouter — a rate limit at any vendor never takes the app down, because fallback happens before the first byte reaches the browser.',
    highlights: [
      'Three-provider failover, resolved pre-stream',
      'Web search and news through tool calling',
      'Python blocks execute in-browser via Pyodide',
      'Zero runtime dependencies, CSP and HSTS on every response',
    ],
    stack: [
      'Vercel Edge',
      'SSE streaming',
      'Groq',
      'Gemini',
      'OpenRouter',
      'Vanilla JS',
      'Zero deps',
      'PWA',
      'Pyodide',
      'CSP + HSTS',
    ],
  },
  {
    name: 'wlystock',
    kind: 'AI stock photo pipeline',
    url: 'https://github.com/wlylabs/wlystock',
    summary:
      'Turns a curated prompt library into submission-ready stock photography, unattended. Generates with FLUX.1-schnell, normalizes to stock aspect ratios, then captions with a vision-language model to emit a titles-and-keywords CSV.',
    highlights: [
      'Every stage has a fallback, so one dead endpoint never stalls a run',
      'Scheduled on GitHub Actions, publishes its own artifacts',
      'Aspect-ratio normalisation to agency requirements',
    ],
    stack: [
      'Python 3.11',
      'Hugging Face API',
      'FLUX.1-schnell',
      'Qwen2.5-VL',
      'Pillow',
      'GitHub Actions',
      'cron',
    ],
  },
];

export const CAPABILITIES = [
  {
    title: 'Smart contracts',
    body: 'Bonding-curve AMM maths, EIP-1167 minimal-proxy clones, upgradeable ERC20s, reentrancy and anti-sniper defenses. 300+ Foundry tests across unit, fuzz, invariant, adversarial and gas suites, plus Slither in the loop.',
    refs: ['Folio/contracts'],
  },
  {
    title: 'Web3 frontend',
    body: 'Wallet connection that constructs nothing until the reader asks for it, live onchain pricing, multi-chain-aware reads and trades, deploy records as data rather than constants.',
    refs: ['Folio/app', 'Folio/lib'],
  },
  {
    title: 'Applied AI',
    body: 'Streaming completions, multi-provider failover, function calling, prompt design that survives small models, untrusted-tool-output envelopes against prompt injection, and image + vision-language generation.',
    refs: ['wlybot/api', 'wlystock/src'],
  },
  {
    title: 'Security-minded by default',
    body: 'SIWE (EIP-4361) sign-in minting a Supabase JWT that Postgres row-level security enforces, origin checks, rate limits, body caps, HTML-escaped rendering, CSP · HSTS · frame-deny headers.',
    refs: ['Folio/lib/schema.sql', 'wlybot/vercel.json'],
  },
  {
    title: 'Automation & CI',
    body: 'Typecheck · lint · test · build on every push, contract suites split by EVM profile, nightly fork tests against live Uniswap v4, and scheduled pipelines that publish their own artifacts.',
    refs: ['.github/workflows in every repo'],
  },
  {
    title: 'Product polish',
    body: 'Installable PWAs, offline routes, themes applied before first paint, safe-area layouts, custom Markdown rendering, SEO and OG images — the last 10% that makes it feel finished.',
    refs: ['Folio/app', 'wlybot'],
  },
];

export const STACK_GROUPS = [
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
    body: 'Tests, fuzzing and CI decide when something is done.',
  },
];

export const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'stack', label: 'Stack' },
  { id: 'principles', label: 'Principles' },
  { id: 'contact', label: 'Contact' },
];
