import React from 'react';
import type { PlanningMode } from '../types';
import { BuildingIcon, LeafIcon, Volume2Icon, SunIcon, ShieldCheckIcon, WavesIcon, ZapIcon, CompassIcon, CheckCircle2Icon } from './icons';

interface ModeSelectorProps {
  currentMode: PlanningMode;
  onSelectMode: (mode: PlanningMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
      {/* URBAN MODE CARD */}
      <div 
        onClick={() => onSelectMode('urban')}
        className="rf-card"
        style={{
          cursor: 'pointer',
          padding: '1.4rem',
          border: currentMode === 'urban' 
            ? '2px solid var(--cyan-primary)' 
            : '1px solid var(--border-card)',
          backgroundColor: currentMode === 'urban' ? '#111e33' : 'var(--bg-card)',
          boxShadow: currentMode === 'urban' ? '0 0 25px rgba(6, 182, 212, 0.18)' : 'var(--shadow-card)',
          position: 'relative',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: currentMode === 'urban' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: currentMode === 'urban' ? 'var(--cyan-light)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BuildingIcon size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>URBAN MODE</h3>
                {currentMode === 'urban' && (
                  <span className="rf-badge rf-badge-cyan">Active Mode</span>
                )}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                High-density structural & acoustic microclimate resilience
              </p>
            </div>
          </div>
          {currentMode === 'urban' && (
            <div style={{ color: 'var(--cyan-light)' }}>
              <CheckCircle2Icon size={20} />
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <Volume2Icon size={15} color="var(--cyan-light)" />
            <span>Acoustic resilience</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <SunIcon size={15} color="var(--amber-light)" />
            <span>Solar heat reduction</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <BuildingIcon size={15} color="var(--blue-light)" />
            <span>Building optimization</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <ShieldCheckIcon size={15} color="var(--emerald-light)" />
            <span>Noise mitigation</span>
          </div>
        </div>
      </div>

      {/* RURAL MODE CARD */}
      <div 
        onClick={() => onSelectMode('rural')}
        className="rf-card"
        style={{
          cursor: 'pointer',
          padding: '1.4rem',
          border: currentMode === 'rural' 
            ? '2px solid var(--emerald-primary)' 
            : '1px solid var(--border-card)',
          backgroundColor: currentMode === 'rural' ? '#0d221c' : 'var(--bg-card)',
          boxShadow: currentMode === 'rural' ? '0 0 25px rgba(16, 185, 129, 0.18)' : 'var(--shadow-card)',
          position: 'relative',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: currentMode === 'rural' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: currentMode === 'rural' ? 'var(--emerald-light)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LeafIcon size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>RURAL MODE</h3>
                {currentMode === 'rural' && (
                  <span className="rf-badge rf-badge-emerald">Active Mode</span>
                )}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                Watershed hydrology, agrivoltaics & terrain-adapted zoning
              </p>
            </div>
          </div>
          {currentMode === 'rural' && (
            <div style={{ color: 'var(--emerald-light)' }}>
              <CheckCircle2Icon size={20} />
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <ZapIcon size={15} color="var(--amber-light)" />
            <span>Agrivoltaics</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <WavesIcon size={15} color="var(--blue-light)" />
            <span>Stormwater management</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <CompassIcon size={15} color="var(--emerald-light)" />
            <span>Terrain-aware planning</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            <LeafIcon size={15} color="var(--cyan-light)" />
            <span>Agro-logistics</span>
          </div>
        </div>
      </div>
    </div>
  );
};
