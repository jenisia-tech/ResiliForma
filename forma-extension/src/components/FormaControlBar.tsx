import React from 'react';
import { FormaSiteData } from '../types/forma';

interface FormaControlBarProps {
  siteData: FormaSiteData;
  onUpdateParameters: (updates: Partial<FormaSiteData>) => void;
  onResetTestSite: () => void;
  isLiveSyncing: boolean;
  onToggleLiveSync: () => void;
}

export const FormaControlBar: React.FC<FormaControlBarProps> = ({
  siteData,
  onUpdateParameters,
  onResetTestSite,
  isLiveSyncing,
  onToggleLiveSync
}) => {
  return (
    <div className="glass-panel" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          Forma Co-Pilot Controls
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onResetTestSite}
            className="btn btn-secondary btn-sm"
            title="Load Step 3 Canonical Test Site"
          >
            ↺ Reset Test Site
          </button>
          
          <button
            onClick={onToggleLiveSync}
            className={`btn btn-sm ${isLiveSyncing ? 'btn-success' : 'btn-secondary'}`}
            title="Toggle Continuous Live Synchronization with Forma Scene"
          >
            <span className="pulse-dot" style={{ backgroundColor: isLiveSyncing ? '#ffffff' : '#94a3b8' }} />
            {isLiveSyncing ? 'Live Sync Active' : 'Auto-Sync: Off'}
          </button>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
        
        {/* Acoustic Barrier Height */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Acoustic Berm Barrier</span>
            <strong style={{ color: 'var(--amber-light)', fontFamily: 'var(--font-mono)' }}>
              {siteData.barrier_height_m ?? 3.5}m
            </strong>
          </div>
          <input
            type="range"
            min="0"
            max="6"
            step="0.5"
            value={siteData.barrier_height_m ?? 3.5}
            onChange={(e) => onUpdateParameters({ barrier_height_m: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
          />
        </div>

        {/* Vegetation Depth */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Vegetation Buffer Depth</span>
            <strong style={{ color: 'var(--emerald-light)', fontFamily: 'var(--font-mono)' }}>
              {siteData.veg_depth_m ?? 8.0}m
            </strong>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={siteData.veg_depth_m ?? 8.0}
            onChange={(e) => onUpdateParameters({ veg_depth_m: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
          />
        </div>

        {/* Shading Louver Depth */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Façade Shading Louvers</span>
            <strong style={{ color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}>
              {siteData.louver_depth_m ?? 1.2}m
            </strong>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="0.2"
            value={siteData.louver_depth_m ?? 1.2}
            onChange={(e) => onUpdateParameters({ louver_depth_m: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
          />
        </div>

      </div>
    </div>
  );
};
