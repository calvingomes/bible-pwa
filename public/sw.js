const CACHE_NAME = 'bible-pwa-v2';
const STATIC_ASSETS = [
  '/',
  '/search',
  '/journal',
  '/manifest.json',
  '/data/books.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg'
];

// Install Event - Pre-cache core shell resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching structural assets...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache-First with Network-Fallback strategy
self.addEventListener('fetch', (event) => {
  const reqUrl = new URL(event.request.url);

  // We only intercept requests to our own domain
  if (reqUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Validate response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Cache loaded dynamic static JSON files (e.g. books data)
        if (reqUrl.pathname.startsWith('/data/')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      }).catch((err) => {
        console.error('[Service Worker] Fetch failed offline:', err);
        // Fallback or let browser display offline page naturally
      });
    })
  );
});
