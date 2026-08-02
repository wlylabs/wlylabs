/**
 * Runs before first paint (loaded synchronously in <head>), so the page never
 * flashes the wrong palette. Kept in its own file rather than inline so the
 * Content-Security-Policy can stay free of 'unsafe-inline'.
 */
(function () {
  var stored = null;
  try {
    stored = localStorage.getItem('theme');
  } catch (e) {
    /* private mode: fall through to the system preference */
  }

  var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  var theme = stored === 'dark' || stored === 'light' ? stored : system;

  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.remove('no-js');
})();
