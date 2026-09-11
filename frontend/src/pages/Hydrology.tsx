import React, { useState } from 'react';
import { 
  WavesIcon, 
  InfoIcon, 
  CloudRainIcon, 
  CompassIcon 
} from '../components/icons';

export const Hydrology: React.FC = () => {
  const [stormEvent, setStormEvent] = useState<'25yr' | '50yr' | '100yr'>('50yr');

  const getStormMetrics = () => {
    switch (stormEvent) {
      case '25yr':
        return { rainMm: 45, captureRate: 92, status: 'Full Retention (Zero Ponding)' };
      case '50yr':
      default:
        return { rainMm: 65, captureRate: 82, status: 'Optimal Retention (Minor Controlled Swale Flow)' };
      case '100yr':
        return { rainMm: 95, captureRate: 71, status: 'Emergency Overflow Routed to East Sump' };
    }
  };

  const metrics = getStormMetrics();

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="rf-badge rf-badge-blue">Hydrology Co-Pilot</span>
            <span className="rf-badge rf-badge-muted">Hydrology Simulation</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>Hydrology, Stormwater & Watershed Infiltration</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Gravity-fed bioswale routing, aquifer recharge zone sizing, and flash-flood resilience modeling.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setStormEvent('25yr')}
            className={`rf-btn ${stormEvent === '25yr' ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            25-Yr Storm
          </button>
          <button
            onClick={() => setStormEvent('50yr')}
            className={`rf-btn ${stormEvent === '50yr' ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            50-Yr Storm (Design)
          </button>
          <button
            onClick={() => setStormEvent('100yr')}
            className={`rf-btn ${stormEvent === '100yr' ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            100-Yr Stress Test
          </button>
        </div>
      </div>

      {/* Mandatory Prototype Disclaimer */}
      <div style={{
        padding: '0.85rem 1rem',
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.8rem',
        color: 'var(--blue-light)',
        marginBottom: '1.5rem'
      }}>
        <InfoIcon size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>Prototype Disclaimer:</strong> Prototype calculations based on empirical rational runoff coefficients. Validated hydrodynamic SWMM watershed modeling will connect in the FastAPI analysis backend.
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Runoff Handling</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--blue-light)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {metrics.captureRate} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>%</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--emerald-light)', marginTop: '0.2rem' }}>
            {metrics.status}
          </div>
        </div>

        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Terrain Slope</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '0.4rem' }}>
            Moderate Slope
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', marginTop: '0.2rem' }}>
            4.2% mean downhill to SE
          </div>
        </div>

        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recharge Basin Area</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            4,200 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>m²</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--blue-light)', marginTop: '0.2rem' }}>
            Infiltrates 270,000 L / hr
          </div>
        </div>

        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precipitation Design</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {metrics.rainMm} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>mm/hr</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--cyan-light)', marginTop: '0.2rem' }}>
            Monsoon peak intensity
          </div>
        </div>
      </div>

      {/* Conceptual Terrain & Water-Flow Visualization SVG */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        <div className="col-8">
          <div className="rf-card" style={{ height: '100%', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <WavesIcon size={18} color="var(--blue-light)" />
                <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Conceptual Terrain Flow Vectors & Swale Network</h4>
              </div>
              <span className="rf-badge rf-badge-muted">Gravity Routing Plan</span>
            </div>

            <div style={{
              width: '100%',
              height: '340px',
              background: 'radial-gradient(ellipse at 80% 80%, #0c2b48 0%, #09111e 80%)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 700 340">
                <defs>
                  {/* Water flow gradient */}
                  <linearGradient id="flowParticleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>

                  <pattern id="contourGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 0,30 Q 30,15 60,30" fill="none" stroke="#1e293b" strokeWidth="0.75" />
                  </pattern>
                </defs>

                {/* Contour Grid */}
                <rect width="100%" height="100%" fill="url(#contourGrid)" />

                {/* Topographic Elevation Contours */}
                <path d="M 40,40 Q 300,120 660,60" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 4" />
                <text x="60" y="35" fill="#64748b" fontSize="8" fontFamily="var(--font-mono)">+426.0m (High Ridge)</text>

                <path d="M 40,140 Q 320,200 660,150" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 4" />
                <text x="60" y="135" fill="#64748b" fontSize="8" fontFamily="var(--font-mono)">+423.5m</text>

                <path d="M 40,240 Q 340,280 660,240" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 4" />
                <text x="60" y="235" fill="#64748b" fontSize="8" fontFamily="var(--font-mono)">+421.0m (Low Depression)</text>

                {/* Primary Bioswale Channels */}
                <path
                  d="M 120,60 Q 240,160 380,220 L 520,250"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeDasharray="10 6"
                  fill="none"
                />
                <path
                  d="M 580,80 Q 520,180 500,240 L 520,250"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeDasharray="8 5"
                  fill="none"
                />

                {/* Water Flow Vectors / Arrowheads */}
                <polygon points="260,165 268,154 266,170" fill="#38bdf8" />
                <polygon points="440,228 450,222 445,235" fill="#38bdf8" />
                <polygon points="530,195 538,187 534,200" fill="#38bdf8" />

                {/* South-Eastern Natural Recharge Basin */}
                <ellipse cx="540" cy="265" rx="75" ry="42" fill="#0369a1" fillOpacity="0.5" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="540" y="265" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Recharge Basin
                </text>
                <text x="540" y="280" fill="#7dd3fc" fontSize="8.5" textAnchor="middle">
                  4,200 m² (82% Runoff Infiltration)
                </text>

                {/* Permeable Pavement Plazas */}
                <rect x="180" y="100" width="100" height="50" fill="#1e293b" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" rx="4" />
                <text x="230" y="128" fill="#34d399" fontSize="8.5" fontWeight="600" textAnchor="middle">
                  Permeable Plaza
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Drainage Recommendations & Infiltration Details */}
        <div className="col-4">
          <div className="rf-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.75rem' }}>
              Hydrology Action Plan
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-light)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                  <WavesIcon size={15} /> 1. Swale Placement
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  380m parabolic vegetative swales intercept overland flow from northern roads and building roofs.
                </p>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan-light)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                  <CloudRainIcon size={15} /> 2. Recharge Zone
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  4,200 m² naturalized wetland basin recharges the local aquifer with zero stagnant surface ponding.
                </p>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-light)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                  <CompassIcon size={15} /> 3. Gravity Flow Alignment
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Leverages the 4.2% natural downhill grade to avoid expensive motorized drainage pumps.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 'auto', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--blue-light)', marginBottom: '0.2rem' }}>
                Runoff Reduction Summary
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Reduces peak discharge volume from 14.8 m³/s to 2.6 m³/s, fully eliminating downstream flash-flood vulnerability.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
