import React, { useState, useEffect } from 'react';
import './App.css';
import type { PageRoute, PlanningMode, ToastMessage } from './types';
import { 
  initialSiteInfo, 
  getKPIs, 
  initialResilienceBreakdown, 
  initialRecommendations,
  simulateSiteAnalysis 
} from './data/demoData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { ImportSiteModal } from './components/Modal';

import { Dashboard } from './pages/Dashboard';
import { SiteAnalysis } from './pages/SiteAnalysis';
import { UrbanMode } from './pages/UrbanMode';
import { RuralMode } from './pages/RuralMode';
import { AcousticAnalysis } from './pages/AcousticAnalysis';
import { SolarAnalysis } from './pages/SolarAnalysis';
import { Hydrology } from './pages/Hydrology';
import { Optimization } from './pages/Optimization';
import { Recommendations } from './pages/Recommendations';
import { Settings } from './pages/Settings';

export function App() {
  // Page routing state
  const [currentPage, setCurrentPage] = useState<PageRoute>('dashboard');
  const [mode, setMode] = useState<PlanningMode>('urban');

  // Core Data States
  const [siteInfo, setSiteInfo] = useState(initialSiteInfo);
  const [kpis, setKpis] = useState(getKPIs('urban'));
  const [breakdown, setBreakdown] = useState(initialResilienceBreakdown);
  const [recommendations, setRecommendations] = useState(initialRecommendations);

  // UI Interactive States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync route with URL hash on mount & changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '') as PageRoute;
      const validRoutes: PageRoute[] = [
        'dashboard',
        'site-analysis',
        'urban-mode',
        'rural-mode',
        'acoustic-analysis',
        'solar-analysis',
        'hydrology',
        'optimization',
        'recommendations',
        'settings'
      ];
      if (validRoutes.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (type: 'info' | 'success' | 'warning', title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      timestamp: Date.now()
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      dismissToast(newToast.id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleModeSelect = (newMode: PlanningMode) => {
    setMode(newMode);
    setKpis(getKPIs(newMode));
    addToast(
      'info',
      `${newMode.toUpperCase()} Mode Active`,
      newMode === 'urban'
        ? 'Switched context to Urban Acoustic, Solar & Building Optimization.'
        : 'Switched context to Rural Agrivoltaics, Stormwater & Terrain Watersheds.'
    );
  };

  const handleAnalyzeSite = async () => {
    setIsAnalyzing(true);
    addToast('info', 'Analyzing Site', 'Recalculating multi-hazard environmental layers for Coimbatore Demo Site...');

    try {
      const result = await simulateSiteAnalysis();
      setSiteInfo(result.updatedSite);
      setKpis(result.updatedKPIs);
      setBreakdown(result.updatedBreakdown);
      addToast('success', 'Site Analysis Complete', 'Updated acoustic baseline, solar exposure, and hydrology parameters.');
    } catch (err) {
      addToast('warning', 'Analysis Warning', 'Running in offline simulation mode.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyRecommendation = (id: string) => {
    setRecommendations(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'applied' as const };
      }
      return item;
    }));

    const rec = recommendations.find(r => r.id === id);
    if (rec) {
      addToast('success', 'Intervention Applied', `Configured "${rec.title}" into simulation model.`);
    }
  };

  return (
    <div className="app-layout">
      {/* 1. Left Architectural Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={navigateTo} />

      {/* 2. Main Content View Area */}
      <div className="main-content">
        {/* Top Header */}
        <Header
          siteInfo={siteInfo}
          isAnalyzing={isAnalyzing}
          onAnalyzeSite={handleAnalyzeSite}
          onImportSiteClick={() => setIsImportModalOpen(true)}
        />

        {/* Dynamic Pages */}
        <main>
          {currentPage === 'dashboard' && (
            <Dashboard
              siteInfo={siteInfo}
              kpis={kpis}
              breakdown={breakdown}
              mode={mode}
              onSelectMode={handleModeSelect}
              recommendations={recommendations}
              onNavigate={navigateTo}
              onAnalyzeSite={handleAnalyzeSite}
              onImportSiteClick={() => setIsImportModalOpen(true)}
              isAnalyzing={isAnalyzing}
              onApplyRecommendation={handleApplyRecommendation}
            />
          )}

          {currentPage === 'site-analysis' && (
            <SiteAnalysis
              siteInfo={siteInfo}
              breakdown={breakdown}
              onAnalyzeSite={handleAnalyzeSite}
              isAnalyzing={isAnalyzing}
            />
          )}

          {currentPage === 'urban-mode' && (
            <UrbanMode onGeneratePlan={handleAnalyzeSite} />
          )}

          {currentPage === 'rural-mode' && (
            <RuralMode onGeneratePlan={handleAnalyzeSite} />
          )}

          {currentPage === 'acoustic-analysis' && (
            <AcousticAnalysis />
          )}

          {currentPage === 'solar-analysis' && (
            <SolarAnalysis />
          )}

          {currentPage === 'hydrology' && (
            <Hydrology />
          )}

          {currentPage === 'optimization' && (
            <Optimization />
          )}

          {currentPage === 'recommendations' && (
            <Recommendations
              recommendations={recommendations}
              onApplyRecommendation={handleApplyRecommendation}
            />
          )}

          {currentPage === 'settings' && (
            <Settings />
          )}
        </main>
      </div>

      {/* 3. Global Modals & Toasts */}
      <ImportSiteModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}

export default App;
