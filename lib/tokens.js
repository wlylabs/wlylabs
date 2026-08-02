/**
 * Design tokens for the wlylabs profile assets.
 *
 * Every generated SVG reads its colours from here, so the README, the static
 * files in `public/` and the `/api/banner` edge function can never drift apart.
 *
 * Brand: clay #D97757 · violet #412991 · ink #0D1117
 * The display accents are lifted or deepened per theme so that contrast holds
 * on GitHub's own canvas (#0D1117 in dark, #FFFFFF in light).
 */

export const FONT_MONO =
  "ui-monospace,'SF Mono',SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

export const FONT_SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,Arial,sans-serif";

/** Advance width of a monospace glyph as a fraction of the font size. */
export const MONO_RATIO = 0.6;

export const THEMES = {
  dark: {
    name: 'dark',
    bg: '#0D1117',
    grid: '#161B22',
    surface: '#11161D',
    border: '#232B35',
    hairline: '#2D3540',
    text: '#E6EDF3',
    muted: '#8B949E',
    faint: '#6E7781',
    accentA: '#E8895F',
    accentB: '#8B5CF6',
    glowA: '#D97757',
    glowB: '#412991',
    glowOpacity: 0.18,
    gridOpacity: 0.55,
  },
  light: {
    name: 'light',
    bg: '#FFFFFF',
    grid: '#EEF1F5',
    surface: '#F7F8FA',
    border: '#DCE1E7',
    hairline: '#C9D1DA',
    text: '#0D1117',
    muted: '#5B6570',
    faint: '#7A838F',
    accentA: '#C2551F',
    accentB: '#412991',
    glowA: '#D97757',
    glowB: '#412991',
    glowOpacity: 0.1,
    gridOpacity: 1,
  },
};

export function theme(name) {
  return THEMES[name] ?? THEMES.dark;
}

/** XML-escape a string so query params can never break out of the document. */
export function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Round to two decimals — keeps generated paths small and diffs stable. */
export function r(n) {
  return Math.round(n * 100) / 100;
}

/** Approximate rendered width of monospace text. */
export function monoWidth(text, size, letterSpacing = 0) {
  return text.length * size * MONO_RATIO + Math.max(0, text.length - 1) * letterSpacing;
}
