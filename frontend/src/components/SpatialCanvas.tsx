import React, { useState } from 'react';
import { Layers, Info } from 'lucide-react';
import { SiteAnalysisRequest, SiteAnalysisResponse } from '../types/analysis';

interface SpatialCanvasProps {
  parameters: SiteAnalysisRequest;
  analysis: SiteAnalysisResponse;
}

export const SpatialCanvas: React.FC<SpatialCanvasProps> = ({
  parameters,
  analysis
}) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState<'normal' | 'noise' | 'solar'>('normal');

  // Generate 26 building parcels with coordinates and sizes
  const buildings = [
    // North Sector (Frontline along NH-544 corridor) - 8 buildings
    { id: 'B01', x: 70, y: 130, w: 55, h: 42, floors: 8, name: 'Commercial Block A1' },
    { id: 'B02', x: 145, y: 130, w: 55, h: 42, floors: 8, name: 'Commercial Block A2' },
    { id: 'B03', x: 220, y: 130, w: 60, h: 42, floors: 10, name: 'Transit Hub Plaza' },
    { id: 'B04', x: 300, y: 130, w: 55, h: 42, floors: 8, name: 'Tech Innovation Tower' },
    { id: 'B05', x: 375, y: 130, w: 55, h: 42, floors: 8, name: 'Corporate Center 1' },
    { id: 'B06', x: 450, y: 130, w: 60, h: 42, floors: 12, name: 'Corporate Tower 2' },
    { id: 'B07', x: 530, y: 130, w: 55, h: 42, floors: 7, name: 'R&D Facility A' },
    { id: 'B08', x: 605, y: 130, w: 55, h: 42, floors: 7, name: 'R&D Facility B' },

    // Central Sector (Mixed-Use & Civic Core) - 9 buildings
    { id: 'B09', x: 70, y: 225, w: 60, h: 50, floors: 6, name: 'Residential Tower R1' },
    { id: 'B10', x: 150, y: 225, w: 60, h: 50, floors: 6, name: 'Residential Tower R2' },
    { id: 'B11', x: 230, y: 220, w: 50, h: 60, floors: 5, name: 'Civic Library & Media' },
    { id: 'B12', x: 300, y: 220, w: 80, h: 60, floors: 4, name: 'Smart Health Center' },
    { id: 'B13', x: 400, y: 220, w: 50, h: 60, floors: 5, name: 'Community Center' },
    { id: 'B14', x: 470, y: 225, w: 60, h: 50, floors: 7, name: 'Residential Tower R3' },
    { id: 'B15', x: 550, y: 225, w: 60, h: 50, floors: 7, name: 'Residential Tower R4' },
    { id: 'B16', x: 630, y: 225, w: 45, h: 50, floors: 5, name: 'Studio Apartments S1' },
    { id: 'B17', x: 630, y: 130, w: 45, h: 42, floors: 5, name: 'Studio Apartments S2' },

    // South Sector (Perimeter Residential & Educational) - 9 buildings
    { id: 'B18', x: 70, y: 325, w: 55, h: 45, floors: 5, name: 'Eco-Housing Block H1' },
    { id: 'B19', x: 145, y: 325, w: 55, h: 45, floors: 5, name: 'Eco-Housing Block H2' },
    { id: 'B20', x: 220, y: 325, w: 65, h: 45, floors: 4, name: 'Primary Learning Academy' },
    { id: 'B21', x: 305, y: 325, w: 65, h: 45, floors: 4, name: 'Higher Secondary Campus' },
    { id: 'B22', x: 390, y: 325, w: 65, h: 45, floors: 4, name: 'Sports & Wellness Pavilion' },
    { id: 'B23', x: 475, y: 325, w: 55, h: 45, floors: 5, name: 'Eco-Housing Block H3' },
    { id: 'B24', x: 550, y: 325, w: 55, h: 45, floors: 5, name: 'Eco-Housing Block H4' },
    { id: 'B25', x: 625, y: 325, w: 50, h: 45, floors: 4, name: 'Senior Living Complex' },
    { id: 'B26', x: 200, y: 185, w: 340, h: 18, floors: 2, name: 'Linear Shaded Galleria' }
  ];

  // Dynamic visual dimensions from parameters
  const barrierH = parameters.barrier_height;
  const vegDepth = parameters.vegetation_depth;
  const louverD = parameters.louver_depth;
  const oriOffset = parameters.orientation_offset;
  const swaleLen = parameters.bioswale_length;
  const retCap = parameters.retention_capacity;

  // Retention pond visual radius based on capacity (max 10000 m³)
  const retentionRadius = Math.max(12, 14 + (retCap / 7800) * 16);

  // Vegetation buffer visual depth in SVG (pixels)
  const vegSvgHeight = Math.max(0, (vegDepth / 16) * 28);

  // Acoustic barrier line thickness
  const barrierSvgWidth = Math.max(0, (barrierH / 5.0) * 8);

  // Calculate building fill color based on heatmap mode
  const getBuildingColor = (b: typeof buildings[0]) => {
    if (showHeatmap === 'noise') {
      const distFromRoad = b.y - 65;
      const effectiveNoise = Math.max(50, analysis.noise.optimized_noise_db - (distFromRoad / 250) * 12);
      if (effectiveNoise > 70) return '#ef4444';
      if (effectiveNoise > 64) return '#f59e0b';
      return '#10b981';
    }
    if (showHeatmap === 'solar') {
      const irr = analysis.solar.estimated_irradiance;
      if (irr > 600) return '#f97316';
      if (irr > 500) return '#eab308';
      return '#10b981';
    }
    return '#1e293b';
  };

  return (
    <div className="card" style={{ padding: '1rem', position: 'relative' }}>
      <div className="card-header" style={{ marginBottom: '0.5rem' }}>
        <div className="card-title">
          <Layers size={18} style={{ color: '#38bdf8' }} />
          <span>Karunya Nagar — Conceptual Spatial Screening Canvas</span>
          <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>2.5D SVG Projection</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#0b1120', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              style={{
                background: showHeatmap === 'normal' ? '#334155' : 'transparent',
                color: showHeatmap === 'normal' ? '#f8fafc' : '#94a3b8',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.725rem',
                cursor: 'pointer'
              }}
              onClick={() => setShowHeatmap('normal')}
            >
              Default
            </button>
            <button
              style={{
                background: showHeatmap === 'noise' ? '#ef4444' : 'transparent',
                color: showHeatmap === 'noise' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.725rem',
                cursor: 'pointer'
              }}
              onClick={() => setShowHeatmap('noise')}
            >
              Noise Map
            </button>
            <button
              style={{
                background: showHeatmap === 'solar' ? '#f59e0b' : 'transparent',
                color: showHeatmap === 'solar' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.725rem',
                cursor: 'pointer'
              }}
              onClick={() => setShowHeatmap('solar')}
            >
              Solar Thermal
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ 
        width: '100%', 
        background: '#070d19', 
        borderRadius: '8px', 
        border: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg
          viewBox="0 0 740 430"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="0.8" />
            </pattern>

            {/* Road Noise Gradient */}
            <linearGradient id="noiseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={showHeatmap === 'noise' ? "0.45" : "0.18"} />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity={showHeatmap === 'noise' ? "0.25" : "0.08"} />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Water Pond Gradient */}
            <radialGradient id="pondGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#0284c7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="1" />
            </radialGradient>

            {/* Bioswale Gradient */}
            <linearGradient id="swaleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Grid & Site Boundary */}
          <rect width="740" height="430" fill="#070d19" />
          <rect width="740" height="430" fill="url(#grid)" />
          <rect x="25" y="20" width="690" height="390" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" rx="6" />

          {/* Site Boundary Label */}
          <text x="35" y="38" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            KARUNYA NAGAR SECTOR BOUNDARY (1.2 km² / 120 ha)
          </text>

          {/* ARTERIAL TRANSIT CORRIDOR: NH-544 / Siruvani Road */}
          <g>
            {/* Road noise acoustic wave propagation field */}
            <rect x="25" y="45" width="690" height="85" fill="url(#noiseGradient)" />

            {/* Road Bed */}
            <rect x="25" y="45" width="690" height="36" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            {/* Road Center Line */}
            <line x1="25" y1="63" x2="715" y2="63" stroke="#f59e0b" strokeWidth="2" strokeDasharray="12 8" />
            <text x="370" y="60" fill="#f8fafc" fontSize="11" fontFamily="Plus Jakarta Sans" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">
              NH-544 / SIRUVANI ROAD ARTERIAL TRANSIT CORRIDOR (78 dBA)
            </text>
            <text x="370" y="74" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
              ▲ Heavy Freight & Commuter Traffic Flow (West-East Corridor)
            </text>
          </g>

          {/* ACOUSTIC BARRIER BERM (Dynamic Rendering) */}
          {barrierH > 0 && (
            <g>
              <line 
                x1="45" 
                y1="86" 
                x2="695" 
                y2="86" 
                stroke="#6366f1" 
                strokeWidth={Math.max(2, barrierSvgWidth)} 
                strokeLinecap="round"
              />
              {/* Berm texture dashes */}
              <line 
                x1="45" 
                y1="86" 
                x2="695" 
                y2="86" 
                stroke="#a5b4fc" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
              />
              <text x="55" y="82" fill="#c7d2fe" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">
                ▰ ACOUSTIC EARTH BERM ({barrierH.toFixed(1)}m H | -{analysis.noise.barrier_attenuation_db} dB)
              </text>
            </g>
          )}

          {/* NATIVE VEGETATION BUFFER (Dynamic Rendering) */}
          {vegDepth > 0 && (
            <g>
              <rect 
                x="45" 
                y={88 + (barrierH > 0 ? barrierSvgWidth/2 : 0)} 
                width="650" 
                height={vegSvgHeight} 
                fill="rgba(16, 185, 129, 0.22)" 
                stroke="rgba(16, 185, 129, 0.6)" 
                strokeWidth="1"
                rx="3"
              />
              {/* Tree dots */}
              {Array.from({ length: 24 }).map((_, i) => (
                <circle 
                  key={i} 
                  cx={60 + i * 27} 
                  cy={92 + vegSvgHeight / 2} 
                  r={Math.min(5, Math.max(2.5, vegSvgHeight / 4))} 
                  fill="#10b981" 
                  opacity="0.85"
                />
              ))}
              <text x="690" y={98 + vegSvgHeight / 2} fill="#34d399" fontSize="8" fontFamily="JetBrains Mono" textAnchor="end" fontWeight="600">
                ● DENSE NATIVE BUFFER ({vegDepth.toFixed(1)}m D | -{analysis.noise.vegetation_attenuation_db} dB)
              </text>
            </g>
          )}

          {/* INTERNAL SECONDARY ROAD NETWORK */}
          <g>
            {/* Horizontal Collector 1 */}
            <rect x="40" y="195" width="660" height="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <line x1="40" y1="202" x2="700" y2="202" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />

            {/* Horizontal Collector 2 */}
            <rect x="40" y="295" width="660" height="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <line x1="40" y1="302" x2="700" y2="302" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />

            {/* Vertical Arterial North-South */}
            <rect x="365" y="100" width="16" height="295" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <line x1="373" y1="100" x2="373" y2="395" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />
          </g>

          {/* BIOSWALES NETWORK (Dynamic Rendering) */}
          {swaleLen > 0 && (
            <g>
              {/* North Swale along internal road */}
              <line x1="50" y1="192" x2="350" y2="192" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 3" />
              <line x1="390" y1="192" x2="680" y2="192" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 3" />
              {/* South Swale leading to pond */}
              <line x1="50" y1="292" x2="350" y2="292" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 3" />
              <line x1="390" y1="292" x2="600" y2="292" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="8 3" />
              {/* Bioswale collector to pond */}
              <path d="M 600 292 Q 650 300 665 340" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              <text x="200" y="190" fill="#38bdf8" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600">
                ≈ INFILTRATION BIOSWALE ({swaleLen.toFixed(0)}m Network)
              </text>
            </g>
          )}

          {/* STORMWATER RETENTION BASIN / POND (Dynamic Rendering) */}
          {retCap > 0 && (
            <g>
              <ellipse 
                cx="665" 
                cy="355" 
                rx={retentionRadius * 1.3} 
                ry={retentionRadius} 
                fill="url(#pondGradient)" 
                stroke="#38bdf8" 
                strokeWidth="2"
              />
              <circle cx="665" cy="355" r={retentionRadius * 0.5} fill="rgba(255,255,255,0.2)" />
              <text x="665" y="392" fill="#7dd3fc" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">
                ◆ RETENTION BASIN
              </text>
              <text x="665" y="402" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">
                ({retCap.toLocaleString()} m³)
              </text>
            </g>
          )}

          {/* 26 BUILDING BLOCKS */}
          {buildings.map((b) => {
            const centerX = b.x + b.w / 2;
            const centerY = b.y + b.h / 2;
            const isHovered = hoveredElement === b.id;

            return (
              <g 
                key={b.id}
                transform={`rotate(${oriOffset}, ${centerX}, ${centerY})`}
                onMouseEnter={() => setHoveredElement(b.id)}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
              >
                {/* Building Shadow */}
                <rect 
                  x={b.x + 3} 
                  y={b.y + 3} 
                  width={b.w} 
                  height={b.h} 
                  fill="rgba(0, 0, 0, 0.4)" 
                  rx="3" 
                />

                {/* Building Footprint */}
                <rect 
                  x={b.x} 
                  y={b.y} 
                  width={b.w} 
                  height={b.h} 
                  fill={getBuildingColor(b)} 
                  stroke={isHovered ? '#38bdf8' : 'rgba(255,255,255,0.18)'} 
                  strokeWidth={isHovered ? 2 : 1}
                  rx="3" 
                />

                {/* Shading Louver Conceptual Projection on West Façade */}
                {louverD > 0 && (
                  <g>
                    <line 
                      x1={b.x - 2} 
                      y1={b.y + 3} 
                      x2={b.x - 2} 
                      y2={b.y + b.h - 3} 
                      stroke="#f59e0b" 
                      strokeWidth={Math.max(1.5, louverD * 1.8)} 
                      strokeLinecap="round"
                    />
                    <line 
                      x1={b.x - 4} 
                      y1={b.y + 6} 
                      x2={b.x - 4} 
                      y2={b.y + b.h - 6} 
                      stroke="rgba(245, 158, 11, 0.6)" 
                      strokeWidth="1" 
                    />
                  </g>
                )}

                {/* Building Label */}
                <text 
                  x={centerX} 
                  y={centerY + 3} 
                  fill={isHovered ? '#ffffff' : '#cbd5e1'} 
                  fontSize="8" 
                  fontFamily="JetBrains Mono" 
                  fontWeight="600" 
                  textAnchor="middle"
                >
                  {b.id}
                </text>
              </g>
            );
          })}

          {/* Compass Rose */}
          <g transform="translate(680, 45)">
            <circle cx="0" cy="0" r="14" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <polygon points="0,-11 3,-2 0,0 -3,-2" fill="#ef4444" />
            <polygon points="0,11 3,2 0,0 -3,2" fill="#64748b" />
            <text x="0" y="-13" fill="#ef4444" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">N</text>
          </g>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredElement && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #38bdf8',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 10
          }}>
            <Info size={14} style={{ color: '#38bdf8' }} />
            <div>
              <strong>Parcel {hoveredElement}:</strong> {buildings.find(b => b.id === hoveredElement)?.name} • {buildings.find(b => b.id === hoveredElement)?.floors} Floors • Orientation: {oriOffset}° (Louver: {louverD}m)
            </div>
          </div>
        )}
      </div>

      {/* Canvas Interactive Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '0.75rem', 
        marginTop: '0.75rem', 
        fontSize: '0.75rem',
        color: '#94a3b8',
        padding: '0.5rem 0.75rem',
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 10, height: 10, background: '#1e293b', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 2, display: 'inline-block' }}></span>
            26 Building Footprints
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 14, height: 4, background: '#f59e0b', display: 'inline-block' }}></span>
            NH-544 Arterial Corridor
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 14, height: 4, background: '#6366f1', display: 'inline-block' }}></span>
            Acoustic Earth Berm ({barrierH}m)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            Native Vegetation Buffer ({vegDepth}m)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 12, height: 3, background: '#38bdf8', display: 'inline-block' }}></span>
            Infiltration Bioswales ({swaleLen}m)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 10, height: 8, borderRadius: 3, background: '#0284c7', display: 'inline-block' }}></span>
            Retention Pond ({retCap.toLocaleString()} m³)
          </span>
        </div>

        <div style={{ fontStyle: 'italic', fontSize: '0.7rem', color: '#64748b' }}>
          * Conceptual 2.5D visual projection; full site geometry modeled in Autodesk Forma.
        </div>
      </div>
    </div>
  );
};
