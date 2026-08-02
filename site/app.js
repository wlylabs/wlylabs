/**
 * Progressive enhancement only — every section is readable and every link
 * works with this file blocked. Zero dependencies.
 *
 * Controls that cannot work without JavaScript (the theme toggle, the command
 * palette, the scroll-to-top button) are hidden by CSS until this file marks
 * the document ready, so the page never shows a dead affordance.
 */

(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarse = window.matchMedia('(pointer: coarse)');

  function on(target, type, handler, options) {
    if (target) target.addEventListener(type, handler, options);
  }

  /* -------------------------------------------------- theme */

  var toggle = document.querySelector('[data-theme-toggle]');
  var themeLight = document.querySelector('[data-theme-color-light]');
  var themeDark = document.querySelector('[data-theme-color-dark]');

  /**
   * The browser chrome has to follow the *chosen* theme, not the system one.
   * Two media-scoped <meta> tags cannot express that, so the resolved theme
   * drives which tag is live and the other is emptied out.
   */
  function paint(theme) {
    if (themeLight) themeLight.setAttribute('media', theme === 'dark' ? 'not all' : 'all');
    if (themeDark) themeDark.setAttribute('media', theme === 'dark' ? 'all' : 'not all');
  }

  function describe(theme) {
    if (!toggle) return;
    var next = theme === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    toggle.setAttribute('title', 'Switch to ' + next + ' theme');
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    describe(theme);
    paint(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      /* nothing to persist to; the choice still applies for this visit */
    }
  }

  describe(root.getAttribute('data-theme'));
  paint(root.getAttribute('data-theme'));

  on(toggle, 'click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* -------------------------------------------------- rotating tagline */

  var lines = [].slice.call(document.querySelectorAll('[data-rotator-line]'));

  if (lines.length > 1 && !reduced.matches) {
    var index = 0;
    setInterval(function () {
      if (document.hidden) return;
      lines[index].removeAttribute('data-active');
      lines[index].setAttribute('aria-hidden', 'true');
      index = (index + 1) % lines.length;
      lines[index].setAttribute('data-active', 'true');
      lines[index].removeAttribute('aria-hidden');
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

  /* -------------------------------------------------- nav, progress, top */

  var nav = document.querySelector('[data-nav]');
  var progress = document.querySelector('[data-progress] span');
  var totop = document.querySelector('[data-totop]');
  var ticking = false;

  function frame() {
    ticking = false;

    var y = window.scrollY || window.pageYOffset;

    if (nav) nav.setAttribute('data-scrolled', y > 8 ? 'true' : 'false');

    if (progress) {
      var travel = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (travel > 0 ? Math.min(1, y / travel) : 0) + ')';
    }

    if (totop) totop.setAttribute('data-shown', y > window.innerHeight ? 'true' : 'false');
  }

  function measure() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(frame);
  }

  measure();
  on(window, 'scroll', measure, { passive: true });
  on(window, 'resize', measure, { passive: true });

  on(totop, 'click', function () {
    window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
    var mark = document.querySelector('.nav__mark');
    if (mark) mark.focus({ preventScroll: true });
  });

  var navLinks = [].slice.call(document.querySelectorAll('[data-nav-link]'));
  var sections = navLinks
    .map(function (link) {
      return document.getElementById((link.getAttribute('href') || '').split('#')[1] || '');
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

  /* -------------------------------------------------- command palette */

  var dialog = document.querySelector('[data-cmd]');
  var supported = dialog && typeof dialog.showModal === 'function';

  if (supported) {
    var opener = document.querySelector('[data-cmd-open]');
    var input = dialog.querySelector('[data-cmd-input]');
    var list = dialog.querySelector('[data-cmd-list]');
    var empty = dialog.querySelector('[data-cmd-empty]');
    var items = [].slice.call(dialog.querySelectorAll('.cmd__item'));
    var visible = items.slice();
    var active = 0;
    var installPrompt = null;

    // Apple platforms label the modifier ⌘; everything else says Ctrl.
    var apple = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
    var mod = document.querySelector('[data-cmd-mod]');
    if (apple && mod) mod.textContent = '⌘';

    function enable(action) {
      var el = dialog.querySelector('[data-action="' + action + '"]');
      if (el) el.removeAttribute('hidden');
      return el;
    }

    if (typeof navigator.share === 'function') enable('share');

    on(window, 'beforeinstallprompt', function (event) {
      event.preventDefault();
      installPrompt = event;
      enable('install');
    });

    function select(next) {
      items.forEach(function (item) {
        item.setAttribute('aria-selected', 'false');
      });

      if (!visible.length) {
        if (input) input.removeAttribute('aria-activedescendant');
        return;
      }

      active = (next + visible.length) % visible.length;
      var el = visible[active];
      el.setAttribute('aria-selected', 'true');
      el.scrollIntoView({ block: 'nearest' });
      if (input) input.setAttribute('aria-activedescendant', el.id);
    }

    /** Letters of `needle` appearing in order anywhere in `haystack`. */
    function subsequence(haystack, needle) {
      var i = 0;
      for (var j = 0; j < haystack.length && i < needle.length; j++) {
        if (haystack.charAt(j) === needle.charAt(i)) i++;
      }
      return i === needle.length;
    }

    /**
     * Substring anywhere in the keywords, or a subsequence of the label alone —
     * so "cpyhndl" still finds "Copy handle", while a loose run of letters
     * scattered across a long keyword list does not drag in every other row.
     */
    var entries = items.map(function (el) {
      return {
        el: el,
        label: (el.querySelector('.cmd__label').textContent || '').toLowerCase(),
        terms: el.getAttribute('data-terms') || '',
      };
    });

    function filter() {
      var query = (input ? input.value : '').trim().toLowerCase();

      visible = entries
        .filter(function (entry) {
          var el = entry.el;
          if (el.hasAttribute('hidden') && el.hasAttribute('data-optional')) return false;
          var hit =
            !query || entry.terms.indexOf(query) !== -1 || subsequence(entry.label, query);
          el.setAttribute('data-filtered', hit ? 'false' : 'true');
          return hit;
        })
        .map(function (entry) {
          return entry.el;
        });

      // A group whose every item is filtered out should take its label with it.
      [].slice.call(dialog.querySelectorAll('.cmd__group')).forEach(function (group) {
        var any = [].slice.call(group.querySelectorAll('.cmd__item')).some(function (item) {
          return visible.indexOf(item) !== -1;
        });
        group.setAttribute('data-filtered', any ? 'false' : 'true');
      });

      if (empty) empty.hidden = visible.length > 0;
      select(0);
    }

    function open() {
      filter();
      dialog.showModal();
      // A 16px input is what stops iOS Safari zooming on focus; the palette
      // still should not steal the keyboard from a thumb-driven reader.
      if (input && !coarse.matches) input.focus();
    }

    function close() {
      if (dialog.open) dialog.close();
    }

    function run(item) {
      var action = item.getAttribute('data-action');

      if (!action) {
        close();
        return; // an <a>: let the browser follow it
      }

      if (action === 'theme') {
        setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      } else if (action === 'copy-handle') {
        copy(item, item.querySelector('.cmd__hint').textContent);
        return;
      } else if (action === 'copy-url') {
        copy(item, location.origin + '/');
        return;
      } else if (action === 'share' && navigator.share) {
        navigator
          .share({ title: document.title, url: location.origin + '/' })
          .catch(function () {});
      } else if (action === 'install' && installPrompt) {
        installPrompt.prompt();
        installPrompt = null;
      } else if (action === 'print') {
        close();
        window.print();
        return;
      }

      close();
    }

    /** Copies, then reports back in the row itself — no toast, no layout shift. */
    function copy(item, text) {
      var hint = item.querySelector('.cmd__hint');
      var was = hint ? hint.textContent : '';

      function done(ok) {
        if (!hint) return;
        hint.textContent = ok ? 'Copied' : 'Press ⌘C to copy';
        item.setAttribute('data-flash', ok ? 'true' : 'false');
        setTimeout(function () {
          hint.textContent = was;
          item.removeAttribute('data-flash');
        }, 1600);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () {
            done(true);
          },
          function () {
            done(false);
          },
        );
      } else {
        done(false);
      }
    }

    on(opener, 'click', open);
    on(dialog.querySelector('[data-cmd-close]'), 'click', close);
    on(input, 'input', filter);

    items.forEach(function (item, i) {
      on(item, 'click', function (event) {
        if (item.getAttribute('data-action')) event.preventDefault();
        active = Math.max(0, visible.indexOf(item));
        run(item);
      });
      on(item, 'mousemove', function () {
        var at = visible.indexOf(item);
        if (at !== -1 && at !== active) select(at);
      });
      if (i === 0) item.setAttribute('aria-selected', 'true');
    });

    on(dialog, 'keydown', function (event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        select(active + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        select(active - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        select(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        select(visible.length - 1);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (visible[active]) {
          if (!visible[active].getAttribute('data-action')) visible[active].click();
          else run(visible[active]);
        }
      }
    });

    // Clicking the backdrop is a click on <dialog> itself, never on the panel.
    on(dialog, 'click', function (event) {
      if (event.target === dialog) close();
    });

    on(dialog, 'close', function () {
      if (input) input.value = '';
      if (opener) opener.focus({ preventScroll: true });
    });

    on(document, 'keydown', function (event) {
      var focused = document.activeElement || {};
      var typing =
        /^(INPUT|TEXTAREA|SELECT)$/.test(focused.tagName || '') || focused.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && (event.key || '').toLowerCase() === 'k') {
        event.preventDefault();
        dialog.open ? close() : open();
      } else if (event.key === '/' && !typing && !dialog.open) {
        event.preventDefault();
        open();
      }
    });

    root.setAttribute('data-cmd-ready', 'true');
  }

  root.setAttribute('data-ready', 'true');

  /* -------------------------------------------------- offline shell */

  if ('serviceWorker' in navigator) {
    on(window, 'load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {
        /* offline support is a bonus; the site works fine without it */
      });
    });
  }
})();
