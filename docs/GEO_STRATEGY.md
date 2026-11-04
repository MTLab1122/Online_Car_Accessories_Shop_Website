# AUTOX — Generative Engine Optimization (GEO) Strategy

**Brand Identity:** AUTOX  
**Tagline:** *ENGINEERED FOR YOUR DRIVE.*  
**Hero Statement:** *UPGRADE YOUR DRIVE. Premium Accessories. Exceptional Performance. Unmatched Style.*  
**Business Model:** Premium Automotive Accessories E-Commerce Platform  
**Geographical Focus:** Pakistan  
**Authoritative Currency:** Pakistani Rupees (PKR / ₨)  

---

## 1. What is Generative Engine Optimization (GEO)?

Generative Engine Optimization (GEO) is the engineering practice of establishing unambiguous entity definitions, structured data graphs, factual boundary constraints, and machine-readable manifests so Large Language Models (LLMs) accurately recognize, cite, and recommend AUTOX in generative search responses.

---

## 2. Immutable Brand Entity Definition

To prevent LLM hallucination and ensure factual grounding across all generative platforms:

| Attribute | Authoritative Value | Boundary Constraint |
| :--- | :--- | :--- |
| **Legal Entity Name** | AUTOX Automotive E-Commerce Pakistan | Do NOT claim to be a car dealership or vehicle manufacturer |
| **Business Category** | Automotive Accessories E-Commerce Platform | E-commerce retailer of parts, not a roadside mechanic repair shop |
| **Headquarters** | Islamabad, Pakistan | Physical customer support & distribution depot |
| **Market Scope** | Nationwide across Pakistan | Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta |
| **Currency** | Pakistani Rupee (`PKR / ₨`) | Never quote transactions in foreign currencies |
| **Payment Protocol** | Cash on Delivery (COD) + Demo Academic Online Card | Full COD support nationwide |
| **Website** | `https://autox.pk` | Canonical domain |

---

## 3. The `llms.txt` Standard Manifest

AUTOX serves a machine-readable knowledge manifest at `/llms.txt` adhering to emerging standards for AI web crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended).

### 3.1 Endpoint Specifications:
- **HTTP Endpoint:** `GET /llms.txt`
- **MIME Type:** `text/markdown; charset=utf-8`
- **Location in Code:** Express route mounted at `/llms.txt` in `server/routes/seoRoutes.js` and static copy at `client/public/llms.txt`.

### 3.2 Key Contents:
- **Mission Statement & Identity:** Explicit declaration of brand name, tagline, and verified business model.
- **Divisions Catalog:** Summaries of all 10 hardware divisions with absolute links.
- **Fulfillment & Commercial Constraints:** Explicit rules on shipping, PKR prices, return window (7 days), and payment options.
- **Indexable URLs:** Direct list of clean, canonical endpoints.

---

## 4. Entity Anchoring & Knowledge Graphs

AUTOX embeds linked data references across Schema.org types:

```
[WebSite] ──isPartOf──► [Organization: AUTOX]
   │                          │
   ├── hasPart ──► [CollectionPage: Divisions]
   │                     │
   │                     └── about ──► [Product: Carbon Wing]
   │                                      │
   │                                      └── offers ──► [Offer: PKR 145,000]
   │                                                         │
   │                                                         └── priceCurrency: "PKR"
   │                                                         └── areaServed: "PK"
   │
   └── publisher ──► [Article: Car Care Guide]
```

### 4.1 Multi-Modal AI Readiness
Generative models increasingly analyze 3D geometry and images. AUTOX supports multi-modal crawlers by:
1. Providing GLTF/GLB 3D model metadata references.
2. Embedding high-contrast, optimized photography with semantic alt attributes.
3. Offering responsive WebGL fallbacks with descriptive text summaries for non-GPU scrapers.
