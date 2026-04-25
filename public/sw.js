const CACHE_NAME = "tutorx-v2"; // 🔁 change this on every deploy

const STATIC_ASSETS = [
  "/",
  "/index.html",
];

/* ================= INSTALL ================= */
self.addEventListener("install", (event) => {
  self.skipWaiting(); // 🔥 activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

/* ================= ACTIVATE ================= */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // 🔥 take control immediately

      // 🔥 delete old caches
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      ),
    ])
  );
});

/* ================= FETCH ================= */
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // 🔥 API → ALWAYS NETWORK FIRST
  if (url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 🔥 STATIC FILES → CACHE FIRST
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});