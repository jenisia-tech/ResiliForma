import React from 'react';
import { Volume2, ArrowDownRight, Activity } from 'lucide-react';
import { NoiseAnalysisResult } from '../types/analysis';

interface NoisePanelProps {
  noise: NoiseAnalysisResult;
}

export const NoisePanel: React.FC<NoisePanelProps> = ({ noise }) => {
  const isOptimal = noise.optimized_noise_db <= 65;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Volume2 size={18} style={{ color: '#ef4444' }} />
          <span>Road Noise Screening</span>
        </div>
        <span className={`badge ${isOptimal ? 'badge-emerald' : 'badge-amber'}`}>
          {noise.status}
        </span>
      </div>

      {/* Main Metric Hero */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Façade Sound Pressure Level
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: isOptimal ? '#10b981' : '#f59e0b', fontFamily: 'var(--font-mono)' }}>
              {noise.optimized_noise_db}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>dBA</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'line-through' }}>
              ({noise.baseline_db} dBA)
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Reduction</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#10b981', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
            <ArrowDownRight size={18} />
            <span>{noise.total_reduction_db} dB</span>
          </div>
        </div>
      </div>

      {/* Before / After Horizontal Comparison Bar */}
      <div style={{ marginBottom: '1.1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
          <span>Acoustic Profile Target (&lt; 65 dBA)</span>
          <span>{noise.optimized_noise_db} / 80 dBA Max</span>
        </div>
        <div className="metric-bar-bg" style={{ height: '10px' }}>
          <div 
            className="metric-bar-fill" 
            style={{ 
              width: `${Math.min(100, Math.max(10, (noise.optimized_noise_db / 80) * 100))}%`,
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
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Acoustic Berm (3.1 dB/m)</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#c7d2fe', fontFamily: 'var(--font-mono)' }}>
            -{noise.barrier_attenuation_db} dB <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>({noise.barrier_height_m}m)</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Vegetation Buffer (0.52 dB/m)</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
            -{noise.vegetation_attenuation_db} dB <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>({noise.vegetation_depth_m}m)</span>
          </div>
        </div>
      </div>

      <div className="disclaimer-text">
        <Activity size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
        {noise.disclaimer}
      </div>
    </div>
  );
};
