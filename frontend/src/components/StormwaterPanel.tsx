import React from 'react';
import { Droplets, ArrowDownRight, Waves, ShieldCheck, AlertCircle } from 'lucide-react';
import { StormwaterAnalysisResult } from '../types/analysis';

interface StormwaterPanelProps {
  stormwater: StormwaterAnalysisResult;
}

export const StormwaterPanel: React.FC<StormwaterPanelProps> = ({ stormwater }) => {
  const isResilient = stormwater.runoff_management_percent >= 75;

  return (
    <div className="card hazard-panel-card">
      <div>
        {/* Uniform Header */}
        <div className="card-header" style={{ minHeight: '42px' }}>
          <div className="card-title" style={{ fontSize: '1rem' }}>
            <Droplets size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />
            <span>Stormwater Runoff Screening</span>
          </div>
          <span className={`badge ${isResilient ? 'badge-emerald' : 'badge-amber'}`} style={{ whiteSpace: 'nowrap' }}>
            {isResilient ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
            <span>{isResilient ? '≥ 75% SuDS Target' : 'Runoff Risk'}</span>
          </span>
        </div>

        {/* Main Metric Hero Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', minHeight: '52px' }}>
          <div>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Runoff Retention & Management
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: isResilient ? '#10b981' : '#f59e0b', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                {stormwater.runoff_management_percent}%
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Retained</span>
              <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
                ({stormwater.mitigated_volume_m3.toLocaleString()} m³)
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Rational Peak (Q_peak)</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.15rem', color: '#38bdf8', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
              <span>{stormwater.peak_runoff_m3s}</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>m³/s</span>
            </div>
          </div>
        </div>

        {/* Horizontal Progress / Benchmark Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
            <span>MoHUA / SuDS Target: <strong>&ge; 75% Retention</strong></span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{stormwater.runoff_management_percent}% / 100%</span>
          </div>
          <div className="metric-bar-bg" style={{ height: '8px' }}>
            <div 
              className="metric-bar-fill" 
              style={{ 
                width: `${Math.min(100, Math.max(10, stormwater.runoff_management_percent))}%`,
                background: isResilient 
                  ? 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)' 
                  : 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
              }}
            />
          </div>
        </div>

        {/* Mitigation Component Breakdown 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', padding: '0.75rem', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', minHeight: '62px' }}>
          <div>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Infiltration Bioswales</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#7dd3fc', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
              {stormwater.bioswale_length_m > 0 ? `${stormwater.bioswale_length_m}m Network` : '0m (None)'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Retention Basin</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
              {stormwater.retention_capacity_m3 > 0 ? `${stormwater.retention_capacity_m3.toLocaleString()} m³` : '0 m³ (None)'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="disclaimer-text" style={{ marginTop: '0.85rem' }}>
        <Waves size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
        {stormwater.disclaimer}
      </div>
    </div>
  );
};
