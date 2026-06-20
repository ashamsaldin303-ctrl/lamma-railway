const CACHE_NAME = 'lamma-v1';
const STATIC_ASSETS = ['/', '/manifest.json', '/icons/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (request.url.includes('_next/webpack-hmr')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => { const clone = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)); return response; })
        .catch(() => caches.match(request).then((r) => r || caches.match('/')))
    );
    return;
  }

  if (request.url.match(/\.(js|css|woff2|png|jpg|jpeg|svg|gif|webp)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => { const clone = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)); return response; }))
    );
  }
});
