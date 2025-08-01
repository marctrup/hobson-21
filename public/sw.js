// Service Worker for caching and performance
const CACHE_NAME = 'hobson-ai-v2';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png',
  '/lovable-uploads/915c8f99-05e9-4948-aa5d-7704686f4175.png',
  '/lovable-uploads/4351fb54-1d77-416e-9474-3c80e483a83c.png',
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch with Network First strategy for HTML, Cache First for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  if (request.destination === 'document') {
    // Network first for HTML documents
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else if (request.destination === 'image' || request.destination === 'script' || request.destination === 'style') {
    // Cache first for static assets
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
    );
  }
});