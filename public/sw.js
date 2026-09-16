// public/sw.js

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated');
  return self.clients.claim();
});

// A fetch handler is required for the browser to detect PWA eligibility
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});