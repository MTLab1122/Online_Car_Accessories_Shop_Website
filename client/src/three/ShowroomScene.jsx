import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, ContactShadows } from '@react-three/drei';
import { Sun, Moon, Sparkles, RotateCcw, ShoppingBag, Eye, Zap, Play, Pause, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';

// Pedestal Display Item
const PedestalItem = ({ position, title, subtitle, color, shape = 'wing', isSelected, onSelect }) => {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={position} onClick={onSelect}>
      {/* Cylindrical Podium Stand */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.4, 32]} />
        <meshStandardMaterial color="#14181F" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Illuminated Stand Accent Ring */}
      <mesh position={[0, -0.39, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.04, 32]} />
        <meshBasicMaterial color={isSelected ? '#FF5A1F' : '#2A303A'} />
      </mesh>

      {/* Floating 3D Automotive Accessory Item */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.4}>
        <group ref={meshRef} position={[0, 0.4, 0]}>
          {shape === 'wing' && (
            <mesh castShadow>
              <boxGeometry args={[1.7, 0.08, 0.55]} />
              <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} />
            </mesh>
          )}

          {shape === 'wheel' && (
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.55, 0.16, 16, 32]} />
              <meshStandardMaterial color={color} roughness={0.15} metalness={0.95} />
            </mesh>
          )}

          {shape === 'exhaust' && (
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.26, 0.26, 0.95, 24]} />
              <meshStandardMaterial color={color} roughness={0.1} metalness={0.95} />
            </mesh>
          )}

          {shape === 'optics' && (
            <mesh castShadow>
              <octahedronGeometry args={[0.5]} />
              <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} wireframe={false} />
            </mesh>
          )}
        </group>
      </Float>

      {/* 3D Label */}
      <Text
        position={[0, -0.15, 1.15]}
        fontSize={0.16}
        color={isSelected ? '#FF5A1F' : '#A0A7B2'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
};

