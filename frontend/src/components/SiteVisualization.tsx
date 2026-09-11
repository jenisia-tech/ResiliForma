import React, { useState } from 'react';
import type { PlanningMode } from '../types';
import { 
  BuildingIcon, 
  Volume2Icon, 
  SunIcon, 
  WavesIcon, 
  LeafIcon, 
  ZapIcon, 
  InfoIcon, 
  CompassIcon 
} from './icons';

interface SiteVisualizationProps {
  mode?: PlanningMode;
  showLayerControls?: boolean;
  highlightCategory?: 'all' | 'acoustic' | 'solar' | 'hydrology' | 'agrivoltaics';
}

export const SiteVisualization: React.FC<SiteVisualizationProps> = ({
  mode = 'urban',
  showLayerControls = true,
  highlightCategory = 'all'
}) => {
  const [layers, setLayers] = useState({
    buildings: true,
    roads: true,
    vegetation: true,
    acousticWaves: highlightCategory === 'all' || highlightCategory === 'acoustic',
    solarHeat: highlightCategory === 'all' || highlightCategory === 'solar',
    waterFlow: highlightCategory === 'all' || highlightCategory === 'hydrology',
    agrivoltaics: mode === 'rural' || highlightCategory === 'agrivoltaics'
  });

  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="rf-card" style={{ padding: '1.25rem', position: 'relative' }}>
      {/* Visualizer Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            padding: '0.35rem 0.5rem',
            background: 'rgba(6, 182, 212, 0.12)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--cyan-light)'
          }}>
            <CompassIcon size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', margin: 0, color: '#ffffff' }}>
              Conceptual Site Visualization
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Coimbatore Demo Site (12.4 ha) • Prototype Schematic View
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="rf-badge rf-badge-muted" style={{ fontSize: '0.68rem', textTransform: 'none' }}>
            <InfoIcon size={12} /> Not Live Autodesk Forma Geometry
          </span>
        </div>
      </div>

      {/* Interactive Layer Toggles */}
      {showLayerControls && (
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          flexWrap: 'wrap',
          padding: '0.45rem 0.65rem',
          background: 'var(--bg-card-muted)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '0.75rem',
          border: '1px solid var(--border-card)'
        }}>
          <button
            onClick={() => toggleLayer('buildings')}
            className={`rf-btn ${layers.buildings ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
          >
            <BuildingIcon size={13} /> Buildings (8)
          </button>

          <button
            onClick={() => toggleLayer('acousticWaves')}
            className={`rf-btn ${layers.acousticWaves ? 'rf-btn-outline-cyan' : 'rf-btn-secondary'}`}
            style={{ 
              padding: '0.25rem 0.6rem', 
              fontSize: '0.72rem',
              backgroundColor: layers.acousticWaves ? 'rgba(6, 182, 212, 0.2)' : undefined 
            }}
          >
            <Volume2Icon size={13} /> Acoustic Wavefronts
          </button>

          <button
            onClick={() => toggleLayer('solarHeat')}
            className={`rf-btn ${layers.solarHeat ? 'rf-btn-secondary' : 'rf-btn-secondary'}`}
            style={{ 
              padding: '0.25rem 0.6rem', 
              fontSize: '0.72rem',
              borderColor: layers.solarHeat ? 'var(--amber-primary)' : undefined,
              color: layers.solarHeat ? 'var(--amber-light)' : undefined,
              backgroundColor: layers.solarHeat ? 'rgba(245, 158, 11, 0.15)' : undefined
            }}
          >
            <SunIcon size={13} /> Solar Exposure Heatmap
          </button>

          <button
            onClick={() => toggleLayer('waterFlow')}
            className={`rf-btn ${layers.waterFlow ? 'rf-btn-secondary' : 'rf-btn-secondary'}`}
            style={{ 
              padding: '0.25rem 0.6rem', 
              fontSize: '0.72rem',
              borderColor: layers.waterFlow ? 'var(--blue-primary)' : undefined,
              color: layers.waterFlow ? 'var(--blue-light)' : undefined,
              backgroundColor: layers.waterFlow ? 'rgba(59, 130, 246, 0.15)' : undefined
            }}
          >
            <WavesIcon size={13} /> Hydrology Runoff Vectors
          </button>

          {mode === 'rural' && (
            <button
              onClick={() => toggleLayer('agrivoltaics')}
              className={`rf-btn ${layers.agrivoltaics ? 'rf-btn-secondary' : 'rf-btn-secondary'}`}
              style={{ 
                padding: '0.25rem 0.6rem', 
                fontSize: '0.72rem',
                borderColor: layers.agrivoltaics ? 'var(--emerald-primary)' : undefined,
                color: layers.agrivoltaics ? 'var(--emerald-light)' : undefined,
                backgroundColor: layers.agrivoltaics ? 'rgba(16, 185, 129, 0.15)' : undefined
              }}
            >
              <ZapIcon size={13} /> Agrivoltaic Canopies
            </button>
          )}

          <button
            onClick={() => toggleLayer('vegetation')}
            className={`rf-btn ${layers.vegetation ? 'rf-btn-secondary' : 'rf-btn-secondary'}`}
            style={{ 
              padding: '0.25rem 0.6rem', 
              fontSize: '0.72rem',
              color: layers.vegetation ? 'var(--emerald-light)' : undefined,
              backgroundColor: layers.vegetation ? 'rgba(16, 185, 129, 0.12)' : undefined
            }}
          >
            <LeafIcon size={13} /> Vegetation Buffers
          </button>
        </div>
      )}

      {/* SVG Architectural Canvas */}
      <div className="site-svg-container grid-background" style={{ minHeight: '380px' }}>
        <svg 
          viewBox="0 0 900 520" 
          width="100%" 
          height="100%" 
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="solarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="acousticWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="waterFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4" />
            </linearGradient>

            <pattern id="pvGridPattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="14" height="14" fill="#0f2b3e" stroke="#0ea5e9" strokeWidth="0.75" rx="1" />
              <line x1="7" y1="0" x2="7" y2="14" stroke="#0ea5e9" strokeWidth="0.5" />
              <line x1="0" y1="7" x2="14" y2="7" stroke="#0ea5e9" strokeWidth="0.5" />
            </pattern>

            <pattern id="vegPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="4" fill="#064e3b" fillOpacity="0.7" stroke="#10b981" strokeWidth="0.75" />
              <circle cx="15" cy="14" r="3.5" fill="#047857" fillOpacity="0.7" stroke="#34d399" strokeWidth="0.75" />
            </pattern>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* SITE BOUNDARY */}
          <polygon
            points="60,60 840,40 860,460 70,480"
            fill="#0c1322"
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* NORTHERN ARTERIAL ROAD & NOISE SOURCE */}
          {layers.roads && (
            <g id="roads-layer">
              <path
                d="M 40,30 L 880,10"
                stroke="#334155"
                strokeWidth="24"
                strokeLinecap="round"
              />
              <path
                d="M 40,30 L 880,10"
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="8 6"
              />
              {/* Road Label */}
              <text x="440" y="24" fill="#94a3b8" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
                NH 544 ARTERIAL HIGHWAY (78 dB NOISE SOURCE)
              </text>
            </g>
          )}

          {/* ACOUSTIC BUFFER & DEFLECTION WALL */}
          {layers.acousticWaves && (
            <g id="acoustic-layer">
              {/* Sound Wavefronts from Road */}
              <path d="M 120,42 Q 440,75 780,25" fill="none" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.8" />
              <path d="M 100,62 Q 440,105 800,45" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="6 4" />
              <path d="M 80,85 Q 440,135 820,68" fill="none" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 4" />

              {/* 3.5m Acoustic Barrier along Northern Perimeter */}
              <path
                d="M 110,65 L 790,46"
                stroke="#22d3ee"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glowEffect)"
              />
              <text x="450" y="60" fill="#22d3ee" fontSize="9" fontWeight="bold" fontFamily="var(--font-mono)" textAnchor="middle">
                PROPOSED 3.5m ACOUSTIC BARRIER (~15 dB Est. Reduction)
              </text>
            </g>
          )}

          {/* VEGETATION BUFFER LAYER */}
          {layers.vegetation && (
            <g id="vegetation-layer">
              {/* Northern Dense Tree Buffer */}
              <rect x="110" y="70" width="680" height="24" fill="url(#vegPattern)" rx="4" />
              
              {/* Western Eco-Corridor */}
              <path
                d="M 80,110 Q 140,280 100,450"
                stroke="url(#vegPattern)"
                strokeWidth="38"
                fill="none"
                strokeLinecap="round"
              />

              {/* Central Green Pocket Park */}
              <ellipse cx="440" cy="270" rx="65" ry="45" fill="url(#vegPattern)" />
              <text x="440" y="274" fill="#34d399" fontSize="10" fontWeight="600" textAnchor="middle">
                Central Microclimate Park
              </text>
            </g>
          )}

          {/* SOLAR HEATMAP GRADIENT OVERLAY */}
          {layers.solarHeat && (
            <g id="solar-layer" opacity="0.65">
              <polygon
                points="120,95 800,75 820,430 110,440"
                fill="url(#solarGradient)"
              />
              {/* Sun Position Indicator */}
              <g transform="translate(760, 110)">
                <circle cx="0" cy="0" r="18" fill="#f59e0b" fillOpacity="0.25" />
                <circle cx="0" cy="0" r="10" fill="#f59e0b" filter="url(#glowEffect)" />
                <line x1="0" y1="-14" x2="0" y2="-20" stroke="#fbbf24" strokeWidth="2" />
                <line x1="10" y1="-10" x2="15" y2="-15" stroke="#fbbf24" strokeWidth="2" />
                <line x1="14" y1="0" x2="20" y2="0" stroke="#fbbf24" strokeWidth="2" />
                <text x="-4" y="32" fill="#fbbf24" fontSize="9" fontFamily="var(--font-mono)">
                  Sun Azimuth 242° (Peak W Heat)
                </text>
              </g>
            </g>
          )}

          {/* HYDROLOGY RUNOFF VECTORS & RECHARGE BASIN */}
          {layers.waterFlow && (
            <g id="hydrology-layer">
              {/* Bioswale Channels */}
              <path
                d="M 180,140 Q 300,240 420,380 L 680,420"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeDasharray="8 6"
                fill="none"
              />
              <path
                d="M 620,130 Q 560,260 520,360 L 680,420"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                fill="none"
              />

              {/* Recharge Basin Pond */}
              <ellipse cx="700" cy="420" rx="55" ry="32" fill="#0369a1" fillOpacity="0.45" stroke="#38bdf8" strokeWidth="2" />
              <text x="700" y="424" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle">
                Recharge Basin (4,200 m²)
              </text>

              {/* Water flow direction arrows */}
              <polygon points="340,270 348,260 345,275" fill="#38bdf8" />
              <polygon points="560,320 570,314 565,328" fill="#38bdf8" />
            </g>
          )}

          {/* AGRIVOLTAICS ARRAY (RURAL MODE) */}
          {layers.agrivoltaics && (
            <g id="agrivoltaics-layer">
              <rect x="520" y="240" width="180" height="90" fill="url(#pvGridPattern)" rx="4" stroke="#0284c7" strokeWidth="1.5" />
              <text x="610" y="288" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" filter="url(#glowEffect)">
                Agrivoltaic Canopy (1.2 MW)
              </text>
            </g>
          )}

          {/* BUILDINGS LAYER */}
          {layers.buildings && (
            <g id="buildings-layer">
              {/* Building A1 */}
              <g 
                transform="translate(180, 110)" 
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveHotspot('A1')}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                <rect width="90" height="50" rx="4" fill={activeHotspot === 'A1' ? '#1e3a8a' : '#1e293b'} stroke="#60a5fa" strokeWidth="1.5" />
                <rect x="0" y="0" width="90" height="12" fill="#3b82f6" fillOpacity="0.4" rx="2" />
                <text x="45" y="32" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">Block A1</text>
                <text x="45" y="44" fill="#94a3b8" fontSize="7.5" textAnchor="middle">Commercial (G+4)</text>
              </g>

              {/* Building A2 */}
              <g 
                transform="translate(320, 105)" 
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveHotspot('A2')}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                <rect width="95" height="52" rx="4" fill={activeHotspot === 'A2' ? '#1e3a8a' : '#1e293b'} stroke="#60a5fa" strokeWidth="1.5" />
                <rect x="0" y="0" width="95" height="12" fill="#3b82f6" fillOpacity="0.4" rx="2" />
                <text x="47" y="32" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">Block A2</text>
                <text x="47" y="44" fill="#94a3b8" fontSize="7.5" textAnchor="middle">Mixed Use (G+6)</text>
              </g>

              {/* Building B1 */}
              <g 
                transform="translate(170, 240)" 
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveHotspot('B1')}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                <rect width="80" height="65" rx="4" fill={activeHotspot === 'B1' ? '#1e3a8a' : '#1e293b'} stroke="#38bdf8" strokeWidth="1.5" />
                <text x="40" y="36" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">Block B1</text>
                <text x="40" y="50" fill="#94a3b8" fontSize="7.5" textAnchor="middle">Residential</text>
              </g>

              {/* Building B2 (Reoriented -18° for Solar Optimization) */}
              <g 
                transform="translate(310, 235) rotate(-14, 50, 35)" 
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveHotspot('B2')}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                <rect width="100" height="70" rx="4" fill={activeHotspot === 'B2' ? '#047857' : '#132e29'} stroke="#10b981" strokeWidth="2" filter="url(#glowEffect)" />
                <text x="50" y="38" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Block B2 (Opt)</text>
                <text x="50" y="52" fill="#34d399" fontSize="7.5" textAnchor="middle">-18° Solar Rotation</text>
              </g>

              {/* Building B3 & B4 */}
              <g transform="translate(190, 360)">
                <rect width="85" height="55" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                <text x="42" y="32" fill="#e2e8f0" fontSize="9" textAnchor="middle">Block B3</text>
              </g>

              <g transform="translate(330, 355)">
                <rect width="85" height="55" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                <text x="42" y="32" fill="#e2e8f0" fontSize="9" textAnchor="middle">Block B4</text>
              </g>

              {/* Community & Essential Facility Block */}
              <g transform="translate(560, 110)">
                <rect width="110" height="75" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="55" y="38" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Essential Facility</text>
                <text x="55" y="52" fill="#cbd5e1" fontSize="8" textAnchor="middle">Health & Transit (8 min)</text>
              </g>

              {/* Agro Logistic Hub */}
              <g transform="translate(710, 240)">
                <rect width="100" height="70" rx="4" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
                <text x="50" y="36" fill="#c084fc" fontSize="9.5" fontWeight="600" textAnchor="middle">Agro-Logistics</text>
                <text x="50" y="50" fill="#94a3b8" fontSize="7.5" textAnchor="middle">Storage & Depot</text>
              </g>
            </g>
          )}

          {/* Compass Rose */}
          <g transform="translate(830, 90)">
            <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <polygon points="0,-13 4,-2 0,0 -4,-2" fill="#06b6d4" />
            <polygon points="0,13 4,2 0,0 -4,2" fill="#475569" />
            <text x="0" y="-16" fill="#06b6d4" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
          </g>

          {/* Scale Bar */}
          <g transform="translate(80, 480)">
            <line x1="0" y1="0" x2="100" y2="0" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="#94a3b8" strokeWidth="2" />
            <line x1="50" y1="-2" x2="50" y2="2" stroke="#94a3b8" strokeWidth="1" />
            <line x1="100" y1="-3" x2="100" y2="3" stroke="#94a3b8" strokeWidth="2" />
            <text x="50" y="-6" fill="#94a3b8" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">100 METERS</text>
          </g>
        </svg>

        {/* Hotspot Floating Tooltip */}
        {activeHotspot && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1px solid var(--border-highlight)',
            borderRadius: 'var(--radius-md)',
            padding: '0.6rem 0.85rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
            fontSize: '0.78rem',
            backdropFilter: 'blur(8px)',
            maxWidth: '260px'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--cyan-light)', marginBottom: '0.2rem' }}>
              Building {activeHotspot} Diagnostic
            </div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.3' }}>
              {activeHotspot === 'B2' 
                ? 'Prototype simulation rotates long axis 18° to minimize afternoon thermal load & maximize natural ventilation (~30% heat reduction).' 
                : 'Acoustic attenuation: ~15 dB reduction (Estimated Demo Value) with northern perimeter barrier in place.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
