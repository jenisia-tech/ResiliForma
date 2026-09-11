import React from 'react';
import { UploadIcon, XIcon, AlertTriangleIcon } from './icons';

interface ImportSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportSiteModal: React.FC<ImportSiteModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
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
              <UploadIcon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#ffffff' }}>Import Site from Autodesk Forma</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Direct Project Synchronizer
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

        {/* Notice Card */}
        <div style={{
          padding: '1rem',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--amber-light)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <AlertTriangleIcon size={18} />
            <span>Autodesk Forma Integration Pending</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
            <strong>Autodesk Forma integration will be connected in the next phase.</strong><br />
            Currently, the dashboard is running on pre-loaded synthetic datasets for the <em>Coimbatore Demo Site</em>. Direct Forma IFC / glTF geometry streaming and extension webhooks will be available once the FastAPI backend is connected.
          </p>
        </div>

        <div style={{ padding: '0.85rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Active Demo Site:</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>Coimbatore Demo Site (12.4 ha)</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            Coordinates: 11.0168° N, 76.9558° E
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="rf-btn rf-btn-primary">
            Got it, continue with Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
