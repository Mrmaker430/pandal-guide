/* Pandal Guide service worker — app shell only; no OSM tile/API caching. */
const CACHE_NAME = 'pandal-guide-shell-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/main.js',
  './js/state.js',
  './js/map.js',
  './js/actions.js',
  './js/search.js',
  './js/ui.js',
  './js/drawer.js',
  './js/features.js',
  './js/data.js',
  './js/names-bn.js',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache map tiles or third-party geocoding/routing responses.
  if (url.hostname.endsWith('tile.openstreetmap.org') ||
      url.hostname === 'nominatim.openstreetmap.org' ||
      url.hostname === 'router.project-osrm.org') return;

  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate') {
      event.respondWith(
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          }
          return response;
        }).catch(() => caches.match('./index.html'))
      );
      return;
    }

    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }))
    );
    return;
  }

  // Cache Leaflet CDN assets after first successful use, for offline reloads.
  if (url.hostname === 'unpkg.com' && (request.destination === 'script' || request.destination === 'style')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const update = fetch(request).then((response) => {
          if (response.ok || response.type === 'opaque') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
        return cached || update;
      })
    );
  }
});
