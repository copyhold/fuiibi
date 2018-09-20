importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  // new RegExp('.*\.vue'),
  workbox.strategies.networkFirst()
);


workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'css-cache',
  })
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 100,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);











//
//
// var CACHE_STATIC_NAME = 'static-v10'
// var CACHE_DYNAMIC_NAME ='dynamic-v5'
// var STATIC_FILES = [
//   '/',
//   '/src/App.vue',
//   '/src/main.js',
//   '/index.html',
//   '/src/components/Welcome.vue',
//   'src/components/img/iwt3.png',
//   'src/images/icons/icon-48x48.png',
//   'src/images/icons/icon-72x72.png',
//   'src/images/icons/icon-96x96.png',
//   'src/images/icons/icon-128x128.png',
//   'src/images/icons/icon-144x144.png',
//   'src/images/icons/icon-152x152.png',
//   'src/images/icons/icon-192x192.png',
//   'src/images/icons/icon-384x384.png',
//   'src/images/icons/icon-512x512.png',
//   'src/images/welcomeImage1.jpg',
//   'https://fonts.googleapis.com/css?family=Roboto:400,700',
//   'https://fonts.googleapis.com/icon?family=Material+Icons',
//   'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
// ]
// // With dynamic cache, a lot of pages can be saved in cache. So we use the below function to clean the
// // dynamic cache. We call this function in the fetch below
// function trimCache(cacheName, maxItems) {
//   caches.open(cacheName)
//     .then(function(cache) {
//       return cache.keys()
//       .then(function(keys) {
//         if(keys.length > maxItems) {
//           cache.delete(keys[0])
//            .then(trimCache(cacheName, maxItems));
//         }
//       })
//     })
//   }
//
// self.addEventListener('install', function (event) {
//   console.log('[serviceWorker] Installing serviceWorker...', event);
//   event.waitUntil(
//   // !!!!!!! IN CASE I CHANGE ANY THING IN THE JAVASCRIPT CODE OF ANY OTHER FILE, IT WONT UPDATE AT IT IS STORED
//   // WITH THE OLD VERSION. AND AS LONG AS SW IS NOT AMENDED, IT WILL NOT RELOAD THE NEW FILES IN THE CACHE.
//   // THEREFORE WE NEED TO CHANGE THE SW SO THAT IT WILL UPDATE THE DATA IN THE CACHE SO THE GOOD PRACTICE IS TO CHANGE THE
//   // VERSION OF THE CACHE NAME
//   // caches.open('static')
//   caches.open(CACHE_STATIC_NAME)
//     .then(function(cache) {
//       console.log('[Service Worker] Precaching App Shell');
//       cache.addAll(STATIC_FILES);
//     })
//   )
// })
//   // We start caching stuff at installation of the sw
//   // We open a cache, if it exist already, it wil open it, otherwise it will create it.
//   // We wait until the caches.open is done before continuing
//
//
//   // event.waitUntil(
//   //   caches.open('static')
//   //   .then(function(cache) {
//   //     console.log('[serviceWorker] Precaching app shell')
//   //     // With the method add, it not only push it to the cache, it execute it as well and get the response
//   //     // we add the url of what need to be cached in the ()
//   //     cache.add('/src/js/app.js')
//   //   })
//   // );
//
// self.addEventListener('activate', function (event) {
//   console.log('[serviceWorker] Activating serviceWorker...', event);
//   event.waitUntil(
//     caches.keys()
//     .then(function(keylist) {
//       return Promise.all(keylist.map(function(key) {
//         if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
//           console.log('[serviceWorker] removing old cache', key)
//           return caches.delete(key)
//         }
//       }))
//     })
//   )
//   return self.clients.claim();
// })
//
// function isInArray (string, array) {
//   var cachePath;
//   if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.T a CDN)
//     console.log('matched', string);
//     cachePath = string.substring(self.origin.length); // take part of the URL AFTER the domain (e.g. after localhost:8080)
//   } else {
//     console.log('unmatched', string);
//     cachePath = string; // store the full request (for CDNs)
//   }
//   return array.indexOf(cachePath) > 1;
// }
//
//
// // This addEventListener is catching any fetch request done by the normal .js code, like in the feed.js.
// // So on the feed.js file it is looking in the cache to bring stuff, and in the meanwhile, here below, it goes to the network
// // and check if it can get something, which is return at the end: return res
// self.addEventListener('fetch', function (event) {
//   console.log('[self.addEventListener(fetch, function (event)]');
//   // We need to cache in any case the app shell and feed.js because without it nothing will work.
//   // So we make a difference between the fetch request that is done to the below url and these that are not.
//   // var url = 'https://httpbin.org/get';
//   // We change the url to our firebase project insted of the above
//   var url = 'https://iwtapplication.firebaseio.com/'
//   // We check if we have this url in the event.request.url
//   // in case we have it, we want to responde with the cache then network strategy, which send the request to cache and at the same time to network.
//   if (event.request.url.indexOf(url) > -1) {
//     event.respondWith(
//       caches.open(CACHE_DYNAMIC_NAME)
//         .then(function(cache) {
//           return fetch(event.request)
//             .then(function(res) {
//               console.log('[we are using the cache first strategy, here we are taking infor from cache]')
//               trimCache(CACHE_DYNAMIC_NAME, 100)
//               cache.put(event.request, res.clone());
//               return res;
//             })
//         })
//     )
//   // Below we do a regular exprestion on the fly that come to check if there are any of the files of the STATIC_FILES
//   // We join the STATIC_FILES and check if the event.request.url match with any of the words include in the regular expretion
//   // We could have done it with a for in the array of the STATIC_FILES, but this is shorter way.
//   // We do that because in case that the request done is for one of the STATIC_FILES, we will use for that one the cache only stategy!!!
//   // We saved it at the installation stage so we have it and they are static so no reason to look for it in the network
// // } else if (new RegExp('\\b' + STATIC_FILES.join('\\b'|'\\b') + '\\b').test(event.request.url)) {
// //   event.respondWith(
// //     caches.match(event.request)
// //   );
// // At the end, Max decided to go for the following loop instead of the regular expression
// } else if (isInArray(event.request.url, STATIC_FILES)) {
//   console.log('else if STATIC_FILES')
//   event.respondWith(
//     caches.match(event.request)
//   );
// } else {
//     // we have been checking above if the strategy was for the mentionned url. If yes, we use the cache then network strategy. If not, below:
//     // here it means that we have not a cache then network strategy but cache with network fallback strategy!!!!!!!!!!!!!
//     // The difference is that we are not tring both of then at the same time, but checking the cache, in case not working, then network.
//     event.respondWith(
//       caches.match(event.request)
//       .then(function(response) {
//         if(response) {
//           return response;
//           console.log('[we are using the cache AND NETWORK strategy =====> response]');
//         } else {
//           return fetch(event.request)
//           .then(function (res) {
//             return caches.open(CACHE_DYNAMIC_NAME)
//             .then(function(cache) {
//               console.log('[we are using the cache AND NETWORK strategy]');
//               trimCache(CACHE_DYNAMIC_NAME, 100)
//               // we can send res only once that's why we clone it, store it and send back the original res
//               cache.put(event.request.url, res.clone())
//               return res
//             })
//           })
//           .catch(function(err) {
//             // In order to get the offline page, I need to look for it in the CACHE_STATIC_NAME, and in there I look for the file name
//             return caches.open(CACHE_STATIC_NAME)
//             .then(function(cache) {
//               // I want to show the offline page only if it's the help page or the root page that has been requested. I dont want to show it if
//               // it was just a css file that failed to be presented.
//               // But instead of checking for each page is this is the request, we use the headers that will show the offline page
//               // only when the header include the text html
//               // With that, we can precache anything, not only an html file, for example an image, and if an image upload fail, you can show the
//               // precached one!
//               // if(event.request.url.indexOf('/help')) {
//               if(event.request.headers.get('accept').includes('text/html')) {
//                 return cache.match('/offline.html');
//               }
//             })
//           })
//         }
//       })
//     );
//   }
// })
//
// // self.addEventListener('fetch', function (event) {
// //   // console.log('[serviceWorker] Fetching something', event);
// //   event.respondWith(
// //     caches.match(event.request)
// //     .then(function(response) {
// //       if(response) {
// //         return response;
// //       } else {
// //         return fetch(event.request)
// //         .then(function (res) {
// //           return caches.open(CACHE_DYNAMIC_NAME)
// //           .then(function(cache) {
// //             // we can send res only once that's why we clone it, store it and send back the original res
// //             cache.put(event.request.url, res.clone())
// //             return res
// //           })
// //         })
// //         .catch(function(err) {
// //
// //         })
// //       }
// //     })
// //   )
// // })
