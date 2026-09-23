import React from 'react';
import { ShieldCheck, AlertTriangle, ArrowRight, FileText } from 'lucide-react';

interface ProposalSelectorProps {
  selectedProposal: 'baseline' | 'resilient';
  onSelectProposal: (proposal: 'baseline' | 'resilient') => void;
  compositeScore: number;
  grade: string;
  onOpenReviewAudit?: () => void;
  deltaScore?: number;
}

export const ProposalSelector: React.FC<ProposalSelectorProps> = ({
  selectedProposal,
  onSelectProposal,
  compositeScore,
  grade,
  onOpenReviewAudit,
  deltaScore = 39
}) => {
  return (
    <div className="card" style={{ padding: '0.85rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Proposal:
          </span>
          <div style={{ display: 'inline-flex', background: '#0b1120', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              className="btn"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.825rem',
                borderRadius: '6px',
                background: selectedProposal === 'baseline' ? '#334155' : 'transparent',
                color: selectedProposal === 'baseline' ? '#f8fafc' : '#94a3b8',
                border: selectedProposal === 'baseline' ? '1px solid rgba(255,255,255,0.15)' : 'none'
              }}
              onClick={() => onSelectProposal('baseline')}
            >
              <AlertTriangle size={14} style={{ color: '#ef4444' }} />
              Baseline Proposal
            </button>
            <button
              className="btn"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.825rem',
                borderRadius: '6px',
                background: selectedProposal === 'resilient' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'transparent',
                color: selectedProposal === 'resilient' ? '#ffffff' : '#94a3b8',
                border: selectedProposal === 'resilient' ? '1px solid rgba(16,185,129,0.4)' : 'none',
                boxShadow: selectedProposal === 'resilient' ? '0 0 12px rgba(16,185,129,0.3)' : 'none'
              }}
              onClick={() => onSelectProposal('resilient')}
            >
              <ShieldCheck size={14} style={{ color: selectedProposal === 'resilient' ? '#a7f3d0' : '#10b981' }} />
              Resilient Proposal
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Current Status: <strong style={{ color: grade === 'A' ? '#10b981' : grade === 'B' ? '#38bdf8' : '#ef4444' }}>Grade {grade} ({compositeScore}/100)</strong>
          </div>

          {onOpenReviewAudit && (
            <button 
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              onClick={onOpenReviewAudit}
            >
              <FileText size={14} style={{ color: '#38bdf8' }} />
              <span>Full Screening Audit</span>
            </button>
          )}

          {selectedProposal === 'baseline' ? (
            <button 
              className="btn btn-success" 
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
              onClick={() => onSelectProposal('resilient')}
            >
              <span>Apply Resilient Interventions</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <span className="badge badge-emerald" style={{ padding: '0.4rem 0.8rem' }}>
              +{deltaScore > 0 ? deltaScore : 39} Resilience Points Achieved
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
