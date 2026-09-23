import React from 'react';
import { Volume2, ArrowDownRight, Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { NoiseAnalysisResult } from '../types/analysis';

interface NoisePanelProps {
  noise: NoiseAnalysisResult;
}

export const NoisePanel: React.FC<NoisePanelProps> = ({ noise }) => {
  const isOptimal = noise.optimized_noise_db <= 65;

  return (
    <div className="card hazard-panel-card">
      <div>
        {/* Uniform Header */}
        <div className="card-header" style={{ minHeight: '42px' }}>
          <div className="card-title" style={{ fontSize: '1rem' }}>
            <Volume2 size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span>Road Noise Screening</span>
          </div>
          <span className={`badge ${isOptimal ? 'badge-emerald' : 'badge-amber'}`} style={{ whiteSpace: 'nowrap' }}>
            {isOptimal ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
            <span>{isOptimal ? '< 65 dBA Target' : 'High Exposure'}</span>
          </span>
        </div>

        {/* Main Metric Hero Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', minHeight: '52px' }}>
          <div>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Façade Sound Pressure Level
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: isOptimal ? '#10b981' : '#f87171', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                {noise.optimized_noise_db}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>dBA</span>
              <span style={{ fontSize: '0.775rem', color: '#64748b', textDecoration: 'line-through' }}>
                ({noise.baseline_db} dBA)
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Shielding</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.15rem', color: '#10b981', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
              <ArrowDownRight size={16} />
              <span>{noise.total_reduction_db > 0 ? `-${noise.total_reduction_db}` : '0.0'} dB</span>
            </div>
          </div>
        </div>

        {/* Horizontal Progress / Benchmark Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
            <span>CPCB India Target: <strong>&le; 65 dBA</strong></span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{noise.optimized_noise_db} / 80 dBA</span>
          </div>
          <div className="metric-bar-bg" style={{ height: '8px' }}>
            <div 
              className="metric-bar-fill" 
              style={{ 
                width: `${Math.min(100, Math.max(12, (noise.optimized_noise_db / 80) * 100))}%`,
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
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Acoustic Berm (3.1 dB/m)</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#c7d2fe', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
              -{noise.barrier_attenuation_db} dB <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 400 }}>({noise.barrier_height_m}m)</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Dense Buffer (0.52 dB/m)</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
              -{noise.vegetation_attenuation_db} dB <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 400 }}>({noise.vegetation_depth_m}m)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="disclaimer-text" style={{ marginTop: '0.85rem' }}>
        <Activity size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
        {noise.disclaimer}
      </div>
    </div>
  );
};
