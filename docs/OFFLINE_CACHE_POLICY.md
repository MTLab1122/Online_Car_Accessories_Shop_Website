# AUTOX — Offline Caching Policy & Data Freshness Standard

## 1. Scope and Objective
This document defines the strict cache eviction, security boundaries, and data freshness rules governing the AUTOX Progressive Web App. It ensures fast mobile performance across 3G/4G Pakistani cellular networks while maintaining zero financial, credential, or inventory risk.

---

## 2. Cache Partitioning Architecture

| Cache Name | Cache Target | Invalidation Trigger | Max Age | Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `autox-precache-v1.0.0` | App shell, offline.html, core icons, manifest | App version bump | Permanent until update | Cache-First |
| `autox-runtime-v1.0.0` | Scripts, stylesheets, static font bundles | Hash changes in bundle | 30 Days | Stale-While-Revalidate |
| `autox-catalog-v1.0.0` | GET `/api/v1/products`, `/categories`, `/guides` | Network query response | 24 Hours | Network-First with Cache Fallback |
| `autox-images-v1.0.0` | WebP/PNG product images, UI icons, banners | URL modification | 14 Days | Cache-First with Network Revalidation |

---

## 3. Strict Security & Financial Exclusions
Under NO circumstances shall the service worker intercept, store, or cache responses for the following routes:

1. **Authentication:**
   - `/api/v1/auth/login`
   - `/api/v1/auth/register`
   - `/api/v1/auth/logout`
   - `/api/v1/auth/me`
   - `/api/v1/auth/forgot-password`
   - `/api/v1/auth/reset-password/*`
   *Rationale:* Eliminates credential replay vulnerabilities, session hijacking, and stale user authorization states.

2. **Orders & Checkout:**
   - `/api/v1/orders`
   - `/api/v1/orders/*`
   *Rationale:* Orders must execute against real-time MongoDB inventory with atomic decrements. Offline order creation is forbidden to prevent negative inventory allocations and pricing discrepancies.

3. **Active Cart & Promotional Coupons:**
   - `/api/v1/cart`
   - `/api/v1/cart/items`
   - `/api/v1/cart/coupon`
   *Rationale:* Coupon validity, discount amounts, and stock limits must remain synchronized with the database in real time.

4. **Administrative Operations:**
   - `/api/v1/admin/*`
   *Rationale:* Admin telemetry, user audits, and stock modifications must always reflect authoritative live records.

5. **Non-Idempotent HTTP Methods:**
   - All `POST`, `PUT`, `DELETE`, and `PATCH` requests bypass service worker caching entirely and stream directly over the network.

---

## 4. Cache Purging & Service Worker Lifecycle
When a new service worker version is deployed:
1. The new service worker installs alongside the old version and activates its precache.
2. The user receives a floating prompt: *"New telemetry update ready. Update now."*
3. Upon user confirmation (or navigation), `skipWaiting` is dispatched.
4. The `activate` event triggers automated deletion of all caches belonging to prior versions:
   ```javascript
   const currentCaches = [PRECACHE_NAME, RUNTIME_CACHE_NAME, CATALOG_CACHE_NAME, IMAGE_CACHE_NAME];
   const oldCaches = await caches.keys();
   await Promise.all(
     oldCaches.map(cache => {
       if (!currentCaches.includes(cache)) {
         return caches.delete(cache);
       }
     })
   );
   ```

---

## 5. Offline Catalog Resiliency Flow
```
Customer navigates to /shop
      │
      ▼
Is network online?
 ├── YES ──► Fetch GET /api/v1/products from MongoDB
 │             ├── Success: Update autox-catalog-v1.0.0 cache & render live products
 │             └── Error (500/timeout): Fallback to autox-catalog-v1.0.0 cached equipment
 └── NO  ──► Immediately read autox-catalog-v1.0.0 from Cache Storage
               ├── Items exist: Render cached catalog with "Telemetry Offline" HUD indicator
               └── Cache empty: Display /offline.html with network reconnection sensor
```

---

## 6. Automated Validation Suite
The offline caching policy and security boundaries are continuously validated by Playwright end-to-end tests:
- `e2e/tests/pwa.spec.js`:
  - Validates manifest JSON schema and 4 responsive icon assets.
  - Verifies service worker installation and client control.
  - Verifies `/offline.html` rendering.
  - Simulates network drops via `context.setOffline(true)` and verifies offline HUD indicator.
  - Inspects active `caches.open()` entries to mathematically assert that 0 private routes exist in cache storage.

