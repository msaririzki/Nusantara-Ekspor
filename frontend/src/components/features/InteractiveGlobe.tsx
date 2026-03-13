import { useRef, useEffect, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';

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
    color: '#22d3ee', // Cyan
    commodity: 'Kopi Robusta',
    volume: '5 Ton',
    status: 'On Progress',
  },
  {
    from: { lat: -8.58, lng: 116.1, name: 'Mataram, NTB', flag: '🇮🇩' },
    to: { lat: 35.68, lng: 139.69, name: 'Tokyo, Jepang', flag: '🇯🇵' },
    color: '#34d399', // Emerald
    commodity: 'Mutiara Lombok',
    volume: '200 Kg',
    status: 'Delivered',
  },
  {
    from: { lat: -6.2, lng: 106.85, name: 'Jakarta, Indonesia', flag: '🇮🇩' },
    to: { lat: 40.71, lng: -74.01, name: 'New York, Amerika', flag: '🇺🇸' },
    color: '#a78bfa', // Violet
    commodity: 'Tenun NTT',
    volume: '1.5 Ton',
    status: 'Shipping',
  },
  {
    from: { lat: -7.8, lng: 110.36, name: 'Yogyakarta, Indonesia', flag: '🇮🇩' },
    to: { lat: 31.23, lng: 121.47, name: 'Shanghai, Tiongkok', flag: '🇨🇳' },
    color: '#fb923c', // Orange
    commodity: 'Batik Tulis',
    volume: '3 Ton',
    status: 'On Progress',
  },
];

// ===== Prepare data for react-globe.gl =====
const arcsData = EXPORT_ROUTES.map(route => ({
  startLat: route.from.lat,
  startLng: route.from.lng,
  endLat: route.to.lat,
  endLng: route.to.lng,
  color: route.color,
  label: `${route.from.name} → ${route.to.name}`,
}));

const pointsData = [
  ...EXPORT_ROUTES.map(route => ({
    lat: route.from.lat,
    lng: route.from.lng,
    size: 0.15,
    color: route.color,
    label: `${route.from.name} ${route.from.flag}`,
  })),
  ...EXPORT_ROUTES.map(route => ({
    lat: route.to.lat,
    lng: route.to.lng,
    size: 0.15,
    color: route.color,
    label: `${route.to.name} ${route.to.flag}`,
  })),
];

// Combine unique points for better rendering
const uniquePoints = Array.from(new Map(pointsData.map(item => [item.label, item])).values());

// ===== Main Export =====
export default function InteractiveGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Resize for Responsive Globe
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle Initial View & Auto-Rotation
  useEffect(() => {
    if (globeRef.current) {
      // Focus point on Indonesia initially
      globeRef.current.pointOfView({ lat: -2, lng: 118, altitude: 2.2 }, 2000);

      try {
        const controls = globeRef.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.5;
          controls.enableZoom = false; // Disable zoom to prevent page scrolling issues on mobile
        }
      } catch (e) {
        console.warn('Controls not initialized yet', e);
      }
    }
  }, [dimensions.width]); // Trigger primarily when mounted & dimension is available

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-black rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center cursor-move"
    >
      {/* Title Header */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Jalur Ekspor Global
        </h3>
        <p className="text-sm font-medium text-cyan-400 mt-1">Nusantara ke Pasar Dunia</p>
      </div>

      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          backgroundColor="rgba(0,0,0,1)"
          width={dimensions.width}
          height={dimensions.height}

          // Arcs (Export Routes)
          arcsData={arcsData}
          arcColor={(d: any) => d.color}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcStroke={1.5}
          arcAltitudeAutoScale={0.4}

          // Points (Cities)
          pointsData={uniquePoints}
          pointColor={(d: any) => d.color}
          pointAltitude={0.05}
          pointRadius={(d: any) => d.size}
          pointResolution={32}

          // Rings (Pulse Effect on Cities)
          ringsData={uniquePoints}
          ringColor={(d: any) => d.color}
          ringMaxRadius={2.5}
          ringPropagationSpeed={2}
          ringRepeatPeriod={1500}

          // Atmosphere
          atmosphereColor="#22d3ee"
          atmosphereAltitude={0.15}
          showAtmosphere={true}

          // Optional Performance Flags
          rendererConfig={{ antialias: true, alpha: false }}
        />
      )}

      {/* Custom Legend */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2.5 z-10 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 pointer-events-auto">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Rute Aktif</h4>
        {EXPORT_ROUTES.map((route, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 shadow-sm shrink-0">
              <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: route.color, backgroundColor: route.color }} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-200">
                {route.from.name} <span className="text-white/40 mx-0.5">→</span> {route.to.name}
              </span>
              <span className="text-[10px] text-gray-400">
                {route.commodity} ({route.volume})
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interaction Hint */}
      <div className="absolute top-6 right-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-medium text-white/70">
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Geser untuk interaksi
        </div>
      </div>
    </div>
  );
}
