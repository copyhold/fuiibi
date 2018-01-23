self.addEventListener('install', function (event) {
  console.log('[serviceWorker] Installing serviceWorker...', event);
  // We start caching stuff at installation of the sw
  // We open a cache, if it exist already, it wil open it, otherwise it will create it.
  // We wait until the caches.open is done before continuing


  // event.waitUntil(
  //   caches.open('static')
  //   .then(function(cache) {
  //     console.log('[serviceWorker] Precaching app shell')
  //     // With the method add, it not only push it to the cache, it execute it as well and get the response
  //     // we add the url of what need to be cached in the ()
  //     cache.add('/src/js/app.js')
  //   })
  // );

})

self.addEventListener('activate', function (event) {
  console.log('[serviceWorker] Activating serviceWorker...', event);
  return self.clients.claim();
})

self.addEventListener('fetch', function (event) {
  // console.log('[serviceWorker] Fetching something', event);
  event.respondWith(fetch(event.request))
})
