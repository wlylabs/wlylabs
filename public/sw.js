/**
 * Offline shell for the profile site.
 *
 * The VERSION placeholder below is substituted at build time with a hash of
 * everything in `public/`, so a deploy that changes one byte gets a new cache
 * name and the previous one is dropped on activate. Never hand-versioned, and
 * the build fails if the substitution does not happen.
 *
 * Strategy, deliberately conservative for a site that is one document:
 *   documents  network-first  — a reader online always sees the live page
 *   assets     stale-while-revalidate — instant paint, refreshed in the back
 *   /api, /banner  never cached — the edge function is the point of them
 */

var VERSION = "57be89e6f6dd";
var CACHE = 'wlylabs-' + VERSION;

var SHELL = [
  '/',
  '/404.html',
  '/styles.css',
  '/theme.js',
  '/app.js',
  '/favicon.svg',
  '/manifest.webmanifest',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(function (cache) {
        return cache.addAll(SHELL);
      })
      .then(function () {
        return self.skipWaiting();
      }),
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            return key === CACHE ? null : caches.delete(key);
          }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

/** Same-origin GETs only, and never the live endpoints. */
function cacheable(request, url) {
  return (
    request.method === 'GET' &&
    url.origin === self.location.origin &&
    url.pathname !== '/banner' &&
    url.pathname.indexOf('/api/') !== 0 &&
    url.pathname !== '/sw.js'
  );
}

function put(request, response) {
  if (!response || !response.ok || response.type === 'opaque') return response;
  var copy = response.clone();
  caches.open(CACHE).then(function (cache) {
    cache.put(request, copy);
  });
  return response;
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);

  if (!cacheable(request, url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          return put(request, response);
        })
        .catch(function () {
          // Offline: the exact document, else the shell, else the 404 page.
          return caches
            .match(request)
            .then(function (hit) {
              return hit || caches.match('/');
            })
            .then(function (hit) {
              return hit || caches.match('/404.html');
            })
            .then(function (hit) {
              return hit || Response.error();
            });
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (hit) {
      var live = fetch(request)
        .then(function (response) {
          return put(request, response);
        })
        .catch(function () {
          return hit;
        });
      return hit || live;
    }),
  );
});
