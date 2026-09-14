import React from 'react';
import { Droplets, Waves, ArrowRight } from 'lucide-react';
import { StormwaterAnalysisResult } from '../types/analysis';

interface StormwaterPanelProps {
  stormwater: StormwaterAnalysisResult;
}

export const StormwaterPanel: React.FC<StormwaterPanelProps> = ({ stormwater }) => {
  const isResilient = stormwater.runoff_management_percent >= 75;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Droplets size={18} style={{ color: '#38bdf8' }} />
          <span>Stormwater Runoff Screening</span>
        </div>
        <span className={`badge ${isResilient ? 'badge-emerald' : 'badge-amber'}`}>
          {stormwater.status}
        </span>
      </div>

      {/* Main Metric Hero */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Runoff Retention & Management
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: isResilient ? '#10b981' : '#f59e0b', fontFamily: 'var(--font-mono)' }}>
              {stormwater.runoff_management_percent}%
            </span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Mitigated</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Rational Peak (Q_peak)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#38bdf8', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
            <span>{stormwater.peak_runoff_m3s}</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>m³/s</span>
          </div>
        </div>
      </div>

      {/* Simple Water-Flow Diagram */}
      <div style={{ 
        padding: '0.65rem 0.85rem', 
        background: 'rgba(15,23,42,0.6)', 
        borderRadius: '8px', 
        border: '1px solid rgba(255,255,255,0.04)',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Hydrologic Routing Process</span>
          <span>1-Hr Storm: {stormwater.total_runoff_volume_m3.toLocaleString()} m³</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <div style={{ textAlign: 'center', background: '#1e293b', padding: '4px 8px', borderRadius: '4px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>Catchment</div>
            <div style={{ fontWeight: 700, color: '#f8fafc' }}>{stormwater.catchment_area_ha} ha</div>
          </div>
          <ArrowRight size={14} style={{ color: '#38bdf8' }} />
          <div style={{ textAlign: 'center', background: '#1e293b', padding: '4px 8px', borderRadius: '4px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>Bioswales ({stormwater.bioswale_length_m}m)</div>
            <div style={{ fontWeight: 700, color: '#38bdf8' }}>Infiltration</div>
          </div>
          <ArrowRight size={14} style={{ color: '#38bdf8' }} />
          <div style={{ textAlign: 'center', background: '#1e293b', padding: '4px 8px', borderRadius: '4px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>Pond ({stormwater.retention_capacity_m3.toLocaleString()} m³)</div>
            <div style={{ fontWeight: 700, color: '#10b981' }}>{stormwater.mitigated_volume_m3.toLocaleString()} m³</div>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.75rem', background: 'rgba(15,23,42,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Runoff Coefficient (C)</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#7dd3fc', fontFamily: 'var(--font-mono)' }}>
            {stormwater.runoff_coefficient} <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>({stormwater.rainfall_intensity_mmhr} mm/hr)</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Net Unmitigated Discharge</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isResilient ? '#34d399' : '#f87171', fontFamily: 'var(--font-mono)' }}>
            {stormwater.net_discharge_m3.toLocaleString()} m³
          </div>
        </div>
      </div>

      <div className="disclaimer-text">
        <Waves size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
        {stormwater.disclaimer}
      </div>
    </div>
  );
};
