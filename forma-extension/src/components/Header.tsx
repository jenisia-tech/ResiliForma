import React from 'react';
import { SdkConnectionState } from '../types/forma';

interface HeaderProps {
  connection: SdkConnectionState;
  onOpenInspector: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ connection, onOpenInspector, onRefresh, isLoading }) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.85rem 1.25rem',
      background: 'rgba(11, 15, 25, 0.95)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 12px rgba(6, 182, 212, 0.4)'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
              ResiliForma
            </h1>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              Forma Extension
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="pulse-dot" style={{ backgroundColor: connection.isConnected ? '#10b981' : '#f59e0b' }} />
            <span>{connection.mode === 'live_forma' ? 'Connected to Autodesk Forma' : 'Forma Test Sandbox'}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={onOpenInspector}
          className="btn btn-secondary btn-sm"
          title="Inspect JSON Payload Exchange (TODO Contract)"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          JSON Contract
        </button>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn btn-primary btn-sm"
          title="Fetch latest geometry from Forma Canvas"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }}
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          {isLoading ? 'Syncing...' : 'Sync Forma'}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};
