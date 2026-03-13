/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // Handle Initial View, Auto-Rotation, & Zoom
  useEffect(() => {
    if (globeRef.current) {
      const isMobile = dimensions.width < 768;
      const altitude = isMobile ? 2.5 : 2.2;

      globeRef.current.pointOfView({ lat: -2, lng: 118, altitude }, 2000);

      try {
        const controls = globeRef.current.controls();
        if (controls) {
          // Putaran otomatis
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.5;
          
          // Fitur Zoom
          controls.enableZoom = true;
          controls.zoomSpeed = 0.8;
          
          // Batas Zoom agar tidak tembus bumi atau terlalu jauh
          controls.minDistance = 120; // Paling dekat
          controls.maxDistance = 400; // Paling jauh
        }
      } catch (e) {
        console.warn('Controls not initialized yet', e);
      }
    }
  }, [dimensions.width]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px] bg-[#050505] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center cursor-move"
    >
      {/* Title Header */}
      <div className="absolute top-5 left-5 md:top-8 md:left-8 z-10 pointer-events-none">
        <h3 className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 drop-shadow-md">
          Jalur Ekspor Global
        </h3>
        <p className="text-[10px] md:text-sm font-medium text-cyan-400 mt-0.5 md:mt-1 drop-shadow-sm">
          Nusantara ke Pasar Dunia
        </p>
      </div>

      {/* Globe Component */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          backgroundColor="rgba(0,0,0,0)" // Transparan agar menyatu dengan background div
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

          rendererConfig={{ antialias: true, alpha: true }}
        />
      )}

      {/* Legend - Diperkecil & Lebih Compact */}
      <div 
        className="absolute bottom-4 w-full md:w-auto md:left-6 md:right-auto flex overflow-x-auto md:flex-col gap-2 z-10 px-4 md:px-0 pointer-events-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" 
        style={{ scrollbarWidth: 'none' }}
      >
        <h4 className="hidden md:block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1 px-1">
          Rute Aktif
        </h4>
        
        {EXPORT_ROUTES.map((route, i) => (
          <div 
            key={i} 
            className="snap-center shrink-0 w-[200px] sm:w-[220px] md:w-max flex items-center gap-2.5 bg-black/40 backdrop-blur-sm p-2 md:p-2.5 rounded-xl border border-white/10 shadow-md transition-colors hover:bg-black/60"
          >
            {/* Dot Indicator (Diperkecil) */}
            <div className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/5 border border-white/10 shrink-0">
              <span 
                className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shadow-[0_0_8px_currentColor]" 
                style={{ color: route.color, backgroundColor: route.color }} 
              />
            </div>
            
            {/* Route Info (Teks Diperkecil) */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[10px] md:text-[11px] font-semibold text-gray-100 truncate">
                {route.from.name} <span className="text-white/40 mx-0.5">→</span> {route.to.name}
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[9px] md:text-[10px] text-gray-400 truncate">
                  {route.commodity}
                </span>
                <span className="text-[8px] md:text-[9px] font-medium text-white/70 bg-white/10 px-1.5 py-0.5 rounded-md ml-1.5">
                  {route.volume}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interaction Hint (Diperkecil sedikit) */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 text-[9px] md:text-[10px] font-medium text-white/80 shadow-md">
          <svg className="w-3 h-3 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span className="hidden sm:inline">Geser & Zoom bola dunia</span>
          <span className="sm:hidden">Geser & Zoom</span>
        </div>
      </div>
    </div>
  );
}