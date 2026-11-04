# AUTOX — SEO, AEO & GEO Operational Maintenance Playbook

**System:** Operational Guide for Engineering & Content Teams  
**Platform:** AUTOX Performance Lab  
**Market:** Pakistan  
**Authoritative Currency:** Pakistani Rupees (PKR / ₨)  

---

## 1. Catalog Updates & Sitemap Synchronization

Because `/sitemap.xml` is generated dynamically from the live MongoDB database:
1. **New Product Creation:** When an administrator adds a new accessory via Mission Control (`/admin`), the product's slug automatically appears in the sitemap on the next crawler fetch. No manual XML rebuild is required.
2. **Product Deletion / Deprecation:** Setting a product's stock to 0 preserves its indexability with `<availability>OutOfStock</availability>`. If an item is permanently deleted from MongoDB, it is automatically omitted from the sitemap.
3. **Category Additions:** Creating a new hardware division automatically generates `/categories/:new-slug` across internal navigation and `/sitemap.xml`.

---

## 2. Currency & Pricing Integrity Checks

All catalog entries must adhere to the **Pakistani Rupee (PKR)** standard:
- **Never Hardcode Foreign Currencies:** Product prices must never use `$`, `€`, or `£`. Always use `PKR` or `₨`.
- **Schema Validation:** In `generateProductSchema`, verify that `priceCurrency` is set to `'PKR'`. Google Search Console will flag mismatches if currency symbols in the UI conflict with structured data.

---

## 3. Monitoring 404s & Redirect Management

1. **404 Handling:** The client application provides an informative, user-friendly 404 view (`NotFoundPage.jsx`) marked with `<SEO noindex={true} />` so broken URLs never accumulate search engine index weight.
2. **URL Renaming:** If a category or product slug is changed, add an explicit 301 permanent redirect rule in the Express server (`server/app.js`) to preserve accumulated PageRank:
   ```javascript
   // Example Express 301 Redirect Rule
   app.get('/categories/old-slug', (req, res) => {
     res.redirect(301, '/categories/new-slug');
   });
   ```

---

## 4. Editorial Content Expansion & Topical Clusters

To maintain topical authority against competitors in the Pakistani automotive space:
1. **Publish New Guides:** Add new articles to `server/data/guidesData.js`. Provide `metaTitle`, `metaDescription`, `readTime`, `publishedAt`, and internal link relationships.
2. **Internal Linking:** Ensure every new guide links to at least 2 relevant category divisions and 2 specific product accessories.
3. **Keep AEO FAQs Fresh:** Review customer support tickets monthly to identify emerging driver queries (e.g., smog season cabin filters, electric vehicle exterior accessories in Pakistan) and add them to `/faq` and `HomePage.jsx` FAQ sections.

---

## 5. Routine Auditing Schedule

| Frequency | Action Item | Tool / Procedure | Responsible Role |
| :--- | :--- | :--- | :--- |
| **Weekly** | Run Automated Test Suite | `npm run test:all` | Lead Developer |
| **Bi-Weekly** | Inspect Dynamic Sitemap Output | `curl -I https://autox.pk/sitemap.xml` | DevOps / SEO Specialist |
| **Monthly** | Verify Google Rich Results | Google Search Console URL Inspection | SEO Architect |
| **Monthly** | Check AI Agent Perplexity/Copilot Citations | Query prompt: *"Best place to buy carbon spoilers online in Pakistan"* | Marketing / Growth Team |
| **Quarterly** | Refresh `llms.txt` Knowledge Manifest | Update product counts, delivery milestones, and contact numbers | Full-Stack Architect |

