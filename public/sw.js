// Service Worker for caching and performance
const CACHE_NAME = 'hobson-ai-v6';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  // Critical images with explicit caching - Add ALL the problematic ones
  '/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png', // Logo
  '/lovable-uploads/270231d1-a007-4b5e-82c2-696ea7ccf2f5.png', // Header logo
  '/lovable-uploads/4351fb54-1d77-416e-9474-3c80e483a83c.png', // Large image 1
  '/lovable-uploads/b21f796e-20aa-4a56-ad42-9d8e9c3189ba.png', // Large image 2
  '/lovable-uploads/a1a372bb-1649-43e9-ad51-c41d6fc762a1.png', // Image 3
  '/blog-images/boy-praying-with-bible.png', // Blog image
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

// Fetch with Cache First strategy for all assets, Network First for HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests except for same-site
  if (url.origin !== location.origin) {
    return;
  }

  // Cache-first strategy for ALL static assets
  if (
    request.destination === 'image' || 
    request.destination === 'script' || 
    request.destination === 'style' || 
    request.destination === 'font' ||
    request.url.includes('/blog-images/') ||
    request.url.includes('/lovable-uploads/') ||
    request.url.includes('/assets/') ||
    request.url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|css|js)$/i) ||
    // Explicit handling for problematic large images and JS files
    request.url.includes('4351fb54-1d77-416e-9474-3c80e483a83c.png') ||
    request.url.includes('b21f796e-20aa-4a56-ad42-9d8e9c3189ba.png') ||
    request.url.includes('boy-praying-with-bible.png') ||
    request.url.includes('a1a372bb-1649-43e9-ad51-c41d6fc762a1.png') ||
    request.url.includes('transformers.web-') ||
    request.url.includes('react-vendor-') ||
    request.url.includes('-BxAcWvgF.js') ||
    request.url.includes('-WFf3rrDU.js')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          if (cachedResponse) {
            // Return cached version with proper headers
            const response = cachedResponse.clone();
            return response;
          }
          
          // Fetch from network and cache
          return fetch(request).then(networkResponse => {
            if (networkResponse.status === 200) {
              // Clone and add cache headers
              const responseHeaders = new Headers(networkResponse.headers);
              responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
              responseHeaders.set('Expires', new Date(Date.now() + 31536000000).toUTCString());
              
              const cachedResponse = new Response(networkResponse.body, {
                status: networkResponse.status,
                statusText: networkResponse.statusText,
                headers: responseHeaders
              });
              
              // Cache the response
              cache.put(request, cachedResponse.clone());
              return cachedResponse;
            }
            return networkResponse;
          }).catch(() => {
            // Return cached version if network fails
            return cache.match(request) || fetch(request);
          });
        });
      })
    );
  } else if (request.destination === 'document') {
    // Network first for HTML documents
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});