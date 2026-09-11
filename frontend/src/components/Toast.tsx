import React from 'react';
import type { ToastMessage } from '../types';
import { CheckCircle2Icon, InfoIcon, AlertTriangleIcon, XIcon } from './icons';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2Icon size={18} color="var(--emerald-light)" />;
            case 'warning':
              return <AlertTriangleIcon size={18} color="var(--amber-light)" />;
            case 'info':
            default:
              return <InfoIcon size={18} color="var(--cyan-light)" />;
          }
        };

        return (
          <div key={toast.id} className="toast-item">
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.15rem' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <XIcon size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
