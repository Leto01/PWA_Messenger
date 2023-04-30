self.addEventListener("install", (e) => {
  console.log("install received");
});

self.addEventListener("activate", (e) => {
  console.log("activate received");
});

self.addEventListener("fetch", (e) => {
  if ((e).request.url.indexOf('www2.hs-esslingen.de') > -1) return;
  if ((e).request.url.indexOf('chrome-extension') > -1) return;
  if ((e).request.url.indexOf(location.host) == -1) return;
  if ((e).request.url.indexOf(location.pathname) == -1) return;

  console.log("didn't return D:")
});
