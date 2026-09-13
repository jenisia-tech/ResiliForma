import React, { useState } from 'react';
import { XIcon, ActivityIcon, RefreshCwIcon, ExternalLinkIcon, LayersIcon } from './icons';

interface FormaStatusProps {
  compact?: boolean;
}

export const FormaStatus: React.FC<FormaStatusProps> = ({ compact = false }) => {
  const [showModal, setShowModal] = useState(false);

  if (compact) {
    return (
      <>
        <div 
          onClick={() => setShowModal(true)}
          className="sidebar-forma-status"
          style={{ cursor: 'pointer' }}
        >
          <div className="sidebar-forma-header">
            <span className="sidebar-forma-title">Autodesk Forma</span>
            <span className="sidebar-forma-state">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              Extension Ready
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Bridge v1.0 • Live Sync</span>
            <ExternalLinkIcon size={12} />
          </div>
        </div>

        {showModal && (
          <FormaDetailModal onClose={() => setShowModal(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div 
        className="rf-card"
        style={{
          border: '1px solid rgba(6, 182, 212, 0.35)',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(16, 23, 38, 0.95) 100%)',
          padding: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--cyan-light)'
            }}>
              <ActivityIcon size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Autodesk Forma Co-Pilot Extension</h4>
                <span className="rf-badge rf-badge-emerald">Extension Active • Port 5174</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '640px', lineHeight: '1.4' }}>
                Bidirectional data synchronization bridge active. Forma geometry (buildings, terrain, roads) streams directly into ResiliForma multi-hazard spatial solvers.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="rf-btn rf-btn-secondary"
              style={{ fontSize: '0.78rem' }}
            >
              <ExternalLinkIcon size={14} /> Launch Extension (5174)
            </a>
            <button 
              onClick={() => setShowModal(true)}
              className="rf-btn rf-btn-primary"
              style={{ fontSize: '0.78rem' }}
            >
              <LayersIcon size={14} /> Forma Integration Hub
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <FormaDetailModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export const FormaDetailModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'contract' | 'steps'>('hub');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || '';

  const testApiBridge = async () => {
    setIsTesting(true);
    try {
      const res = await fetch(`${API_BASE}/api/forma/test-site`);
      if (res.ok) {
        const site = await res.json();
        const analyzeRes = await fetch(`${API_BASE}/api/forma/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(site)
        });
        if (analyzeRes.ok) {
          const result = await analyzeRes.json();
          setSyncStatus(`✓ Success: Backend returned Resilience Score: ${result.resilience_score} | Acoustic Reduction: ${result.acoustic.reduction_db} dB | Solar Heat Cut: ${result.solar.heat_gain_reduction}%`);
        } else {
          setSyncStatus(`API returned HTTP ${analyzeRes.status}`);
        }
      } else {
        setSyncStatus(`Could not reach ${API_BASE || ''}/api/forma/test-site (HTTP ${res.status})`);
      }
    } catch (err: any) {
      setSyncStatus(`⚠️ Backend check: ${err.message || 'Make sure backend is accessible'}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--cyan-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ActivityIcon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#ffffff' }}>Autodesk Forma Integration Hub</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--cyan-light)', fontWeight: 600 }}>
                Status: Connected to ResiliForma Backend (`/api/forma/analyze`)
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('hub')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'hub' ? 'var(--cyan-primary)' : 'transparent',
              color: activeTab === 'hub' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Extension Overview & Live Test
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'contract' ? 'var(--cyan-primary)' : 'transparent',
              color: activeTab === 'contract' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Data Contract (TODO Spec)
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'steps' ? 'var(--cyan-primary)' : 'transparent',
              color: activeTab === 'steps' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            4-Step Workflow Guide
          </button>
        </div>

        {/* Tab 1: Hub & Test */}
        {activeTab === 'hub' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                System Architecture (Decoupled Prototype Model)
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                ResiliForma operates as an independent multi-hazard spatial analytics co-pilot connecting to Autodesk Forma proposals via a high-performance REST API contract. No paid commercial developer license required.
              </p>
            </div>

            {/* Visual Pipeline Box */}
            <div style={{
              background: '#030712',
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.73rem',
              lineHeight: '1.6'
            }}>
              <div style={{ color: 'var(--cyan-light)', fontWeight: 700, marginBottom: '0.25rem' }}>
                YOUR RESILIFORMA PLATFORM:
              </div>
              <div style={{ color: 'var(--text-main)' }}>
                React Frontend (Port 5173)<br />
                &nbsp;&nbsp;↓<br />
                FastAPI Backend (Port 8000)<br />
                &nbsp;&nbsp;↓<br />
                Acoustic (Traffic Diffraction) • Solar (Façade Azimuth) • Hydrology (Runoff & Swales)<br />
                &nbsp;&nbsp;↓<br />
                Multi-Objective Pareto Optimization + Climate-Adaptive Recommendations
              </div>
              <div style={{ margin: '0.4rem 0', color: 'var(--amber-light)', fontWeight: 600 }}>
                &nbsp;&nbsp;↕ REST API Data Contract (POST /api/forma/analyze)
              </div>
              <div style={{ color: '#a78bfa', fontWeight: 600 }}>
                AUTODESK FORMA [Integration Stage] — Karunya Nagar, Coimbatore Site (26 Buildings)
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'rgba(6, 182, 212, 0.05)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                  Test End-to-End API Communication Live:
                </span>
                <button
                  onClick={testApiBridge}
                  disabled={isTesting}
                  className="rf-btn rf-btn-primary"
                  style={{ fontSize: '0.75rem' }}
                >
                  <RefreshCwIcon size={14} /> {isTesting ? 'Sending Payload...' : 'Test /api/forma/analyze'}
                </button>
              </div>

              {syncStatus && (
                <div style={{
                  padding: '0.65rem',
                  background: '#030712',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: syncStatus.startsWith('✓') ? '#4ade80' : '#fcd34d',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {syncStatus}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Extension URL</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}>http://localhost:5174</div>
              </div>
              <div style={{ flex: 1, minWidth: '220px', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Backend Endpoint</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--emerald-light)', fontFamily: 'var(--font-mono)' }}>http://localhost:8000/api/forma/analyze</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Data Contract */}
        {activeTab === 'contract' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--cyan-light)', marginBottom: '0.35rem' }}>
                Forma Side → Sends:
              </div>
              <pre style={{
                background: '#030712',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.7rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                maxHeight: '260px',
                overflow: 'auto',
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>
{`{
  "site_id": "demo-site-01",
  "location": {
    "latitude": 11.0168,
    "longitude": 76.9558
  },
  "buildings": [
    { "id": "B1", "name": "Building 1", "height_m": 18, "azimuth_deg": 45, "footprint_sq_m": 850, "exposure_pct": 75 },
    { "id": "B2", "name": "Building 2", "height_m": 24, "azimuth_deg": -18, "footprint_sq_m": 1200, "exposure_pct": 82 },
    { "id": "B3", "name": "Building 3", "height_m": 12, "azimuth_deg": 0, "footprint_sq_m": 600, "exposure_pct": 60 }
  ],
  "terrain": { "type": "Mixed", "mean_slope_percent": 4.2 },
  "roads": [
    { "id": "R1", "name": "North Arterial Road", "traffic_type": "heavy", "distance_to_site_m": 15, "baseline_db": 78 }
  ],
  "noise_sources": [
    { "id": "N1", "source_type": "highway", "baseline_db": 78, "barrier_height_m": 3.5, "veg_depth_m": 8.0 }
  ]
}`}
              </pre>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--emerald-light)', marginBottom: '0.35rem' }}>
                Backend Returns:
              </div>
              <pre style={{
                background: '#030712',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.7rem',
                color: '#4ade80',
                fontFamily: 'var(--font-mono)',
                maxHeight: '260px',
                overflow: 'auto',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
{`{
  "acoustic": {
    "noise_before": 78,
    "noise_after": 63,
    "reduction_db": 15
  },
  "solar": {
    "heat_gain_reduction": 32
  },
  "resilience_score": 87,
  "recommendations": [
    "Increase façade shielding on north boundary",
    "Add vegetation buffer",
    "Reorient building B2"
  ]
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Steps */}
        {activeTab === 'steps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.78rem' }}>
            <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)' }}>
              <strong style={{ color: 'var(--cyan-light)' }}>Step 1 — Autodesk Platform Services Access:</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Autodesk Account + Autodesk Forma + APS Developer Access.</div>
            </div>
            <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)' }}>
              <strong style={{ color: 'var(--emerald-light)' }}>Step 2 — Forma Extension Workflow:</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Autodesk Forma → Forma Extension (iframe) → Forma API → ResiliForma Backend.</div>
            </div>
            <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)' }}>
              <strong style={{ color: 'var(--amber-light)' }}>Step 3 — Create Test Forma Project:</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Test site with boundary, terrain, north road, and 2-3 buildings (B1, B2, B3).</div>
            </div>
            <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-card)' }}>
              <strong style={{ color: '#a78bfa' }}>Step 4 — Test API Communication:</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Real-time synchronization and analysis returned into Autodesk Forma.</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-card)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Smart India Hackathon 2026 • ResiliForma Co-Pilot
          </span>
          <button onClick={onClose} className="rf-btn rf-btn-primary">
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
