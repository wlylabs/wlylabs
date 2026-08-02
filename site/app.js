/**
 * Progressive enhancement only — every section is readable and every link
 * works with this file blocked. Zero dependencies.
 */

(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* -------------------------------------------------- theme toggle */

  var toggle = document.querySelector('[data-theme-toggle]');

  function describe(theme) {
    if (!toggle) return;
    var next = theme === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    toggle.setAttribute('title', 'Switch to ' + next + ' theme');
  }

  describe(root.getAttribute('data-theme'));

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      describe(next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        /* nothing to persist to; the choice still applies for this visit */
      }
    });
  }

  /* -------------------------------------------------- rotating tagline */

  var lines = [].slice.call(document.querySelectorAll('[data-rotator-line]'));

  if (lines.length > 1 && !reduced.matches) {
    var index = 0;
    setInterval(function () {
      if (document.hidden) return;
      lines[index].removeAttribute('data-active');
      index = (index + 1) % lines.length;
      lines[index].setAttribute('data-active', 'true');
    }, 3400);
  }

  /* -------------------------------------------------- scroll reveal */

  var revealables = [].slice.call(document.querySelectorAll('.reveal'));

  if (!('IntersectionObserver' in window) || reduced.matches) {
    revealables.forEach(function (el) {
      el.setAttribute('data-shown', 'true');
    });
  } else {
    var revealer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-shown', 'true');
          revealer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    revealables.forEach(function (el) {
      revealer.observe(el);
    });
  }

  /* -------------------------------------------------- nav state */

  var nav = document.querySelector('[data-nav]');

  if (nav) {
    var onScroll = function () {
      nav.setAttribute('data-scrolled', window.scrollY > 8 ? 'true' : 'false');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var navLinks = [].slice.call(document.querySelectorAll('[data-nav-link]'));
  var sections = navLinks
    .map(function (link) {
      return document.getElementById(link.getAttribute('href').slice(1));
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = navLinks[sections.indexOf(entry.target)];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (other) {
              other.removeAttribute('aria-current');
            });
            link.setAttribute('aria-current', 'true');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }
})();
