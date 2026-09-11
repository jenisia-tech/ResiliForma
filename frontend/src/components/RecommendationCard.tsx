import React from 'react';
import type { RecommendationItem } from '../types';
import { ShieldCheckIcon, TreeIcon, SunIcon, WavesIcon, CompassIcon, ZapIcon, CheckCircle2Icon } from './icons';

interface RecommendationCardProps {
  recommendation: RecommendationItem;
  onApply?: (id: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onApply
}) => {
  const getIcon = () => {
    switch (recommendation.iconType) {
      case 'barrier':
        return <ShieldCheckIcon size={18} color="var(--cyan-light)" />;
      case 'tree':
        return <TreeIcon size={18} color="var(--emerald-light)" />;
      case 'sun':
        return <SunIcon size={18} color="var(--amber-light)" />;
      case 'water':
        return <WavesIcon size={18} color="var(--blue-light)" />;
      case 'zap':
        return <ZapIcon size={18} color="var(--amber-light)" />;
      case 'road':
      default:
        return <CompassIcon size={18} color="var(--purple-light)" />;
    }
  };

  const getPriorityBadge = () => {
    switch (recommendation.priority) {
      case 'high':
        return <span className="rf-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>High Priority</span>;
      case 'medium':
        return <span className="rf-badge rf-badge-amber">Medium Priority</span>;
      case 'low':
      default:
        return <span className="rf-badge rf-badge-muted">Low Priority</span>;
    }
  };

  return (
    <div className="rf-card" style={{ padding: '1rem 1.15rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {getIcon()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h5 style={{ fontSize: '0.88rem', color: '#ffffff', margin: 0 }}>{recommendation.title}</h5>
              <span className="rf-badge rf-badge-cyan" style={{ fontSize: '0.65rem' }}>
                {recommendation.category}
              </span>
            </div>
          </div>
        </div>

        <div>{getPriorityBadge()}</div>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0.6rem 2.6rem', lineHeight: '1.4' }}>
        {recommendation.explanation}
      </p>

      <div style={{
        marginLeft: '2.6rem',
        padding: '0.4rem 0.65rem',
        background: 'var(--bg-card-muted)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.74rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-light)', fontWeight: 600 }}>
          <CheckCircle2Icon size={14} />
          <span>Impact: {recommendation.impact}</span>
        </div>

        {onApply && (
          <button 
            onClick={() => onApply(recommendation.id)}
            className="rf-btn rf-btn-ghost"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
          >
            {recommendation.status === 'applied' ? 'Applied ✓' : 'Apply to Model'}
          </button>
        )}
      </div>
    </div>
  );
};
