const VERSION = {
  STATIC: "3",
  DYNAMIC: "3",
};
const CACHES = {
  STATIC: `PWAM_STATIC_${VERSION.STATIC}`,
  DYNAMIC: `PWAM_DYNAMIC_${VERSION.DYNAMIC}`,
};
const STATIC_ITEMS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/chat.js",
  "./js/chat.service.js",
  "./js/cookie.service.js",
  "./js/helper.js",
  "./js/Login.js",
  "./js/Register.js",
];
const ASSET_ITEMS = [
  ,
  "./assets/camera_icon.svg",
  "./assets/send_icon.svg",
  "./assets/settings.svg",
  "./assets/logout.svg",
  "./assets/delete_forever.svg",
];

function netFirst(e) {
  const fetchOrCache = async () => {
    let reqClone = e.request.clone();
    const body = JSON.parse(await reqClone.text());
    try {
      const res = await fetch(e.request);
      if (body.request === "fetchmessages") {
        const cache = await caches.open(CACHES.DYNAMIC);
        cache.put(e.request.url, res.clone());
      }
      return res;
    } catch (err) {
      const cacheRes = await caches.match(e.request.url);
      if (!cacheRes) {
        return Promise.reject("Network Error");
      } else {
        return cacheRes;
      }
    }
  }

  e.respondWith(fetchOrCache());
}

function cacheFirst(e) {
  e.respondWith(
    caches
      .match(e.request.url)
      .then((cacheRes) => {
        if (!cacheRes) {
          fetch(e.request).then((s) =>
            caches
              .open(CACHES.DYNAMIC)
              .then((c) => (c.put(e.request.url, s.clone()), s))
          );
        } else {
          return cacheRes;
        }
      })
      .catch(() => {
        return new Response({
          body: "404",
        });
      })
  );
}

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHES.STATIC).then((cache) => {
      cache.addAll(STATIC_ITEMS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((e) =>
        Promise.all(
          e
            .filter((e) => e !== CACHES.STATIC && e !== CACHES.DYNAMIC)
            .map((e) => caches.delete(e))
        )
      )
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.url.indexOf("chrome-extension") > -1) return;
  if (e.request.url.indexOf("www2.hs-esslingen.de") > -1) {
    return netFirst(e);
  }
  cacheFirst(e);
});
