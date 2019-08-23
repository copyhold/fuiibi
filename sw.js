importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  workbox.setConfig({ debug: false })
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

const ICON ="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3NTUuOTA1NDkgNzU1LjkwNTU1IiBoZWlnaHQ9IjIwMCIgd2lkdGg9IjIwMCI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMTUuNTk3NTggMCAwIDE1LjUzMTk5IC0xODA1LjEwNCAtNzU3LjgyNykiPjxwYXRoIGQ9Ik0xNDMuNDU4IDU0Ljg4NmwuOTUzLjEyM2MtLjAyMy41NTItLjA1MyAyLjM1Mi43NzMgMS45NTggMS4zMzctLjYzNi45NTMtMS41NDMuODE3LTEuODU4LTEuOTU0LTIuMDE2LTEuNzI5LTIuMjktMS43MTQtMy4zODMuNTMyLTMuNDA4IDUuMTgtMi4zOTggMy43MTkgMS40NTVoLS43ODRjLjIwMi0xLjY2NS0uMDQxLTIuMTgzLS44NTMtMi4xNDMtLjgxMi4wMzktMS43MTcuODE5LS40NDMgMi4wOTggMS41MTIgMS4zNCAxLjgyMiA0LjQ5Mi0uMjA2IDUuMDctMi42OS43NjgtMi4wODktMS42MDMtMi4yNjItMy4zMnpNMTU1LjM3NyA3My43MjRjLS4yOTYgOC4zMTYtNy4wNyAxNC45NjUtMTUuMzgzIDE0Ljk2Ni04LjUwMSAwLTE1LjM5My02Ljk1NS0xNS4zOTMtMTUuNTMzYTE1LjU1NSAxNS41NTUgMCAwIDEgNy4xMS0xMy4wOTVsLTQuNjg1LTcuNTIzYTI0LjM0NCAyNC4zNDQgMCAwIDAtMTEuMjk2IDIwLjU4MmMwIDEzLjQ0MSAxMC44NTIgMjQuMzM4IDI0LjI0IDI0LjMzOCAxMy4wODkgMCAyMy43NTUtMTAuNDE4IDI0LjIyMy0yMy40NDZ6IiBmaWxsPSJuYXZ5Ii8+PGVsbGlwc2Ugcnk9IjE1LjUzMyIgcng9IjE1LjM5MyIgY3k9IjczLjE1NyIgY3g9IjEzOS45OTQiIHRyYW5zZm9ybT0ibWF0cml4KC40NzI3NSAwIDAgLjQ3Mjc1IDczLjgxMiAzOC41NzIpIiBmaWxsPSJuYXZ5Ii8+PHBhdGggZD0iTTEyOS4yMDEgNTEuMzFsMS4xNDYtLjUzNSAzLjUwNiA4LjEzNC0uNzI4LjM0M2MtMS4zNy0yLjYwMi0yLjU3Ny01LjMwNi0zLjkyNC03Ljk0MnpNMTMyLjEwNCA1MC4wOTJsNC4wOTUgOC4wMDcuNjkxLS4xOTYtLjUyLTUuNjg3IDEuODQyIDUuNTA2LjY4LS4wOC41MjEtOC44NS0xLjIwMS4wNC0uMSA1LjA2Ni0xLjc4Mi00Ljg4Ni0xLjIwMi4xOC40NCA1LjIwNi0yLjMwMi00LjY4NnpNMTQxLjQzNiA0OC44MTFsLTEuODYzIDguODMxLjgyMS4wMi44MDEtMy4yMzUuOTU4LjAxOC4yNDQgMy40MTguODIxLjEyLS42NC05LjExNXptLjM0NSAyLjUzNGwuMjEgMS43Mi0uNTc2LS4wMnpNMTUxLjA4MiA1MS40ODVsMy43OCAyLjQzMi0uOTQ5IDEuMjMtMS4xOTgtLjg4LTQuMDY1IDYuMDQzLS42ODgtLjQ0NiAzLjc0Mi02LjI1Mi0xLjMyNi0uNzQ5ek0xNTUuMjU1IDU0LjIzbC01LjU0MiA2Ljg4LjYxLjUzIDIuNTM2LTIuODMgMS4xNzUgMS4xNjktMi43NjcgMi42LjU4Mi42NyA2Ljc3NC01LjY3LS45MTktMS4wNS0yLjY4NSAyLjUyNC0xLjI1OC0xLjI1MiAyLjUyOS0yLjY3NXpNMTU5LjA5MyA1OC4xNjRsLTYuOTQ2IDUuNDU4IDEuNDk0IDIuMzQyIDEuNTA2LS43OTYtMS4yNTktMS45MTcgMS44MTUtMS4xOSAxLjI4NSAyLjEzNSAxLjE5My0uNjMtMS4zNS0yLjI0OCAxLjc1My0xLjE4OCAxLjQ2OCAyLjQ0NyAxLjQtLjc0ek0xNTMuNzcgNjYuMjJsNy44ODctMy45ODEgMS4yNDEgMi45NjdjLjMxLjc0Mi0uMzYzIDEuNzA3LTEuMDAzIDIuMTk0LS41NjguNDMzLTEuNDA2LjQxMy0yLjExNi4zNC0uNTM4LS4wNTYtMS4xNTMtLjM5OC0xLjUxNi0uNTgxbC0zLjMyNyAyLjE1Mi0uMzEyLS44OTIgMy4zLTIuMDgxLS4zNDYtLjg5Ni0zLjQ2MyAxLjQ5eiIgZmlsbD0ibmF2eSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggZD0iTTE1OC44NTggNjQuOTY0bDEuOTU5LS43NTcuNzIzIDEuOTU3Yy4yNDIuNjU2LTEuNzg0IDEuMTgyLTIuMDMuNTI4eiIgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iLjI2NSIvPjxwYXRoIGQ9Ik0xNTQuOTkzIDY5LjdsOC42MTMtMS45OTcuNTY4IDQuMTA0LTEuNTgyLjA4OS0uMzA0LTIuNjc1LTIuMDguMzY5LjI3NSAyLjQyNS0xLjM0OS4wNjUtLjI1Mi0yLjI1NS0yLjA1My4zNjMuMTQ3IDIuMDI0LTEuNjEyLjA5MXoiIGZpbGw9Im5hdnkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvZz48L3N2Zz4=";
workbox.routing.registerRoute(
  /(app|vendor).*\.js$/,
  new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
  // Cache CSS files.
  /\.css$/,
  // Use cache but update in the background.
  new workbox.strategies.StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: 'css-cache',
  })
);

