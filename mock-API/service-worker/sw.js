// const CACHE_NAME = "my-site-cache-v1";
const CACHE_NAME = "my-site-cache-v2";
const urlsToCache = [
  "/index.html",
  "/favicon-32x32.png",
  "/styles/main.css",
  "/styles/other.css",
];


self.addEventListener("install", function (event) {
  console.log("install...");

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log("service worker fetch");

  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit
      if (response) {
        return response;
      }

      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("active");

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

