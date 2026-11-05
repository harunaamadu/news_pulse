// NewsPulse service worker. Deliberately small:
//  - precaches the offline shell
//  - falls back to it when a page navigation fails
//  - serves saved cover images from the cache
// Bump VERSION whenever offline.html changes.
const VERSION = "v1";
const SHELL_CACHE = `np-shell-${VERSION}`;
const IMAGE_CACHE = "np-offline-images"; // written by the page, not versioned
const OFFLINE_URL = "/offline.html";
const ARTICLE_PATH = /^\/article\/([^/]+)\/?$/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("np-shell-") && key !== SHELL_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request, url));
    return;
  }

  if (url.pathname === "/_next/image") {
    event.respondWith(handleImage(request));
  }
});

async function handleNavigation(request, url) {
  try {
    return await fetch(request);
  } catch {
    // Offline: send article URLs to the offline reader, everything else to the shell
    const article = ARTICLE_PATH.exec(url.pathname);
    if (article) {
      return Response.redirect(
        `${self.location.origin}${OFFLINE_URL}?slug=${article[1]}`,
        302,
      );
    }

    const cache = await caches.open(SHELL_CACHE);
    return (await cache.match(OFFLINE_URL)) || Response.error();
  }
}

async function handleImage(request) {
  const cache = await caches.open(IMAGE_CACHE);
  // Next sets "Vary: Accept" on optimized images, so ignore it when matching
  const cached = await cache.match(request, { ignoreVary: true });
  return cached || fetch(request);
}