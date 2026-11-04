# AUTOX — Technical SEO Implementation Architecture

**Brand:** AUTOX  
**System:** High-Performance E-Commerce Engine  
**Authoritative Market:** Pakistan  
**Currency:** Pakistani Rupees (PKR / ₨)  
**Base Canonical URL:** `https://autox.pk`  

---

## 1. System Architecture Overview

The technical SEO engine in AUTOX is divided across the backend Node.js Express server (`server/`) and the client React Vite application (`client/`), ensuring discovery endpoints are served natively at root HTTP boundaries while on-page metadata and structured data are generated reactively from live database entities.

```
                          ┌────────────────────────┐
                          │ Search Engine / AI Bot │
                          └───────────┬────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
   HTTP Root Discovery Endpoints            React Client Application
   • GET /robots.txt                        • Dynamic document.head (<SEO />)
   • GET /sitemap.xml (Real-time DB)        • JSON-LD Structured Data
   • GET /llms.txt (Entity Knowledge)       • Canonical link headers
                                            • Privacy-Safe Analytics
```

---

## 2. Dynamic XML Sitemap Engine (`server/controllers/seoController.js`)

The dynamic sitemap engine queries live MongoDB collections on every crawl request, formatting records according to the official `sitemap/0.9` XML protocol.

### 2.1 Route Handler: `GET /sitemap.xml`
- **MIME Content-Type:** `application/xml`
- **Cache-Control:** `public, max-age=86400, s-maxage=86400`
- **Included Content:**
  1. **Core Static Landing Pages:** `/`, `/shop`, `/categories`, `/showroom`, `/guides`, `/about`, `/contact`, `/faq`, `/shipping-policy`, `/return-policy`, `/privacy-policy`, `/terms`.
  2. **Active Categories:** Queried from `Category.find().select('slug updatedAt')`, generating `https://autox.pk/categories/:slug` (priority `0.8`, `weekly`).
  3. **In-Stock & Active Products:** Queried from `Product.find().select('slug updatedAt')`, generating `https://autox.pk/product/:slug` (priority `0.7`, `weekly`).
  4. **Editorial Guides:** Queried from `guidesData`, generating `https://autox.pk/guides/:slug` (priority `0.7`, `monthly`).

### 2.2 XML Output Sample:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://autox.pk/</loc>
    <lastmod>2026-11-04</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://autox.pk/shop</loc>
    <lastmod>2026-11-04</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://autox.pk/categories/exterior-accessories</loc>
    <lastmod>2026-11-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://autox.pk/product/3k-dry-carbon-fiber-gt-wing-spoiler</loc>
    <lastmod>2026-11-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

---

## 3. Crawler Control Directives (`server/controllers/seoController.js`)

### 3.1 Route Handler: `GET /robots.txt`
- **MIME Content-Type:** `text/plain`
- **Cache-Control:** `public, max-age=86400`
- **Rule Definitions:**
```txt
User-agent: *
Allow: /
Allow: /shop
Allow: /categories
Allow: /categories/*
Allow: /product/*
Allow: /showroom
Allow: /guides
Allow: /guides/*
Allow: /about
Allow: /contact
Allow: /faq
Allow: /shipping-policy
Allow: /return-policy
Allow: /privacy-policy
Allow: /terms

Disallow: /admin
Disallow: /admin/*
Disallow: /checkout
Disallow: /cart
Disallow: /account
Disallow: /account/*
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /reset-password/*
Disallow: /api/

Sitemap: https://autox.pk/sitemap.xml
```

---

## 4. Frontend Metadata & Schema Injector (`client/src/components/common/SEO.jsx`)

The `<SEO />` component manages document head tags reactively using native browser DOM APIs:
- Updates `document.title` (appending `| AUTOX Pakistan` standard suffix if missing).
- Synchronizes `<meta name="description" />`.
- Synchronizes `<link rel="canonical" href="..." />`.
- Sets `<meta name="robots" content="noindex, nofollow" />` if `noindex={true}`, or `<meta name="robots" content="index, follow" />` otherwise.
- Sets Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`, `og:type`) and Twitter Cards (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
- Generates or removes `<script type="application/ld+json">` containing serialized Schema.org JSON-LD arrays.

---

## 5. Schema Generator Engine (`client/src/utils/schemaGenerator.js`)

Structured data models are strictly grounded in factual parameters:

### 5.1 Product Schema
```javascript
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "image": product.images,
  "description": product.description,
  "sku": product.SKU,
  "brand": { "@type": "Brand", "name": product.brand },
  "offers": {
    "@type": "Offer",
    "url": `https://autox.pk/product/${product.slug}`,
    "priceCurrency": "PKR",
    "price": product.price,
    "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "seller": { "@type": "Organization", "name": "AUTOX" }
  }
}
```

---

## 6. Privacy-Preserving E-Commerce Analytics (`client/src/utils/analytics.js`)

The analytics engine integrates with GA4 / GTM via `window.dataLayer` and standard console telemetry in development environments.

### 6.1 Zero-PII Policy
No customer personally identifiable information (names, email addresses, phone numbers, complete physical addresses, credit card numbers, or passwords) is ever included in event parameters.

### 6.2 Supported Standard Events:
1. `view_item_list` (Shop page, Category detail)
2. `view_item` (Product detail page load)
3. `add_to_cart` (Product addition to cart)
4. `remove_from_cart` (Item deletion from cart)
5. `view_cart` (Cart page view with line items and subtotal)
6. `begin_checkout` (Initiation of checkout procedure)
7. `purchase` (Order confirmation with transaction ID, PKR total, shipping amount, and item array)
