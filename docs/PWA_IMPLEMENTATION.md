# AUTOX — Progressive Web App (PWA) Implementation & Technical Specification

## 1. Executive Summary
AUTOX incorporates a Progressive Web App (PWA) architecture tailored for the Pakistan automotive e-commerce ecosystem. The implementation guarantees uninterrupted catalog browsing during high-latency mobile sessions and complete offline resilience via a service worker, precached critical assets, and a standalone installation experience.

---

## 2. PWA Specification & Web App Manifest
- **Manifest Location:** `/manifest.webmanifest`
- **Application Name:** `AUTOX — Premium Car Accessories`
- **Short Name:** `AUTOX`
- **Theme Color:** `#080A0D` (Brand Void Black)
- **Background Color:** `#080A0D`
- **Display Mode:** `standalone`
- **Orientation:** `any` (optimized for `portrait-primary`)
- **Start URL:** `/?source=pwa`
- **Scope:** `/`

### Application Icons
All icons adhere to the luxury automotive brand palette with high-contrast `#FF5A1F` accents:
1. `icons/icon-192x192.png`: Standard Android home screen icon (`192x192`, `any`).
2. `icons/icon-512x512.png`: High-density splash screen icon (`512x512`, `any`).
3. `icons/icon-maskable-192x192.png`: Adaptive circular/squircle maskable icon (`192x192`, `maskable`).
4. `icons/icon-maskable-512x512.png`: Adaptive high-resolution maskable icon (`512x512`, `maskable`).
5. `logo.svg`: Vector icon fallback.

### App Shortcuts
Configured within the manifest for instant launch actions:
- **Explore Showroom:** Launches directly into the 3D Interactive Showroom (`/showroom`).
- **Catalog:** Opens the equipment inventory (`/shop`).

---

## 3. Service Worker Architecture (`public/sw.js`)

### Precaching Strategy
On install, the service worker immediately downloads and caches core runtime assets:
- `/`
- `/index.html`
- `/offline.html`
- `/manifest.webmanifest`
- `/logo.svg`
- `/icons/icon-192x192.png`
- `/icons/icon-512x512.png`

The service worker activates `self.skipWaiting()` and `clients.claim()` to establish immediate control over open browser windows.

### Runtime Request Routing
1. **Critical Exclusions (Bypass Cache Entirely):**
   - Non-GET requests (`POST`, `PUT`, `DELETE`, `PATCH`).
   - Private authentication endpoints (`/api/v1/auth/*`).
   - Order management and payment endpoints (`/api/v1/orders/*`).
   - Active user cart endpoints (`/api/v1/cart/*`).
   - Admin management endpoints (`/api/v1/admin/*`).
   *These requests always go direct to the network to guarantee financial, security, and session integrity.*

2. **Public Catalog API (`/api/v1/products`, `/api/v1/categories`, `/api/v1/guides`):**
   - Strategy: **Network-First with Cache Fallback**.
   - If connected, queries the live MongoDB database and updates the runtime cache.
   - If offline, serves the cached catalog equipment so customers can browse inventory without interruption.

3. **Media & Static Assets (Images, 3D Assets, Styles, Scripts):**
   - Strategy: **Cache-First with Network Revalidation**.
   - Serves cached assets instantly, revalidating in the background to conserve mobile cellular data bandwidth.

4. **HTML Navigation Requests:**
   - Strategy: **Network-First with Precached Fallback**.
   - If network request fails and page is not cached, delivers the dedicated luxury `/offline.html` experience.

---

## 4. Frontend Integration Components
- **`client/src/services/pwa.js`:** Handles service worker registration, lifecycle event hooks, update dispatching, and installation prompt capture (`beforeinstallprompt`).
- **`client/src/hooks/useOnlineStatus.js`:** React hook that listens to browser `online` and `offline` events with automatic auto-dismiss timers.
- **`client/src/components/pwa/OfflineIndicator.jsx`:** Floating HUD pill that animates into view when telemetry connection is lost, informing the customer that they are viewing cached equipment.
- **`client/src/components/pwa/UpdateNotification.jsx`:** Prompts the user when a new service worker version is waiting, enabling smooth zero-downtime updates via `skipWaiting`.

---

## 5. Offline Fallback Page (`public/offline.html`)
The offline fallback is a fully self-contained page styled with the AUTOX dark automotive aesthetic:
- **Headline:** *"YOUR DRIVE DOESN'T STOP. TELEMETRY TEMPORARILY OFFLINE."*
- **Features:**
  - Live network sensor that automatically reloads when connectivity is restored.
  - Interactive "Re-Establish Link" retry button with animated loading pulse.
  - Quick action buttons to view previously cached catalog products or the 3D showroom.
  - 100% inline CSS and SVGs requiring zero network roundtrips.
