// Service Worker for BLAZE Streetwear
const CACHE_NAME = 'blaze-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/product-detail.html',
  '/cart.html',
  '/checkout.html',
  '/confirmation.html',
  '/styles.css',
  '/footer.css',
  '/product.css',
  '/cart.css',
  '/checkout.css',
  '/confirmation.css',
  '/color-variants.css',
  '/mobile-enhancements.css',
  '/script.js',
  '/cart.js',
  '/product.js',
  '/product-variants.js',
  '/checkout.js',
  '/countdown.js',
  '/mobile-nav.js',
  '/images/products/Rise.webp',
  '/images/products/SEGRETO.webp',
  '/images/products/Wild-Flowers.webp',
  '/images/products/Rush.webp',
  '/images/products/Lost in Casablanca.webp',
  '/images/products/Trust-The-Process.webp'
];

// Install event - cache assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});