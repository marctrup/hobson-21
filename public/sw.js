// Legacy cleanup Service Worker.
// The app no longer uses offline caching; this file exists only to clear older registrations.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName))))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
  );
});