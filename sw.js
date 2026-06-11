const APP_VERSION = "1.2-20260611-view-split";
const ASSET_TOKEN = "20260611-view-split-1";
const CACHE = `gs-safety-${ASSET_TOKEN}`;
const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/assets/icons/notification-icon.png",
  `/assets/dist/css/styles-v2.min.css?v=${ASSET_TOKEN}`,
  `/assets/dist/css/20-component-table.min.css?v=${ASSET_TOKEN}`,
  `/assets/dist/css/30-feature-not-found.min.css?v=${ASSET_TOKEN}`,
  `/assets/dist/css/30-feature-signature.min.css?v=${ASSET_TOKEN}`,
  `/assets/dist/css/30-feature-push-management.min.css?v=${ASSET_TOKEN}`,
  `/assets/dist/css/30-feature-monthly-worker.min.css?v=${ASSET_TOKEN}`,
  `/assets/dist/css/20-component-disabled-reason.min.css?v=${ASSET_TOKEN}`,
  "/assets/js/vendor/supabase-js-2.105.3.min.js",
  `/assets/dist/js/checklist-rules.min.js?v=${ASSET_TOKEN}`,
  `/assets/dist/js/push-rules.min.js?v=${ASSET_TOKEN}`,
  `/assets/dist/js/issue-material-rules.min.js?v=${ASSET_TOKEN}`,
  `/assets/dist/js/pictogram-helpers.min.js?v=${ASSET_TOKEN}`,
  `/assets/dist/js/ship-helpers.min.js?v=${ASSET_TOKEN}`,
  `/assets/dist/js/worker-helpers.min.js?v=${ASSET_TOKEN}`,
  `/assets/dist/js/xlsx-helpers.min.js?v=${ASSET_TOKEN}`,
  `/assets/dist/js/analytics-model.min.js?v=${ASSET_TOKEN}`,
  `/assets/dist/js/ship-import-rules.min.js?v=${ASSET_TOKEN}`,
  `/assets/dist/js/dashboard-view.min.js?v=${ASSET_TOKEN}`,
  `/assets/dist/js/screen-views.min.js?v=${ASSET_TOKEN}`,
  "/assets/dist/js/admin-v2.js",
  `/assets/dist/js/app-v2.min.js?v=${ASSET_TOKEN}`
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
    // Stale-while-revalidate: assets are versioned via ?v=<ASSET_TOKEN>, so a
    // cached entry for a given URL is effectively immutable. Serve it instantly
    // and refresh the cache in the background; only block on the network when
    // there is no cached copy (e.g. a freshly deployed token). Falls back to the
    // cached copy if the network is unavailable.
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          const networkFetch = fetch(event.request)
            .then((response) => {
              if (response && response.status === 200 && response.type === "basic") {
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => cached);
          return cached || networkFetch;
        })
      )
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
