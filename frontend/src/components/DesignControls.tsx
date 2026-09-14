import React from 'react';
import { Sliders, RotateCcw, Sparkles, Volume2, Sun, Droplets } from 'lucide-react';
import { SiteAnalysisRequest } from '../types/analysis';

interface DesignControlsProps {
  parameters: SiteAnalysisRequest;
  onChange: (newParams: SiteAnalysisRequest) => void;
  onResetBaseline: () => void;
  onApplyResilient: () => void;
}

export const DesignControls: React.FC<DesignControlsProps> = ({
  parameters,
  onChange,
  onResetBaseline,
  onApplyResilient
}) => {
  const updateParam = (key: keyof SiteAnalysisRequest, value: number) => {
    onChange({
      ...parameters,
      [key]: value
    });
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <div className="card-title">
          <Sliders size={18} style={{ color: '#38bdf8' }} />
          <span>Interactive Design Controls</span>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.725rem' }} 
            onClick={onResetBaseline}
            title="Reset to Baseline Proposal parameters"
          >
            <RotateCcw size={12} /> Baseline
          </button>
          <button 
            className="btn btn-success" 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.725rem' }} 
            onClick={onApplyResilient}
            title="Apply optimal Resilient Proposal parameters"
          >
            <Sparkles size={12} /> Resilient
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Section 1: Acoustic Controls */}
        <div style={{ padding: '0.75rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: '#818cf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Volume2 size={14} />
            <span>Acoustic Mitigation</span>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Acoustic Barrier Height</span>
              <span className="control-value">{parameters.barrier_height.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="0"
              max="5"
              step="0.1"
              value={parameters.barrier_height}
              onChange={(e) => updateParam('barrier_height', parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group" style={{ marginBottom: 0 }}>
            <div className="control-label">
              <span>Vegetation Buffer Depth</span>
              <span className="control-value">{parameters.vegetation_depth.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="0"
              max="16"
              step="0.5"
              value={parameters.vegetation_depth}
              onChange={(e) => updateParam('vegetation_depth', parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Section 2: Solar & Façade Controls */}
        <div style={{ padding: '0.75rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Sun size={14} />
            <span>Solar & Orientation</span>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Façade Orientation Offset</span>
              <span className="control-value">{parameters.orientation_offset > 0 ? `+${parameters.orientation_offset}` : parameters.orientation_offset}°</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="-30"
              max="30"
              step="1"
              value={parameters.orientation_offset}
              onChange={(e) => updateParam('orientation_offset', parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group" style={{ marginBottom: 0 }}>
            <div className="control-label">
              <span>Shading Louver Projection</span>
              <span className="control-value">{parameters.louver_depth.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="0"
              max="2"
              step="0.1"
              value={parameters.louver_depth}
              onChange={(e) => updateParam('louver_depth', parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Section 3: Stormwater & Retention Controls */}
        <div style={{ padding: '0.75rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Droplets size={14} />
            <span>Stormwater Management</span>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Bioswale Total Length</span>
              <span className="control-value">{parameters.bioswale_length.toFixed(0)} m</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="0"
              max="1000"
              step="10"
              value={parameters.bioswale_length}
              onChange={(e) => updateParam('bioswale_length', parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Retention Basin Capacity</span>
              <span className="control-value">{parameters.retention_capacity.toLocaleString()} m³</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="0"
              max="10000"
              step="100"
              value={parameters.retention_capacity}
              onChange={(e) => updateParam('retention_capacity', parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Rainfall Intensity (I)</span>
              <span className="control-value">{parameters.rainfall_intensity.toFixed(0)} mm/hr</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="40"
              max="100"
              step="1"
              value={parameters.rainfall_intensity}
              onChange={(e) => updateParam('rainfall_intensity', parseFloat(e.target.value))}
            />
          </div>

          <div className="control-group" style={{ marginBottom: 0 }}>
            <div className="control-label">
              <span>Runoff Coefficient (C)</span>
              <span className="control-value">{parameters.runoff_coefficient.toFixed(2)}</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min="0.40"
              max="0.95"
              step="0.01"
              value={parameters.runoff_coefficient}
              onChange={(e) => updateParam('runoff_coefficient', parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
