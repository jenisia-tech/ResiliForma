import React, { useState } from 'react';
import { 
  SunIcon, 
  InfoIcon, 
  SlidersIcon 
} from '../components/icons';

export const SolarAnalysis: React.FC = () => {
  const [azimuthOffset, setAzimuthOffset] = useState(-18);
  const [louverDepth, setLouverDepth] = useState(1.2);

  // Dynamic heat gain computation
  const heatReduction = Math.min(45, Math.round(20 + Math.abs(azimuthOffset) * 0.45 + (louverDepth / 1.5) * 10));
  const optimizedRadiation = Math.round(1780 * (1 - heatReduction / 100));

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="rf-badge rf-badge-amber">Solar & Microclimate</span>
            <span className="rf-badge rf-badge-muted">Solar Simulation</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>Solar Analysis & Building Orientation Optimization</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Façade solar irradiance modeling, sun-path angle optimization, and passive shading co-pilot.
          </p>
        </div>

        <span className="rf-badge rf-badge-amber" style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}>
          Tropical Aw Zone (11° N)
        </span>
      </div>

      {/* Mandatory Prototype Disclaimer */}
      <div style={{
        padding: '0.85rem 1rem',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.8rem',
        color: 'var(--amber-light)',
        marginBottom: '1.5rem'
      }}>
        <InfoIcon size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>Prototype Disclaimer:</strong> Prototype estimate — detailed solar simulation will be connected to the analysis backend.
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Peak Solar Exposure</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--amber-light)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            82 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>%</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Critical western façade exposure
          </div>
        </div>

        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Heat Gain Reduction</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-light)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {heatReduction} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>%</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--emerald-light)', marginTop: '0.2rem' }}>
            {azimuthOffset}° orientation offset
          </div>
        </div>

        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Annual Irradiance</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {optimizedRadiation} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>kWh/m²</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Down from 1,780 kWh/m² baseline
          </div>
        </div>

        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Shading Efficiency</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            78 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>%</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--cyan-light)', marginTop: '0.2rem' }}>
            {louverDepth}m overhangs & louvers
          </div>
        </div>
      </div>

      {/* Main Grid: Solar Radiation Diagram & Building Orientation Tuner */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Sun-Path & Façade Diagram */}
        <div className="col-8">
          <div className="rf-card" style={{ height: '100%', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SunIcon size={18} color="var(--amber-light)" />
                <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Sun-Path & Solar Façade Radiation Arc</h4>
              </div>
              <span className="rf-badge rf-badge-muted">Azimuth: 242° • Altitude: 48°</span>
            </div>

            <div style={{
              width: '100%',
              height: '320px',
              background: 'radial-gradient(ellipse at 50% 100%, #3a220b 0%, #0a0e17 80%)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 700 320">
                <defs>
                  <linearGradient id="sunBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Sun Arc Path */}
                <path d="M 60,260 Q 350,40 640,260" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />

                {/* Sun Positions: Morning, Noon, Afternoon */}
                <circle cx="120" cy="210" r="10" fill="#fef08a" opacity="0.6" />
                <text x="120" y="235" fill="#fef08a" fontSize="8" textAnchor="middle">08:00 AM (East)</text>

                <circle cx="350" cy="95" r="14" fill="#fbbf24" opacity="0.8" />
                <text x="350" y="75" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">12:00 PM Peak (South Arc)</text>

                <g transform="translate(560, 190)">
                  <circle cx="0" cy="0" r="16" fill="#f59e0b" />
                  <line x1="0" y1="-12" x2="0" y2="-18" stroke="#fbbf24" strokeWidth="2" />
                  <line x1="-12" y1="-12" x2="-16" y2="-16" stroke="#fbbf24" strokeWidth="2" />
                  <text x="0" y="32" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
                    04:00 PM Peak Thermal Radiation
                  </text>
                </g>

                {/* Reoriented Building B2 Schematic */}
                <g transform={`translate(350, 220) rotate(${azimuthOffset})`}>
                  {/* Building Core */}
                  <rect x="-70" y="-35" width="140" height="70" fill="#1e293b" stroke="#10b981" strokeWidth="2" rx="4" />
                  {/* North Glazing */}
                  <line x1="-70" y1="-35" x2="70" y2="-35" stroke="#38bdf8" strokeWidth="4" />
                  {/* South Shaded Glazing */}
                  <line x1="-70" y1="35" x2="70" y2="35" stroke="#f59e0b" strokeWidth="4" />
                  {/* Louver Overhangs */}
                  <rect x="-75" y="37" width="150" height="6" fill="#059669" rx="2" />
                  <text x="0" y="5" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Building B2</text>
                  <text x="0" y="18" fill="#34d399" fontSize="8" textAnchor="middle">Rotated {azimuthOffset}°</text>
                </g>

                {/* Ground Line */}
                <line x1="40" y1="285" x2="660" y2="285" stroke="#334155" strokeWidth="1.5" />
                <text x="350" y="305" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
                  PASSIVE SOLAR DESIGN: ROTATED LONG AXIS MINIMIZES WEST GLAZING
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Interactive Orientation Slider */}
        <div className="col-4">
          <div className="rf-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <SlidersIcon size={18} color="var(--amber-light)" />
              <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Façade Tuning Controls</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {/* Azimuth Angle Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Building B2 Azimuth Offset</span>
                  <span style={{ fontWeight: 700, color: 'var(--amber-light)', fontFamily: 'var(--font-mono)' }}>
                    {azimuthOffset}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={azimuthOffset}
                  onChange={e => setAzimuthOffset(parseInt(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>-45° (Max N)</span>
                  <span>-18° (Optimum)</span>
                  <span>+45° (Max S)</span>
                </div>
              </div>

              {/* Shading Louver Depth Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Louver Overhang Depth</span>
                  <span style={{ fontWeight: 700, color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}>
                    {louverDepth.toFixed(1)} m
                  </span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.4"
                  step="0.2"
                  value={louverDepth}
                  onChange={e => setLouverDepth(parseFloat(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>0.4m (Minimal)</span>
                  <span>1.2m (Recommended)</span>
                  <span>2.4m (Deep Canopy)</span>
                </div>
              </div>
            </div>

            {/* Calculated Cooling Delta */}
            <div style={{
              marginTop: 'auto',
              padding: '0.85rem',
              background: 'var(--bg-card-muted)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Simulated Thermal Performance:
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                <span>Orientation Heat Relief:</span>
                <span style={{ color: 'var(--amber-light)', fontWeight: 600 }}>-{Math.round(Math.abs(azimuthOffset) * 0.45 + 15)}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                <span>Louver Solar Block:</span>
                <span style={{ color: 'var(--cyan-light)', fontWeight: 600 }}>-{Math.round((louverDepth / 1.5) * 10)}%</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '0.35rem', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                <span>Net Cooling Load Cut:</span>
                <span style={{ color: 'var(--emerald-light)' }}>{heatReduction}% Reduction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
