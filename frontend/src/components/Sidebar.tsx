import React from 'react';
import type { PageRoute } from '../types';
import { 
  LayoutDashboardIcon, 
  MapIcon, 
  BuildingIcon, 
  LeafIcon, 
  Volume2Icon, 
  SunIcon, 
  WavesIcon, 
  SlidersIcon, 
  LightbulbIcon, 
  SettingsIcon, 
  ShieldCheckIcon 
} from './icons';
import { FormaStatus } from './FormaStatus';

interface SidebarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const mainNavItems: { id: PageRoute; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon size={18} /> },
    { id: 'site-analysis', label: 'Site Analysis', icon: <MapIcon size={18} /> },
  ];

  const modesNavItems: { id: PageRoute; label: string; icon: React.ReactNode }[] = [
    { id: 'urban-mode', label: 'Urban Mode', icon: <BuildingIcon size={18} /> },
    { id: 'rural-mode', label: 'Rural Mode', icon: <LeafIcon size={18} /> },
  ];

  const analysisNavItems: { id: PageRoute; label: string; icon: React.ReactNode }[] = [
    { id: 'acoustic-analysis', label: 'Acoustic Analysis', icon: <Volume2Icon size={18} /> },
    { id: 'solar-analysis', label: 'Solar Analysis', icon: <SunIcon size={18} /> },
    { id: 'hydrology', label: 'Hydrology', icon: <WavesIcon size={18} /> },
    { id: 'optimization', label: 'Optimization', icon: <SlidersIcon size={18} /> },
    { id: 'recommendations', label: 'Recommendations', icon: <LightbulbIcon size={18} /> },
  ];

  return (
    <aside className="sidebar">
      {/* Sidebar Header with Brand */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <ShieldCheckIcon size={20} />
        </div>
        <div className="sidebar-brand-name">
          <span>ResiliForma</span>
          <span className="sidebar-brand-badge">AI Co-Pilot</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Overview</div>
        {mainNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%' }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <div className="sidebar-section-title">Resilience Modes</div>
        {modesNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%' }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <div className="sidebar-section-title">Simulations & Engine</div>
        {analysisNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%' }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <div className="sidebar-section-title">System</div>
        <button
          onClick={() => onNavigate('settings')}
          className={`sidebar-nav-item ${currentPage === 'settings' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%' }}
        >
          <SettingsIcon size={18} />
          <span>Settings</span>
        </button>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {/* Forma Connection Status */}
        <FormaStatus compact />

        {/* User Profile Pill */}
        <div className="sidebar-user-pill" style={{ background: 'var(--bg-card-muted)', border: '1px solid var(--border-card)' }}>
          <div className="sidebar-user-avatar">
            <span>UP</span>
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Urban Planner</span>
            <span className="sidebar-user-role">Coimbatore Pilot</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
