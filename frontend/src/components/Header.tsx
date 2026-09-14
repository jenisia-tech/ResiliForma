import React from 'react';
import { Layers, CheckCircle2, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  backendConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ backendConnected }) => {
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
        <span className="badge badge-indigo">SIH26114</span>
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
        <span className="badge badge-emerald">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          Demo Site Connected
        </span>
      </div>
    </header>
  );
};
