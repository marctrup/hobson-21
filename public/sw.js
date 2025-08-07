// Service Worker for caching and performance optimization
const CACHE_NAME = 'hobson-ai-v4';
const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  // Critical images only
  '/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png', // Logo
];

// Maximum cache age in milliseconds (7 days)
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

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
    // Cache first for static assets with compression header support
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            // Check cache age and refresh if too old
            const cachedTime = response.headers.get('sw-cached-time');
            if (cachedTime && Date.now() - parseInt(cachedTime) > CACHE_MAX_AGE) {
              return fetch(request).then((fetchResponse) => {
                if (fetchResponse.status === 200) {
                  const responseToCache = fetchResponse.clone();
                  const headers = new Headers(responseToCache.headers);
                  headers.set('sw-cached-time', Date.now().toString());
                  
                  caches.open(STATIC_CACHE).then((cache) => {
                    cache.put(request, new Response(responseToCache.body, {
                      status: responseToCache.status,
                      statusText: responseToCache.statusText,
                      headers: headers
                    }));
                  });
                }
                return fetchResponse;
              }).catch(() => response);
            }
            return response;
          }
          
          return fetch(request).then((response) => {
            // Cache successful responses with metadata
            if (response.status === 200) {
              const responseClone = response.clone();
              const headers = new Headers(responseClone.headers);
              headers.set('sw-cached-time', Date.now().toString());
              
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, new Response(responseClone.body, {
                  status: responseClone.status,
                  statusText: responseClone.statusText,
                  headers: headers
                }));
              });
            }
            return response;
          });
        })
    );
  }
});