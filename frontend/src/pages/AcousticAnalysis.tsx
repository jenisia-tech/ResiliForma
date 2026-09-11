import React, { useState } from 'react';
import { 
  Volume2Icon, 
  InfoIcon, 
  SlidersIcon 
} from '../components/icons';

export const AcousticAnalysis: React.FC = () => {
  const [barrierHeight, setBarrierHeight] = useState(3.5);
  const [vegDepth, setVegDepth] = useState(8.0);

  // Dynamic calculated attenuation based on slider adjustments
  const baseNoise = 78;
  const barrierCut = barrierHeight * 3.1; // ~10.8 dB at 3.5m
  const vegCut = (vegDepth / 8) * 4.2; // ~4.2 dB at 8m
  const totalReduction = Math.min(24, Math.round(barrierCut + vegCut));
  const optimizedDb = Math.max(54, baseNoise - totalReduction);

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="rf-badge rf-badge-cyan">Acoustic Co-Pilot</span>
            <span className="rf-badge rf-badge-muted">Acoustic Simulation</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>Acoustic Resilience & Traffic Noise Mitigation</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Multi-barrier acoustic diffraction modeling for northern arterial traffic noise corridor.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="rf-badge rf-badge-cyan" style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}>
            Target: ≤ 65 dB
          </span>
        </div>
      </div>

      {/* Mandatory Disclaimer Alert */}
      <div style={{
        padding: '0.85rem 1rem',
        background: 'rgba(6, 182, 212, 0.08)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.8rem',
        color: 'var(--cyan-light)',
        marginBottom: '1.5rem'
      }}>
        <InfoIcon size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>Prototype Disclaimer:</strong> Prototype estimate based on simplified acoustic assumptions. Full validated acoustic ray-tracing will be integrated in the analysis backend.
        </span>
      </div>

      {/* Acoustic KPI Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Noise Source</span>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginTop: '0.35rem' }}>
            Road Traffic (NH 544)
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Northern Perimeter Edge
          </div>
        </div>

        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Baseline Noise</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--rose-primary)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            78 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>dB</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--rose-primary)', marginTop: '0.2rem' }}>
            Exceeds Residential 65 dB
          </div>
        </div>

        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Level (Demo)</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {optimizedDb} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>dB</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--emerald-light)', marginTop: '0.2rem' }}>
            ✓ Meets WHO & CPCB limits
          </div>
        </div>

        <div className="rf-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Attenuation</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald-light)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            -{totalReduction} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>dB</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--emerald-light)', marginTop: '0.2rem' }}>
            Berm + Multi-tier canopy
          </div>
        </div>
      </div>

      {/* Main Analysis: Interactive Noise Heatmap / Ray Propagation SVG + Barrier Controls */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Noise Intensity Heatmap Diagram */}
        <div className="col-8">
          <div className="rf-card" style={{ height: '100%', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Volume2Icon size={18} color="var(--cyan-light)" />
                <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Noise Intensity Heatmap & Ray Propagation</h4>
              </div>
              <span className="rf-badge rf-badge-muted">2D Contour Simulation</span>
            </div>

            <div style={{
              width: '100%',
              height: '340px',
              background: 'radial-gradient(ellipse at 50% 10%, #1e1b4b 0%, #0c1322 70%)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 700 340">
                <defs>
                  {/* Acoustic decibel intensity gradient */}
                  <linearGradient id="dbHeatmap" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="25%" stopColor="#f59e0b" stopOpacity="0.5" />
                    <stop offset="55%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
                  </linearGradient>

                  <filter id="waveBlur">
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                </defs>

                {/* Noise Heatmap Layer */}
                <rect x="20" y="30" width="660" height="290" fill="url(#dbHeatmap)" rx="6" opacity="0.45" />

                {/* Traffic Road Line */}
                <rect x="20" y="30" width="660" height="22" fill="#334155" />
                <text x="350" y="45" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  HIGHWAY TRAFFIC NOISE LINE (78 dB)
                </text>

                {/* Acoustic Diffracted Rays */}
                <path d="M 50,52 Q 200,90 350,140" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.6" />
                <path d="M 350,52 Q 450,100 550,150" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.6" />
                <path d="M 650,52 Q 550,100 450,160" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.6" />

                {/* 3.5m Acoustic Wall */}
                <rect x="50" y="75" width="600" height="6" fill="#22d3ee" rx="2" />
                <text x="350" y="70" fill="#22d3ee" fontSize="9" fontWeight="bold" textAnchor="middle">
                  EARTH-BERM ACOUSTIC BARRIER ({barrierHeight}m) • SHADOW ZONE (63 dB)
                </text>

                {/* Vegetation Buffer Zone */}
                <rect x="50" y="86" width="600" height="20" fill="#064e3b" fillOpacity="0.6" rx="2" />
                <text x="350" y="100" fill="#34d399" fontSize="8.5" fontWeight="600" textAnchor="middle">
                  Multi-Tier Vegetation Buffer ({vegDepth}m Depth)
                </text>

                {/* Shielded Buildings */}
                <rect x="120" y="150" width="160" height="80" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
                <text x="200" y="185" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Building A1</text>
                <text x="200" y="202" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">63 dB (Compliant)</text>

                <rect x="420" y="150" width="160" height="80" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
                <text x="500" y="185" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Building A2</text>
                <text x="500" y="202" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">63 dB (Compliant)</text>

                {/* Quiet Courtyard Zone */}
                <rect x="220" y="260" width="260" height="50" fill="#042f2e" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" rx="4" />
                <text x="350" y="285" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Central Plaza Acoustic Oasis (54 dB)
                </text>
              </svg>
            </div>

            {/* Heatmap Legend */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '0.85rem', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#ef4444' }} />
                <span>&gt; 75 dB (Critical)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#f59e0b' }} />
                <span>68 - 75 dB (Moderate)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#06b6d4' }} />
                <span>60 - 68 dB (Acceptable)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#10b981' }} />
                <span>&lt; 60 dB (Comfort Zone)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barrier & Buffer Simulation Controls */}
        <div className="col-4">
          <div className="rf-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <SlidersIcon size={18} color="var(--cyan-light)" />
              <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Acoustic Parameter Tuning</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {/* Barrier Height Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Acoustic Barrier Height</span>
                  <span style={{ fontWeight: 700, color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}>
                    {barrierHeight.toFixed(1)} m
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.5"
                  value={barrierHeight}
                  onChange={e => setBarrierHeight(parseFloat(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>1.0m (Low)</span>
                  <span>3.5m (Standard)</span>
                  <span>6.0m (High Berm)</span>
                </div>
              </div>

              {/* Vegetation Buffer Depth Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Vegetation Buffer Depth</span>
                  <span style={{ fontWeight: 700, color: 'var(--emerald-light)', fontFamily: 'var(--font-mono)' }}>
                    {vegDepth.toFixed(1)} m
                  </span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="16.0"
                  step="1.0"
                  value={vegDepth}
                  onChange={e => setVegDepth(parseFloat(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>2.0m</span>
                  <span>8.0m (Balanced)</span>
                  <span>16.0m (Deep Forest)</span>
                </div>
              </div>
            </div>

            {/* Calculated Breakdown Card */}
            <div style={{
              marginTop: 'auto',
              padding: '0.85rem',
              background: 'var(--bg-card-muted)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Simulated Diffractive Attenuation:
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                <span>Berm Diffraction:</span>
                <span style={{ color: 'var(--cyan-light)', fontWeight: 600 }}>-{barrierCut.toFixed(1)} dB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                <span>Vegetation Foliage Loss:</span>
                <span style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>-{vegCut.toFixed(1)} dB</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '0.35rem', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                <span>Net Predicted Sound Level:</span>
                <span style={{ color: 'var(--cyan-light)' }}>{optimizedDb} dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
