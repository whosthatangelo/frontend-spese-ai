const CACHE_NAME = 'spese-ai-v2'; // Incrementa versione
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png'
];

// Installazione del service worker
self.addEventListener('install', event => {
  console.log('📦 Service Worker: Installing v2');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
  // Forza l'attivazione immediata
  self.skipWaiting();
});

// Attivazione del service worker
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Activating v2');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminazione cache vecchia:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prendi controllo di tutte le tab aperte
      return self.clients.claim();
    })
  );
});

// Strategia cache-first per assets, network-first per HTML
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se è HTML, sempre network-first
        if (event.request.destination === 'document') {
          return fetch(event.request)
            .then(networkResponse => {
              // Salva in cache se la risposta è ok
              if (networkResponse && networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseToCache));
              }
              return networkResponse;
            })
            .catch(() => {
              // Fallback alla cache se network fallisce
              return response || caches.match('/');
            });
        }

        // Per altri assets, cache-first
        if (response) {
          return response;
        }

        return fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));

          return networkResponse;
        });
      })
      .catch(() => {
        // Fallback offline per pagine HTML
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Gestione aggiornamenti
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});