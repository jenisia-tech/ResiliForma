import React from 'react';
import { Award, TrendingUp, HelpCircle } from 'lucide-react';
import { ResilienceScoreResult } from '../types/analysis';

interface ResilienceScoreProps {
  score: ResilienceScoreResult;
  selectedProposal?: 'baseline' | 'resilient';
}

export const ResilienceScore: React.FC<ResilienceScoreProps> = ({ score }) => {
  const isResilient = score.composite_score >= 85;

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.8) 100%)' }}>
      <div className="card-header">
        <div className="card-title">
          <Award size={18} style={{ color: score.status_color }} />
          <span>Composite Resilience Score</span>
        </div>
        <span className="badge" style={{ background: `${score.status_color}20`, color: score.status_color, border: `1px solid ${score.status_color}50` }}>
          GRADE {score.grade}
        </span>
      </div>

      {/* Main Score Hero */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0.5rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <span style={{ fontSize: '3.25rem', fontWeight: 800, color: score.status_color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            {score.composite_score}
          </span>
          <span style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 600 }}>/100</span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
            {score.grade_label}
          </div>
          {isResilient ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.25rem' }}>
              <TrendingUp size={14} /> +39 pts vs Baseline
            </div>
          ) : (
            <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.25rem' }}>
              Requires Mitigation
            </div>
          )}
        </div>
      </div>

      {/* Category Weighted Sub-Score Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
            <span style={{ color: '#94a3b8' }}>Road Noise Attenuation (30% weight)</span>
            <span className="font-mono" style={{ fontWeight: 600, color: '#c7d2fe' }}>{score.sub_scores.noise} / 100</span>
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${score.sub_scores.noise}%`, background: '#818cf8' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
            <span style={{ color: '#94a3b8' }}>Solar Façade Relief (25% weight)</span>
            <span className="font-mono" style={{ fontWeight: 600, color: '#fcd34d' }}>{score.sub_scores.solar} / 100</span>
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${score.sub_scores.solar}%`, background: '#f59e0b' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
            <span style={{ color: '#94a3b8' }}>Stormwater Retention (25% weight)</span>
            <span className="font-mono" style={{ fontWeight: 600, color: '#7dd3fc' }}>{score.sub_scores.stormwater} / 100</span>
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${score.sub_scores.stormwater}%`, background: '#38bdf8' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
            <span style={{ color: '#94a3b8' }}>Urban Pedestrian Accessibility (10% weight)</span>
            <span className="font-mono" style={{ fontWeight: 600, color: '#34d399' }}>{score.sub_scores.accessibility} / 100</span>
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${score.sub_scores.accessibility}%`, background: '#10b981' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
            <span style={{ color: '#94a3b8' }}>Green Infrastructure & Land Use (10% weight)</span>
            <span className="font-mono" style={{ fontWeight: 600, color: '#a78bfa' }}>{score.sub_scores.land_efficiency} / 100</span>
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${score.sub_scores.land_efficiency}%`, background: '#a855f7' }} />
          </div>
        </div>
      </div>

      <div className="disclaimer-text">
        <HelpCircle size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
        {score.disclaimer}
      </div>
    </div>
  );
};
