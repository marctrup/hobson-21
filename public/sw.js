// Minimal Service Worker - Network First for everything to prevent caching issues
const CACHE_NAME = 'hobson-ai-v6'; // Updated version to clear old cache
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Install Service Worker - Skip caching on install to prevent issues
self.addEventListener('install', (event) => {
  console.log('SW: Installing new service worker');
  self.skipWaiting(); // Immediately activate new SW
});

// Activate Service Worker - Clear old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating new service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Taking control of all clients');
      return self.clients.claim();
    })
  );
});

// Network First strategy for everything to prevent stale content
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and non-GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  // Network first for all requests to prevent stale content
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses
        if (response.status === 200) {
          // Only cache static assets, not HTML documents
          if (request.destination === 'image' || 
              request.destination === 'script' || 
              request.destination === 'style' || 
              request.destination === 'font' ||
              request.url.includes('/blog-images/') ||
              request.url.includes('/lovable-uploads/')) {
            
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              // Add timestamp for cache invalidation
              const cacheKey = new Request(request.url + '?cached=' + Date.now());
              cache.put(request, responseClone);
              
              // Clean up old cached items
              cache.keys().then((keys) => {
                keys.forEach((key) => {
                  const keyUrl = new URL(key.url);
                  const cachedParam = keyUrl.searchParams.get('cached');
                  if (cachedParam && Date.now() - parseInt(cachedParam) > MAX_CACHE_AGE) {
                    cache.delete(key);
                  }
                });
              });
            });
          }
        }
        return response;
      })
      .catch((error) => {
        console.log('SW: Network request failed, trying cache:', error);
        // Only fall back to cache for static assets, never for HTML
        if (request.destination !== 'document') {
          return caches.match(request);
        }
        throw error;
      })
  );
});