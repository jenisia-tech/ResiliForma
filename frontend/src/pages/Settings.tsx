import React, { useState } from 'react';
import { FormaStatus } from '../components/FormaStatus';

export const Settings: React.FC = () => {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [noiseThreshold, setNoiseThreshold] = useState(65);

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="rf-badge rf-badge-muted">Preferences & Integrations</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>System Settings & Extensions</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Configure spatial units, simulation tolerances, and Autodesk Forma extension parameters.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Unit & Standards Preferences */}
        <div className="rf-card">
          <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '1rem' }}>
            Spatial Units & Design Standards
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Measurement Units
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setUnits('metric')}
                  className={`rf-btn ${units === 'metric' ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  Metric (Hectares, Meters, mm/hr)
                </button>
                <button
                  onClick={() => setUnits('imperial')}
                  className={`rf-btn ${units === 'imperial' ? 'rf-btn-primary' : 'rf-btn-secondary'}`}
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  Imperial (Acres, Feet, in/hr)
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Acoustic Compliance Target ({noiseThreshold} dB)
              </label>
              <input
                type="range"
                min="50"
                max="75"
                step="1"
                value={noiseThreshold}
                onChange={e => setNoiseThreshold(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                <span>50 dB (Quiet Residential)</span>
                <span>65 dB (Standard Urban)</span>
                <span>75 dB (Commercial)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Autodesk Forma Extension Configuration */}
        <div className="rf-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>
              Autodesk Forma Extension & API Connection
            </h4>
            <span className="rf-badge rf-badge-amber">Integration Pending</span>
          </div>

          <div style={{
            padding: '1rem',
            background: 'var(--bg-card-muted)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-card)',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--amber-light)', marginBottom: '0.35rem' }}>
              Autodesk Developer Portal Webhook Target:
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              When the Phase 2 FastAPI backend is deployed, connect your Autodesk Forma client extension via the webhook endpoint below:
            </p>
            <div style={{
              marginTop: '0.6rem',
              padding: '0.5rem 0.75rem',
              background: '#0a0e17',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--cyan-light)',
              border: '1px solid var(--border-subtle)'
            }}>
              https://api.resiliforma.local/v1/forma/extension/webhook/sync
            </div>
          </div>

          <FormaStatus />
        </div>
      </div>
    </div>
  );
};
