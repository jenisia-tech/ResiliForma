import React, { useState } from 'react';
import { optimizationCandidates } from '../data/demoData';
import type { OptimizationCandidate } from '../types';
import { 
  SlidersIcon, 
  SparklesIcon, 
  InfoIcon, 
  CpuIcon 
} from '../components/icons';

export const Optimization: React.FC = () => {
  const [weights, setWeights] = useState({
    acoustic: 30,
    solar: 25,
    water: 20,
    access: 15,
    land: 10
  });

  const [isRunning, setIsRunning] = useState(false);
  const [solverStep, setSolverStep] = useState<string>('');
  const [candidates, setCandidates] = useState<OptimizationCandidate[]>(optimizationCandidates);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand-a');

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const handleRunOptimization = () => {
    setIsRunning(true);
    setSolverStep('Initializing multi-hazard objective functions...');

    setTimeout(() => {
      setSolverStep('Simulating 120 spatial candidate layouts (Pareto frontier)...');
    }, 600);

    setTimeout(() => {
      setSolverStep('Evaluating non-dominated acoustic, solar & hydrology trade-offs...');
    }, 1200);

    setTimeout(() => {
      setIsRunning(false);
      setSolverStep('');

      // Recalculate candidate overall scores based on weights
      const updated = candidates.map(c => {
        const weightedScore = Math.round(
          (c.scores.acoustic * weights.acoustic +
            c.scores.solar * weights.solar +
            c.scores.water * weights.water +
            c.scores.accessibility * weights.access +
            c.scores.landUtilization * weights.land) / 100
        );
        return {
          ...c,
          scores: {
            ...c.scores,
            overall: weightedScore
          }
        };
      });

      // Find highest score candidate
      const sorted = [...updated].sort((a, b) => b.scores.overall - a.scores.overall);
      const bestId = sorted[0].id;

      const finalCandidates = updated.map(c => ({
        ...c,
        isBest: c.id === bestId
      }));

      setCandidates(finalCandidates);
      setSelectedCandidateId(bestId);
    }, 1800);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="rf-badge rf-badge-purple">Pareto Optimization Simulation</span>
            <span className="rf-badge rf-badge-muted">Simulation Mode</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>Multi-Objective Site Optimization</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Balance competing disaster resilience objectives to discover optimal site-planning layouts.
          </p>
        </div>

        <button
          onClick={handleRunOptimization}
          disabled={isRunning}
          className="rf-btn rf-btn-primary"
          style={{ padding: '0.55rem 1.25rem', background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)' }}
        >
          <SparklesIcon size={16} className={isRunning ? 'animate-spin-fast' : ''} />
          <span>{isRunning ? 'Simulating Candidates...' : 'Run Simulation'}</span>
        </button>
      </div>

      {/* Mandatory Prototype Disclaimer Alert */}
      <div style={{
        padding: '0.85rem 1rem',
        background: 'rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.8rem',
        color: 'var(--purple-light)',
        marginBottom: '1.5rem'
      }}>
        <InfoIcon size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>Prototype Optimization:</strong> This interface simulates multi-objective Pareto front exploration. Real NSGA-II genetic algorithms and Autodesk Forma geometry generation will be integrated in the backend solver module.
        </span>
      </div>

      {/* Live Solver Progress Pill */}
      {isRunning && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          color: 'var(--cyan-light)',
          fontSize: '0.82rem'
        }}>
          <CpuIcon size={18} className="animate-spin-fast" />
          <span>{solverStep}</span>
        </div>
      )}

      {/* Objectives Sliders Configuration */}
      <div className="rf-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersIcon size={18} color="var(--purple-light)" />
            <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Objective Weighting Configuration</h4>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total Allocation: {weights.acoustic + weights.solar + weights.water + weights.access + weights.land}%
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          {/* Acoustic Weight */}
          <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--cyan-light)', fontWeight: 600 }}>Acoustic Resilience</span>
              <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{weights.acoustic}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weights.acoustic}
              onChange={e => handleWeightChange('acoustic', parseInt(e.target.value))}
            />
          </div>

          {/* Solar Weight */}
          <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--amber-light)', fontWeight: 600 }}>Solar Performance</span>
              <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{weights.solar}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weights.solar}
              onChange={e => handleWeightChange('solar', parseInt(e.target.value))}
            />
          </div>

          {/* Hydrology Weight */}
          <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--blue-light)', fontWeight: 600 }}>Water Management</span>
              <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{weights.water}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weights.water}
              onChange={e => handleWeightChange('water', parseInt(e.target.value))}
            />
          </div>

          {/* Accessibility Weight */}
          <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>Accessibility</span>
              <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{weights.access}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weights.access}
              onChange={e => handleWeightChange('access', parseInt(e.target.value))}
            />
          </div>

          {/* Land Utilization Weight */}
          <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--purple-light)', fontWeight: 600 }}>Land Utilization</span>
              <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{weights.land}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weights.land}
              onChange={e => handleWeightChange('land', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Candidate Solutions Comparison (Candidates A, B, C) */}
      <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1rem' }}>
        Pareto Front Candidates & Trade-Offs
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {candidates.map(candidate => (
          <div
            key={candidate.id}
            onClick={() => setSelectedCandidateId(candidate.id)}
            className="rf-card"
            style={{
              cursor: 'pointer',
              border: candidate.isBest
                ? '2px solid var(--emerald-primary)'
                : selectedCandidateId === candidate.id
                ? '2px solid var(--cyan-primary)'
                : '1px solid var(--border-card)',
              backgroundColor: candidate.isBest ? '#0d221c' : selectedCandidateId === candidate.id ? '#101d32' : 'var(--bg-card)',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Best candidate banner */}
            {candidate.isBest && (
              <div style={{
                position: 'absolute',
                top: '-11px',
                right: '16px',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)'
              }}>
                ★ Highest Composite Score
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>{candidate.name}</h4>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: candidate.isBest ? 'var(--emerald-light)' : '#ffffff', fontFamily: 'var(--font-heading)' }}>
                {candidate.scores.overall} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span>
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              {candidate.tagline}
            </p>

            {/* Score Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>Acoustic</span>
                  <span style={{ color: 'var(--cyan-light)', fontWeight: 600 }}>{candidate.scores.acoustic}%</span>
                </div>
                <div className="rf-progress-track" style={{ height: '5px' }}>
                  <div className="rf-progress-fill" style={{ width: `${candidate.scores.acoustic}%`, background: 'var(--cyan-primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>Solar</span>
                  <span style={{ color: 'var(--amber-light)', fontWeight: 600 }}>{candidate.scores.solar}%</span>
                </div>
                <div className="rf-progress-track" style={{ height: '5px' }}>
                  <div className="rf-progress-fill" style={{ width: `${candidate.scores.solar}%`, background: 'var(--amber-primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>Hydrology</span>
                  <span style={{ color: 'var(--blue-light)', fontWeight: 600 }}>{candidate.scores.water}%</span>
                </div>
                <div className="rf-progress-track" style={{ height: '5px' }}>
                  <div className="rf-progress-fill" style={{ width: `${candidate.scores.water}%`, background: 'var(--blue-primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>Accessibility</span>
                  <span style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>{candidate.scores.accessibility}%</span>
                </div>
                <div className="rf-progress-track" style={{ height: '5px' }}>
                  <div className="rf-progress-fill" style={{ width: `${candidate.scores.accessibility}%`, background: 'var(--emerald-primary)' }} />
                </div>
              </div>
            </div>

            {/* Tradeoff Summary */}
            <div style={{
              padding: '0.65rem',
              background: 'var(--bg-card-muted)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.35
            }}>
              {candidate.tradeoffSummary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