workbox.routing.registerRoute(
  /^https:\/\/firebasestorage.googleapis.com\/.*\/iwtapplication.appspot.com/,
  new workbox.strategies.CacheFirst({
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
    cacheName: 'firebase-storage'
  })
)

workbox.routing.registerRoute(
  // Cache image files.
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  // Use the cache if it's available.
  new workbox.strategies.CacheFirst({
    // Use a custom cache name.
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images.
        maxEntries: 200,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);
self.addEventListener('push', function(event) {
  if (!event.data) {
    return null;
  }
  let {notification,data} = event.data.json()
  data = JSON.parse(data['gcm.notification.data'])
  event.waitUntil(
    self.registration.showNotification(notification.title, {
      icon: '/static/icons/icon-192x192.png',
      icon: ICON,
      image: notification.image,
      tag:  notification.tag,
      body: notification.body + JSON.stringify(data),
      data,
    })
  )
});
self.addEventListener('notificationclick', event => {
  const {data} = event.notification
  const url = new URL( data.url || '/notifications', location).href
  setTimeout(() => event.notification.close(), 1000)
  event.waitUntil(
    self.clients.matchAll()
    .then(clientList => {
      if (clientList.length>0) {
        clientList[0].navigate(url)
        return clientList[0].focus()
      } else {
        return clients.openWindow(url);
      }
    })
  )
})
