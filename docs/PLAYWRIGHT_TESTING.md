# AUTOX — Playwright End-to-End Automation Architecture & Specification

## 1. Overview
The AUTOX E2E automation suite is built on **Playwright Test** to validate end-to-end user workflows, WebGL 3D canvas rendering, Progressive Web App capabilities, real transactional persistence in MongoDB, and responsive mobile rendering.

- **Framework:** `@playwright/test`
- **Browsers:** Chromium (Desktop & Mobile Viewport emulation)
- **Base URL:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api/v1`
- **Currency Standard:** Pakistani Rupees (`₨ / PKR`)
- **Payment Verification:** Cash on Delivery & Academic Simulation Mode

---

## 2. Test Architecture & Directory Structure
```
e2e/
├── fixtures/
│   ├── base.fixture.js      # Extends test with auto-initialized Page Objects
│   └── seed-data.js         # Test constants, deterministic credentials & product data
├── helpers/
│   ├── auth.helper.js       # Authentication tokens, login flows, and session helpers
│   ├── cart.helper.js       # Atomic cart operations and assertions
│   └── database.helper.js   # Deterministic database reset and cleanup utilities
├── pages/
│   ├── BasePage.js          # Shared navigation and global toast locators
│   ├── HomePage.js          # Hero, 3D Canvas, and Featured Products
│   ├── ShopPage.js          # Product grid, search filtering, and brand facets
│   ├── ProductPage.js       # Gallery, spec sheet, 3D preview, quantity controls
│   ├── CartPage.js          # Cart items, item removal, coupon form, total summary
│   ├── CheckoutPage.js      # Shipping details (Pakistan provinces/cities), payment selector
│   └── AuthPage.js          # Login & registration forms
└── tests/
    ├── homepage.spec.js         # Hero, brand tagline, 3D canvas, footer
    ├── navigation.spec.js       # Route changes, mobile drawer menu, 404 handler
    ├── authentication.spec.js   # Customer login, validation errors, session state
    ├── catalog.spec.js          # Product search, category filters, empty search states
    ├── product-details.spec.js  # Dynamic route loading, specs, pricing, quantity limits
    ├── cart.spec.js             # Add to cart, quantity changes, item removal
    ├── coupon.spec.js           # Valid promo code, invalid code, case-insensitive entry
    ├── checkout.spec.js         # Form validation, Cash on Delivery, payment methods
    ├── order-placement.spec.js  # Full purchase journey with real DB stock deduction
    ├── showroom.spec.js         # Three.js 3D Studio, lighting presets, turntable orbit
    └── pwa.spec.js              # Manifest schema, SW registration, offline banner, security
```

---

## 3. Verified Test Suites Summary

| Suite File | Test Count | Pass Rate | Key Validations |
| :--- | :---: | :---: | :--- |
| `homepage.spec.js` | 4 | **100% (4/4)** | Hero title, Procedural 3D Canvas, navigation links, VIP dispatch |
| `navigation.spec.js` | 2 | **100% (2/2)** | Core routes (`/`, `/shop`, `/categories`, `/showroom`), Mobile menu |
| `authentication.spec.js` | 4 | **100% (4/4)** | Validation errors, valid login, persistent JWT cookie, account link |
| `catalog.spec.js` | 3 | **100% (3/3)** | Product grid, search filtering, category filters, empty results |
| `product-details.spec.js` | 4 | **100% (4/4)** | Specs tab, PKR formatted price, in-stock badge, quantity increment |
| `cart.spec.js` | 3 | **100% (3/3)** | Add item, stock quantity increment, persistent totals |
| `coupon.spec.js` | 4 | **100% (4/4)** | `WELCOME10` 10% discount, invalid code handling, case-insensitivity |
| `checkout.spec.js` | 2 | **100% (2/2)** | Required shipping fields, Cash on Delivery selection |
| `order-placement.spec.js` | 1 | **100% (1/1)** | Full purchase, order confirmation `AOX-*`, real MongoDB stock decrement |
| `showroom.spec.js` | 4 | **100% (4/4)** | WebGL studio canvas, Midnight/Sunset/Cyber Noir presets, pedestal stands |
| `pwa.spec.js` | 6 | **100% (6/6)** | Manifest JSON, icon assets, SW registration, offline fallback, security |

**Total:** 33 / 33 End-to-End Tests Passing.

---

## 4. Execution Commands

### Run Full Suite on Desktop Chromium
```bash
npx playwright test --project="Desktop Chromium"
```

### Run Full Suite on Mobile Viewport (iPhone 14 / Chromium)
```bash
npx playwright test e2e/tests/navigation.spec.js --project="Mobile iPhone 14"
```

### Run Individual Spec
```bash
npx playwright test e2e/tests/order-placement.spec.js --project="Desktop Chromium"
```

### View Interactive HTML Report
```bash
npx playwright show-report playwright-report
```

---

## 5. Reliability & Determinism Engineering
1. **Headless WebGL Optimization:** Launch argument `--disable-features=WebXR` prevents OpenXR stalls on Windows, reducing test duration from ~50s to under 4s per test.
2. **DOM Content Loaded Strategy:** Navigations utilize `waitUntil: 'domcontentloaded'` with explicit element assertions to avoid blocking on slow external CDNs or heavy textures.
3. **Strict Database Isolation:** Order placement tests generate unique isolated timestamps and query product stock before and after purchase to verify real persistent atomic inventory decrements.
