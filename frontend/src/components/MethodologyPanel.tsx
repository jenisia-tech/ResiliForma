import React from 'react';
import { BookOpen } from 'lucide-react';

export const MethodologyPanel: React.FC = () => {
  const steps = [
    { title: 'Autodesk Forma', desc: 'Author site geometry & building masses' },
    { title: 'Site Parameters', desc: 'Extract context & environmental constraints' },
    { title: 'ResiliForma Extension', desc: 'Execute deterministic screening formulas' },
    { title: 'Multi-Hazard Results', desc: 'Calculate noise, solar & stormwater impact' },
    { title: 'Proposal Comparison', desc: 'Evaluate baseline vs resilient alternatives' },
    { title: 'Informed Decision', desc: 'Select climate-resilient spatial strategy' },
    { title: 'Forma / Revit Detail', desc: 'Proceed to detailed engineering workflows' }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <BookOpen size={18} style={{ color: '#38bdf8' }} />
          <span>How ResiliForma Works — Screening Workflow Pipeline</span>
        </div>
        <span className="badge badge-indigo">Extension Pipeline</span>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', 
        gap: '0.6rem', 
        marginBottom: '1.25rem' 
      }}>
        {steps.map((s, idx) => (
          <div 
            key={idx}
            style={{ 
              background: 'rgba(15, 23, 42, 0.7)', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              border: '1px solid rgba(255, 255, 255, 0.06)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>
                STEP 0{idx + 1}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                {s.title}
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3 }}>
              {s.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Methodology Principles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '0.3rem' }}>1. Road Traffic Noise Screening</strong>
          Screening applies barrier diffraction attenuation: <code className="font-mono" style={{ color: '#38bdf8' }}>A_barrier = min(18.0, h × 3.1)</code> and vegetation absorption: <code className="font-mono" style={{ color: '#10b981' }}>A_veg = min(8.0, (d/8) × 4.2)</code>.
        </div>

        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '0.3rem' }}>2. Façade Solar Irradiance Relief</strong>
          Combines azimuth deflection relief: <code className="font-mono" style={{ color: '#f59e0b' }}>min(25, |θ| × 0.45 + 12)</code> with horizontal louver shading: <code className="font-mono" style={{ color: '#fb923c' }}>min(20, (d/1.2) × 11.9)</code> capped at 45% peak reduction.
        </div>

        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '0.3rem' }}>3. Rational Stormwater Screening</strong>
          Calculates peak runoff using <code className="font-mono" style={{ color: '#38bdf8' }}>Q = 0.278 × C × I × A</code>, screening sustainable drainage systems (SuDS) with bioswale infiltration and dedicated retention volume.
        </div>
      </div>
    </div>
  );
};
