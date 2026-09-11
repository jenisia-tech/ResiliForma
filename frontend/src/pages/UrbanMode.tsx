import React, { useState } from 'react';
import { SiteVisualization } from '../components/SiteVisualization';
import { 
  Volume2Icon, 
  SunIcon, 
  LeafIcon, 
  SparklesIcon, 
  CheckCircle2Icon 
} from '../components/icons';

interface UrbanModeProps {
  onGeneratePlan?: () => void;
}

export const UrbanMode: React.FC<UrbanModeProps> = ({ onGeneratePlan }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [planResult, setPlanResult] = useState<{
    planName: string;
    generatedTime: string;
    acousticReduction: string;
    solarReduction: string;
  } | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPlanResult({
        planName: 'ResiliForma Urban Planning Simulation',
        generatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        acousticReduction: '~15 dB noise attenuation (Estimated Demo Value)',
        solarReduction: '~30% peak heat gain reduction (Estimated Demo Value)'
      });
    }, 1500);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="rf-badge rf-badge-cyan">Urban Resilience Mode</span>
            <span className="rf-badge rf-badge-muted">Prototype Simulation</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>Urban Resilience & Microclimate Co-Pilot</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Acoustic barrier modeling, façade solar shading, building orientation optimization, and urban green buffers.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="rf-btn rf-btn-primary"
        >
          <SparklesIcon size={16} className={isGenerating ? 'animate-spin-fast' : ''} />
          <span>{isGenerating ? 'Simulating Urban Plan...' : 'Generate Urban Plan'}</span>
        </button>
      </div>

      {/* Plan Generation Success Notice */}
      {planResult && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2Icon size={22} color="var(--cyan-light)" />
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                {planResult.planName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Generated at {planResult.generatedTime} • {planResult.acousticReduction} • {planResult.solarReduction}
              </div>
            </div>
          </div>
          <span className="rf-badge rf-badge-cyan">Prototype Simulation</span>
        </div>
      )}

      {/* 2 Main Analysis KPI Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Acoustic Analysis Box */}
        <div className="rf-card" style={{ border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                padding: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--cyan-light)'
              }}>
                <Volume2Icon size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Acoustic Analysis</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Traffic Noise Mitigation</span>
              </div>
            </div>
            <span className="rf-badge rf-badge-cyan">Arterial Corridor</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.65rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Noise Source</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>Road Traffic</span>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Baseline Noise</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--rose-primary)', fontFamily: 'var(--font-mono)' }}>78 dB</span>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Target Limit</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>≤ 65 dB</span>
            </div>
          </div>

          <div style={{
            padding: '0.75rem',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Estimated Demo Result</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan-light)', fontFamily: 'var(--font-heading)' }}>
                ~63 dB
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="rf-badge rf-badge-cyan" style={{ fontSize: '0.75rem' }}>~15 dB Reduction (Demo Est.)</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--emerald-light)', display: 'block', marginTop: '0.25rem' }}>
                ✓ Target Threshold: ≤ 65 dB
              </span>
            </div>
          </div>
        </div>

        {/* Solar Analysis Box */}
        <div className="rf-card" style={{ border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                padding: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--amber-light)'
              }}>
                <SunIcon size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Solar Analysis</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Façade & Thermal Load (Demo Simulation)</span>
              </div>
            </div>
            <span className="rf-badge rf-badge-amber">Tropical Aw Zone</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.65rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Peak Exposure</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--amber-light)', fontFamily: 'var(--font-mono)' }}>82% (Demo)</span>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Critical Façade</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>West & South-West</span>
            </div>
          </div>

          <div style={{
            padding: '0.75rem',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Estimated Heat-Gain Reduction</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--amber-light)', fontFamily: 'var(--font-heading)' }}>
                ~30% (Estimated)
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="rf-badge rf-badge-amber" style={{ fontSize: '0.75rem' }}>-18° Axis Offset (Demo)</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--emerald-light)', display: 'block', marginTop: '0.25rem' }}>
                ~534 kWh/m² Est. Cut
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conceptual Site Visualization */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SiteVisualization mode="urban" />
      </div>

      {/* Urban Intervention Strategies */}
      <div className="rf-card">
        <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.75rem' }}>
          Urban Optimization Interventions
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan-light)', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <Volume2Icon size={16} /> 3.5m Northern Earth-Berm Barrier
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Diffracts high-frequency road acoustics, casting a 140m shadow zone over residential blocks.
            </p>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--amber-light)', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <SunIcon size={16} /> -18° Block B2 Azimuth Reorientation
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Reduces solar irradiance on primary glazing while funneling prevailing SW summer winds for passive ventilation.
            </p>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-light)', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <LeafIcon size={16} /> 8m Native Multi-Tier Green Buffer
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Broadleaf Neem & Bamboo canopy delivers localized evaporative cooling (-1.8°C) and micro-particulate absorption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
