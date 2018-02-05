var CACHE_STATIC_NAME = 'static-v4'
var CACHE_DYNAMIC_NAME ='dynamic-v2'

self.addEventListener('install', function (event) {
  console.log('[serviceWorker] Installing serviceWorker...', event);
  event.waitUntil(
  // !!!!!!! IN CASE I CHANGE ANY THING IN THE JAVASCRIPT CODE OF ANY OTHER FILE, IT WONT UPDATE AT IT IS STORED
  // WITH THE OLD VERSION. AND AS LONG AS SW IS NOT AMENDED, IT WILL NOT RELOAD THE NEW FILES IN THE CACHE.
  // THEREFORE WE NEED TO CHANGE THE SW SO THAT IT WILL UPDATE THE DATA IN THE CACHE SO THE GOOD PRACTICE IS TO CHANGE THE
  // VERSION OF THE CACHE NAME
  // caches.open('static')
  caches.open(CACHE_STATIC_NAME)
    .then(function(cache) {
      console.log('[Service Worker] Precaching App Shell');
      cache.addAll([
        '/',
        '/src/App.vue',
        '/src/main.js',
        '/index.html',
        '/src/components/Welcome.vue',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
      ]);
    })
  )
})
// '/src/js/feed.js',
// '/src/js/promise.js',
// '/src/js/fetch.js',
// '/src/js/material.min.js',
// '/src/css/app.css',
// '/src/css/feed.css',
// '/src/images/main-image.jpg',
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

self.addEventListener('activate', function (event) {
  console.log('[serviceWorker] Activating serviceWorker...', event);
  event.waitUntil(
    caches.keys()
    .then(function(keylist) {
      return Promise.all(keylist.map(function(key) {
        if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
          console.log('[serviceWorker] removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim();
})

self.addEventListener('fetch', function (event) {
  // console.log('[serviceWorker] Fetching something', event);
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if(response) {
        return response;
      } else {
        return fetch(event.request)
        .then(function (res) {
          return caches.open(CACHE_DYNAMIC_NAME)
          .then(function(cache) {
            // we can send res only once that's why we clone it, store it and send back the original res
            cache.put(event.request.url, res.clone())
            return res
          })
        })
        .catch(function(err) {

        })
      }
    })
  )
})
