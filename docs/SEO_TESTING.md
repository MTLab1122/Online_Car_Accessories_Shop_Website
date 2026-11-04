# AUTOX — SEO, AEO & Discovery Testing & Verification Suite

**System:** AUTOX Automated QA Engine  
**Test Framework:** Vitest 3.2.7 & Supertest 7.0.0  
**Target Coverage:** Backend Endpoints, Dynamic Sitemap, Crawler Directives, AI Manifests, Frontend Schema Injections, Breadcrumbs, and Meta Synchronization  

---

## 1. Testing Architecture Overview

The automated test suite verifies all critical SEO and discovery behaviors on every build and CI cycle:
1. **Server Discovery Suite (`server/tests/seo.test.js`):** Tests raw HTTP responses for `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and editorial `/api/v1/guides` routes against an isolated in-memory MongoDB server.
2. **Client SEO & Schema Suite (`client/src/tests/SEO.test.jsx`):** Tests reactive DOM manipulation, canonical link updates, `noindex` directives, and JSON-LD schema generation.
3. **End-to-End Regression Test (`npm run test:all`):** Executes full monorepo verification across backend and frontend.

---

## 2. Test Execution Commands

```bash
# Run server SEO discovery suite
cd server
npx vitest run tests/seo.test.js

# Run client SEO and schema generator suite
cd client
npx vitest run src/tests/SEO.test.jsx

# Run complete monorepo test suite (21 server tests + 10 client tests = 31 tests)
npm run test:all
```

---

## 3. Test Cases & Verification Matrix

### 3.1 Backend Discovery Tests (`server/tests/seo.test.js`)

| Test Case | Description | Expected Status | Assertion Criteria |
| :--- | :--- | :--- | :--- |
| `GET /robots.txt` | Authoritative crawler directives | `200 OK` | `content-type: text/plain`, contains `User-agent: *`, `Disallow: /admin`, `Disallow: /checkout`, `Sitemap: https://autox.pk/sitemap.xml` |
| `GET /sitemap.xml` | Dynamic database-driven XML sitemap | `200 OK` | `content-type: application/xml`, contains `<urlset>`, static URLs, active category slugs, and generated product slugs |
| `GET /llms.txt` | AI Agent entity manifest | `200 OK` | `content-type: text/plain` / markdown, contains brand identity, Pakistani Rupees (`PKR / ₨`), and delivery parameters |
| `GET /api/v1/guides` | Topical authority content list | `200 OK` | `success: true`, returns list of guides with `slug`, `title`, `readTime`, and `publishedAt` |
| `GET /api/v1/guides/:slug` | Single guide detail | `200 OK` | Returns full editorial content with sections and related categories |
| `GET /api/v1/guides/:slug` (404) | Non-existent guide lookup | `404 Not Found` | Handled cleanly with `{ success: false, message: 'Editorial guide not found' }` |

### 3.2 Frontend SEO Tests (`client/src/tests/SEO.test.jsx`)

| Test Case | Description | Expected Behavior |
| :--- | :--- | :--- |
| `Document Head Sync` | Mounts `<SEO />` with title, description, canonical | Synchronously updates `document.title`, creates `<meta name="description">`, `<link rel="canonical">`, and `<script type="application/ld+json">` |
| `noindex Directive` | Mounts `<SEO noindex={true} />` on private routes | Injects `<meta name="robots" content="noindex, nofollow">` |
| `Organization & WebSite Schema` | Evaluates root schema generators | Generates compliant Schema.org JSON graph with `SearchAction` sitelinks template |
| `Product & Offer Schema` | Evaluates product schema generator | Emits `PKR` currency, stock availability status, and conditional `AggregateRating` only when genuine reviews exist |
| `FAQPage Schema` | Evaluates FAQ microdata generator | Emits valid `Question` and `acceptedAnswer` objects |

---

## 4. Live Verification Output Summary

```
 RUN  v3.2.7 C:/Users/muham/OneDrive/Desktop/Online_Car_Accessories_Website/server
 ✓ tests/products.test.js (5 tests)
 ✓ tests/auth.test.js (6 tests)
 ✓ tests/cart_order.test.js (4 tests)
 ✓ tests/seo.test.js (6 tests)
 Test Files  4 passed (4)
 Tests       21 passed (21)

 RUN  v3.2.7 C:/Users/muham/OneDrive/Desktop/Online_Car_Accessories_Website/client
 ✓ src/tests/SEO.test.jsx (5 tests)
 ✓ src/tests/ProductCard.test.jsx (3 tests)
 ✓ src/tests/Navigation.test.jsx (2 tests)
 Test Files  3 passed (3)
 Tests       10 passed (10)

TOTAL SUITE RESULTS: 31 PASSED | 0 FAILED | 100% SUCCESS RATE
```

