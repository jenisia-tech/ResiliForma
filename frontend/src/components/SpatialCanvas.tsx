import React, { useState } from 'react';
import { Layers, Info, Image as ImageIcon, Sparkles, Building, X, Volume2, Sun, Droplets, Eye } from 'lucide-react';
import { SiteAnalysisRequest, SiteAnalysisResponse, BuildingParcel } from '../types/analysis';
import { KARUNYA_BUILDINGS } from '../integrations/designParser';

interface SpatialCanvasProps {
  parameters: SiteAnalysisRequest;
  analysis: SiteAnalysisResponse;
  buildings?: BuildingParcel[];
  siteName?: string;
  siteAreaKm2?: number;
  transitCorridorName?: string;
  customImageOverlay?: string | null;
}

export const SpatialCanvas: React.FC<SpatialCanvasProps> = ({
  parameters,
  analysis,
  buildings = KARUNYA_BUILDINGS,
  siteName = "Karunya Nagar Smart City Sector",
  siteAreaKm2 = 1.2,
  transitCorridorName = "NH-544 / Siruvani Road Arterial Corridor",
  customImageOverlay = null
}) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<BuildingParcel | null>(null);
  const [showHeatmap, setShowHeatmap] = useState<'normal' | 'noise' | 'solar' | 'stormwater'>('normal');
  const [showImageUnderlay, setShowImageUnderlay] = useState<boolean>(true);
  const [imageOpacity, setImageOpacity] = useState<number>(0.65);

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
  const getBuildingColor = (b: BuildingParcel) => {
    if (showHeatmap === 'noise') {
      const distFromRoad = Math.max(0, b.y - 65);
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
    if (showHeatmap === 'stormwater') {
      const swMgmt = analysis.stormwater.runoff_management_percent;
      if (swMgmt < 45) return '#ef4444';
      if (swMgmt < 75) return '#38bdf8';
      return '#10b981';
    }

    // Default by use type
    if (b.use_type === 'residential') return '#1e293b';
    if (b.use_type === 'civic') return '#1e3a5f';
    if (b.use_type === 'educational') return '#2a2245';
    if (b.use_type === 'industrial') return '#3b2d18';
    return '#1e293b';
  };

  return (
    <div className="card" style={{ padding: '1rem', position: 'relative' }}>
      <div className="card-header" style={{ marginBottom: '0.5rem' }}>
        <div className="card-title">
          <Layers size={18} style={{ color: '#38bdf8' }} />
          <span>{siteName} — Multi-Hazard Spatial Screening Canvas</span>
          <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
            {buildings.length} Parcels Active
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {customImageOverlay && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#0b1120', padding: '2px 6px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <button
                style={{
                  background: showImageUnderlay ? '#0284c7' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '0.725rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
                onClick={() => setShowImageUnderlay(!showImageUnderlay)}
              >
                <ImageIcon size={12} />
                <span>Blueprint</span>
              </button>
              {showImageUnderlay && (
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[0.35, 0.65, 0.95].map((op) => (
                    <button
                      key={op}
                      style={{
                        background: imageOpacity === op ? '#38bdf8' : 'transparent',
                        color: imageOpacity === op ? '#070b14' : '#94a3b8',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '1px 4px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      onClick={() => setImageOpacity(op)}
                    >
                      {Math.round(op * 100)}%
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

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
            <button
              style={{
                background: showHeatmap === 'stormwater' ? '#38bdf8' : 'transparent',
                color: showHeatmap === 'stormwater' ? '#070b14' : '#94a3b8',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.725rem',
                fontWeight: showHeatmap === 'stormwater' ? 700 : 500,
                cursor: 'pointer'
              }}
              onClick={() => setShowHeatmap('stormwater')}
            >
              SuDS Flow
            </button>
          </div>
        </div>
      </div>

      {/* Blueprint Image Screening Notice Banner */}
      {customImageOverlay && (
        <div style={{
          padding: '0.4rem 0.75rem',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '6px',
          marginBottom: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc' }}>
            <Sparkles size={14} style={{ color: '#38bdf8' }} />
            <span>
              <strong>Active Drawing Screening:</strong> Multi-hazard screening active on uploaded blueprint image.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', color: '#94a3b8' }}>
            <span>Noise: <strong style={{ color: '#ef4444' }}>{analysis.noise.optimized_noise_db} dBA</strong></span>
            <span>Solar: <strong style={{ color: '#f59e0b' }}>{Math.round(analysis.solar.estimated_irradiance)} W/m²</strong></span>
            <span>SuDS: <strong style={{ color: '#38bdf8' }}>{analysis.stormwater.runoff_management_percent}%</strong></span>
          </div>
        </div>
      )}

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
              <stop offset="0%" stopColor="#ef4444" stopOpacity={showHeatmap === 'noise' ? "0.5" : "0.22"} />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity={showHeatmap === 'noise' ? "0.3" : "0.1"} />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Stormwater Infiltration Field Gradient */}
            <linearGradient id="stormwaterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity={showHeatmap === 'stormwater' ? "0.4" : "0.0"} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={showHeatmap === 'stormwater' ? "0.25" : "0.0"} />
            </linearGradient>

            {/* Water Pond Gradient */}
            <radialGradient id="pondGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#0284c7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Background Grid & Site Boundary */}
          <rect width="740" height="430" fill="#070d19" />

          {/* Uploaded Blueprint Image Underlay */}
          {customImageOverlay && showImageUnderlay && (
            <image
              href={customImageOverlay}
              x="25"
              y="20"
              width="690"
              height="390"
              opacity={imageOpacity}
              preserveAspectRatio="xMidYMid slice"
            />
          )}

          <rect width="740" height="430" fill="url(#grid)" />
          <rect x="25" y="20" width="690" height="390" fill="url(#stormwaterGradient)" />
          <rect x="25" y="20" width="690" height="390" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" rx="6" />

          {/* Site Boundary Label */}
          <text x="35" y="38" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            {siteName.toUpperCase()} BOUNDARY ({siteAreaKm2} km² • {buildings.length} PARCELS)
          </text>

          {/* ARTERIAL TRANSIT CORRIDOR */}
          <g>
            {/* Road noise acoustic wave propagation field */}
            <rect x="25" y="45" width="690" height="85" fill="url(#noiseGradient)" />

            {/* Acoustic propagation waves */}
            <path d="M 50 110 Q 370 125 690 110" fill="none" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1.5" strokeDasharray="6 4" />
            <path d="M 50 120 Q 370 135 690 120" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1.2" strokeDasharray="6 4" />

            {/* Road Bed */}
            <rect x="25" y="45" width="690" height="36" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            {/* Road Center Line */}
            <line x1="25" y1="63" x2="715" y2="63" stroke="#f59e0b" strokeWidth="2" strokeDasharray="12 8" />
            <text x="370" y="60" fill="#f8fafc" fontSize="10.5" fontFamily="Plus Jakarta Sans" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">
              {transitCorridorName.toUpperCase()} ({parameters.baseline_noise_db.toFixed(1)} dBA)
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
            <rect x="40" y="195" width="660" height="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <line x1="40" y1="202" x2="700" y2="202" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />

            <rect x="40" y="295" width="660" height="14" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <line x1="40" y1="302" x2="700" y2="302" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />

            <rect x="365" y="100" width="16" height="295" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <line x1="373" y1="100" x2="373" y2="395" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />
          </g>

          {/* BIOSWALES NETWORK (Dynamic Rendering) */}
          {swaleLen > 0 && (
            <g>
              <line x1="50" y1="192" x2="350" y2="192" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 3" />
              <line x1="390" y1="192" x2="680" y2="192" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 3" />
              <line x1="50" y1="292" x2="350" y2="292" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 3" />
              <line x1="390" y1="292" x2="600" y2="292" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="8 3" />
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

          {/* DYNAMIC BUILDING BLOCKS */}
          {buildings.map((b) => {
            const centerX = b.x + b.w / 2;
            const centerY = b.y + b.h / 2;
            const isHovered = hoveredElement === b.id;
            const isSelected = selectedParcel?.id === b.id;
            const blockOri = b.orientation_offset !== undefined ? b.orientation_offset : oriOffset;
            const blockLouver = b.louver_depth !== undefined ? b.louver_depth : louverD;

            return (
              <g 
                key={b.id}
                transform={`rotate(${blockOri}, ${centerX}, ${centerY})`}
                onMouseEnter={() => setHoveredElement(b.id)}
                onMouseLeave={() => setHoveredElement(null)}
                onClick={() => setSelectedParcel(b)}
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
              >
                {/* Building Shadow */}
                <rect 
                  x={b.x + 3} 
                  y={b.y + 3} 
                  width={b.w} 
                  height={b.h} 
                  fill="rgba(0, 0, 0, 0.5)" 
                  rx="3" 
                />

                {/* Building Footprint */}
                <rect 
                  x={b.x} 
                  y={b.y} 
                  width={b.w} 
                  height={b.h} 
                  fill={getBuildingColor(b)} 
                  stroke={isSelected ? '#10b981' : isHovered ? '#38bdf8' : 'rgba(255,255,255,0.25)'} 
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                  rx="3" 
                />

                {/* Shading Louver Conceptual Projection on West Façade */}
                {blockLouver > 0 && (
                  <g>
                    <line 
                      x1={b.x - 2} 
                      y1={b.y + 3} 
                      x2={b.x - 2} 
                      y2={b.y + b.h - 3} 
                      stroke="#f59e0b" 
                      strokeWidth={Math.max(1.5, blockLouver * 1.8)} 
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
                  fill={isSelected ? '#10b981' : isHovered ? '#ffffff' : '#cbd5e1'} 
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

        {/* Selected / Hovered Parcel Details Overlay */}
        {(selectedParcel || hoveredElement) && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: selectedParcel ? '1px solid #10b981' : '1px solid #38bdf8',
            borderRadius: '6px',
            padding: '8px 14px',
            fontSize: '0.775rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 10
          }}>
            <Building size={16} style={{ color: selectedParcel ? '#10b981' : '#38bdf8' }} />
            <div>
              {(() => {
                const target = selectedParcel || buildings.find(b => b.id === hoveredElement);
                if (!target) return null;
                return (
                  <div>
                    <strong>Parcel {target.id}:</strong> {target.name} • <strong>{target.floors} Floors</strong> • Type: <span style={{ textTransform: 'capitalize' }}>{target.use_type || 'Commercial'}</span> • Orientation: <strong>{oriOffset}°</strong> (Louver: {louverD}m)
                  </div>
                );
              })()}
            </div>
            {selectedParcel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedParcel(null);
                }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
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
            {buildings.length} Building Footprints
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 14, height: 4, background: '#f59e0b', display: 'inline-block' }}></span>
            Transit Arterial Corridor
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
          * Dynamic 2.5D SVG Projection; Site design authoring directly inside Autodesk Forma.
        </div>
      </div>
    </div>
  );
};
