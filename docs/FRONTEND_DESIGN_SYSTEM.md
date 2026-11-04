# AUTOX — Frontend Luxury Design System & Component Library

## 1. Executive Design Philosophy

The AUTOX design system delivers a **futuristic luxury automotive aesthetic** engineered specifically for the Pakistani performance enthusiast market. Drawing inspiration from precision telemetry instruments, carbon-weave autoclave textures, and editorial motorsport typography (Porsche, Lamborghini, Ferrari, McLaren), AUTOX eschews generic SaaS/e-commerce templates in favor of a dark, immersive, high-contrast visual identity.

---

## 2. Immutable Design Tokens

### 2.1 Color Architecture

| Token Name | Hex Code | Purpose & Semantic Role |
| :--- | :--- | :--- |
| `autox-bg` | `#080A0D` | Deep cockpit void background; maximizes contrast for WebGL renders and cards |
| `autox-surface` | `#101318` | Elevated container surface; navigation bars, modals, slide-out drawers |
| `autox-card` | `#15191F` | Default card background; product tiles, spec tables, reviews |
| `autox-cardHover` | `#1C222B` | Interactive card state on hover/focus |
| `autox-border` | `#1E232B` | Subtle graphite card borders; provides structural definition without visual clutter |
| `autox-borderLight` | `#2D3540` | Active borders, focused inputs, table dividers |
| `autox-orange` | `#FF5A1F` | Primary automotive brand accent; CTA buttons, badges, glowing indicators |
| `autox-orangeHover`| `#E04B14` | Primary button hover/active state |
| `autox-orangeGlow` | `rgba(255, 90, 31, 0.25)` | Backdrops, shadows, radial spotlight effects |
| `autox-text` | `#F5F5F5` | Primary typographic hierarchy; headlines, high-priority labels |
| `autox-silver` | `#C5CBD3` | Body copy, secondary specifications, table values |
| `autox-muted` | `#9299A3` | Eyebrow labels, timestamps, SKU numbers, breadcrumbs |

### 2.2 Typography System

Centralized via Google Fonts in `client/index.html` and configured in `tailwind.config.js`:

```css
/* Typography Scale */
--font-display: 'Space Grotesk', 'Rajdhani', sans-serif; /* Automotive Headlines, Product Titles */
--font-sans: 'Inter', system-ui, sans-serif;             /* Highly legible body copy, descriptions */
--font-mono: 'JetBrains Mono', monospace;                /* Engineering specs, prices, SKUs, telemetry */
```

### 2.3 Shadow & Glow System

```javascript
boxShadow: {
  'glow-sm': '0 0 15px -3px rgba(255, 90, 31, 0.25)',
  'glow': '0 0 25px -5px rgba(255, 90, 31, 0.35)',
  'glow-lg': '0 0 35px -5px rgba(255, 90, 31, 0.45)',
  'inner-glow': 'inset 0 0 20px rgba(255, 90, 31, 0.15)'
}
```

---

## 3. Reusable Component Catalog

### 3.1 Button Component Suite (`client/src/components/ui/Buttons.jsx`)
- **`PrimaryButton`**: Orange gradient fill (`#FF5A1F` to `#E04B14`), uppercase mono/display font, box-shadow glow, spring scale feedback (`active:scale-95`). Supports icons, disabled state, and loading spinners.
- **`SecondaryButton`**: Dark card fill with subtle graphite border, glowing on hover.
- **`IconButton`**: Circular or rounded-square tactile trigger for wishlist, search, audio, and cart actions.

### 3.2 Typography Components (`client/src/components/ui/Typography.jsx`)
- **`EyebrowLabel`**: Uppercase mono pill badge with glowing dot or icon indicator (`AERODYNAMICS DIVISION`, `TELEMETRY MATRIX`).
- **`SectionHeading`**: Cinematic section header with eyebrow pill, uppercase headline with gradient highlight, and editorial subline.

### 3.3 Financial & Stock Indicators
- **`PriceDisplay` (`client/src/components/ui/PriceDisplay.jsx`)**: Authoritative PKR currency formatter (`₨ {amount} PKR`). Computes live discount math, strikethroughs original prices, and renders size scales (`sm`, `md`, `lg`, `xl`).
- **`StockIndicator` (`client/src/components/ui/StockIndicator.jsx`)**: Real-time stock status badge:
  - Green pulse: `In Stock (PKR)` or `{count} In Stock`
  - Amber warning: `Only {count} Left` (for quantities < 5)
  - Red badge: `Sold Out`

### 3.4 Interactive Containers & Overlays
- **`Drawer` (`client/src/components/ui/Drawer.jsx`)**: Slide-out drawer with Framer Motion spring physics, backdrop blur, ESC key listener, and automatic body scroll lock.
- **`Modal` (`client/src/components/ui/Modal.jsx`)**: Centered modal dialog for quick-view and verified review submission.
- **`CartDrawer` (`client/src/components/cart/CartDrawer.jsx`)**: Slide-out cart manifest featuring live line items, quantity adjustments, progress bar to free shipping (`₨ 5,000` threshold), coupon application, and direct express checkout.
- **`SearchOverlay` (`client/src/components/navigation/SearchOverlay.jsx`)**: Instant search overlay querying the backend with live debounce, active result thumbnails, and popular keyword pills.

---

## 4. Pakistani Market Localization

1. **Currency Authority**: All items, calculations, coupons, and orders calculate exclusively in Pakistani Rupees (`PKR / ₨`).
2. **Logistics Integration**: Delivery thresholds and dispatch badges highlight domestic couriers (`TCS`, `Leopards`, `Call Courier`) with 24-48h dispatch guarantees.
3. **Cash on Delivery (COD)**: First-class billing option across checkout and customer manifest displays.

