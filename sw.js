const CACHE = 'cache-first'

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(
        [
          './'
        ]
      )
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (navigator.onLine) {
    fetch(event.request).then(function (response) {
      caches.open(CACHE).then(function (cache) {
        cache.put(event.request, response.clone());
        return response;
      })
    })
  } else {
    event.respondWith(
      caches.open(CACHE).then(function (cache) {
        return cache.match(event.request).then(function (response) {
          return response
        });
      })
    );
  }
});