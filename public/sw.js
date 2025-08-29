// Service Worker for caching and performance
const CACHE_NAME = 'hobson-ai-v6';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  // Critical images with explicit caching
  '/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png', // Logo
  '/lovable-uploads/270231d1-a007-4b5e-82c2-696ea7ccf2f5.png', // Header logo
  '/lovable-uploads/4351fb54-1d77-416e-9474-3c80e483a83c.png', // Large image 1
  '/lovable-uploads/b21f796e-20aa-4a56-ad42-9d8e9c3189ba.png', // Large image 2
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
  } else if (
    request.destination === 'image' || 
    request.destination === 'script' || 
    request.destination === 'style' || 
    request.destination === 'font' ||
    request.url.includes('/blog-images/') ||
    request.url.includes('/lovable-uploads/') ||
    request.url.includes('/assets/') ||
    request.url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|css|js)$/i) ||
    // Explicit handling for problematic large images
    request.url.includes('4351fb54-1d77-416e-9474-3c80e483a83c.png') ||
    request.url.includes('b21f796e-20aa-4a56-ad42-9d8e9c3189ba.png')
  ) {
    // Cache first for all static assets with long cache times
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request).then((fetchResponse) => {
            // Only cache successful responses
            if (fetchResponse.status === 200) {
              // Clone response and add long cache headers
              const responseHeaders = new Headers(fetchResponse.headers);
              responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
              responseHeaders.set('Expires', new Date(Date.now() + 31536000000).toUTCString());
              
              const cachedResponse = new Response(fetchResponse.body, {
                status: fetchResponse.status,
                statusText: fetchResponse.statusText,
                headers: responseHeaders
              });
              
              // Cache the response
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, cachedResponse.clone());
              });
              
              return cachedResponse;
            }
            return fetchResponse;
          }).catch(() => {
            // Return cached version if network fails
            return caches.match(request);
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