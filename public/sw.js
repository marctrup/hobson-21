// Service Worker for caching and performance
const CACHE_NAME = 'hobson-ai-v5';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  // Critical images
  '/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png', // Logo
  '/lovable-uploads/270231d1-a007-4b5e-82c2-696ea7ccf2f5.png', // Header logo
  // Key static assets
  '/robots.txt',
  '/sitemap.xml',
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
  } else if (request.destination === 'image' || request.destination === 'script' || request.destination === 'style' || request.destination === 'font' || request.url.includes('/blog-images/')) {
    // Cache first for static assets (images, JS, CSS, fonts, blog images)
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            // Cache successful responses for static assets
            if (response.status === 200) {
              // Add cache headers for better performance
              const headers = new Headers(response.headers);
              headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year for images
              
              const responseClone = new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: headers
              });
              
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone.clone());
              });
              
              return responseClone;
            }
            return response;
          });
        })
    );
  } else if (request.url.includes('.json') || request.url.includes('robots.txt') || request.url.includes('sitemap.xml')) {
    // Cache first for static data files
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
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