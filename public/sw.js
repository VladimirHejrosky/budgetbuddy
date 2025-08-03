const CACHE_NAME = "pwa-cache";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
    event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
    self.skipWaiting()
  })
  
  self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim())
  })
  
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
  