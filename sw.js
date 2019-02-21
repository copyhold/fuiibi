importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '208715939086'
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

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
self.addEventListener('notificationclick', event => {
  const rootUrl = new URL('/', location).href
  event.notification.close()
  event.waitUntil(
    clients.matchAll()
    .then(matchedClients => {
      for (let client of matchedClients) {
        if (client.url.indexOf(rootUrl) >= 0) {
          return client.focus()
        }
      }
      return clients.openWindow(rootUrl).then(client => client.focus())
    })
    .catch(console.log)
  )
})
