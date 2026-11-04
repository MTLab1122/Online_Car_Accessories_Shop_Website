import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, ContactShadows, PresentationControls } from '@react-three/drei';
import { Sun, Moon, Sparkles, RotateCcw, ShoppingBag, Eye, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SEO from '../components/common/SEO';

// Pedestal Display Item
const PedestalItem = ({ position, title, subtitle, color, shape = 'wing', isSelected, onSelect }) => {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={position} onClick={onSelect}>
      {/* Cylindrical Podium Stand */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.4, 32]} />
        <meshStandardMaterial color="#1C222A" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Illuminated Stand Accent Ring */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.04, 32]} />
        <meshBasicMaterial color={isSelected ? '#FF5A1F' : '#303741'} />
      </mesh>

      {/* Floating 3D Automotive Accessory Item */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.5}>
        <group ref={meshRef} position={[0, 0.4, 0]}>
          {shape === 'wing' && (
            <mesh castShadow>
              <boxGeometry args={[1.6, 0.08, 0.5]} />
              <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} />
            </mesh>
          )}

          {shape === 'wheel' && (
            <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.5, 0.15, 16, 32]} />
              <meshStandardMaterial color={color} roughness={0.2} metalness={0.95} />
            </mesh>
          )}

          {shape === 'exhaust' && (
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.25, 0.25, 0.9, 24]} />
              <meshStandardMaterial color={color} roughness={0.1} metalness={0.95} />
            </mesh>
          )}

          {shape === 'optics' && (
            <mesh castShadow>
              <octahedronGeometry args={[0.45]} />
              <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} wireframe={false} />
            </mesh>
          )}
        </group>
      </Float>

      {/* 3D Label */}
      <Text
        position={[0, -0.2, 1.1]}
        fontSize={0.18}
        color={isSelected ? '#FF5A1F' : '#C5CBD3'}
        anchorX="center"
        anchorY="middle"
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
};

const ShowroomScene = () => {
  const [activePedestal, setActivePedestal] = useState(0);
  const [lightingPreset, setLightingPreset] = useState('midnight'); // midnight | sunset | cyber
  const controlsRef = useRef();
  const { addItem } = useCart();

  const pedestalItems = [
    {
      id: 0,
      title: 'Carbon GT Wing',
      subtitle: 'Aerodynamic Downforce System',
      price: 85000,
      color: '#FF5A1F',
      shape: 'wing',
      position: [-3.8, 0, 0],
      sku: 'EXT-CF-SP01'
    },
    {
      id: 1,
      title: 'Forged 19" Rim',
      subtitle: 'Lightweight Monoblock Alloy',
      price: 240000,
      color: '#C5CBD3',
      shape: 'wheel',
      position: [-1.3, 0, -1],
      sku: 'WHL-FORG-01'
    },
    {
      id: 2,
      title: 'Laser Bi-LEDs',
      subtitle: '22,000 LM Projectors',
      price: 52000,
      color: '#58d5ff',
      shape: 'optics',
      position: [1.3, 0, -1],
      sku: 'LGT-PRJ-01'
    },
    {
      id: 3,
      title: 'Titanium Exhaust',
      subtitle: 'GR2 Valvetronic Muffler',
      price: 185000,
      color: '#b36bff',
      shape: 'exhaust',
      position: [3.8, 0, 0],
      sku: 'PRF-EXH-03'
    }
  ];

  const currentItem = pedestalItems[activePedestal];

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-76px)] bg-[#080A0D] overflow-hidden">
      <SEO
        title="3D Virtual Showroom & Configurator | AUTOX Pakistan"
        description="Interact with racing aerodynamics, forged alloy wheels, and titanium exhaust systems in our 360-degree real-time Three.js WebGL showroom."
        canonical="https://autox.pk/showroom"
        keywords="3d car accessories showroom pakistan, webgl car parts viewer, automotive 3d configurator"
      />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 2.5, 6.5], fov: 48 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
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
              <ambientLight intensity={0.6} color="#ffaa77" />
              <directionalLight position={[8, 4, 3]} intensity={2.5} castShadow color="#FF5A1F" />
              <pointLight position={[-4, 2, -2]} intensity={1.5} color="#ffa040" />
            </>
          )}

          {lightingPreset === 'cyber' && (
            <>
              <ambientLight intensity={0.3} color="#220033" />
              <directionalLight position={[0, 8, 4]} intensity={1.5} color="#00ffcc" />
              <pointLight position={[-5, 2, 0]} intensity={3} color="#ff007f" />
              <pointLight position={[5, 2, 0]} intensity={3} color="#00ffcc" />
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
            minDistance={3}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2 - 0.05} // prevent going below floor
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Floating HUD Overlays */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
        <div className="glass-card p-4 rounded-xl max-w-sm pointer-events-auto">
          <div className="flex items-center gap-2 text-autox-orange text-xs font-semibold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Interactive 3D Showroom</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white">Select An Accessory Stand</h2>
          <p className="text-xs text-autox-muted mt-1 leading-relaxed">
            Click directly on any display stand or use the selector buttons below to examine aerodynamics, forged wheels, and lighting modules.
          </p>
        </div>

        {/* Lighting Atmosphere Preset Selector */}
        <div className="glass-card p-2.5 rounded-xl flex items-center gap-2 pointer-events-auto text-xs font-mono uppercase">
          <span className="text-autox-muted px-2">Studio Light:</span>
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

      {/* Camera Reset & Active Item Inspector (Bottom) */}
      <div className="absolute bottom-6 inset-x-6 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none">
        {/* Reset Camera button */}
        <button
          onClick={resetCamera}
          className="glass-card hover:border-autox-orange text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-mono uppercase tracking-wider pointer-events-auto transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-autox-orange" />
          <span>Reset Camera</span>
        </button>

        {/* Active Inspection Card */}
        <div className="glass-card p-4 rounded-xl flex items-center gap-6 max-w-md w-full pointer-events-auto border-l-4 border-l-autox-orange">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-autox-muted">
              Stand {activePedestal + 1} of 4 • {currentItem.sku}
            </span>
            <h3 className="text-lg font-bold font-display text-white truncate">{currentItem.title}</h3>
            <p className="text-xs text-autox-muted truncate">{currentItem.subtitle}</p>
            <div className="text-autox-orange font-bold text-base mt-1">
              PKR {currentItem.price.toLocaleString()}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/shop"
              className="px-4 py-2 rounded-lg bg-autox-orange hover:bg-autox-orangeHover text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-glow transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Shop All</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowroomScene;

