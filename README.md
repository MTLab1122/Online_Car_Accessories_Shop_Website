# AUTOX — 3D IMMERSIVE ONLINE CAR ACCESSORIES SHOP
> **Final Year Project (FYP) — Full-Stack MERN E-Commerce Platform**  
> *Tagline:* "ENGINEERED FOR YOUR DRIVE."  
> *Hero Statement:* "UPGRADE YOUR DRIVE. Premium Accessories. Exceptional Performance. Unmatched Style."  
> *Primary Market:* Pakistan • *Authoritative Currency:* Pakistani Rupees (PKR ₨)

[![GitHub Pages Deployment](https://github.com/MTLab1122/Online_Car_Accessories_Shop_Website/actions/workflows/deploy.yml/badge.svg)](https://github.com/MTLab1122/Online_Car_Accessories_Shop_Website/actions/workflows/deploy.yml)
[![Playwright Tests](https://img.shields.io/badge/Playwright-33%2F33%20Passed-brightgreen.svg?logo=playwright)](./docs/PLAYWRIGHT_TESTING.md)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20First-orange.svg?logo=pwa)](./docs/PWA_IMPLEMENTATION.md)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B%20%7C%20v26-success.svg?logo=node.js)](https://nodejs.org/)
[![React 18](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black.svg?logo=three.js)](https://threejs.org/)

---

## 🌐 Public Links

- **Live Deployed Website (GitHub Pages):**  
  [https://mtlab1122.github.io/Online_Car_Accessories_Shop_Website/](https://mtlab1122.github.io/Online_Car_Accessories_Shop_Website/)
- **Official GitHub Repository:**  
  [https://github.com/MTLab1122/Online_Car_Accessories_Shop_Website](https://github.com/MTLab1122/Online_Car_Accessories_Shop_Website)

---

## 1. Project Overview

**AUTOX** is an end-to-end, production-grade automotive e-commerce platform engineered specifically for Pakistan's performance and luxury car market. Inspired by supercar configurators and editorial motorsport design, AUTOX unites an interactive WebGL Three.js studio with an authoritative Express.js and MongoDB transactional engine.

### Key Implemented Capabilities
- **Interactive 3D WebGL Configurator & Studio:** Three.js, React Three Fiber (R3F), and Drei integration featuring realistic procedural supercar aerodynamics, interactive lighting presets (*Midnight, Sunset, Cyber Noir*), accessory pedestal stands, and free turntable orbit controls.
- **Progressive Web App (PWA) with Offline Telemetry:** Service worker precaching, Cache-First asset handling, and Network-First catalog caching ensuring uninterrupted equipment browsing across variable 3G/4G Pakistani cellular connections, complete with luxury offline fallback page (`offline.html`) and live connection telemetry.
- **Enterprise Automation & Playwright E2E Suite:** 11 dedicated Playwright test suites covering full customer journeys, real database inventory deduction, promotional coupons, authentication, WebGL studio, and mobile viewports.
- **Pakistani Automotive Market Localization:** All authoritative pricing strictly denominated in Pakistani Rupees (PKR `₨`), authentic Cash on Delivery (COD) workflows, domestic shipping estimation, and provincial address validation.
- **Production-Ready Security & Administration:** Cryptographic order generation (`AOX-YYYYMMDD-XXXX`), JWT cookies with HTTP-only security, rate limiting, Helmet HTTP headers, Zod schema validation, and complete administrative telemetry.

---

## 2. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js 18 & Vite 6 | Fast HMR, ES Modules, dynamic code-splitting |
| **Styling & Design System** | Tailwind CSS 3 | Luxury Dark Automotive Theme (`#080A0D`, `#15191F`, `#FF5A1F`) |
| **3D Graphics & Canvas** | Three.js, React Three Fiber, Drei | WebGL rendering, orbit controls, contact shadows |
| **Motion & Micro-interactions** | Framer Motion | Fluid animated drawers, page transitions, and toast alerts |
| **State Management** | React Context API | `AuthContext`, `CartContext`, `WishlistContext` |
| **E2E Automation** | Playwright Test | Desktop & Mobile Chromium browser automation |
| **Unit & Integration Testing** | Vitest 3, React Testing Library, Supertest | Server API and client component suites |
| **Backend Runtime** | Node.js v20+ / Express.js 4 | RESTful API with modular MVC architecture |
| **Database & ODM** | MongoDB with Mongoose 8 | Atomic schema constraints, partial filter indexes |
| **Offline Engine** | Service Worker & Web App Manifest | W3C PWA standards, Cache Storage API |
| **Deployment & CI/CD** | GitHub Pages & GitHub Actions | Automated build, artifact packaging, and zero-downtime release |

---

## 3. Monorepo Architecture & Directory Structure

```
Online_Car_Accessories_Shop_Website/
├── .github/
│   └── workflows/
│       ├── deploy.yml                   # Automated GitHub Pages CI/CD workflow
│       └── e2e.yml                      # Automated Playwright test workflow
├── client/                              # Frontend Single Page Application (React 18 + Vite)
│   ├── public/
│   │   ├── icons/                       # 192x192, 512x512, and maskable PWA icons
│   │   ├── logo.svg                     # Vector brand logo
│   │   ├── manifest.webmanifest         # W3C Web App Manifest
│   │   ├── offline.html                 # Luxury dark offline fallback experience
│   │   └── sw.js                        # Precision caching Service Worker
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                  # Skeletons, Modals, ProtectedRoute, AdminRoute, SEO
│   │   │   ├── navigation/              # Luxury Navbar, Footer, and SearchOverlay
│   │   │   ├── products/                # ProductCard, QuickViewModal
│   │   │   ├── pwa/                     # OfflineIndicator HUD, UpdateNotification
│   │   │   └── ui/                      # Buttons, Drawers, Modals, Breadcrumbs, PriceDisplay
│   │   ├── context/                     # AuthContext, CartContext, WishlistContext
│   │   ├── data/                        # Static showcase catalog fallback
│   │   ├── hooks/                       # useOnlineStatus and responsive viewport hooks
│   │   ├── pages/                       # Home, Shop, Categories, ProductDetail, Cart, Checkout, Admin
│   │   ├── services/                    # API clients (auth, product, category, cart, order, pwa)
│   │   ├── tests/                       # Vitest component & navigation tests
│   │   ├── three/                       # InteractiveHeroCar, ShowroomScene
│   │   ├── App.jsx                      # Client route definitions with lazy loading Suspense
│   │   └── main.jsx                     # Root bootstrap with subpath basename support
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js                   # GitHub Pages SPA 404 generator plugin
│
├── server/                              # Backend RESTful API Engine (Node.js + Express)
│   ├── config/                          # MongoDB connection with embedded fallback
│   ├── controllers/                     # Auth, Products, Cart, Orders, Admin controllers
│   ├── middleware/                      # Auth protect, upload, validation, errorHandler
│   ├── models/                          # Mongoose schemas (User, Product, Category, Order, Cart)
│   ├── routes/                          # Express v1 route definitions
│   ├── seed/                            # Seed script with 10 categories, 31+ products, admin user
│   ├── tests/                           # Vitest & Supertest API integration suites
│   ├── app.js                           # Express application configuration
│   └── server.js                        # HTTP listener bootstrap
│
├── docs/                                # Production Documentation
│   ├── OFFLINE_CACHE_POLICY.md          # PWA caching rules, TTL, and security boundaries
│   ├── PLAYWRIGHT_TESTING.md            # E2E test architecture, Page Objects, and CLI
│   ├── PWA_IMPLEMENTATION.md            # Manifest specifications & SW architecture
│   ├── API.md                           # RESTful Endpoint specifications
│   ├── DATABASE.md                      # Schema designs & ER diagrams
│   └── TESTING.md                       # Test results & verification logs
│
├── e2e/                                 # Playwright End-to-End Automation Suite
│   ├── helpers/                         # Database and auth helpers
│   ├── pages/                           # Page Object Models (Home, Shop, Product, Cart, Checkout)
│   └── tests/                           # 11 comprehensive E2E test suites
│
├── .env.example                         # Environment configuration reference
├── package.json                         # Root monorepo build & test orchestration
├── playwright.config.js                 # Playwright multi-project runner configuration
└── README.md
```

---

## 4. Quick Start & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **NPM:** v9.0.0 or higher
- **MongoDB:** (Optional for local testing) If an external MongoDB cluster is not running, the backend seamlessly activates an embedded in-memory MongoDB instance for local demonstration.

### Step 1: Clone Repository
```bash
git clone https://github.com/MTLab1122/Online_Car_Accessories_Shop_Website.git
cd Online_Car_Accessories_Shop_Website
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
```bash
# In server directory:
cp server/.env.example server/.env

# In client directory:
cp client/.env.example client/.env
```

### Step 4: Seed Database
```bash
npm run seed
```
*Seeded Admin Credentials:*
- **Email:** `admin@autox.pk`
- **Password:** `Admin@AutoX2026!`

### Step 5: Start Development Servers
```bash
npm run dev
```
- **Frontend Application:** `http://localhost:5173`
- **Backend API Server:** `http://localhost:5000`
- **API Health Check:** `http://localhost:5000/api/v1/health`

---

## 5. Automated Verification & Testing Suite

AUTOX implements a multi-tier testing pipeline covering unit, integration, and full end-to-end browser automation.

### 1. Playwright End-to-End Automation Suite (11 Suites / 33 Tests)
```bash
# Run full E2E suite on Desktop Chromium
npm run test:e2e

# Run E2E suite with interactive HTML report
npm run test:e2e:report

# Run mobile viewport check (iPhone 14)
npm run test:e2e:mobile

# Run 3D WebGL Showroom tests
npm run test:e2e:showroom
```

| Suite File | Scope & Assertions |
| :--- | :--- |
| `homepage.spec.js` | Brand hero, WebGL canvas dimensions, navigation, VIP dispatch |
| `navigation.spec.js` | Core public routes (`/`, `/shop`, `/categories`, `/showroom`), mobile menu |
| `authentication.spec.js` | Validation errors, customer login, persistent JWT cookies, session state |
| `catalog.spec.js` | Product grid, search input filter, category filter pills, empty state |
| `product-details.spec.js` | Dynamic route loading, specification sheet, authoritative PKR pricing |
| `cart.spec.js` | Add to cart, quantity change, badge updates, item removal |
| `coupon.spec.js` | `WELCOME10` 10% discount, invalid code handling, case-insensitivity |
| `checkout.spec.js` | Shipping validation, Pakistan cities/provinces, Cash on Delivery |
| `order-placement.spec.js` | Full purchase journey, order confirmation `AOX-*`, real MongoDB atomic stock decrement |
| `showroom.spec.js` | Three.js Studio Canvas, Midnight/Sunset/Cyber Noir presets, pedestal stand switching |
| `pwa.spec.js` | Manifest JSON schema, icon loading, service worker registration, offline fallback |

### 2. Unit & Integration Baselines
```bash
# Run server Vitest API tests (21/21 passed)
npm run test

# Run client Vitest component tests (19/19 passed)
npm run test:client

# Run all unit tests across monorepo
npm run test:all
```

---

## 6. Website Deployment Architecture

### Frontend: GitHub Pages (Automated via GitHub Actions)
The frontend is deployed to GitHub Pages at:  
`https://mtlab1122.github.io/Online_Car_Accessories_Shop_Website/`

- **Build Configuration:** Handled by Vite with base path `/Online_Car_Accessories_Shop_Website/`.
- **SPA Routing Support:** The custom `githubPagesSpa` build plugin automatically duplicates `index.html` to `404.html` in `client/dist/`, ensuring that direct navigation to sub-routes (e.g., `/shop`, `/showroom`) works smoothly without server 404 errors.
- **Showcase & Offline Mode:** When deployed as a static client on GitHub Pages, the application automatically falls back to an embedded showcase catalog and local storage cart if a remote backend is not connected.

### Backend Hosting Requirements
The backend is an Express.js / Node.js service requiring a persistent database connection (MongoDB Atlas) and environment secrets (`JWT_SECRET`, `ADMIN_PASSWORD`).
- **Recommended Free/Low-Cost Platforms:** Render.com, Railway.app, Fly.io, or VPS.
- **Docker Ready:** Can be packaged and deployed as a container using the provided `server/server.js` and `package.json`.
- **Connecting Frontend to Live Backend:** Set `VITE_API_URL=https://your-backend-api.onrender.com/api/v1` during build time.

---

## 7. Academic Demonstration & Payment Notice

> **[!NOTE]**  
> AUTOX features two checkout payment workflows:
> 1. **Cash On Delivery (COD):** Authentic physical cash collection upon parcel arrival anywhere in Pakistan.
> 2. **Simulated Online Payment:** Clearly designated as an academic demonstration mechanism. No real credit card or bank debit instrument is charged. Never display or pretend a fake banking transaction has occurred.

---

## 8. License & Authors

- **Brand:** AUTOX — Engineered For Your Drive
- **Project Type:** Final Year Project (FYP) — Full-Stack E-Commerce Web Application
- **Author:** AUTOX Engineering Team
- **License:** ISC License
