import React, { useState } from 'react';
import type { SiteInfoData } from '../types';
import { 
  MapPinIcon, 
  RefreshCwIcon, 
  UploadIcon, 
  BellIcon 
} from './icons';

interface HeaderProps {
  siteInfo: SiteInfoData;
  isAnalyzing: boolean;
  onAnalyzeSite: () => void;
  onImportSiteClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  siteInfo,
  isAnalyzing,
  onAnalyzeSite,
  onImportSiteClick
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="top-header">
      {/* Page Title & Subtitle */}
      <div className="header-title-group">
        <div className="header-title">
          <span>ResiliForma</span>
          <span className="rf-badge rf-badge-cyan" style={{ fontSize: '0.65rem' }}>Demo Edition</span>
        </div>
        <div className="header-subtitle">
          Disaster-Adaptive Site Planning Co-Pilot for Autodesk Forma
        </div>
      </div>

      {/* Center/Right Site Selector & Actions */}
      <div className="header-actions">
        {/* Site Selector Pill */}
        <div className="header-site-pill">
          <MapPinIcon size={14} color="var(--cyan-light)" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '0.78rem', color: '#ffffff' }}>
              {siteInfo.name}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              {siteInfo.coordinates} • {siteInfo.areaHectares} ha
            </span>
          </div>
          <span className="rf-badge rf-badge-amber" style={{ fontSize: '0.62rem', marginLeft: '0.25rem' }}>
            Demo Data
          </span>
        </div>

        {/* Analyze Site Action */}
        <button
          onClick={onAnalyzeSite}
          disabled={isAnalyzing}
          className="rf-btn rf-btn-primary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
        >
          <RefreshCwIcon size={14} className={isAnalyzing ? 'animate-spin-fast' : ''} />
          <span>{isAnalyzing ? 'Analyzing Site...' : 'Analyze Site'}</span>
        </button>

        {/* Import Site Action (Forma integration notice) */}
        <button
          onClick={onImportSiteClick}
          className="rf-btn rf-btn-secondary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
        >
          <UploadIcon size={14} />
          <span>Import Site</span>
        </button>

        {/* Notifications Icon Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="header-icon-btn"
            title="System Notifications"
          >
            <BellIcon size={17} />
            <span className="header-notif-dot" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: '0',
              width: '320px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-highlight)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
              padding: '1rem',
              zIndex: 50
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>System Updates</span>
                <span className="rf-badge rf-badge-cyan" style={{ fontSize: '0.65rem' }}>2 New</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ padding: '0.5rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cyan-light)' }}>
                    Site Analysis Cached
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Baseline acoustic & solar heat-gain simulation loaded for Coimbatore Demo Site.
                  </div>
                </div>

                <div style={{ padding: '0.5rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--amber-light)' }}>
                    Forma API Notice
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Running in prototype mode. Extension webhooks will activate in Phase 2.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Quick Avatar */}
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7, #10b981)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.78rem',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          UP
        </div>
      </div>
    </header>
  );
};
