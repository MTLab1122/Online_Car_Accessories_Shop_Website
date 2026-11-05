/**
 * AUTOX — Progressive Web App Service Worker
 * Comprehensive Offline-First Architecture & Secure Cache Engine
 */

const CACHE_VERSION = 'autox-v1.0.0';
const STATIC_CACHE = `autox-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `autox-images-${CACHE_VERSION}`;
const CATALOG_CACHE = `autox-catalog-${CACHE_VERSION}`;

// Precached Static Resources (Relative paths support both root and subpath deployments)
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './logo.svg',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/icon-maskable-192x192.png',
  './icons/icon-maskable-512x512.png'
];

// Security Blacklist: Under NO circumstance should these private routes be cached
const PRIVATE_ROUTE_PATTERNS = [
  /\/api\/v1\/auth\//i,
  /\/api\/v1\/orders/i,
  /\/api\/v1\/cart/i,
  /\/api\/v1\/admin/i,
  /\/api\/v1\/users/i,
  /\/api\/v1\/checkout/i
];

// Max entries limit for image cache to prevent unbounded storage on mobile devices
const MAX_IMAGE_ENTRIES = 60;

/**
 * Trim cache entries to prevent storage bloat
 */
async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      await cache.delete(keys[0]);
      await trimCache(cacheName, maxItems);
    }
  } catch (err) {
    console.warn('[AUTOX SW] Cache trimming error:', err);
  }
}

// 1. Install Event: Precache Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[AUTOX SW] Precaching static shell assets...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up outdated legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE, IMAGE_CACHE, CATALOG_CACHE].includes(key)) {
            console.log('[AUTOX SW] Purging obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intelligent Strategy Router
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // A. Non-GET requests (POST, PUT, DELETE, PATCH): Never intercept or cache
  if (request.method !== 'GET') {
    return;
  }

  // B. Security Check: Never intercept or cache private customer/admin API endpoints
  if (PRIVATE_ROUTE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    return;
  }

  // C. Navigation Requests (HTML Pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response, cache the HTML document in static cache
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          // Offline fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          const offlinePage = (await caches.match('offline.html')) || (await caches.match('/offline.html')) || (await caches.match('./offline.html'));
          if (offlinePage) return offlinePage;

          return (await caches.match('index.html')) || (await caches.match('/index.html')) || (await caches.match('./index.html'));
        })
    );
    return;
  }

  // D. Image Assets: Cache-First with Expiration and Background Revalidation
  if (
    request.destination === 'image' ||
    /\.(png|jpg|jpeg|svg|webp|gif|avif)$/i.test(url.pathname) ||
    url.hostname.includes('unsplash.com') ||
    url.pathname.startsWith('/uploads/')
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          // Return cached image, revalidate in background if online
          if (navigator.onLine) {
            fetch(request).then((networkRes) => {
              if (networkRes && networkRes.status === 200) {
                cache.put(request, networkRes.clone());
              }
            }).catch(() => {});
          }
          return cached;
        }

        // Fetch from network if not in cache
        return fetch(request)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              cache.put(request, networkRes.clone());
              trimCache(IMAGE_CACHE, MAX_IMAGE_ENTRIES);
            }
            return networkRes;
          })
          .catch(() => {
            // Return placeholder or fallback logo if offline and missing
            return caches.match('/logo.svg');
          });
      })
    );
    return;
  }

  // E. Public Catalog API (Products, Categories, Guides, SEO endpoints): Network-First with Stale Fallback
  if (
    url.pathname.startsWith('/api/v1/products') ||
    url.pathname.startsWith('/api/v1/categories') ||
    url.pathname.startsWith('/api/v1/guides')
  ) {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CATALOG_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkRes;
        })
        .catch(async () => {
          console.log('[AUTOX SW] Network unreachable. Serving cached public catalog data for:', url.pathname);
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          // Return structured offline JSON response
          return new Response(
            JSON.stringify({
              success: false,
              offline: true,
              message: 'You are currently offline. Live catalog connection unavailable.'
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // F. Static Build Assets (JS, CSS, Web Fonts)
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkRes;
        });
      })
    );
    return;
  }
});

// 4. Message Event: Skip waiting when update is requested by user
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
