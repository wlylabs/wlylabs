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
  var explicit = stored === 'dark' || stored === 'light';

  document.documentElement.setAttribute('data-theme', explicit ? stored : system);

  /* Resolving the system preference into an attribute is what lets the toggle
     label and the browser chrome name a concrete theme, but it also freezes
     the page on whatever the OS said at load. This marks the visit as unpinned
     so app.js can keep following the OS until a choice is actually made. */
  if (!explicit) document.documentElement.setAttribute('data-theme-auto', '');

  document.documentElement.classList.remove('no-js');
})();
