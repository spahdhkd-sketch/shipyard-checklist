const APP_VERSION = "1.2-20260610-start-gate";
const ASSET_TOKEN = "20260610-design-unify-1";
const CACHE = `gs-safety-${ASSET_TOKEN}`;
const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/assets/icons/notification-icon.png",
  `/assets/css/styles-v2.css?v=${ASSET_TOKEN}`,
  `/assets/css/20-component-table.css?v=${ASSET_TOKEN}`,
  `/assets/css/30-feature-not-found.css?v=${ASSET_TOKEN}`,
  `/assets/css/30-feature-signature.css?v=${ASSET_TOKEN}`,
  `/assets/css/30-feature-push-management.css?v=${ASSET_TOKEN}`,
  `/assets/css/30-feature-monthly-worker.css?v=${ASSET_TOKEN}`,
  `/assets/css/20-component-disabled-reason.css?v=${ASSET_TOKEN}`,
  "/assets/js/vendor/supabase-js-2.105.3.min.js",
  `/assets/js/checklist-rules.js?v=${ASSET_TOKEN}`,
  `/assets/js/issue-material-rules.js?v=${ASSET_TOKEN}`,
  `/assets/js/pictogram-helpers.js?v=${ASSET_TOKEN}`,
  `/assets/js/ship-helpers.js?v=${ASSET_TOKEN}`,
  `/assets/js/worker-helpers.js?v=${ASSET_TOKEN}`,
  `/assets/js/dashboard-view.js?v=${ASSET_TOKEN}`,
  `/assets/js/screen-views.js?v=${ASSET_TOKEN}`,
  "/assets/js/admin-v2.js",
  `/assets/js/app-v2.js?v=${ASSET_TOKEN}`
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "GS 안전 체크리스트";
  const options = {
    body: data.body || "",
    icon: data.icon || "/assets/icons/notification-icon.png",
    badge: data.badge || "/assets/icons/notification-icon.png",
    tag: data.tag || "gs-safety-checklist",
    renotify: data.renotify !== false,
    requireInteraction: Boolean(data.requireInteraction),
    data: {
      url: data.url || "/",
      style: data.style || "notice",
    },
  };
  if (Array.isArray(data.vibrate)) options.vibrate = data.vibrate;

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const sameOriginClient = clientList.find((client) => new URL(client.url).origin === self.location.origin);
        if (sameOriginClient) {
          sameOriginClient.focus();
          return sameOriginClient.navigate(targetUrl);
        }
        return clients.openWindow(targetUrl);
      })
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "GS_GET_VERSION") return;
  event.source?.postMessage({
    type: "GS_SW_VERSION",
    appVersion: APP_VERSION,
    assetToken: ASSET_TOKEN,
    cache: CACHE,
  });
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  if (/\.(css|js)$/.test(requestUrl.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        });
    })
  );
});
