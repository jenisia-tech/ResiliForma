import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FormaSiteCanvas } from './components/FormaSiteCanvas';
import { ResilienceReport } from './components/ResilienceReport';
import { FormaControlBar } from './components/FormaControlBar';
import { PayloadInspectorModal } from './components/PayloadInspectorModal';
import { FormaSiteData, FormaAnalysisResponse, SdkConnectionState, FormaIntervention } from './types/forma';
import { formaSdkService, DEFAULT_FORMA_TEST_SITE } from './services/formaSdk';
import { FormaApiService } from './services/api';

export const App: React.FC = () => {
  const [connection, setConnection] = useState<SdkConnectionState>({
    isConnected: false,
    mode: 'mock_sandbox',
    projectId: 'Loading...',
    proposalId: 'Loading...',
    lastSyncedAt: null
  });

  const [siteData, setSiteData] = useState<FormaSiteData>(DEFAULT_FORMA_TEST_SITE);
  const [analysis, setAnalysis] = useState<FormaAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(true);
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>('B2');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run analysis against backend API
  const runAnalysis = useCallback(async (data: FormaSiteData) => {
    setIsLoading(true);
    try {
      const result = await FormaApiService.analyzeSite(data);
      setAnalysis(result);
    } catch (err) {
      console.error('[ResiliForma] Analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize SDK
  useEffect(() => {
    const initSdk = async () => {
      const conn = await formaSdkService.initialize();
      setConnection(conn);
      const initialSite = await formaSdkService.fetchSiteData();
      setSiteData(initialSite);
      runAnalysis(initialSite);
    };
    initSdk();
  }, [runAnalysis]);

  // Handle building orientation rotation
  const handleRotateBuilding = async (buildingId: string, azimuth: number) => {
    const updated = await formaSdkService.updateBuildingOrientation(buildingId, azimuth, siteData);
    setSiteData(updated);
    runAnalysis(updated);
    showToast(`Rotated ${buildingId} long-axis to ${azimuth}°`);
  };

  // Handle applying intervention to scene
  const handleApplyIntervention = async (intervention: FormaIntervention) => {
    const updated = await formaSdkService.applyIntervention(intervention, siteData);
    setSiteData(updated);
    runAnalysis(updated);
    showToast(`✓ Applied to Forma: ${intervention.title}`);
  };

  // Update site parameters from sliders
  const handleUpdateParameters = (updates: Partial<FormaSiteData>) => {
    const updated = { ...siteData, ...updates };
    setSiteData(updated);
    runAnalysis(updated);
  };

  // Reset to canonical Step 3 Test Site
  const handleResetTestSite = async () => {
    const freshSite = JSON.parse(JSON.stringify(DEFAULT_FORMA_TEST_SITE));
    setSiteData(freshSite);
    runAnalysis(freshSite);
    showToast('Reset to canonical Step 3 Test Site');
  };

  // Sync with Forma
  const handleRefresh = async () => {
    setIsLoading(true);
    const synced = await formaSdkService.fetchSiteData();
    setSiteData(synced);
    setConnection(formaSdkService.getConnectionState());
    await runAnalysis(synced);
    showToast('Synchronized with Autodesk Forma scene');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Extension Header */}
      <Header
        connection={connection}
        onOpenInspector={() => setShowInspector(true)}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Main Extension Body */}
      <main style={{
        flex: 1,
        padding: '1.25rem',
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1fr)',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Spatial Visualizer & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FormaSiteCanvas
            siteData={siteData}
            onRotateBuilding={handleRotateBuilding}
            selectedBuildingId={selectedBuildingId}
            onSelectBuilding={setSelectedBuildingId}
          />

          <FormaControlBar
            siteData={siteData}
            onUpdateParameters={handleUpdateParameters}
            onResetTestSite={handleResetTestSite}
            isLiveSyncing={isLiveSyncing}
            onToggleLiveSync={() => setIsLiveSyncing(!isLiveSyncing)}
          />
        </div>

        {/* Right Column: Resilience Report & Interventions */}
        <div>
          <ResilienceReport
            analysis={analysis}
            onApplyIntervention={handleApplyIntervention}
            isLoading={isLoading}
          />
        </div>

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#06b6d4',
          color: '#ffffff',
          padding: '0.6rem 1.1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(6, 182, 212, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 90,
          animation: 'slideUp 0.2s ease-out'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* JSON Payload Inspector Modal */}
      {showInspector && (
        <PayloadInspectorModal
          siteData={siteData}
          analysis={analysis}
          onClose={() => setShowInspector(false)}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          main {
            grid-templateColumns: 1fr !important;
          }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
