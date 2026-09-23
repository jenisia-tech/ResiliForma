import React from 'react';
import { Layers, CheckCircle2, ShieldAlert, UploadCloud, FileText } from 'lucide-react';

interface HeaderProps {
  backendConnected: boolean;
  onOpenUploadModal?: () => void;
  onOpenReviewAudit?: () => void;
  activeDesignName?: string;
  isCustomUpload?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  backendConnected,
  onOpenUploadModal,
  onOpenReviewAudit,
  activeDesignName,
  isCustomUpload = false
}) => {
  return (
    <header className="header-wrapper">
      <div className="logo-group">
        <div className="logo-mark">
          <Layers size={22} />
        </div>
        <div className="logo-text">
          <h1>RESILIFORMA</h1>
          <p>Deterministic Multi-Hazard Design Screening for Autodesk Forma</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span className="badge badge-cyan">Autodesk Forma Extension</span>
        <span className={`badge ${backendConnected ? 'badge-emerald' : 'badge-amber'}`}>
          {backendConnected ? (
            <>
              <CheckCircle2 size={12} />
              <span>Backend Connected</span>
            </>
          ) : (
            <>
              <ShieldAlert size={12} />
              <span>Local Engine Active</span>
            </>
          )}
        </span>
        <span className={`badge ${isCustomUpload ? 'badge-cyan' : 'badge-emerald'}`}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isCustomUpload ? '#38bdf8' : '#10b981', display: 'inline-block' }}></span>
          {activeDesignName ? `${activeDesignName}` : 'Karunya Nagar'}
        </span>

        {onOpenReviewAudit && (
          <button
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            onClick={onOpenReviewAudit}
            title="Open Multi-Hazard Screening Audit"
          >
            <FileText size={14} style={{ color: '#38bdf8' }} />
            <span>Screening Audit</span>
          </button>
        )}

        {onOpenUploadModal && (
          <button
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            onClick={onOpenUploadModal}
            title="Upload Custom Site Design"
          >
            <UploadCloud size={14} />
            <span>Upload Design</span>
          </button>
        )}
      </div>
    </header>
  );
};
