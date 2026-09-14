import React from 'react';
import { Sun, ArrowDownRight } from 'lucide-react';
import { SolarAnalysisResult } from '../types/analysis';

interface SolarPanelProps {
  solar: SolarAnalysisResult;
}

export const SolarPanel: React.FC<SolarPanelProps> = ({ solar }) => {
  const isOptimal = solar.estimated_irradiance <= 500;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Sun size={18} style={{ color: '#f59e0b' }} />
          <span>Solar Façade Screening</span>
        </div>
        <span className={`badge ${isOptimal ? 'badge-emerald' : 'badge-amber'}`}>
          {solar.status}
        </span>
      </div>

      {/* Main Metric Hero */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Peak Direct Solar Irradiance
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: isOptimal ? '#10b981' : '#f59e0b', fontFamily: 'var(--font-mono)' }}>
              {Math.round(solar.estimated_irradiance)}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>W/m²</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'line-through' }}>
              ({solar.baseline_irradiance} W/m²)
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Façade Relief</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#10b981', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
            <ArrowDownRight size={18} />
            <span>-{solar.total_reduction_percent}%</span>
          </div>
        </div>
      </div>

      {/* Before / After Bar */}
      <div style={{ marginBottom: '1.1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
          <span>Thermal Load Target (&lt; 500 W/m²)</span>
          <span>{Math.round(solar.estimated_irradiance)} / 710 W/m² Baseline</span>
        </div>
        <div className="metric-bar-bg" style={{ height: '10px' }}>
          <div 
            className="metric-bar-fill" 
            style={{ 
              width: `${Math.min(100, Math.max(15, (solar.estimated_irradiance / 710) * 100))}%`,
              background: isOptimal 
                ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
            }}
          />
        </div>
      </div>

      {/* Mitigation Component Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.75rem', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Orientation Relief (θ)</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fcd34d', fontFamily: 'var(--font-mono)' }}>
            -{solar.orientation_relief_percent}% <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>({solar.orientation_offset_deg}°)</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Louver Shading (d)</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fb923c', fontFamily: 'var(--font-mono)' }}>
            -{solar.louver_relief_percent}% <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>({solar.louver_depth_m}m)</span>
          </div>
        </div>
      </div>

      <div className="disclaimer-text">
        <Sun size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
        {solar.disclaimer}
      </div>
    </div>
  );
};
