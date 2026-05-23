const CACHE = "gs-safety-v6-20260524";
const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/assets/css/styles-v2.css?v=20260522-nav-font-14",
  "/assets/js/vendor/supabase-js-2.105.3.min.js",
  "/assets/js/checklist-rules.js?v=20260522-nav-font-14",
  "/assets/js/issue-material-rules.js?v=20260522-nav-font-14",
  "/assets/js/app-v2.js?v=20260522-nav-font-14"
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
