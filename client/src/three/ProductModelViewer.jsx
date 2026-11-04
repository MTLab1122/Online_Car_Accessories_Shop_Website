import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, ContactShadows, Float } from '@react-three/drei';
import { RotateCcw, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const ModelMesh = ({ url, onError }) => {
  let gltf;
  try {
    gltf = useGLTF(url, true);
  } catch (err) {
    if (onError) onError(err);
    return null;
  }

  return <primitive object={gltf.scene} scale={1.2} />;
};

const ProductModelViewer = ({ modelUrl, productName, fallbackImages = [] }) => {
  const [loadError, setLoadError] = useState(false);
  const controlsRef = useRef();

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (!modelUrl || loadError) {
    return (
      <div className="relative w-full aspect-square bg-autox-dark rounded-2xl overflow-hidden border border-autox-border flex items-center justify-center p-6">
        <img
          src={fallbackImages[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'}
          alt={productName}
          className="w-full h-full object-contain filter contrast-105"
        />
        <div className="absolute bottom-4 right-4 bg-autox-card/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-autox-muted border border-autox-border">
          2D Master Render
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square bg-[#0c1017] rounded-2xl overflow-hidden border border-autox-border group">
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={false}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
              <ModelMesh url={modelUrl} onError={() => setLoadError(true)} />
            </Float>
          </Stage>
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            autoRotate={true}
            autoRotateSpeed={1.5}
            minDistance={2}
            maxDistance={8}
          />
        </Suspense>
      </Canvas>

      {/* Floating Controls HUD */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-autox-card/90 border border-autox-border text-[11px] font-mono text-autox-orange uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-autox-orange" />
          Interactive 3D Asset
        </span>
      </div>

      <button
        onClick={resetView}
        className="absolute bottom-4 right-4 z-10 p-2.5 rounded-xl bg-autox-card/90 hover:bg-autox-card text-white border border-autox-border text-xs font-mono backdrop-blur-md transition-colors"
        title="Reset Camera View"
      >
        <RotateCcw className="w-4 h-4 text-autox-orange" />
      </button>

      <div className="absolute bottom-4 left-4 z-10 text-[11px] font-mono text-autox-muted bg-autox-bg/80 px-2.5 py-1 rounded-md backdrop-blur-sm pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

export default ProductModelViewer;