const ShowroomScene = () => {
  const [activePedestal, setActivePedestal] = useState(0);
  const [lightingPreset, setLightingPreset] = useState('midnight'); // midnight | sunset | cyber
  const [autoRotate, setAutoRotate] = useState(false);
  const controlsRef = useRef();
  const { addItem, openDrawer } = useCart();
  const navigate = useNavigate();

  const pedestalItems = [
    {
      id: 0,
      title: 'Carbon GT Wing',
      subtitle: 'Aerodynamic Downforce System',
      price: 85000,
      color: '#FF5A1F',
      shape: 'wing',
      position: [-3.8, 0, 0],
      sku: 'EXT-CF-SP01',
      slug: 'carbon-fiber-gt-rear-wing-spoiler',
      badge: 'Flagship Aero'
    },
    {
      id: 1,
      title: 'Forged 19" Rim',
      subtitle: 'Lightweight Monoblock Alloy',
      price: 240000,
      color: '#C5CBD3',
      shape: 'wheel',
      position: [-1.3, 0, -1],
      sku: 'WHL-FORG-01',
      slug: 'apex-forged-19-monoblock-wheel-set',
      badge: 'Unsprung Weight'
    },
    {
      id: 2,
      title: 'Laser Bi-LEDs',
      subtitle: '22,000 LM Projectors',
      price: 52000,
      color: '#58d5ff',
      shape: 'optics',
      position: [1.3, 0, -1],
      sku: 'LGT-PRJ-01',
      slug: 'hyperbeam-laser-bi-led-projector-headlights',
      badge: 'Optical Tech'
    },
    {
      id: 3,
      title: 'Titanium Exhaust',
      subtitle: 'GR2 Valvetronic Muffler',
      price: 185000,
      color: '#b36bff',
      shape: 'exhaust',
      position: [3.8, 0, 0],
      sku: 'PRF-EXH-03',
      slug: 'valvetronic-titanium-cat-back-exhaust-system',
      badge: 'Acoustic Sound'
    }
  ];

  const currentItem = pedestalItems[activePedestal];

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleInspectInStore = () => {
    navigate('/shop');
  };

  return (
    <div className="relative w-full h-[calc(100vh-76px)] bg-[#080A0D] overflow-hidden select-none">
      <SEO
        title="3D Virtual Showroom & Configurator | AUTOX Pakistan"
        description="Interact with racing aerodynamics, forged alloy wheels, and titanium exhaust systems in our 360-degree real-time Three.js WebGL showroom in PKR."
        canonical="https://autox.pk/showroom"
        keywords="3d car accessories showroom pakistan, webgl car parts viewer, automotive 3d configurator"
      />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 2.4, 6.8], fov: 46 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={['#080A0D', 8, 22]} />

          {/* Lighting based on preset */}
          {lightingPreset === 'midnight' && (
            <>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 10, 5]} intensity={1.8} castShadow color="#ffffff" />
              <pointLight position={[-6, 3, 2]} intensity={2.5} color="#FF5A1F" />
              <pointLight position={[6, 3, 2]} intensity={2.0} color="#58d5ff" />
            </>
          )}

          {lightingPreset === 'sunset' && (
            <>
              <ambientLight intensity={0.5} color="#ff9955" />
              <directionalLight position={[8, 4, 3]} intensity={2.6} castShadow color="#FF5A1F" />
              <pointLight position={[-4, 2, -2]} intensity={1.8} color="#ff8833" />
            </>
          )}

          {lightingPreset === 'cyber' && (
            <>
              <ambientLight intensity={0.25} color="#180028" />
              <directionalLight position={[0, 8, 4]} intensity={1.6} color="#00ffcc" />
              <pointLight position={[-5, 2, 0]} intensity={3.5} color="#ff007f" />
              <pointLight position={[5, 2, 0]} intensity={3.5} color="#00ffcc" />
            </>
          )}

          {/* Pedestal Items */}
          {pedestalItems.map((item) => (
            <PedestalItem
              key={item.id}
              position={item.position}
              title={item.title}
              subtitle={item.subtitle}
              color={item.color}
              shape={item.shape}
              isSelected={activePedestal === item.id}
              onSelect={() => setActivePedestal(item.id)}
            />
          ))}

          {/* Showroom Floor Shadows */}
          <ContactShadows
            position={[0, -0.85, 0]}
            opacity={0.9}
            scale={18}
            blur={2}
            far={6}
            color="#000000"
          />

          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            autoRotate={autoRotate}
            autoRotateSpeed={1.2}
            minDistance={2.8}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2 - 0.05}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Floating HUD Overlays (Top Left) */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex flex-col gap-3 max-w-sm">
        <div className="glass-card p-4 rounded-2xl pointer-events-auto border border-autox-border">
          <div className="flex items-center gap-2 text-autox-orange text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive 3D Configurator</span>
          </div>
          <h2 className="text-xl font-bold font-display uppercase text-white">
            Accessory Showroom
          </h2>
          <p className="text-xs text-autox-muted mt-1 leading-relaxed font-sans">
            Rotate 360° to evaluate aerodynamic wings, forged monoblocks, laser projectors, and valvetronic exhausts.
          </p>
        </div>

        {/* Lighting Atmosphere Preset Selector */}
        <div className="glass-card p-2 rounded-xl flex items-center gap-1.5 pointer-events-auto text-[11px] font-mono uppercase border border-autox-border">
          <span className="text-autox-muted px-2 hidden sm:inline">Atmosphere:</span>
          <button
            onClick={() => setLightingPreset('midnight')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              lightingPreset === 'midnight'
                ? 'bg-autox-orange text-white shadow-glow'
                : 'text-autox-muted hover:text-white bg-autox-bg/60'
            }`}
          >
            Midnight
          </button>
          <button
            onClick={() => setLightingPreset('sunset')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              lightingPreset === 'sunset'
                ? 'bg-autox-orange text-white shadow-glow'
                : 'text-autox-muted hover:text-white bg-autox-bg/60'
            }`}
          >
            Sunset
          </button>
          <button
            onClick={() => setLightingPreset('cyber')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              lightingPreset === 'cyber'
                ? 'bg-autox-orange text-white shadow-glow'
                : 'text-autox-muted hover:text-white bg-autox-bg/60'
            }`}
          >
            Cyber Noir
          </button>
        </div>
      </div>

      {/* Pedestal Quick Selector Bar (Top Right on desktop / Middle on mobile) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex flex-wrap gap-2 pointer-events-auto max-w-xs justify-end">
        {pedestalItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePedestal(item.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
              activePedestal === item.id
                ? 'border-autox-orange bg-autox-orange/20 text-autox-orange shadow-glow'
                : 'border-autox-border bg-autox-card/80 text-autox-muted hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>Stand {item.id + 1}</span>
          </button>
        ))}
      </div>

      {/* Bottom Control Bar & Inspector */}
      <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        {/* Camera Tools (Reset & Auto Rotate) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={resetCamera}
            className="glass-card hover:border-autox-orange text-white px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors border border-autox-border"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-autox-orange" />
            <span className="hidden sm:inline">Reset View</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`glass-card px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors border border-autox-border ${
              autoRotate ? 'text-autox-orange border-autox-orange/50' : 'text-white'
            }`}
            title="Toggle Continuous Turntable Rotation"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoRotate ? 'Pause Orbit' : 'Turntable'}</span>
          </button>
        </div>

        {/* Active Inspection Card */}
        <div className="glass-card p-4 rounded-2xl flex items-center justify-between gap-4 sm:gap-6 max-w-lg w-full pointer-events-auto border-l-4 border-l-autox-orange border-autox-border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-autox-orange font-bold">
                Stand {activePedestal + 1} of 4 • {currentItem.badge}
              </span>
              <span className="text-[10px] font-mono text-autox-muted hidden sm:inline">
                {currentItem.sku}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-display uppercase text-white truncate">
              {currentItem.title}
            </h3>
            <p className="text-xs text-autox-muted truncate font-sans">{currentItem.subtitle}</p>
            <div className="text-autox-orange font-display font-bold text-base mt-0.5">
              ₨ {currentItem.price.toLocaleString()} PKR
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/shop"
              className="px-4 py-2.5 rounded-xl bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-glow transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Explore</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowroomScene;
