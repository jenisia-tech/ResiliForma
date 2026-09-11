import React from 'react';
import { FormaSiteData, FormaBuilding } from '../types/forma';

interface FormaSiteCanvasProps {
  siteData: FormaSiteData;
  onRotateBuilding: (buildingId: string, azimuth: number) => void;
  selectedBuildingId: string | null;
  onSelectBuilding: (buildingId: string | null) => void;
}

export const FormaSiteCanvas: React.FC<FormaSiteCanvasProps> = ({
  siteData,
  onRotateBuilding,
  selectedBuildingId,
  onSelectBuilding
}) => {
  const width = 560;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const scale = 1.6;

  const toScreenX = (x: number) => centerX + x * scale;
  const toScreenY = (y: number) => centerY - y * scale;

  return (
    <div className="glass-panel" style={{ padding: '1rem', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Forma Spatial Canvas Visualizer
          </h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
            Interactive 2.5D element projection synchronized with Autodesk Forma scene
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#f43f5e', borderRadius: '2px' }} /> Noise Source
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#06b6d4', borderRadius: '2px' }} /> Buildings
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '2px' }} /> Interventions
          </span>
        </div>
      </div>

      <div style={{
        background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
          <defs>
            {/* Grid Pattern */}
            <pattern id="forma-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>

            {/* Noise Gradient */}
            <linearGradient id="noiseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(244, 63, 94, 0.45)" />
              <stop offset="50%" stopColor="rgba(244, 63, 94, 0.15)" />
              <stop offset="100%" stopColor="rgba(244, 63, 94, 0.0)" />
            </linearGradient>

            {/* Vegetation Pattern */}
            <linearGradient id="vegGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.15)" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width={width} height={height} fill="url(#forma-grid)" />

          {/* Site Boundary */}
          <rect
            x={toScreenX(-120)}
            y={toScreenY(90)}
            width={240 * scale}
            height={180 * scale}
            fill="rgba(255, 255, 255, 0.015)"
            stroke="rgba(6, 182, 212, 0.3)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            rx="6"
          />

          {/* Terrain Drainage Arrows (North to South-East) */}
          <g opacity="0.4">
            {[-60, 0, 60].map((gx, idx) => (
              <g key={idx} transform={`translate(${toScreenX(gx)}, ${toScreenY(0)})`}>
                <line x1="0" y1="-30" x2="15" y2="20" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                <polygon points="15,20 10,12 18,14" fill="#38bdf8" />
              </g>
            ))}
          </g>

          {/* North Arterial Road (Arterial Highway Corridor) */}
          <g>
            <rect
              x={toScreenX(-135)}
              y={toScreenY(115)}
              width={270 * scale}
              height={20 * scale}
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="1"
            />
            {/* Road center line */}
            <line
              x1={toScreenX(-135)}
              y1={toScreenY(105)}
              x2={toScreenX(135)}
              y2={toScreenY(105)}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <text
              x={toScreenX(0)}
              y={toScreenY(108)}
              fill="#94a3b8"
              fontSize="9"
              fontWeight="600"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              NORTH ARTERIAL HIGHWAY (78 dBA)
            </text>

            {/* Noise Wave propagation */}
            <rect
              x={toScreenX(-125)}
              y={toScreenY(95)}
              width={250 * scale}
              height={40 * scale}
              fill="url(#noiseGrad)"
              pointerEvents="none"
            />
          </g>

          {/* Proposed Interventions in Scene */}

          {/* 1. Acoustic Barrier Wall */}
          {siteData.barrier_height_m && siteData.barrier_height_m > 0 && (
            <g>
              <line
                x1={toScreenX(-105)}
                y1={toScreenY(94)}
                x2={toScreenX(105)}
                y2={toScreenY(94)}
                stroke="#f59e0b"
                strokeWidth={siteData.barrier_height_m * 1.5}
                strokeLinecap="round"
              />
              <text
                x={toScreenX(0)}
                y={toScreenY(97)}
                fill="#fcd34d"
                fontSize="8"
                fontWeight="700"
                textAnchor="middle"
              >
                3.5m ACOUSTIC BERM BARRIER
              </text>
            </g>
          )}

          {/* 2. Vegetation Buffer Zone */}
          {siteData.veg_depth_m && siteData.veg_depth_m > 0 && (
            <g>
              <rect
                x={toScreenX(-105)}
                y={toScreenY(90)}
                width={210 * scale}
                height={siteData.veg_depth_m * scale}
                fill="url(#vegGrad)"
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="2 2"
                rx="4"
              />
              <text
                x={toScreenX(0)}
                y={toScreenY(86)}
                fill="#6ee7b7"
                fontSize="8"
                fontWeight="600"
                textAnchor="middle"
              >
                🌲 8m NATIVE CANOPY VEGETATION BUFFER
              </text>
            </g>
          )}

          {/* 3. Bioswale Drainage Swale */}
          <g>
            <path
              d={`M ${toScreenX(-50)} ${toScreenY(0)} Q ${toScreenX(20)} ${toScreenY(-40)} ${toScreenX(85)} ${toScreenY(-75)}`}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3.5"
              strokeDasharray="5 3"
            />
            <text
              x={toScreenX(85)}
              y={toScreenY(-80)}
              fill="#67e8f9"
              fontSize="8"
              fontWeight="600"
              textAnchor="middle"
            >
              🌊 Aquifer Recharge Basin
            </text>
          </g>

          {/* Buildings from Forma */}
          {siteData.buildings.map((b: FormaBuilding) => {
            const isSelected = selectedBuildingId === b.id;
            const poly = b.geometry_polygon || [
              [-20, -20],
              [20, -20],
              [20, 20],
              [-20, 20]
            ];

            // Calculate center of polygon
            const bCenterX = poly.reduce((acc, p) => acc + p[0], 0) / poly.length;
            const bCenterY = poly.reduce((acc, p) => acc + p[1], 0) / poly.length;

            const bScreenX = toScreenX(bCenterX);
            const bScreenY = toScreenY(bCenterY);

            // Path string
            const pathData = poly.map((p, idx) => {
              const sx = toScreenX(p[0]);
              const sy = toScreenY(p[1]);
              return `${idx === 0 ? 'M' : 'L'} ${sx} ${sy}`;
            }).join(' ') + ' Z';

            // Color based on solar exposure
            const fillColor = b.exposure_pct > 80 ? 'rgba(239, 68, 68, 0.4)' : b.exposure_pct > 70 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(6, 182, 212, 0.4)';
            const strokeColor = isSelected ? '#ffffff' : b.exposure_pct > 80 ? '#f87171' : b.exposure_pct > 70 ? '#fbbf24' : '#38bdf8';

            return (
              <g
                key={b.id}
                onClick={() => onSelectBuilding(isSelected ? null : b.id)}
                style={{ cursor: 'pointer' }}
                transform={`rotate(${b.azimuth_deg}, ${bScreenX}, ${bScreenY})`}
              >
                {/* 3D Extrusion Shadow */}
                <path
                  d={pathData}
                  transform="translate(4, -6)"
                  fill="rgba(0, 0, 0, 0.4)"
                />

                {/* Building Footprint */}
                <path
                  d={pathData}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />

                {/* Center Label */}
                <text
                  x={bScreenX}
                  y={bScreenY - 2}
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="700"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {b.id}
                </text>
                <text
                  x={bScreenX}
                  y={bScreenY + 10}
                  fill="rgba(255, 255, 255, 0.8)"
                  fontSize="7.5"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {b.height_m}m • {b.azimuth_deg}°
                </text>

                {/* Solar Exposure Tag */}
                <rect
                  x={bScreenX - 22}
                  y={bScreenY + 16}
                  width="44"
                  height="12"
                  rx="3"
                  fill="rgba(0, 0, 0, 0.6)"
                />
                <text
                  x={bScreenX}
                  y={bScreenY + 25}
                  fill={b.exposure_pct > 80 ? '#fca5a5' : '#7dd3fc'}
                  fontSize="7"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  ☀️ {b.exposure_pct}% exp
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Canvas Legend */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '0.35rem 0.6rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          display: 'flex',
          gap: '0.75rem'
        }}>
          <span>📍 Lat 11.0168, Lon 76.9558</span>
          <span>📐 Parcel: 4.8 Hectares</span>
          <span>🏢 Buildings: {siteData.buildings.length}</span>
        </div>
      </div>

      {/* Building Orientation Quick-Rotate Controller */}
      {selectedBuildingId && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.65rem 0.85rem',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ffffff' }}>
              Selected: <strong>{selectedBuildingId}</strong>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--cyan-light)' }}>
              (Current Azimuth: {siteData.buildings.find(b => b.id === selectedBuildingId)?.azimuth_deg}°)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Quick Orient:</span>
            {[-18, 0, 45, 90].map((deg) => (
              <button
                key={deg}
                onClick={() => onRotateBuilding(selectedBuildingId, deg)}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.45rem',
                  borderColor: deg === -18 ? 'var(--cyan-primary)' : undefined,
                  color: deg === -18 ? 'var(--cyan-light)' : undefined
                }}
              >
                {deg}° {deg === -18 ? '★ AI Opt' : ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
