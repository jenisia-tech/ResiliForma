import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SiteOverview } from './components/SiteOverview';
import { ProposalSelector } from './components/ProposalSelector';
import { SpatialCanvas } from './components/SpatialCanvas';
import { DesignControls } from './components/DesignControls';
import { NoisePanel } from './components/NoisePanel';
import { SolarPanel } from './components/SolarPanel';
import { StormwaterPanel } from './components/StormwaterPanel';
import { ResilienceScore } from './components/ResilienceScore';
import { ComparisonPanel } from './components/ComparisonPanel';
import { MethodologyPanel } from './components/MethodologyPanel';
import { FormaIntegrationPanel } from './components/FormaIntegrationPanel';

import {
  SiteAnalysisRequest,
  SiteAnalysisResponse,
  DemoSiteInfo,
  ProposalCompareResponse
} from './types/analysis';
import {
  fetchDemoSite,
  analyzeSite,
  compareProposals,
  checkBackendHealth
} from './services/api';
import {
  DEMO_SITE_DATA,
  BASELINE_PARAMETERS,
  RESILIENT_PARAMETERS
} from './integrations/forma/demoFormaAdapter';

export const App: React.FC = () => {
  const [siteInfo, setSiteInfo] = useState<DemoSiteInfo>(DEMO_SITE_DATA);
  const [selectedProposal, setSelectedProposal] = useState<'baseline' | 'resilient'>('baseline');
  const [parameters, setParameters] = useState<SiteAnalysisRequest>(BASELINE_PARAMETERS);
  const [analysis, setAnalysis] = useState<SiteAnalysisResponse | null>(null);
  const [comparisonData, setComparisonData] = useState<ProposalCompareResponse | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  // Initialize site context, backend health, and proposals
  useEffect(() => {
    async function init() {
      const isHealthy = await checkBackendHealth();
      setBackendConnected(isHealthy);

      const site = await fetchDemoSite();
      setSiteInfo(site);

      // Perform initial analysis and comparison
      const initialAnalysis = await analyzeSite(BASELINE_PARAMETERS);
      setAnalysis(initialAnalysis);

      const comp = await compareProposals(BASELINE_PARAMETERS, RESILIENT_PARAMETERS);
      setComparisonData(comp);
    }
    init();
  }, []);

  // Recalculate analysis when parameters change
  const triggerAnalysis = useCallback(async (newParams: SiteAnalysisRequest) => {
    const res = await analyzeSite(newParams);
    setAnalysis(res);
  }, []);

  const handleParametersChange = (newParams: SiteAnalysisRequest) => {
    setParameters(newParams);
    triggerAnalysis(newParams);
  };

  const handleSelectProposal = (type: 'baseline' | 'resilient') => {
    setSelectedProposal(type);
    const newParams = type === 'baseline' ? { ...BASELINE_PARAMETERS } : { ...RESILIENT_PARAMETERS };
    setParameters(newParams);
    triggerAnalysis(newParams);
  };

  const handleResetBaseline = () => {
    handleSelectProposal('baseline');
  };

  const handleApplyResilient = () => {
    handleSelectProposal('resilient');
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header backendConnected={backendConnected} />

      {/* Hero Subtitle Banner */}
      <div style={{ padding: '0.25rem 0.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc', marginBottom: '0.25rem' }}>
          Design for resilience before detailed design.
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '900px', lineHeight: 1.45 }}>
          ResiliForma adds deterministic multi-hazard screening to early-stage Autodesk Forma workflows, helping planners compare design alternatives against road noise, solar exposure, and stormwater constraints.
        </p>
      </div>

      {/* Demonstration Site Overview */}
      <SiteOverview siteInfo={siteInfo} />

      {/* Proposal Selector Strip */}
      <ProposalSelector
        selectedProposal={selectedProposal}
        onSelectProposal={handleSelectProposal}
        compositeScore={analysis?.score.composite_score ?? (selectedProposal === 'baseline' ? 48 : 87)}
        grade={analysis?.score.grade ?? (selectedProposal === 'baseline' ? 'D' : 'A')}
      />

      {/* Main Workspace Layout */}
      {analysis && (
        <>
          <div className="grid-main">
            {/* Left Main Column: Spatial Canvas + Hazard Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <SpatialCanvas
                parameters={parameters}
                analysis={analysis}
              />

              {/* 3 Major Hazard Screening Cards */}
              <div className="grid-panels">
                <NoisePanel noise={analysis.noise} />
                <SolarPanel solar={analysis.solar} />
                <StormwaterPanel stormwater={analysis.stormwater} />
              </div>
            </div>

            {/* Right Side Column: Composite Resilience Score + Design Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <ResilienceScore
                score={analysis.score}
                selectedProposal={selectedProposal}
              />
              <DesignControls
                parameters={parameters}
                onChange={handleParametersChange}
                onResetBaseline={handleResetBaseline}
                onApplyResilient={handleApplyResilient}
              />
            </div>
          </div>

          {/* Proposal Side-by-Side Comparison Section */}
          <ComparisonPanel comparisonData={comparisonData} />

          {/* Screening Methodology Pipeline */}
          <MethodologyPanel />

          {/* Autodesk Forma Integration Architecture & Verification Checklist */}
          <FormaIntegrationPanel />
        </>
      )}

      {/* Professional Disclaimers Footer */}
      <footer className="footer-disclaimer">
        <p style={{ marginBottom: '0.35rem' }}>
          <strong>SIH26114 Submission Prototype:</strong> ResiliForma is a supplementary early-stage decision-support screening extension concept for Autodesk Forma.
        </p>
        <p>
          Detailed engineering verification should be performed using appropriate native Autodesk Forma analyses, Revit BIM workflows, and certified engineering modeling.
        </p>
      </footer>
    </div>
  );
};
