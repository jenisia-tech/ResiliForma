import React, { useState } from 'react';
import { FormaSiteData, FormaAnalysisResponse } from '../types/forma';

interface PayloadInspectorModalProps {
  siteData: FormaSiteData;
  analysis: FormaAnalysisResponse | null;
  onClose: () => void;
}

export const PayloadInspectorModal: React.FC<PayloadInspectorModalProps> = ({
  siteData,
  analysis,
  onClose
}) => {
  const [copiedSent, setCopiedSent] = useState(false);
  const [copiedReceived, setCopiedReceived] = useState(false);

  const sentJson = JSON.stringify({
    site_id: siteData.site_id,
    location: {
      latitude: siteData.location.latitude,
      longitude: siteData.location.longitude
    },
    buildings: siteData.buildings.map(b => ({
      id: b.id,
      name: b.name,
      height_m: b.height_m,
      azimuth_deg: b.azimuth_deg,
      footprint_sq_m: b.footprint_sq_m,
      exposure_pct: b.exposure_pct
    })),
    terrain: {
      type: siteData.terrain.type,
      mean_slope_percent: siteData.terrain.mean_slope_percent,
      elevation_min: siteData.terrain.elevation_min,
      elevation_max: siteData.terrain.elevation_max
    },
    roads: siteData.roads,
    noise_sources: siteData.noise_sources
  }, null, 2);

  const receivedJson = analysis ? JSON.stringify({
    acoustic: {
      noise_before: analysis.acoustic.noise_before,
      noise_after: analysis.acoustic.noise_after,
      reduction_db: analysis.acoustic.reduction_db
    },
    solar: {
      heat_gain_reduction: analysis.solar.heat_gain_reduction
    },
    resilience_score: analysis.resilience_score,
    recommendations: analysis.recommendations
  }, null, 2) : '{\n  "status": "pending analysis"\n}';

  const copyToClipboard = (text: string, isSent: boolean) => {
    navigator.clipboard.writeText(text);
    if (isSent) {
      setCopiedSent(true);
      setTimeout(() => setCopiedSent(false), 2000);
    } else {
      setCopiedReceived(true);
      setTimeout(() => setCopiedReceived(false), 2000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      zIndex: 100
    }} onClick={onClose}>
      <div style={{
        background: '#0f172a',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '960px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🔗</span>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Forma ↔ ResiliForma Data Contract Agreement
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                Specification derived from TODO requirements (Step 4 API Communication)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-sm">
            ✕ Close
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.25rem'
        }}>
          
          {/* Left Column: Forma Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--cyan-light)' }}>
                Forma side → sends this information:
              </div>
              <button
                onClick={() => copyToClipboard(sentJson, true)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
              >
                {copiedSent ? '✓ Copied' : 'Copy JSON'}
              </button>
            </div>

            <pre style={{
              background: '#030712',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              overflowX: 'auto',
              maxHeight: '380px'
            }}>
              {sentJson}
            </pre>
          </div>

          {/* Right Column: Backend Returns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--emerald-light)' }}>
                Your backend → returns:
              </div>
              <button
                onClick={() => copyToClipboard(receivedJson, false)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
              >
                {copiedReceived ? '✓ Copied' : 'Copy JSON'}
              </button>
            </div>

            <pre style={{
              background: '#030712',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#4ade80',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              overflowX: 'auto',
              maxHeight: '380px'
            }}>
              {receivedJson}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            API Endpoint: <code style={{ color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}>POST /api/forma/analyze</code>
          </div>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
