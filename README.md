# AUTOX — 3D IMMERSIVE ONLINE CAR ACCESSORIES SHOP
> **Final Year Project (FYP) — Full-Stack MERN E-Commerce Platform**  
> *Tagline:* "ENGINEERED FOR YOUR DRIVE."  
> *Hero Statement:* "UPGRADE YOUR DRIVE. Premium Accessories. Exceptional Performance. Unmatched Style."  
> *Primary Market:* Pakistan • *Authoritative Currency:* Pakistani Rupees (PKR ₨)

---

## 1. Project Overview

**AUTOX** is an end-to-end, full-stack MERN e-commerce application engineered for luxury automotive enthusiasts in Pakistan. Inspired by supercar configurators and editorial motorsport magazines, AUTOX unites an interactive Three.js 3D WebGL showroom with an authoritative Express/MongoDB transactional backend.

### Key Highlights
- **Interactive 3D Automotive Hero & Virtual Showroom:** Real-time WebGL sports car experience with smooth pointer damping, contact shadows, studio lighting presets (Midnight, Sunset, Cyber Noir), and interactive accessory display pedestals.
- **Authoritative Backend Security:** Server-side pricing calculation, strict inventory deduction, cryptographic order generation (`AOX-YYYYMMDD-XXXX`), coupon validation, and role-based access control.
- **Pakistani Automotive Market Localization:** All pricing in Pakistani Rupees (PKR), Cash On Delivery (COD) workflows, domestic parcel timelines, and provincial address validation.
- **Complete Administration Operations Command:** Comprehensive dashboard KPIs, order transition state machines, product/category catalog management, customer suspension controls, review moderation, and promotional coupon issuing.
- **Zero-Config Embedded Database Fallback:** Automatic zero-config embedded MongoDB memory instance for evaluation environments with no local MongoDB daemon required.

---

## 2. Technology Stack

### Frontend Architecture
- **Framework:** React.js 18 with Vite 6 (JavaScript ES Modules)
- **Styling & Theme:** Tailwind CSS 3 (Dark Luxury Automotive Theme `#080A0D`, `#15191F`, `#FF5A1F`)
- **3D Graphics & Canvas:** Three.js, React Three Fiber (R3F), Drei
- **Motion & Interactions:** Framer Motion
- **State & Context:** React Context API (AuthContext, CartContext, WishlistContext)
- **HTTP Client:** Axios with withCredentials & session interceptors
- **Icons & UI:** Lucide React
- **Notifications:** React Hot Toast
- **Testing:** Vitest, React Testing Library, JSDOM

### Backend Architecture
- **Runtime:** Node.js v26 LTS / v20+ with Express.js 4
- **Database ODM:** MongoDB with Mongoose 8
- **Authentication & Cryptography:** JSON Web Tokens (JWT), bcryptjs, crypto sha256
- **Security Middleware:** Helmet, CORS (allowlisted origin & credentials), Express Rate Limit, Cookie-parser (HTTP-only)
- **Data Validation:** Zod schema validation middleware
- **File & Media Handling:** Multer with MIME and extension filtering
- **Testing Framework:** Vitest 3 with Supertest 7
- **Database Fallback:** mongodb-memory-server (zero-config local dev & CI testing)

---

## 3. Monorepo Architecture & Directory Structure

```
online-car-accessories-shop/
├── client/                               # Frontend Single Page Application
│   ├── public/
│   │   ├── logo.svg                     # AUTOX Brand Vector Asset
│   │   └── models/                      # 3D GLTF / GLB assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                  # Skeletons, Modals, ProtectedRoute, AdminRoute
│   │   │   ├── navigation/              # Glass-nav Navbar & Luxury Footer
│   │   │   └── products/                # ProductCard, QuickViewModal
│   │   ├── context/                     # AuthContext, CartContext, WishlistContext
│   │   ├── pages/
│   │   │   ├── public/                  # Home, Shop, Categories, ProductDetail, Cart, Checkout, Info
│   │   │   ├── auth/                    # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── customer/                # AccountPage (Profile, Orders, Addresses, Wishlist, Security)
│   │   │   └── admin/                   # AdminDashboardPage (Metrics, Orders, Catalog, Coupons, Reviews)
│   │   ├── services/                    # Axios API service modules
│   │   ├── styles/                      # Tailwind custom styling & scrollbars
│   │   ├── tests/                       # Vitest component & navigation tests
│   │   ├── three/                       # InteractiveHeroCar, ShowroomScene, ProductModelViewer
│   │   ├── App.jsx                      # App route definitions with Suspense
│   │   └── main.jsx                     # Context & BrowserRouter bootstrap
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                               # Backend RESTful API Engine
│   ├── config/                          # MongoDB connection & embedded fallback
│   ├── controllers/                     # Request controllers (Auth, Products, Cart, Orders, Admin, etc.)
│   ├── middleware/                      # Auth protect/authorize, upload, validation, errorHandler
│   ├── models/                          # Mongoose schemas (User, Product, Category, Order, Cart, etc.)
│   ├── routes/                          # Express v1 route registrations
│   ├── seed/                            # Idempotent database seeder (10 categories, 31+ products)
│   ├── tests/                           # Vitest & Supertest integration suites
│   ├── utils/                           # JWT cookie sender, standard API response envelopes, email adapter
│   ├── validators/                      # Zod schemas
│   ├── app.js                           # Express application configuration
│   ├── server.js                        # HTTP listener bootstrap
│   └── package.json
│
├── docs/                                # Technical Documentation
│   ├── API.md                           # RESTful Endpoint specifications
│   ├── DATABASE.md                      # Schema designs & ER diagrams
│   └── TESTING.md                       # QA test results & execution logs
│
├── .env.example                         # Environment configuration reference
├── package.json                         # Root monorepo scripts
└── README.md
```

