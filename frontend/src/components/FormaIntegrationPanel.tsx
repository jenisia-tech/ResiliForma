import React from 'react';
import { Layers, CheckCircle2, FileCheck } from 'lucide-react';

export const FormaIntegrationPanel: React.FC = () => {
  const nativeFormaAnalyses = [
    { name: 'Area Metrics', status: 'Verified in Forma', desc: 'Gross Floor Area (GFA), building footprints & site coverage' },
    { name: 'Embodied Carbon', status: 'Verified in Forma', desc: 'Material lifecycle carbon intensity benchmarking' },
    { name: 'Sun Hours Analysis', status: 'Verified in Forma', desc: 'Direct sunlight exposure on façades & public courtyards' },
    { name: 'Daylight Potential', status: 'Verified in Forma', desc: 'Vertical daylight factor & indoor natural light penetration' },
    { name: 'Wind Comfort & Microclimate', status: 'Verified in Forma', desc: 'Pedestrian comfort Lawson wind criteria simulation' },
    { name: 'Microclimate Energy Balance', status: 'Verified in Forma', desc: 'Universal Thermal Climate Index (UTCI) heat island mapping' },
    { name: 'Native Noise Analysis', status: 'Verified in Forma', desc: 'Full 3D acoustic ray-tracing & façade noise map verification' },
    { name: 'Solar Energy Potential', status: 'Verified in Forma', desc: 'Rooftop & vertical PV generation feasibility' }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Layers size={18} style={{ color: '#38bdf8' }} />
          <span>Autodesk Forma Integration Architecture</span>
        </div>
        <span className="badge badge-cyan">Extension-Ready Architecture</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Platform Positioning Card */}
        <div style={{ padding: '1rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Platform Separation & Roles
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
              PRIMARY PLATFORM: Autodesk Forma Site Design
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              The authoritative smart city 3D site model, building massing, terrain grading, and native analyses are authored directly within Autodesk Forma.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>
              RESILIFORMA: Supplementary Screening Extension
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Executes rapid deterministic multi-hazard screening for road noise, solar irradiance relief, and stormwater retention during early concept generation.
            </p>
          </div>
        </div>

        {/* Adapter Interface Pipeline */}
        <div style={{ padding: '1rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Adapter Interface Flow
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.775rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
              <span className="badge badge-indigo" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>1</span>
              <span>Autodesk Forma Site Model (3D Masses & Roads)</span>
            </div>
            <div style={{ paddingLeft: '1.25rem', color: '#64748b' }}>↓ Normalized Site Context Adapter (<code className="font-mono" style={{ color: '#38bdf8' }}>IFormaAdapter</code>)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
              <span className="badge badge-indigo" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>2</span>
              <span>FastAPI Screening Calculation Engine</span>
            </div>
            <div style={{ paddingLeft: '1.25rem', color: '#64748b' }}>↓ Multi-Hazard Metrics & Composite Resilience Score</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
              <span className="badge badge-indigo" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>3</span>
              <span>Forma Board Proposal Comparison & Revit BIM Handshake</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forma Native Analysis Verification Checklist */}
      <div style={{ padding: '1rem', background: 'rgba(15,23,42,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
              Autodesk Forma Native Analysis — Verification Checklist
            </div>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
              Project workflow verification checklist (Detailed physical simulations verified in Autodesk Forma platform)
            </div>
          </div>
          <span className="badge badge-emerald">
            <FileCheck size={12} /> 8 / 8 Verified
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
          {nativeFormaAnalyses.map((item, i) => (
            <div 
              key={i} 
              style={{ 
                padding: '0.6rem 0.75rem', 
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: '6px', 
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={16} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
