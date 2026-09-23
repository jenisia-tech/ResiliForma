import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SiteOverview } from './components/SiteOverview';
import { UploadedImageExplanation } from './components/UploadedImageExplanation';
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
import { DesignUploadModal } from './components/DesignUploadModal';
import { DesignReviewReportModal } from './components/DesignReviewReportModal';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';

import {
  SiteAnalysisRequest,
  SiteAnalysisResponse,
  DemoSiteInfo,
  ProposalCompareResponse,
  CustomSiteDesign
} from './types/analysis';
import {
  analyzeSite,
  compareProposals,
  checkBackendHealth
} from './services/api';
import {
  PRESET_KARUNYA,
  autoGenerateResilientProposal
} from './integrations/designParser';

export const App: React.FC = () => {
  const [currentDesign, setCurrentDesign] = useState<CustomSiteDesign>(PRESET_KARUNYA);
  const [siteInfo, setSiteInfo] = useState<DemoSiteInfo>(PRESET_KARUNYA.site_info);
  const [selectedProposal, setSelectedProposal] = useState<'baseline' | 'resilient'>('baseline');
  const [parameters, setParameters] = useState<SiteAnalysisRequest>(PRESET_KARUNYA.baseline_parameters);
  const [analysis, setAnalysis] = useState<SiteAnalysisResponse | null>(null);
  const [comparisonData, setComparisonData] = useState<ProposalCompareResponse | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Initialize site context, backend health, and proposals
  useEffect(() => {
    async function init() {
      const isHealthy = await checkBackendHealth();
      setBackendConnected(isHealthy);

      const initialAnalysis = await analyzeSite(PRESET_KARUNYA.baseline_parameters);
      setAnalysis(initialAnalysis);

      const resilientParams = PRESET_KARUNYA.resilient_parameters || autoGenerateResilientProposal(PRESET_KARUNYA.baseline_parameters, PRESET_KARUNYA.buildings.length);
      const comp = await compareProposals(PRESET_KARUNYA.baseline_parameters, resilientParams);
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
    const resilientParams = currentDesign.resilient_parameters || autoGenerateResilientProposal(currentDesign.baseline_parameters, currentDesign.buildings.length);
    const newParams = type === 'baseline' ? { ...currentDesign.baseline_parameters } : { ...resilientParams };
    setParameters(newParams);
    triggerAnalysis(newParams);
  };

  const handleResetBaseline = () => {
    handleSelectProposal('baseline');
  };

  const handleApplyResilient = () => {
    handleSelectProposal('resilient');
  };

  // When a user uploads or selects a new design
  const handleLoadCustomDesign = async (newDesign: CustomSiteDesign, openReviewImmediately: boolean = false) => {
    setCurrentDesign(newDesign);
    setSiteInfo(newDesign.site_info);
    setSelectedProposal('baseline');
    setParameters(newDesign.baseline_parameters);

    const resilientParams = newDesign.resilient_parameters || autoGenerateResilientProposal(newDesign.baseline_parameters, newDesign.buildings.length);

    const newAnalysis = await analyzeSite(newDesign.baseline_parameters);
    setAnalysis(newAnalysis);

    const comp = await compareProposals(newDesign.baseline_parameters, resilientParams);
    setComparisonData(comp);

    if (openReviewImmediately) {
      // Small timeout ensures the analysis state is fully mounted before opening the modal
      setTimeout(() => {
        setIsReviewModalOpen(true);
      }, 50);
    }
  };

  const isCustomUpload = currentDesign.uploaded_format !== 'preset' || currentDesign.id !== 'preset-karunya';
  const isImageDesign = currentDesign.uploaded_format === 'image' || !!currentDesign.custom_image_overlay;

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header 
        backendConnected={backendConnected} 
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenReviewAudit={() => setIsReviewModalOpen(true)}
        activeDesignName={currentDesign.site_info.site_name}
        isCustomUpload={isCustomUpload}
      />

      {/* Hero Subtitle Banner */}
      <div style={{ padding: '0.25rem 0.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc', marginBottom: '0.25rem' }}>
          Design for resilience before detailed design.
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '900px', lineHeight: 1.45 }}>
          ResiliForma adds deterministic multi-hazard screening to early-stage Autodesk Forma workflows. Upload custom blueprints, site plans, GeoJSON footprints, CSV tables, or JSON specs to screen acoustic noise, solar irradiance relief, and stormwater runoff retention.
        </p>
      </div>

      {/* Demonstration / Active Site Overview */}
      <SiteOverview 
        siteInfo={siteInfo} 
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenReviewAudit={() => setIsReviewModalOpen(true)}
        isCustomUpload={isCustomUpload}
        parcelCount={currentDesign.buildings.length}
      />

      {/* Detailed Explanation Section for Uploaded Blueprint Images */}
      {isImageDesign && analysis && (
        <UploadedImageExplanation
          design={currentDesign}
          analysis={analysis}
          onOpenReviewAudit={() => setIsReviewModalOpen(true)}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onApplyResilientOptimization={handleApplyResilient}
          selectedProposal={selectedProposal}
        />
      )}

      {/* Proposal Selector Strip */}
      <ProposalSelector
        selectedProposal={selectedProposal}
        onSelectProposal={handleSelectProposal}
        compositeScore={analysis?.score.composite_score ?? (selectedProposal === 'baseline' ? 48 : 87)}
        grade={analysis?.score.grade ?? (selectedProposal === 'baseline' ? 'D' : 'A')}
        onOpenReviewAudit={() => setIsReviewModalOpen(true)}
        deltaScore={comparisonData?.delta_score}
      />

      {/* Active Custom Design Screening Notification Banner (for non-image or general custom files) */}
      {isCustomUpload && !isImageDesign && analysis && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              background: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#f8fafc' }}>
                Multi-Hazard Screening Active for "{currentDesign.site_info.site_name}"
              </div>
              <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                Format: <strong style={{ color: '#38bdf8' }}>{currentDesign.uploaded_format?.toUpperCase()}</strong> • Parcels: <strong style={{ color: '#f8fafc' }}>{currentDesign.buildings.length} Blocks</strong> • Area: <strong style={{ color: '#f8fafc' }}>{currentDesign.site_info.site_area_km2} km²</strong> • Status: <strong style={{ color: analysis.score.status_color }}>Grade {analysis.score.grade} ({analysis.score.composite_score}/100)</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.775rem' }}
              onClick={() => setIsReviewModalOpen(true)}
            >
              <FileText size={13} style={{ color: '#38bdf8' }} />
              <span>View Screening Audit</span>
            </button>
            {selectedProposal === 'baseline' && (
              <button
                className="btn btn-success"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.775rem' }}
                onClick={handleApplyResilient}
              >
                <Sparkles size={13} />
                <span>Auto-Optimize Resilient Proposal</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      {analysis && (
        <>
          <div className="grid-main">
            {/* Left Main Column: Spatial Canvas + Hazard Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <SpatialCanvas
                parameters={parameters}
                analysis={analysis}
                buildings={currentDesign.buildings}
                siteName={currentDesign.site_info.site_name}
                siteAreaKm2={currentDesign.site_info.site_area_km2}
                transitCorridorName={currentDesign.site_info.context.transit_corridor}
                customImageOverlay={currentDesign.custom_image_overlay}
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

      {/* Modals */}
      <DesignUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onLoadDesign={handleLoadCustomDesign}
        activeDesignId={currentDesign.id}
      />

      {analysis && (
        <DesignReviewReportModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          design={currentDesign}
          analysis={analysis}
          onApplyResilientOptimization={handleApplyResilient}
        />
      )}

      {/* Professional Disclaimers Footer */}
      <footer className="footer-disclaimer">
        <p style={{ marginBottom: '0.35rem' }}>
          <strong>ResiliForma Prototype:</strong> Supplementary early-stage decision-support screening extension for Autodesk Forma.
        </p>
        <p>
          Detailed engineering verification should be performed using appropriate native Autodesk Forma analyses, Revit BIM workflows, and certified engineering modeling.
        </p>
      </footer>
    </div>
  );
};
