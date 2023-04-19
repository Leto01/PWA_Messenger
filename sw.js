self.addEventListener("install", (e) => {
  console.log("install received");
});

self.addEventListener("activate", (e) => {
  console.log("activate received");
});

self.addEventListener("fetch", (e) => {
  console.log("fetch received");
});
