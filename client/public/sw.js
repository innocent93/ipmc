// Service worker v2 — cache-strategy upgrade over the original naive
// "cache-first for literally everything" version, which served stale
// HTML/API data indefinitely once cached and never revalidated it.
//
// Strategy by request type:
//   - Navigation/HTML requests: network-first (always try fresh content;
//     fall back to cache only when offline)
//   - Hashed static assets (/assets/*.js, *.css with content hashes):
//     cache-first (safe forever — a new deploy ships new filenames)
//   - GET API calls: stale-while-revalidate (serve the cached response
//     instantly for speed, then quietly fetch a fresh copy in the
//     background and update the cache for next time)
//   - Auth endpoints: never cached (session-sensitive)
//   - Any non-GET request: never intercepted, always goes straight to
//     the network (was already the case, kept as-is)

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `ipmc-static-${CACHE_VERSION}`;
const API_CACHE = `ipmc-api-${CACHE_VERSION}`;
const CURRENT_CACHES = [STATIC_CACHE, API_CACHE];

const APP_SHELL = ['/', '/index.html', '/manifest.json', '/robots.txt'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !CURRENT_CACHES.includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

const isNavigation = (request) => request.mode === 'navigate';
const isHashedAsset = (url) => /\/assets\/.+\.(js|css|woff2?|png|jpg|jpeg|svg|webp|avif)$/.test(url.pathname);
const isApiCall = (url) => url.pathname.startsWith('/api/');
const isAuthEndpoint = (url) => url.pathname.startsWith('/api/auth');

async function networkFirst(request) {
  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match('/index.html');
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, fresh.clone());
  }
  return fresh;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((fresh) => {
      if (fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    })
    .catch(() => cached); // offline and nothing fresh — fall back to whatever's cached, if anything
  return cached || networkPromise;
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  if (isAuthEndpoint(url)) return; // never intercept — always hit the network directly
  if (isNavigation(e.request)) { e.respondWith(networkFirst(e.request)); return; }
  if (isHashedAsset(url)) { e.respondWith(cacheFirst(e.request)); return; }
  if (isApiCall(url)) { e.respondWith(staleWhileRevalidate(e.request)); return; }

  // Anything else (fonts from a CDN, misc assets): cache-first is a
  // reasonable default.
  e.respondWith(cacheFirst(e.request));
});
