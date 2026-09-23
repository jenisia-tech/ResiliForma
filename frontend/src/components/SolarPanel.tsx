import React from 'react';
import { Sun, ArrowDownRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { SolarAnalysisResult } from '../types/analysis';

interface SolarPanelProps {
  solar: SolarAnalysisResult;
}

export const SolarPanel: React.FC<SolarPanelProps> = ({ solar }) => {
  const isOptimal = solar.estimated_irradiance <= 500;

  return (
    <div className="card hazard-panel-card">
      <div>
        {/* Uniform Header */}
        <div className="card-header" style={{ minHeight: '42px' }}>
          <div className="card-title" style={{ fontSize: '1rem' }}>
            <Sun size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <span>Solar Façade Screening</span>
          </div>
          <span className={`badge ${isOptimal ? 'badge-emerald' : 'badge-amber'}`} style={{ whiteSpace: 'nowrap' }}>
            {isOptimal ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
            <span>{isOptimal ? '< 500 W/m² Target' : 'High Solar Gain'}</span>
          </span>
        </div>

        {/* Main Metric Hero Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', minHeight: '52px' }}>
          <div>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Peak Direct Solar Irradiance
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: isOptimal ? '#10b981' : '#f59e0b', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                {Math.round(solar.estimated_irradiance)}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>W/m²</span>
              <span style={{ fontSize: '0.775rem', color: '#64748b', textDecoration: 'line-through' }}>
                ({solar.baseline_irradiance} W/m²)
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Façade Relief</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.15rem', color: '#10b981', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
              <ArrowDownRight size={16} />
              <span>{solar.total_reduction_percent > 0 ? `-${solar.total_reduction_percent}` : '0.0'}%</span>
            </div>
          </div>
        </div>

        {/* Horizontal Progress / Benchmark Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
            <span>NBC / ECBC Envelope: <strong>&le; 500 W/m²</strong></span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(solar.estimated_irradiance)} / 750 W/m²</span>
          </div>
          <div className="metric-bar-bg" style={{ height: '8px' }}>
            <div 
              className="metric-bar-fill" 
              style={{ 
                width: `${Math.min(100, Math.max(12, (solar.estimated_irradiance / 750) * 100))}%`,
                background: isOptimal 
                  ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
              }}
            />
          </div>
        </div>

        {/* Mitigation Component Breakdown 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', padding: '0.75rem', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', minHeight: '62px' }}>
          <div>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Orientation Relief (θ)</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fcd34d', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
              -{solar.orientation_relief_percent}% <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 400 }}>({solar.orientation_offset_deg}°)</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Louver Shading (d)</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fb923c', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
              -{solar.louver_relief_percent}% <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 400 }}>({solar.louver_depth_m}m)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="disclaimer-text" style={{ marginTop: '0.85rem' }}>
        <Sun size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
        {solar.disclaimer}
      </div>
    </div>
  );
};
