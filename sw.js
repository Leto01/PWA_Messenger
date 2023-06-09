const CACHE_VERSION = {
  STATIC: "1",
  DYNAMIC: "1",
};

const CACHE_LIST = {
  STATIC_CACHE: `static-pwa-chat-${CACHE_VERSION.STATIC}`,
  DYNAMIC_CACHE: `dynamic-pwa-chat-${CACHE_VERSION.DYNAMIC}`,
};

const STATIC_CACHE_ITEMS = [
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

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_LIST.STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_CACHE_ITEMS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("activate received");
});

self.addEventListener("fetch", (e) => {
  // console.log(e.request)
  // console.log("Fetching detected");
  if (e.request.url.indexOf("www2.hs-esslingen.de") > -1) return;
  if (e.request.url.indexOf("chrome-extension") > -1) return;
  if (e.request.url.indexOf(location.host) == -1) return;
  if (e.request.url.indexOf(location.pathname) == -1) return;
  e.respondWith(
    caches.match(e.request).then(res => {
      console.log(res);
      return res || fetch(e.request);
    })
  )
});
