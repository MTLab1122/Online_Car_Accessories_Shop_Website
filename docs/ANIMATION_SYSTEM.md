# AUTOX — Motion Design & Animation System

## 1. Principles of Motion

Motion within AUTOX serves functional clarity and automotive tactile realism. Animations emulate the mechanical dampening of high-end automotive switchgear, active aerodynamics, and telemetry instrumentation.

- **Fast & Responsive**: Micro-interactions finish in under 200ms with snappy spring curves.
- **Physics-Based Spring Systems**: Drawers, modals, and pills use Framer Motion springs (`damping: 25`, `stiffness: 300`) rather than linear CSS curves.
- **GPU Acceleration**: All transitions target `transform` (`translate3d`, `scale`) and `opacity` to prevent browser layout reflows and retain 60/120 FPS on mobile devices.
- **Accessibility / Reduced Motion**: Respects `prefers-reduced-motion: reduce` by suppressing parallax, continuous auto-rotation, and heavy spring translations.

---

## 2. Animation Token Catalog

| Animation Token | Duration | Easing / Spring Config | Usage |
| :--- | :--- | :--- | :--- |
| `fade-in` | `150ms - 250ms` | `ease-out` | Tooltips, search results, badge appearance |
| `slide-drawer` | `300ms` | `spring: { damping: 25, stiffness: 280 }` | Mobile menu, Cart drawer, filter drawer |
| `modal-scale` | `200ms` | `spring: { damping: 20, stiffness: 300 }` | QuickView modal, review submission |
| `card-hover` | `250ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Product tiles, category zoom, pedestal select |
| `pulse-indicator` | `2000ms` | `infinite linear` | Live stock alerts, 3D hotspot pulsing rings |

---

## 3. Framer Motion Implementations

### 3.1 Scroll-Triggered Reveal (`RevealOnScroll.jsx`)
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-50px' }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  {children}
</motion.div>
```

### 3.2 Slide-Out Drawer (`Drawer.jsx`)
```jsx
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
  className="relative ml-auto w-full max-w-lg bg-autox-surface"
>
  {children}
</motion.div>
```

### 3.3 Metric Telemetry Counter (`AnimatedCounter.jsx`)
Smoothly interpolates numerical statistics from `0` to target (e.g. `24000` RPM, `185000` PKR) upon viewport intersection using Framer Motion `animate(motionValue, target, { duration: 1.8 })`.

---

## 4. Reduced Motion Fallbacks

In `client/src/styles/index.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Three.js auto-rotation and Float oscillations detect `window.matchMedia('(prefers-reduced-motion: reduce)')` to automatically freeze turntable sweeps for users requiring motionless viewports.
