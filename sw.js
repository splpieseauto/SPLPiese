// SPL Piese Auto — Service Worker
// Compatibil cu GitHub Pages (HTTPS)
const CACHE = 'spl-piese-v1';
const ASSETS = ['./'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Nu cache-uim cererile catre Google Sheets
  if (e.request.url.includes('script.google.com')) return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const c = r.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, c));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
