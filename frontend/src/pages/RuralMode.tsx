import React, { useState } from 'react';
import { SiteVisualization } from '../components/SiteVisualization';
import { 
  LeafIcon, 
  ZapIcon, 
  WavesIcon, 
  CompassIcon, 
  SparklesIcon, 
  CheckCircle2Icon 
} from '../components/icons';

interface RuralModeProps {
  onGeneratePlan?: () => void;
}

export const RuralMode: React.FC<RuralModeProps> = ({ onGeneratePlan }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [planResult, setPlanResult] = useState<{
    planName: string;
    generatedTime: string;
    agriLandUse: string;
    runoffCapture: string;
  } | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPlanResult({
        planName: 'ResiliForma Agrivoltaic Rural Planning Simulation',
        generatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agriLandUse: '~74% dual-use land utilization (Estimated Demo Value)',
        runoffCapture: '~82% stormwater capture (Estimated Demo Value)'
      });
    }, 1500);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="rf-badge rf-badge-emerald">Rural Resilience Mode</span>
            <span className="rf-badge rf-badge-muted">Prototype Simulation</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>Rural & Peri-Urban Resilience Co-Pilot</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Agrivoltaic energy planning, stormwater routing, terrain-aware watershed recharge, and agro-logistics access.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="rf-btn rf-btn-primary"
          style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
        >
          <SparklesIcon size={16} className={isGenerating ? 'animate-spin-fast' : ''} />
          <span>{isGenerating ? 'Simulating Rural Plan...' : 'Generate Rural Plan'}</span>
        </button>
      </div>

      {/* Plan Generated Notice */}
      {planResult && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2Icon size={22} color="var(--emerald-light)" />
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                {planResult.planName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Generated at {planResult.generatedTime} • {planResult.agriLandUse} • {planResult.runoffCapture}
              </div>
            </div>
          </div>
          <span className="rf-badge rf-badge-emerald">Prototype Simulation</span>
        </div>
      )}

      {/* 4 Rural KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="rf-card" style={{ border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Runoff Handling</span>
            <WavesIcon size={18} color="var(--blue-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            ~82%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--blue-light)', marginTop: '0.25rem' }}>
            Estimated Demo Value (4,200 m² basin)
          </div>
        </div>

        <div className="rf-card" style={{ border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Agrivoltaic Land Use</span>
            <ZapIcon size={18} color="var(--amber-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            ~74%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', marginTop: '0.25rem' }}>
            Estimated Demo Value (1.2 MW)
          </div>
        </div>

        <div className="rf-card" style={{ border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Facility Access</span>
            <CompassIcon size={18} color="var(--emerald-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            ~8 min
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--emerald-light)', marginTop: '0.25rem' }}>
            Estimated Demo Value (Porous paths)
          </div>
        </div>

        <div className="rf-card" style={{ border: '1px solid rgba(100, 116, 139, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Terrain Risk</span>
            <LeafIcon size={18} color="var(--cyan-light)" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', marginTop: '0.4rem' }}>
            Moderate
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Prototype Risk Rating (4.2% grade)
          </div>
        </div>
      </div>

      {/* Conceptual Rural Site Visualization */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SiteVisualization mode="rural" />
      </div>

      {/* Rural Technical Systems Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        <div className="rf-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--amber-light)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.88rem' }}>
            <ZapIcon size={18} /> Agrivoltaics & Dual-Use Canopy
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
            3.8m elevated bifacial solar modules generate 1.2 MW clean capacity while providing partial shade to cultivate ginger, turmeric, and micro-legumes underneath without land degradation.
          </p>
        </div>

        <div className="rf-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--blue-light)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.88rem' }}>
            <WavesIcon size={18} /> Terrain-Aware Water Routing
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
            Cascading 380m vegetated swales follow natural topographic contours, decelerating runoff velocities and directing 82% of monsoonal volume into groundwater recharge basins.
          </p>
        </div>

        <div className="rf-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-light)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.88rem' }}>
            <CompassIcon size={18} /> Agro-Logistics & Supply Link
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
            Permeable stabilization pathways ensure rapid transit between harvesting fields, cold storage depots, and regional transport arteries even during high-precipitation periods.
          </p>
        </div>
      </div>
    </div>
  );
};
