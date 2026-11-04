# AUTOX — Frontend Performance, Code-Splitting & Asset Optimization

## 1. Executive Performance Architecture

AUTOX delivers an ultra-high performance score (targeting 90+ Lighthouse Performance) while delivering real-time WebGL 3D rendering and motion animations.

---

## 2. Code-Splitting & Bundle Strategy

Built with **Vite 6** and Rollup code-splitting:

```
dist/index.html                               1.32 kB │ gzip:   0.69 kB
dist/assets/index-*.css                      48.18 kB │ gzip:   8.61 kB
dist/assets/HomePage-*.js                    43.03 kB │ gzip:  11.99 kB
dist/assets/ShopPage-*.js                    15.03 kB │ gzip:   4.46 kB
dist/assets/ProductDetailPage-*.js           99.00 kB │ gzip:  32.42 kB
dist/assets/ShowroomScene-*.js              127.60 kB │ gzip:  47.15 kB
dist/assets/index-*.js (Core React & Libs)  424.81 kB │ gzip: 137.69 kB
dist/assets/ContactShadows-*.js (Three.js)  830.21 kB │ gzip: 222.81 kB
```

### Route-Level Lazy Loading
Every public and admin route is lazy-loaded via React `lazy()` and `Suspense`:
- `ShowroomScene.jsx` is only downloaded when the user enters the 3D Showroom route (`/showroom`), keeping initial landing page visits under 150kB gzipped.
- `AdminDashboardPage.jsx` is isolated from customer bundles.

---

## 3. Font Optimization Strategy

1. **`display=swap` Directive**: Google Fonts link in `client/index.html` specifies `display=swap`, ensuring zero Flash of Invisible Text (FOIT) on cellular networks.
2. **Preconnect Hints**:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   ```

---

## 4. WebGL Runtime Performance

1. **Procedural Geometry vs Heavy Polygons**: The 3D showroom stands and floating parts utilize lightweight procedural Three.js geometries (`cylinderGeometry`, `torusGeometry`, `boxGeometry`) instead of uncompressed multi-megabyte obj/fbx files.
2. **Frame-Rate Throttle**: OrbitControls dampening and rotation logic use delta-based incrementation (`delta * 0.4`), ensuring consistent rotational velocity on 60Hz, 90Hz, 120Hz, and 144Hz displays.
3. **Contact Shadow Bounding**: Fast baking of ground contact shadows without taxing mobile rasterizers.

---

## 5. Network Caching & Debounced Search

- **Search Debounce**: The live search overlay (`SearchOverlay.jsx`) debounces API input by `300ms`, preventing redundant server calls during rapid typing.
- **Vite Asset Fingerprinting**: All JS, CSS, and SVG assets are compiled with immutable content hashes for aggressive HTTP caching (`Cache-Control: public, max-age=31536000, immutable`).

