import React from 'react';
import { Volume2Icon, SunIcon, WavesIcon, CompassIcon, ArrowUpRightIcon } from './icons';

import type { PageRoute } from '../types';

interface AnalysisCardProps {
  onNavigateToDetail?: (page: PageRoute) => void;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ onNavigateToDetail }) => {
  return (
    <div className="rf-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Analysis Overview</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Baseline vs. Prototype Simulation (Estimated Demo Data)
          </span>
        </div>
        <span className="rf-badge rf-badge-cyan">Prototype Metrics</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {/* ACOUSTIC ANALYSIS ITEM */}
        <div 
          onClick={() => onNavigateToDetail?.('acoustic-analysis')}
          className="rf-card rf-card-interactive" 
          style={{ background: 'var(--bg-card-muted)', padding: '1rem', border: '1px solid var(--border-card)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan-light)', fontSize: '0.8rem', fontWeight: 600 }}>
              <Volume2Icon size={16} /> Acoustic Analysis
            </div>
            <ArrowUpRightIcon size={14} color="var(--text-muted)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Before</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>78 dB</span>
            </div>
            <span style={{ color: 'var(--cyan-light)', fontWeight: 700 }}>→</span>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Est. After</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>~63 dB</span>
            </div>
            <span className="rf-badge rf-badge-cyan" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>
              ~15 dB (Demo Est.)
            </span>
          </div>

          <div className="rf-progress-track">
            <div className="rf-progress-fill" style={{ width: '81%', background: 'linear-gradient(90deg, #0284c7, #06b6d4)' }} />
          </div>
        </div>

        {/* SOLAR ANALYSIS ITEM */}
        <div 
          onClick={() => onNavigateToDetail?.('solar-analysis')}
          className="rf-card rf-card-interactive" 
          style={{ background: 'var(--bg-card-muted)', padding: '1rem', border: '1px solid var(--border-card)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--amber-light)', fontSize: '0.8rem', fontWeight: 600 }}>
              <SunIcon size={16} /> Solar Analysis
            </div>
            <ArrowUpRightIcon size={14} color="var(--text-muted)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Exposure</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>82%</span>
            </div>
            <span style={{ color: 'var(--amber-light)', fontWeight: 700 }}>→</span>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Est. Cut</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>~30%</span>
            </div>
            <span className="rf-badge rf-badge-amber" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>
              ~534 kWh/m² (Demo Est.)
            </span>
          </div>

          <div className="rf-progress-track">
            <div className="rf-progress-fill" style={{ width: '70%', background: 'linear-gradient(90deg, #d97706, #f59e0b)' }} />
          </div>
        </div>

        {/* HYDROLOGY ITEM */}
        <div 
          onClick={() => onNavigateToDetail?.('hydrology')}
          className="rf-card rf-card-interactive" 
          style={{ background: 'var(--bg-card-muted)', padding: '1rem', border: '1px solid var(--border-card)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--blue-light)', fontSize: '0.8rem', fontWeight: 600 }}>
              <WavesIcon size={16} /> Hydrology
            </div>
            <ArrowUpRightIcon size={14} color="var(--text-muted)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Est. Runoff Handling</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>~82%</span>
            </div>
            <span className="rf-badge rf-badge-blue" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>
              Demo Infiltration Est.
            </span>
          </div>

          <div className="rf-progress-track">
            <div className="rf-progress-fill" style={{ width: '82%', background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)' }} />
          </div>
        </div>

        {/* ACCESSIBILITY ITEM */}
        <div 
          onClick={() => onNavigateToDetail?.('site-analysis')}
          className="rf-card rf-card-interactive" 
          style={{ background: 'var(--bg-card-muted)', padding: '1rem', border: '1px solid var(--border-card)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-light)', fontSize: '0.8rem', fontWeight: 600 }}>
              <CompassIcon size={16} /> Access & Mobility
            </div>
            <ArrowUpRightIcon size={14} color="var(--text-muted)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Nearest Essential Facility</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>~8 min</span>
            </div>
            <span className="rf-badge rf-badge-emerald" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>
              Est. Demo Value
            </span>
          </div>

          <div className="rf-progress-track">
            <div className="rf-progress-fill" style={{ width: '94%', background: 'linear-gradient(90deg, #059669, #10b981)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
