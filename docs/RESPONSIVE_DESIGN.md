# AUTOX — Responsive Design & Mobile Ergonomics System

## 1. Responsive Philosophy

Over 75% of Pakistani e-commerce traffic originates from mobile devices (Android and iOS). The AUTOX frontend architecture treats mobile ergonomics as a primary engineering requirement rather than a desktop afterthought.

---

## 2. Breakpoint Grid Matrix

Tailwind CSS standardized breakpoints:

| Breakpoint | Minimum Width | Target Devices | Layout Behavior |
| :--- | :--- | :--- | :--- |
| `base` | `< 640px` | Smart phones (iPhone, Galaxy) | 2-column product grid, bottom bar cart trigger, full-width drawers |
| `sm` | `640px` | Large phones, phablets | 2-column grid, compact headers |
| `md` | `768px` | Tablets (portrait) | 2 to 3 columns, sidebar filter drawer |
| `lg` | `1024px` | Tablets (landscape), Laptops | 3-column shop grid, 7:5 PDP media/spec ratio, sticky filter sidebar |
| `xl` | `1280px` | High-res desktop monitors | 4-column product showcases, expanded showroom HUD |
| `2xl` | `1536px` | Ultra-wide displays | Max container width clamped at 1280px (`max-w-7xl mx-auto`) |

---

## 3. Mobile Transformations

### 3.1 2-Column High-Density Product Grid
Traditional e-commerce templates stack products vertically in a single wide column on mobile, creating severe scroll fatigue. AUTOX implements a **2-column mobile layout**:
```jsx
<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
  {products.map(p => <ProductCard key={p._id} product={p} />)}
</div>
```
Product cards adapt compact typography, condensed price badges, and full-width touch tap targets.

### 3.2 Slide-Out Filter Drawer for Small Screens
On desktop, the Shop page displays an accessible left-hand filter sidebar. On mobile (`< lg`), the sidebar folds into a dedicated slide-out `Drawer` triggered by a filter button displaying active filter counters (`Filters (2)`).

### 3.3 Touch-Optimized 3D Controls
In the 3D Showroom:
- Raycasting hits on 3D objects can be difficult to target on small screens; floating pill buttons (`Stand 1`, `Stand 2`, `Stand 3`, `Stand 4`) provide instant touch switching.
- OrbitControls multi-touch pinch-to-zoom is constrained within safe boundaries (`minDistance: 2.8`, `maxDistance: 12`) to prevent disorientation.
- Studio lighting buttons remain thumb-accessible on the upper left HUD.

### 3.4 Fixed Mobile Navigation Drawer
The mobile navigation slides out from the right using hardware-accelerated spring animations, providing immediate access to Home, Shop, Categories, 3D Showroom, Guides, About, and Contact.
