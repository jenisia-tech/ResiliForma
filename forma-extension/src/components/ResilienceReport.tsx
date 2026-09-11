import React from 'react';
import { FormaAnalysisResponse, FormaIntervention } from '../types/forma';

interface ResilienceReportProps {
  analysis: FormaAnalysisResponse | null;
  onApplyIntervention: (intervention: FormaIntervention) => void;
  isLoading: boolean;
}

export const ResilienceReport: React.FC<ResilienceReportProps> = ({
  analysis,
  onApplyIntervention,
  isLoading
}) => {
  if (isLoading || !analysis) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="pulse-dot" style={{ width: '16px', height: '16px', backgroundColor: '#06b6d4', margin: '0 auto 1rem' }} />
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>Running ResiliForma Spatial Analytics...</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Evaluating acoustic diffraction, solar radiation, and watershed runoff heuristics
        </div>
      </div>
    );
  }

  const { acoustic, solar, resilience_score, recommendations, interventions = [] } = analysis;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Metric Cards (Contract Agreement) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
        
        {/* Composite Score Card */}
        <div className="glass-panel" style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(17, 24, 39, 0.8) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Resilience Score
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>
              Grade A
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {resilience_score}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--cyan-light)', marginTop: '0.2rem' }}>
            ↑ High Climate Resilience
          </div>
        </div>

        {/* Acoustic Card */}
        <div className="glass-panel" style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(17, 24, 39, 0.8) 100%)',
          border: '1px solid rgba(244, 63, 94, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Acoustic Reduction
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>
              Safe Zone
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              -{acoustic.reduction_db} dB
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Before: <strong style={{ color: '#f87171' }}>{acoustic.noise_before} dB</strong></span>
            <span>After: <strong style={{ color: '#4ade80' }}>{acoustic.noise_after} dB</strong></span>
          </div>
        </div>

        {/* Solar Card */}
        <div className="glass-panel" style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(17, 24, 39, 0.8) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Solar Heat Cut
            </span>
            <span className="badge badge-amber" style={{ fontSize: '0.62rem' }}>
              Passive
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {solar.heat_gain_reduction}%
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--amber-light)' }}>reduction</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Building B2 oriented at -18°
          </div>
        </div>

      </div>

      {/* AI Recommendations Panel (Exact strings from TODO Contract) */}
      <div className="glass-panel" style={{ padding: '1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            AI Spatial Recommendations
          </h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Autodesk Forma Ready
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {recommendations.map((recText, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                padding: '0.65rem 0.8rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--cyan-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                flexShrink: 0,
                marginTop: '1px'
              }}>
                {idx + 1}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                {recText}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Forma Interventions (Push to Autodesk Forma Canvas) */}
      <div className="glass-panel" style={{ padding: '1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-primary)" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Apply Interventions to Forma Canvas
          </h4>
          <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>
            Interactive
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {interventions.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.9rem',
                background: 'rgba(15, 23, 42, 0.65)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flex: '1 1 200px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.15rem' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                  {item.description}
                </div>
              </div>

              <button
                onClick={() => onApplyIntervention(item)}
                className="btn btn-primary btn-sm"
                style={{ flexShrink: 0 }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Apply to Forma
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
