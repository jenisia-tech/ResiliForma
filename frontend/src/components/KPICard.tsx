import React from 'react';
import type { KPIItem } from '../types';
import { Volume2Icon, SunIcon, WavesIcon, ShieldCheckIcon, TrendingUpIcon } from './icons';

interface KPICardProps {
  kpi: KPIItem;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, onClick }) => {
  const getIcon = () => {
    switch (kpi.iconName) {
      case 'Volume2':
        return <Volume2Icon size={22} className="text-cyan-400" />;
      case 'Sun':
        return <SunIcon size={22} className="text-amber-400" />;
      case 'Waves':
        return <WavesIcon size={22} className="text-blue-400" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheckIcon size={22} className="text-emerald-400" />;
    }
  };

  const getAccentStyles = () => {
    switch (kpi.accentColor) {
      case 'cyan':
        return {
          iconBg: 'rgba(6, 182, 212, 0.12)',
          iconColor: 'var(--cyan-light)',
          borderHover: 'rgba(6, 182, 212, 0.4)',
          glow: 'var(--shadow-glow)'
        };
      case 'amber':
        return {
          iconBg: 'rgba(245, 158, 11, 0.12)',
          iconColor: 'var(--amber-light)',
          borderHover: 'rgba(245, 158, 11, 0.4)',
          glow: '0 0 25px rgba(245, 158, 11, 0.12)'
        };
      case 'blue':
        return {
          iconBg: 'rgba(59, 130, 246, 0.12)',
          iconColor: 'var(--blue-light)',
          borderHover: 'rgba(59, 130, 246, 0.4)',
          glow: '0 0 25px rgba(59, 130, 246, 0.12)'
        };
      case 'emerald':
      default:
        return {
          iconBg: 'rgba(16, 185, 129, 0.12)',
          iconColor: 'var(--emerald-light)',
          borderHover: 'rgba(16, 185, 129, 0.4)',
          glow: 'var(--shadow-glow-emerald)'
        };
    }
  };

  const style = getAccentStyles();

  return (
    <div 
      className="rf-card rf-card-interactive" 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '140px'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {kpi.label}
          </span>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: style.iconBg, 
            color: style.iconColor,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: `1px solid ${style.borderHover}`
          }}>
            {getIcon()}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)' }}>
            {kpi.value}
          </span>
          {kpi.unit && (
            <span style={{ fontSize: '1rem', fontWeight: 600, color: style.iconColor, fontFamily: 'var(--font-mono)' }}>
              {kpi.unit}
            </span>
          )}
        </div>
      </div>

      <div>
        {kpi.delta && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--emerald-light)', marginBottom: '0.35rem' }}>
            <TrendingUpIcon size={14} color="var(--emerald-light)" />
            <span style={{ fontWeight: 600 }}>{kpi.delta}</span>
          </div>
        )}
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
          {kpi.description}
        </div>
      </div>
    </div>
  );
};
