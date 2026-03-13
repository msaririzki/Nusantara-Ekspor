// ==========================================
// Nusantara Ekspor - Interactive 3D Globe
// ==========================================

import { useRef, useMemo, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// ===== Coordinate Helpers =====
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ===== Types =====
interface ExportRoute {
  from: { lat: number; lng: number; name: string; flag: string };
  to: { lat: number; lng: number; name: string; flag: string };
  color: string;
  commodity?: string;
  volume?: string;
  status?: string;
}

// ===== Export Routes Data =====
const EXPORT_ROUTES: ExportRoute[] = [
  {
    from: { lat: -8.58, lng: 116.1, name: 'Mataram, NTB', flag: '🇮🇩' },
    to: { lat: 52.52, lng: 13.4, name: 'Berlin, Jerman', flag: '🇩🇪' },
    color: '#22d3ee',
    commodity: 'Kopi Robusta',
    volume: '5 Ton',
    status: 'On Progress',
  },
  {
    from: { lat: -8.58, lng: 116.1, name: 'Mataram, NTB', flag: '🇮🇩' },
    to: { lat: 35.68, lng: 139.69, name: 'Tokyo, Jepang', flag: '🇯🇵' },
    color: '#34d399',
    commodity: 'Mutiara Lombok',
    volume: '200 Kg',
    status: 'Delivered',
  },
  {
    from: { lat: -6.2, lng: 106.85, name: 'Jakarta, Indonesia', flag: '🇮🇩' },
    to: { lat: 40.71, lng: -74.01, name: 'New York, Amerika', flag: '🇺🇸' },
    color: '#a78bfa',
    commodity: 'Tenun NTT',
    volume: '1.5 Ton',
    status: 'Shipping',
  },
  {
    from: { lat: -7.8, lng: 110.36, name: 'Yogyakarta, Indonesia', flag: '🇮🇩' },
    to: { lat: 31.23, lng: 121.47, name: 'Shanghai, Tiongkok', flag: '🇨🇳' },
    color: '#fb923c',
    commodity: 'Batik Tulis',
    volume: '3 Ton',
    status: 'On Progress',
  },
];

// ===== Set clear color to transparent =====
function ClearColor() {
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);
  return null;
}

// ===== Generate Earth Texture via Canvas =====
function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Ocean — dark blue
  ctx.fillStyle = '#0a1628';
  ctx.fillRect(0, 0, 1024, 512);

  // Helper: draw land mass
  const drawLand = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const landColor = '#1a3a2a';
  const coastGlow = '#22d3ee';

  // North America
  drawLand(120, 80, 140, 120, landColor);
  drawLand(130, 90, 120, 90, '#1e4030');
  // South America
  drawLand(200, 220, 80, 140, landColor);
  drawLand(210, 240, 60, 100, '#1e4030');
  // Europe
  drawLand(460, 70, 100, 80, landColor);
  drawLand(470, 80, 80, 60, '#1e4030');
  // Africa
  drawLand(470, 160, 100, 160, landColor);
  drawLand(480, 170, 80, 130, '#1e4030');
  // Asia
  drawLand(560, 50, 250, 180, landColor);
  drawLand(580, 60, 220, 150, '#1e4030');
  // India
  drawLand(640, 180, 50, 70, landColor);
  // Southeast Asia / Indonesia
  drawLand(700, 220, 120, 40, landColor);
  drawLand(710, 230, 30, 20, '#2a5a3a');
  drawLand(750, 230, 20, 15, '#2a5a3a');
  drawLand(780, 235, 25, 12, '#2a5a3a');
  drawLand(810, 230, 20, 15, '#2a5a3a');
  // Australia
  drawLand(770, 300, 100, 70, landColor);
  drawLand(780, 310, 80, 50, '#1e4030');
  // Japan
  drawLand(810, 110, 15, 40, '#1e4030');

  // Ocean grid lines (subtle)
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.06)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 1024; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
  }
  for (let i = 0; i < 512; i += 64) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
  }

  // Coastal glow dots
  ctx.fillStyle = coastGlow;
  ctx.globalAlpha = 0.15;
  // Major coastal cities as glow dots
  const cities = [
    [185, 140], [220, 300], // Americas
    [480, 110], [510, 200], [500, 280], // Europe/Africa
    [640, 130], [700, 170], [730, 240], [760, 240], [820, 130], // Asia
    [800, 320], // Australia
  ];
  cities.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ===== Globe with Earth Texture =====
function EarthGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    // Try CDN first
    loader.load(
      'https://unpkg.com/three-globe@2.31.3/example/img/earth-blue-marble.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => {
        // Fallback: generate procedural texture
        setTexture(createEarthTexture());
      }
    );
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial
          map={texture}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[2.008, 48, 48]}>
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.04} />
      </Sphere>

      {/* Atmosphere inner glow */}
      <Sphere args={[2.08, 32, 32]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>

      {/* Atmosphere outer glow */}
      <Sphere args={[2.25, 32, 32]}>
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.03} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
}

// ===== Export Path Arc =====
function ExportArc({ route }: { route: ExportRoute }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  const { curve, tubeGeometry } = useMemo(() => {
    const start = latLngToVector3(route.from.lat, route.from.lng, 2.02);
    const end = latLngToVector3(route.to.lat, route.to.lng, 2.02);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    mid.normalize().multiplyScalar(2 + dist * 0.5);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.008, 8, false);
    return { curve, tubeGeometry };
  }, [route]);

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * 0.2) % 1;
    if (pulseRef.current) {
      const point = curve.getPoint(progressRef.current);
      pulseRef.current.position.copy(point);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={tubeGeometry}>
        <meshBasicMaterial color={route.color} transparent opacity={0.6} />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={route.color} />
      </mesh>
    </group>
  );
}

// ===== Data Pin =====
function DataPin({ route }: { route: ExportRoute }) {
  const [hovered, setHovered] = useState(false);
  const pinRef = useRef<THREE.Mesh>(null);
  const position = useMemo(
    () => latLngToVector3(route.from.lat, route.from.lng, 2.04),
    [route]
  );

  useFrame((state) => {
    if (pinRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      pinRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={pinRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={route.color} transparent opacity={hovered ? 1 : 0.8} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.07, 32]} />
        <meshBasicMaterial color={route.color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {hovered && (
        <Html distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-xl px-4 py-3 whitespace-nowrap shadow-2xl"
               style={{ minWidth: '180px' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{route.from.flag}</span>
              <span className="text-gray-400 text-xs">→</span>
              <span className="text-lg">{route.to.flag}</span>
              <span className="text-white text-xs font-semibold ml-1">{route.to.name}</span>
            </div>
            {route.commodity && (
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Komoditas</span>
                  <span className="text-white font-medium">{route.commodity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume</span>
                  <span className="text-white font-medium">{route.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="font-bold" style={{ color: route.color }}>{route.status}</span>
                </div>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// ===== Destination Pin =====
function DestinationPin({ route }: { route: ExportRoute }) {
  const position = useMemo(
    () => latLngToVector3(route.to.lat, route.to.lng, 2.04),
    [route]
  );
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color={route.color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ===== Scene =====
function Scene() {
  return (
    <>
      <ClearColor />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#e0f2fe" />
      <pointLight position={[-10, -5, -10]} intensity={0.4} color="#22d3ee" />

      <EarthGlobe />

      {EXPORT_ROUTES.map((route, i) => (
        <group key={i}>
          <ExportArc route={route} />
          <DataPin route={route} />
          <DestinationPin route={route} />
        </group>
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3.5}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  );
}

// ===== Loader =====
function GlobeLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
        <span className="text-cyan-400/60 text-sm font-medium">Memuat Globe 3D...</span>
      </div>
    </div>
  );
}

// ===== Main Export =====
export default function InteractiveGlobe() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px]">
      {/* Glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
      </div>

      <Suspense fallback={<GlobeLoader />}>
        <Canvas
          camera={{ position: [0, 1.5, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3">
        {EXPORT_ROUTES.map((route, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: route.color }} />
            <span>{route.from.flag}→{route.to.flag}</span>
          </div>
        ))}
      </div>

      {/* Instruction */}
      <div className="absolute top-4 right-4 text-[10px] text-gray-500 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
        <span>🖱️</span>
        <span>Putar & zoom globe</span>
      </div>
    </div>
  );
}
