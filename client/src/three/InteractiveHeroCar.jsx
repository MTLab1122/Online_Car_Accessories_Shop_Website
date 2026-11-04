import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Compass, Sparkles, ShieldCheck } from 'lucide-react';
import * as THREE from 'three';

// Sophisticated High-Performance Geometric Automotive Display
const CarModel = ({ pointer, reducedMotion }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;

    // Smooth pointer tracking clamped to [-0.6, 0.6] rad
    const targetY = (pointer.x * 0.45);
    const targetX = (-pointer.y * 0.15);

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetY - 0.35, // default attractive 3/4 angle
      3,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetX + 0.05,
      3,
      delta
    );
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Sleek Aerodynamic Car Silhouette Chassis */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.65, 1.9]} />
        <meshPhysicalMaterial
          color="#0d1117"
          roughness={0.15}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={0.95}
        />
      </mesh>

      {/* Aerodynamic Cockpit & Tinted Glass */}
      <mesh position={[-0.3, 0.95, 0]} castShadow>
        <boxGeometry args={[2.2, 0.55, 1.6]} />
        <meshPhysicalMaterial
          color="#05070a"
          roughness={0.05}
          metalness={0.95}
          transmission={0.6}
          opacity={0.85}
          transparent
        />
      </mesh>

      {/* Carbon Fiber Hood Accent */}
      <mesh position={[1.1, 0.68, 0]} rotation={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[1.8, 0.05, 1.65]} />
        <meshStandardMaterial color="#1a1f26" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Aggressive Front Splitter */}
      <mesh position={[2.1, 0.08, 0]} castShadow>
        <boxGeometry args={[0.3, 0.05, 1.95]} />
        <meshStandardMaterial color="#FF5A1F" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* GT Racing Rear Wing Spoiler */}
      <group position={[-1.9, 1.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.05, 2.1]} />
          <meshStandardMaterial color="#FF5A1F" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Spoiler Risers */}
        <mesh position={[0, -0.25, 0.6]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.05]} />
          <meshStandardMaterial color="#C5CBD3" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.25, -0.6]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.05]} />
          <meshStandardMaterial color="#C5CBD3" metalness={0.9} />
        </mesh>
      </group>

      {/* Laser LED Projector Headlights (Pure White / Cyan) */}
      <mesh position={[2.1, 0.45, 0.65]}>
        <boxGeometry args={[0.1, 0.15, 0.4]} />
        <meshBasicMaterial color="#58d5ff" />
      </mesh>
      <mesh position={[2.1, 0.45, -0.65]}>
        <boxGeometry args={[0.1, 0.15, 0.4]} />
        <meshBasicMaterial color="#58d5ff" />
      </mesh>

      {/* Continuous OLED Tail Light Bar (AUTOX Neon Red/Orange) */}
      <mesh position={[-2.1, 0.55, 0]}>
        <boxGeometry args={[0.08, 0.12, 1.8]} />
        <meshBasicMaterial color="#FF3B00" />
      </mesh>

      {/* Forged Sport Wheels with Orange Calipers */}
      {[
        [1.3, 0.1, 1.0],
        [1.3, 0.1, -1.0],
        [-1.3, 0.1, 1.0],
        [-1.3, 0.1, -1.0]
      ].map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Wheel Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.28, 28]} />
            <meshStandardMaterial color="#1a1d24" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Brake Rotor */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.08, 20]} />
            <meshStandardMaterial color="#C5CBD3" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Orange Caliper */}
          <mesh position={[0, 0.18, 0.05]}>
            <boxGeometry args={[0.18, 0.12, 0.1]} />
            <meshBasicMaterial color="#FF5A1F" />
          </mesh>
        </group>
      ))}

      {/* Underglow Neon Accent Strip */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[3.6, 0.02, 1.8]} />
        <meshBasicMaterial color="#FF5A1F" transparent opacity={0.65} />
      </mesh>
    </group>
  );
};

// Canvas Loader State
const CanvasLoader = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center p-4 bg-autox-card/80 backdrop-blur-md rounded-lg border border-autox-border">
      <div className="w-8 h-8 border-2 border-autox-orange border-t-transparent rounded-full animate-spin mb-2" />
      <span className="text-xs font-mono uppercase tracking-widest text-autox-muted">Loading 3D Engine...</span>
    </div>
  </Html>
);

