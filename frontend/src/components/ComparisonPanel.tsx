import React from 'react';
import { GitCompare } from 'lucide-react';
import { ProposalCompareResponse } from '../types/analysis';

interface ComparisonPanelProps {
  comparisonData: ProposalCompareResponse | null;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ comparisonData }) => {
  if (!comparisonData) return null;

  const { baseline, resilient, delta_score, noise_reduction_gain_db, solar_reduction_gain_percent, stormwater_management_gain_percent } = comparisonData;

  return (
    <div className="card" id="comparison-section">
      <div className="card-header">
        <div className="card-title">
          <GitCompare size={18} style={{ color: '#38bdf8' }} />
          <span>Proposal Comparison Matrix</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-emerald">+{delta_score} Points Net Gain</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
        <table className="comparison-table">
          <thead>
            <tr>
              <th style={{ width: '28%' }}>Design Parameter / Metric</th>
              <th style={{ width: '32%', color: '#f87171' }}>Baseline Proposal</th>
              <th style={{ width: '32%', color: '#34d399' }}>Resilient Proposal</th>
              <th style={{ width: '8%', textAlign: 'right' }}>Mitigation Delta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Façade Solar Orientation</strong></td>
              <td>0° (Direct West Exposure)</td>
              <td>-18° (Deflected Solar Azimuth)</td>
              <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>-18° Offset</td>
            </tr>
            <tr>
              <td><strong>Acoustic Earth Berm</strong></td>
              <td>0.0 m (None)</td>
              <td>3.5 m (Engineered Earth Berm)</td>
              <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>+3.5 m</td>
            </tr>
            <tr>
              <td><strong>Native Vegetation Buffer</strong></td>
              <td>0.0 m (None)</td>
              <td>8.0 m (Dense Acoustic Planting)</td>
              <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>+8.0 m</td>
            </tr>
            <tr>
              <td><strong>Solar Shading Louvers</strong></td>
              <td>0.0 m (Unshaded Façades)</td>
              <td>1.2 m (Horizontal Shading Overhangs)</td>
              <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>+1.2 m</td>
            </tr>
            <tr>
              <td><strong>Bioswales & Retention Pond</strong></td>
              <td>0 m Swales / 0 m³ Retention</td>
              <td>644 m Swales / 7,800 m³ Pond</td>
              <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>Full SuDS</td>
            </tr>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <td><strong>Road Traffic Noise Level</strong></td>
              <td style={{ color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{baseline.noise.optimized_noise_db} dBA (High Exposure)</td>
              <td style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{resilient.noise.optimized_noise_db} dBA (Improved Exposure)</td>
              <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>-{noise_reduction_gain_db} dB</td>
            </tr>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <td><strong>Façade Peak Solar Irradiance</strong></td>
              <td style={{ color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{Math.round(baseline.solar.estimated_irradiance)} W/m² (High Load)</td>
              <td style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{Math.round(resilient.solar.estimated_irradiance)} W/m² (Relieved)</td>
              <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>-{solar_reduction_gain_percent}%</td>
            </tr>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <td><strong>Stormwater Runoff Managed</strong></td>
              <td style={{ color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{baseline.stormwater.runoff_management_percent}% (High Runoff)</td>
              <td style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{resilient.stormwater.runoff_management_percent}% (High Retention)</td>
              <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>+{stormwater_management_gain_percent}%</td>
            </tr>
            <tr style={{ background: 'rgba(56, 189, 248, 0.05)', fontWeight: 700 }}>
              <td><strong>Composite Resilience Score</strong></td>
              <td style={{ color: '#ef4444', fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
                {baseline.score.composite_score} / 100 (Grade {baseline.score.grade})
              </td>
              <td style={{ color: '#10b981', fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>
                {resilient.score.composite_score} / 100 (Grade {resilient.score.grade})
              </td>
              <td style={{ textAlign: 'right', color: '#10b981', fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                +{delta_score} pts
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Autodesk Forma Board Integration Callout */}
      <div style={{
        padding: '0.85rem 1rem',
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#c7d2fe', marginBottom: '0.2rem' }}>
            Autodesk Forma Board Workflow Alignment
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Official multi-proposal spatial comparison is presented directly through <strong>Autodesk Forma Board</strong>. ResiliForma exports normalized multi-hazard screening metrics to populate Forma comparison matrices.
          </div>
        </div>
        <span className="badge badge-indigo">Forma Board Compatible</span>
      </div>
    </div>
  );
};
