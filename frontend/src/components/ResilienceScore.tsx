import React from 'react';
import type { ResilienceBreakdown } from '../types';
import { ShieldCheckIcon, Volume2Icon, SunIcon, WavesIcon, CompassIcon } from './icons';

interface ResilienceScoreProps {
  breakdown: ResilienceBreakdown;
}

export const ResilienceScore: React.FC<ResilienceScoreProps> = ({ breakdown }) => {
  const radius = 64;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (breakdown.overallScore / 100) * circumference;

  return (
    <div className="rf-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--emerald-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheckIcon size={18} />
          </div>
          <h4 style={{ fontSize: '1rem', margin: 0, color: '#ffffff' }}>Resilience Score</h4>
        </div>
        <span className="rf-badge rf-badge-emerald">Composite Index</span>
      </div>

      {/* Main Radial Progress Gauge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.75rem', margin: '0.5rem 0 1.5rem' }}>
        <div style={{ position: 'relative', width: '136px', height: '136px' }}>
          <svg height="136" width="136" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              stroke="rgba(255, 255, 255, 0.07)"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx="68"
              cy="68"
            />
            <circle
              stroke="url(#emeraldCyanGrad)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx="68"
              cy="68"
            />
            <defs>
              <linearGradient id="emeraldCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {breakdown.overallScore}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              / 100
            </span>
          </div>
        </div>

        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--emerald-light)',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '0.5rem'
          }}>
            <ShieldCheckIcon size={16} />
            {breakdown.ratingLabel}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '180px', margin: 0, lineHeight: 1.4 }}>
            Multi-hazard performance evaluated across noise, heat, flood, and connectivity.
          </p>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
        {/* Acoustic */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <Volume2Icon size={14} color="var(--cyan-light)" /> Acoustic Resilience
            </span>
            <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{breakdown.acousticScore}%</span>
          </div>
          <div className="rf-progress-track">
            <div className="rf-progress-fill" style={{ width: `${breakdown.acousticScore}%`, background: 'var(--cyan-primary)' }} />
          </div>
        </div>

        {/* Solar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <SunIcon size={14} color="var(--amber-light)" /> Solar Resilience
            </span>
            <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{breakdown.solarScore}%</span>
          </div>
          <div className="rf-progress-track">
            <div className="rf-progress-fill" style={{ width: `${breakdown.solarScore}%`, background: 'var(--amber-primary)' }} />
          </div>
        </div>

        {/* Water */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <WavesIcon size={14} color="var(--blue-light)" /> Water Resilience
            </span>
            <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{breakdown.waterScore}%</span>
          </div>
          <div className="rf-progress-track">
            <div className="rf-progress-fill" style={{ width: `${breakdown.waterScore}%`, background: 'var(--blue-primary)' }} />
          </div>
        </div>

        {/* Accessibility */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <CompassIcon size={14} color="var(--emerald-light)" /> Accessibility
            </span>
            <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{breakdown.accessibilityScore}%</span>
          </div>
          <div className="rf-progress-track">
            <div className="rf-progress-fill" style={{ width: `${breakdown.accessibilityScore}%`, background: 'var(--emerald-primary)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