---

## 4. Prerequisites & Requirements

- **Node.js:** v18.0.0 or higher (Tested and verified on Node v26.13.0 LTS)
- **NPM:** v9.0.0 or higher
- **MongoDB:** (Optional for local testing) Any standard MongoDB 6.0+ cluster (Atlas or local). If an external cluster is unreachable, the system automatically runs an embedded, zero-config MongoDB instance for local demonstration.

---

## 5. Quick Start & Installation

### Step 1: Clone or Navigate to Project
```bash
cd Online_Car_Accessories_Website
```

### Step 2: Install Monorepo Dependencies
```bash
npm run install:all
```
*(Or individually: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

### Step 3: Configure Environment Variables
Copy `.env.example` into `server/.env` and `client/.env`:
```bash
# In server directory:
cp server/.env.example server/.env

# In client directory:
cp client/.env.example client/.env
```

---

## 6. Database Seeding & Administrator Setup

The seed script creates:
- 10 Dedicated Performance Divisions (Categories)
- 31 Detailed Track & Luxury Accessories (Descriptions, PKR Pricing, Specs, High-res images)
- 3 Active Promotional Coupons (`AUTOX10`, `SUPERDRIVE`, `VIP500`)
- 1 Pre-configured Administrator Account
- Sample Customers, Orders, and Verified Buyer Reviews

### Execute Seeding
```bash
npm run seed
```

### Default Seeded Demonstration Credentials
| Account Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@autox.pk` | `Admin@AutoX2026!` | Full Admin Operations Command |
| **Customer Pilot** | `hamza.tariq@example.pk` | `Password123!` | Customer Dashboard, Orders, Wishlist |

---

## 7. Running the Application

### Start Both Frontend & Backend Concurrently
```bash
npm run dev
```

- **Client Application:** `http://localhost:5173`
- **Backend API Engine:** `http://localhost:5000`
- **API Health Check:** `http://localhost:5000/api/health`

### Run Individually
- Frontend only: `npm run client`
- Backend only: `npm run server`

---

## 8. Automated Testing Suite

All 20 backend integration and frontend component tests are automated using Vitest and Supertest.

```bash
# Run all tests across backend and frontend
npm test

# Run backend integration tests only
cd server && npm test

# Run frontend component tests only
cd client && npm test
```

### Test Verification Summary
- **Backend (Supertest):** 15/15 Passed (Registration, Duplicate Email Prevention, Password Hashing, JWT Cookie, Catalog Filtering, Pagination, Stock Deduction, Admin Guard).
- **Frontend (RTL + Vitest):** 5/5 Passed (ProductCard Rendering, Add to Cart interaction, Wishlist toggle, Navbar brand typography, Live item badge count).

---

## 9. Production Build

To verify production bundling and optimization:
```bash
npm run build
```
Generates minified, tree-shaken assets in `client/dist/` with route-level code splitting.

---

## 10. Academic Demonstration & Payment Disclaimer

> **[!NOTE]**  
> AUTOX features two checkout payment workflows:
> 1. **Cash On Delivery (COD):** Authentic physical cash collection upon parcel arrival anywhere in Pakistan.
> 2. **Simulated Online Payment:** Clearly designated as an academic demonstration mechanism. No real credit card or bank debit instrument is charged. Never display or pretend a fake banking transaction has occurred.

---

## 11. Troubleshooting

- **PowerShell Execution Policy on Windows:**  
  If npm scripts fail to run in PowerShell, run:  
  `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force`
- **Local MongoDB Connection (ECONNREFUSED):**  
  AUTOX automatically catches unreachable MongoDB connections in development and activates an embedded MongoDB instance. You do not need to install MongoDB manually to run tests or demonstrate the application.
- **Port Conflict (5000 / 5173):**  
  Adjust `PORT` in `server/.env` and `VITE_API_URL` in `client/.env` if another local service occupies default ports.
