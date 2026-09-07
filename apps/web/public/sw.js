// TOEIC Master Service Worker
const CACHE_NAME = 'toeic-master-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/roadmap',
  '/vocabulary',
  '/grammar',
  '/tests',
  '/skills',
  '/speaking',
  '/writing',
  '/social',
  '/subscription'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass through non-GET and API calls directly
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            // Cache static assets
            if (event.request.url.startsWith(self.location.origin)) {
              cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        })
      );
    }).catch(() => {
      // Fallback response if offline
      return caches.match('/');
    })
  );
});
