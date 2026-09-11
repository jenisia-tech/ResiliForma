import React, { useState } from 'react';
import type { 
  SiteInfoData, 
  KPIItem, 
  ResilienceBreakdown, 
  PlanningMode, 
  RecommendationItem,
  PageRoute 
} from '../types';
import { KPICard } from '../components/KPICard';
import { ModeSelector } from '../components/ModeSelector';
import { SiteVisualization } from '../components/SiteVisualization';
import { ResilienceScore } from '../components/ResilienceScore';
import { RecommendationCard } from '../components/RecommendationCard';
import { AnalysisCard } from '../components/AnalysisCard';
import { FormaStatus } from '../components/FormaStatus';
import { 
  SparklesIcon, 
  SlidersIcon, 
  RefreshCwIcon, 
  UploadIcon, 
  ArrowUpRightIcon 
} from '../components/icons';

interface DashboardProps {
  siteInfo: SiteInfoData;
  kpis: KPIItem[];
  breakdown: ResilienceBreakdown;
  mode: PlanningMode;
  onSelectMode: (mode: PlanningMode) => void;
  recommendations: RecommendationItem[];
  onNavigate: (page: PageRoute) => void;
  onAnalyzeSite: () => void;
  onImportSiteClick: () => void;
  isAnalyzing: boolean;
  onApplyRecommendation: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  siteInfo,
  kpis,
  breakdown,
  mode,
  onSelectMode,
  recommendations,
  onNavigate,
  onAnalyzeSite,
  onImportSiteClick,
  isAnalyzing,
  onApplyRecommendation
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  const handleGenerateOptimizedPlan = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationComplete(true);
    }, 1500);
  };

  const filteredRecommendations = recommendations.filter(
    rec => rec.mode === 'both' || rec.mode === mode
  ).slice(0, 4);

  return (
    <div className="page-container">
      {/* 1. SITE SELECTOR & QUICK ACTIONS HERO CARD */}
      <div 
        className="rf-card"
        style={{
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 23, 38, 0.95) 100%)',
          border: '1px solid var(--border-highlight)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="rf-badge rf-badge-cyan">Active Planning Context</span>
              <span className="rf-badge rf-badge-amber">Demo Data</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', margin: 0 }}>
              {siteInfo.name}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
              Location: <strong>{siteInfo.location}</strong> • Area: <strong>{siteInfo.areaHectares} ha</strong> • Buildings: <strong>{siteInfo.buildingCount}</strong> • Terrain: <strong>{siteInfo.terrainType}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onAnalyzeSite}
              disabled={isAnalyzing}
              className="rf-btn rf-btn-primary"
            >
              <RefreshCwIcon size={16} className={isAnalyzing ? 'animate-spin-fast' : ''} />
              <span>{isAnalyzing ? 'Recalculating...' : 'Analyze Site'}</span>
            </button>
            <button
              onClick={onImportSiteClick}
              className="rf-btn rf-btn-secondary"
            >
              <UploadIcon size={16} />
              <span>Import Site</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MODE SELECTOR (URBAN VS RURAL) */}
      <ModeSelector currentMode={mode} onSelectMode={onSelectMode} />

      {/* 3. KPI CARDS */}
      <div className="kpi-grid">
        {kpis.map(kpi => (
          <KPICard 
            key={kpi.id} 
            kpi={kpi} 
            onClick={() => {
              if (kpi.id === 'kpi-noise') onNavigate('acoustic-analysis');
              else if (kpi.id === 'kpi-solar') onNavigate('solar-analysis');
              else if (kpi.id === 'kpi-runoff') onNavigate('hydrology');
              else onNavigate('site-analysis');
            }} 
          />
        ))}
      </div>

      {/* 4. SITE OVERVIEW & RESILIENCE SCORE (GRID) */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Conceptual Site Visualization */}
        <div className="col-8">
          <SiteVisualization mode={mode} />
        </div>

        {/* Resilience Score Gauge Card */}
        <div className="col-4">
          <ResilienceScore breakdown={breakdown} />
        </div>
      </div>

      {/* 5. ANALYSIS OVERVIEW & MULTI-OBJECTIVE OPTIMIZATION SIMULATOR */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        {/* Analysis Overview */}
        <div className="col-7">
          <AnalysisCard onNavigateToDetail={onNavigate} />
        </div>

        {/* Multi-Objective Optimization Panel */}
        <div className="col-5">
          <div className="rf-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  color: 'var(--purple-light)'
                }}>
                  <SlidersIcon size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Multi-Objective Optimization</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Prototype Simulation Engine
                  </span>
                </div>
              </div>
              <span className="rf-badge rf-badge-purple">Prototype Pareto Model</span>
            </div>

            {/* Objective Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Noise Reduction (Acoustic Berms)</span>
                  <span style={{ fontWeight: 700, color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}>~90% (Est.)</span>
                </div>
                <div className="rf-progress-track">
                  <div className="rf-progress-fill" style={{ width: '90%', background: 'var(--cyan-primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Solar Reduction (Orientation & Louvers)</span>
                  <span style={{ fontWeight: 700, color: 'var(--amber-light)', fontFamily: 'var(--font-mono)' }}>~82% (Est.)</span>
                </div>
                <div className="rf-progress-track">
                  <div className="rf-progress-fill" style={{ width: '82%', background: 'var(--amber-primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Water Management (Bioswales & Basin)</span>
                  <span style={{ fontWeight: 700, color: 'var(--blue-light)', fontFamily: 'var(--font-mono)' }}>~84% (Est.)</span>
                </div>
                <div className="rf-progress-track">
                  <div className="rf-progress-fill" style={{ width: '84%', background: 'var(--blue-primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Accessibility (All-Weather Paths)</span>
                  <span style={{ fontWeight: 700, color: 'var(--emerald-light)', fontFamily: 'var(--font-mono)' }}>~94% (Est.)</span>
                </div>
                <div className="rf-progress-track">
                  <div className="rf-progress-fill" style={{ width: '94%', background: 'var(--emerald-primary)' }} />
                </div>
              </div>
            </div>

            {/* Simulation Trigger & Info */}
            <div style={{ marginTop: 'auto' }}>
              <div style={{
                padding: '0.6rem 0.75rem',
                background: 'var(--bg-card-muted)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.75rem',
                border: '1px solid var(--border-card)'
              }}>
                {optimizationComplete ? (
                  <span style={{ color: 'var(--emerald-light)', fontWeight: 600 }}>
                    ✓ Prototype plan generated: Candidate A selected with estimated 88/100 composite resilience.
                  </span>
                ) : (
                  <span>
                    Simulates non-dominated sorting across acoustic, solar, hydrology, and access constraints.
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleGenerateOptimizedPlan}
                  disabled={isOptimizing}
                  className="rf-btn rf-btn-primary"
                  style={{ flex: 1 }}
                >
                  <SparklesIcon size={16} className={isOptimizing ? 'animate-spin-fast' : ''} />
                  <span>{isOptimizing ? 'Simulating Pareto Front...' : 'Generate Prototype Plan'}</span>
                </button>
                <button
                  onClick={() => onNavigate('optimization')}
                  className="rf-btn rf-btn-secondary"
                  title="Configure Optimizer Weights"
                >
                  <ArrowUpRightIcon size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. AI RECOMMENDATIONS PANEL */}
      <div className="rf-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--cyan-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SparklesIcon size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>ResiliForma Recommendations</h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                AI-Generated Climate Adaptive Interventions ({filteredRecommendations.length} active)
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('recommendations')}
            className="rf-btn rf-btn-outline-cyan"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <span>View All Recommendations</span>
            <ArrowUpRightIcon size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          {filteredRecommendations.map(rec => (
            <RecommendationCard 
              key={rec.id} 
              recommendation={rec} 
              onApply={onApplyRecommendation}
            />
          ))}
        </div>
      </div>

      {/* 7. AUTODESK FORMA CONNECTION FOOTER BANNER */}
      <FormaStatus />
    </div>
  );
};
