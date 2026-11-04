# AUTOX — Schema.org JSON-LD Implementation Dictionary

**Standard:** Schema.org JSON-LD  
**Host Application:** AUTOX (`client/src/utils/schemaGenerator.js`)  
**Validation Standard:** Google Rich Results & Schema.org Specification  
**Currency Standard:** Pakistani Rupees (`PKR`)  

---

## 1. Schema Architecture Overview

AUTOX generates valid, machine-readable JSON-LD schemas inject directly into `document.head`. The generator provides utility functions for all primary entity types in the e-commerce and editorial journey.

---

## 2. Entity Schema Dictionary

### 2.1 `Organization` Schema
Anchors AUTOX as a verified commercial entity in Pakistan.
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AUTOX",
  "legalName": "AUTOX Automotive E-Commerce Pakistan",
  "url": "https://autox.pk",
  "logo": "https://autox.pk/logo.svg",
  "slogan": "ENGINEERED FOR YOUR DRIVE.",
  "description": "Pakistan’s premier high-performance automotive accessories e-commerce platform.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Blue Area, Sector G-7/1",
    "addressLocality": "Islamabad",
    "addressRegion": "Islamabad Capital Territory",
    "postalCode": "44000",
    "addressCountry": "PK"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+92-300-1234567",
      "contactType": "customer service",
      "areaServed": "PK",
      "availableLanguage": ["English", "Urdu"]
    }
  ]
}
```

### 2.2 `WebSite` Schema (with Sitelinks SearchBox)
Enables interactive sitelinks search on Google SERPs.
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AUTOX",
  "alternateName": "AUTOX Pakistan",
  "url": "https://autox.pk",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://autox.pk/shop?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### 2.3 `Product` & `Offer` Schema
Provides complete product specifications, pricing in PKR, stock availability, and verified ratings.
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "3K Dry Carbon Fiber GT Wing Spoiler",
  "image": ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738"],
  "description": "Track-tested autoclave dry carbon spoiler for high-speed aerodynamics.",
  "sku": "AERO-WING-01",
  "mpn": "AERO-WING-01",
  "brand": {
    "@type": "Brand",
    "name": "AeroCraft Pro"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://autox.pk/product/3k-dry-carbon-fiber-gt-wing-spoiler",
    "priceCurrency": "PKR",
    "price": 145000,
    "priceValidUntil": "2027-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "AUTOX"
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": 0,
        "currency": "PKR"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "PK"
      }
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.9,
    "reviewCount": 8,
    "bestRating": 5,
    "worstRating": 1
  }
}
```

### 2.4 `BreadcrumbList` Schema
Enables clean hierarchical breadcrumbs in search snippets.
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://autox.pk/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Shop",
      "item": "https://autox.pk/shop"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "3K Dry Carbon Fiber GT Wing Spoiler",
      "item": "https://autox.pk/product/3k-dry-carbon-fiber-gt-wing-spoiler"
    }
  ]
}
```

### 2.5 `FAQPage` Schema
Enables rich snippet FAQ accordions and direct citation in AI Overviews.
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you deliver car accessories nationwide across Pakistan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We deliver via tracked air and road express couriers to all major cities including Karachi, Lahore, Islamabad, Rawalpindi, and Faisalabad."
      }
    }
  ]
}
```

### 2.6 `Article` Schema
Used across `/guides/:slug` to establish authoritativeness and date freshness.
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete Car Accessories Buying Guide for Pakistani Drivers",
  "image": ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738"],
  "datePublished": "2026-03-01T10:00:00.000Z",
  "dateModified": "2026-03-15T12:00:00.000Z",
  "author": {
    "@type": "Organization",
    "name": "AUTOX Technical Engineering Team",
    "url": "https://autox.pk"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AUTOX",
    "logo": {
      "@type": "ImageObject",
      "url": "https://autox.pk/logo.svg"
    }
  }
}
```