const InteractiveHeroCar = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect WebGL capability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    // Check user accessibility preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handlePointerMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;
    setPointer({ x, y });
  };

  return (
    <div
      className="relative w-full h-[88vh] min-h-[640px] max-h-[960px] bg-gradient-to-b from-[#06080b] via-[#0b0e14] to-autox-bg overflow-hidden select-none"
      onPointerMove={handlePointerMove}
    >
      {/* Background Cinematic Atmosphere & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-autox-orange/10 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#303741 1px, transparent 1px), linear-gradient(90deg, #303741 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 3D Canvas or Non-WebGL Graceful Fallback */}
      {hasWebGL ? (
        <Canvas
          shadows
          camera={{ position: [3.8, 1.8, 4.6], fov: 42 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={<CanvasLoader />}>
            {/* Dark Showroom Lighting */}
            <ambientLight intensity={0.4} />
            <spotLight
              position={[5, 8, 5]}
              angle={0.4}
              penumbra={0.8}
              intensity={2.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[-4, 3, -3]} intensity={1.5} color="#FF5A1F" />
            <pointLight position={[4, 2, -2]} intensity={1.2} color="#58d5ff" />
            <directionalLight position={[0, -2, 0]} intensity={0.4} color="#FF5A1F" />

            <CarModel pointer={pointer} reducedMotion={reducedMotion} />

            {/* Realistic Showroom Floor Contact Shadows */}
            <ContactShadows
              position={[0, -0.65, 0]}
              opacity={0.85}
              scale={10}
              blur={2.4}
              far={4}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80"
            alt="AUTOX Luxury Performance Sports Vehicle"
            className="w-full h-full object-cover object-center opacity-60 filter contrast-125"
          />
        </div>
      )}

      {/* Editorial Content Overlays */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto">
        {/* Brand Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 pt-16 sm:pt-12"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-autox-card/90 border border-autox-border text-autox-orange backdrop-blur-md pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-autox-orange animate-pulse" />
            ENGINEERED FOR YOUR DRIVE.
          </span>
        </motion.div>

        {/* Main Hero Typography & Call-To-Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="max-w-2xl pb-10"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-none font-display">
            UPGRADE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-autox-orange via-[#ff7c4d] to-white">
              YOUR DRIVE.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-autox-muted font-normal leading-relaxed max-w-xl">
            Premium Accessories. Exceptional Performance. Unmatched Style.
            Explore authentic aero kits, forged performance wheels, and cutting-edge telemetry tailored for automotive purists across Pakistan.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4 pointer-events-auto">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-autox-orange text-white font-semibold text-sm uppercase tracking-wider hover:bg-autox-orangeHover transition-all duration-200 shadow-glow hover:shadow-glow-lg group"
            >
              <span>Explore Shop</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/showroom"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-autox-card/90 hover:bg-autox-card text-white border border-autox-border font-medium text-sm uppercase tracking-wider backdrop-blur-md hover:border-autox-orange/60 transition-all duration-200"
            >
              <Compass className="w-4 h-4 text-autox-orange" />
              <span>3D Showroom</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-10 grid grid-cols-3 gap-6 pt-6 border-t border-autox-border/60">
            <div>
              <span className="text-2xl font-bold font-display text-white">100%</span>
              <p className="text-xs text-autox-muted uppercase tracking-wider mt-0.5">Authentic Gear</p>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-white">PKR</span>
              <p className="text-xs text-autox-muted uppercase tracking-wider mt-0.5">Local Currency</p>
            </div>
            <div>
              <span className="text-2xl font-bold font-display text-white">Nationwide</span>
              <p className="text-xs text-autox-muted uppercase tracking-wider mt-0.5">Tracked Delivery</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Helper Indicator */}
      <div className="absolute bottom-4 right-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-autox-dark/80 border border-autox-border text-[11px] font-mono text-autox-muted backdrop-blur-sm pointer-events-none">
        <Box className="w-3.5 h-3.5 text-autox-orange animate-spin" style={{ animationDuration: '6s' }} />
        <span>Move cursor to inspect 3D perspective</span>
      </div>
    </div>
  );
};

export default InteractiveHeroCar;

