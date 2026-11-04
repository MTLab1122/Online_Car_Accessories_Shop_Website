# AUTOX — 3D Showroom & WebGL Graphics Architecture

## 1. Executive WebGL Overview

AUTOX provides real-time 3D asset inspection directly inside modern web browsers without native plugin dependencies. Built on **Three.js (r172)**, **React Three Fiber (R3F v8)**, and **Drei (v9)**, the showroom and product viewers allow enthusiasts across Pakistan to inspect racing aerodynamics, forged alloy wheels, optical projectors, and titanium exhaust systems from any perspective.

---

## 2. Core 3D Modules

### 2.1 Virtual 3D Showroom (`client/src/three/ShowroomScene.jsx`)
- **Full-Screen Canvas**: High-DPI responsive canvas rendered with linear tone mapping, sRGB encoding, and exponential distance fog (`#080A0D`).
- **Interactive Pedestals**: 4 individual rotating accessory pedestals featuring cylindrical podium stands, illuminated accent rings, and floating procedural geometry:
  - Stand 1: `Carbon GT Wing` (Aerodynamic downforce system, Toray 3K finish)
  - Stand 2: `Forged 19" Rim` (Lightweight monoblock alloy, brushed silver)
  - Stand 3: `Laser Bi-LEDs` (Optical projector headlights, cyan emission)
  - Stand 4: `Titanium Exhaust` (Valvetronic dual muffler, burnt titanium finish)
- **Pedestal Navigation**: Dual navigation via direct 3D raycasting clicks or top-right touch pills (`Stand 1`, `Stand 2`, `Stand 3`, `Stand 4`) for mobile ergonomics.
- **Turntable Orbit**: Toggleable 360-degree automatic turntable mode with manual override and one-click camera reset.

### 2.2 Product Detail Model Viewer (`client/src/three/ProductModelViewer.jsx`)
- **GLTF / GLB Loader**: Loads verified GLTF/GLB binary assets via Drei's `useGLTF`.
- **Lighting Stage**: Drei's `<Stage>` environment providing automatic camera alignment, soft studio fill, and contact ground shadows.
- **Graceful Fallback**: If a model fails to fetch or WebGL context is lost, gracefully transitions to a high-contrast 2D master render with zero console crashes or page freezes.

---

## 3. Studio Lighting Atmospheres

The showroom provides real-time dynamic studio atmospheres selectable via the floating HUD:

```javascript
// 1. Midnight Preset (Default)
<ambientLight intensity={0.4} />
<directionalLight position={[5, 10, 5]} intensity={1.8} castShadow color="#ffffff" />
<pointLight position={[-6, 3, 2]} intensity={2.5} color="#FF5A1F" />
<pointLight position={[6, 3, 2]} intensity={2.0} color="#58d5ff" />

// 2. Sunset Preset
<ambientLight intensity={0.5} color="#ff9955" />
<directionalLight position={[8, 4, 3]} intensity={2.6} castShadow color="#FF5A1F" />
<pointLight position={[-4, 2, -2]} intensity={1.8} color="#ff8833" />

// 3. Cyber Noir Preset
<ambientLight intensity={0.25} color="#180028" />
<directionalLight position={[0, 8, 4]} intensity={1.6} color="#00ffcc" />
<pointLight position={[-5, 2, 0]} intensity={3.5} color="#ff007f" />
<pointLight position={[5, 2, 0]} intensity={3.5} color="#00ffcc" />
```

---

## 4. Performance Optimizations & Mobile Handling

1. **Contact Shadows**: Uses `<ContactShadows>` with resolution scale 18, blur 2, and opacity 0.9, eliminating heavy real-time dynamic shadow maps on low-tier mobile GPUs.
2. **Polar Angle Clamping**: OrbitControls clamped at `maxPolarAngle={Math.PI / 2 - 0.05}`, preventing camera clipping below the studio pedestal ground plane.
3. **Smooth Damping**: `dampingFactor={0.05}` provides buttery inertia on touch swipes and trackpads.
4. **Suspense Lazy Loading**: The 3D canvas is wrapped in React `Suspense` and code-split into a separate Vite chunk (`ShowroomScene-*.js`), ensuring initial page loads remain lightweight.
