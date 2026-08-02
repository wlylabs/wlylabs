/**
 * Live banner renderer — Vercel Edge Function.
 *
 *   /api/banner                          hero that follows the reader's theme
 *   /banner?theme=dark                   pinned palette (clean URL via vercel.json)
 *   /banner?name=wlylabs&status=OPEN
 *   /banner?lines=One line|Another line
 *
 * Same generator as the committed files in `public/`, so the live endpoint and
 * the static fallbacks are always the identical design.
 */

import { hero } from '../lib/assets.js';

export const config = { runtime: 'edge' };

const MAX = 96;

function clamp(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, MAX) : fallback;
}

export default function handler(request) {
  const { searchParams } = new URL(request.url);

  const lines = searchParams
    .get('lines')
    ?.split('|')
    .map((line) => line.trim().slice(0, MAX))
    .filter(Boolean)
    .slice(0, 6);

  const requested = searchParams.get('theme');

  const svg = hero({
    theme: requested === 'dark' || requested === 'light' ? requested : 'auto',
    name: clamp(searchParams.get('name'), undefined),
    eyebrow: clamp(searchParams.get('eyebrow'), undefined),
    status: clamp(searchParams.get('status'), undefined),
    lines: lines?.length ? lines : undefined,
  });

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
