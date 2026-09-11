import React from 'react';
import type { SiteInfoData, ResilienceBreakdown } from '../types';
import { SiteVisualization } from '../components/SiteVisualization';
import { 
  RefreshCwIcon, 
  InfoIcon 
} from '../components/icons';

interface SiteAnalysisProps {
  siteInfo: SiteInfoData;
  breakdown: ResilienceBreakdown;
  onAnalyzeSite: () => void;
  isAnalyzing: boolean;
}

export const SiteAnalysis: React.FC<SiteAnalysisProps> = ({
  siteInfo,
  onAnalyzeSite,
  isAnalyzing
}) => {

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="rf-badge rf-badge-cyan">Site Profiler</span>
            <span className="rf-badge rf-badge-muted">Synthetic GIS Model</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>Site Analysis & Environmental Baseline</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Multi-layered GIS baseline and environmental exposure assessment for <strong>{siteInfo.name}</strong>.
          </p>
        </div>

        <button
          onClick={onAnalyzeSite}
          disabled={isAnalyzing}
          className="rf-btn rf-btn-primary"
        >
          <RefreshCwIcon size={16} className={isAnalyzing ? 'animate-spin-fast' : ''} />
          <span>{isAnalyzing ? 'Processing Terrain & GIS...' : 'Analyze Site'}</span>
        </button>
      </div>

      {/* Prototype Scientific Disclaimer */}
      <div style={{
        padding: '0.75rem 1rem',
        background: 'rgba(6, 182, 212, 0.06)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.78rem',
        color: 'var(--cyan-light)',
        marginBottom: '1.5rem'
      }}>
        <InfoIcon size={16} />
        <span>
          <strong>Prototype Simulation:</strong> Site metrics are computed from synthetic spatial heuristics for demonstration purposes. Full validated Autodesk Forma terrain integration and microclimate CFD will be connected in the analysis backend.
        </span>
      </div>

      {/* Core Site Information Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="rf-card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Location
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
            {siteInfo.location}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
            {siteInfo.coordinates}
          </div>
        </div>

        <div className="rf-card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Total Site Area
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
            {siteInfo.areaHectares} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ha</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            ~124,000 m² developable parcel
          </div>
        </div>

        <div className="rf-card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Existing Buildings
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
            {siteInfo.buildingCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Blocks</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--emerald-light)', marginTop: '0.25rem' }}>
            Mix of G+4, G+6 & Institutional
          </div>
        </div>

        <div className="rf-card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Terrain Slope
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
            Moderate Slope
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--amber-light)', marginTop: '0.25rem' }}>
            4.2% mean grade (NW to SE)
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Visualization + Detailed GIS Panels */}
      <div className="grid-12" style={{ marginBottom: '1.5rem' }}>
        <div className="col-8">
          <SiteVisualization />
        </div>

        <div className="col-4">
          <div className="rf-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.75rem' }}>
              Primary Risk & Hazard Matrix
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--amber-light)' }}>
                    Urban Heat Island Exposure
                  </span>
                  <span className="rf-badge rf-badge-amber" style={{ fontSize: '0.62rem' }}>High Risk</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  High summer surface temperatures reaching 41°C due to unshaded paved surfaces and western façade orientation.
                </p>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--cyan-light)' }}>
                    Arterial Traffic Noise
                  </span>
                  <span className="rf-badge rf-badge-cyan" style={{ fontSize: '0.62rem' }}>78 dB Peak</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  NH 544 northern corridor generates continuous 72-78 dB acoustic pollution impacting northern building envelopes.
                </p>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--bg-card-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--blue-light)' }}>
                    Monsoonal Flash Runoff
                  </span>
                  <span className="rf-badge rf-badge-blue" style={{ fontSize: '0.62rem' }}>Moderate Risk</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Topographic convergence toward the south-eastern boundary risks localized waterlogging during 65 mm/hr downpours.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 'auto', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--emerald-light)', marginBottom: '0.2rem' }}>
                Co-Pilot Mitigation Strategy
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Integrate 3.5m perimeter acoustic barrier, bioswale runoff routing, and optimized building orientation.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Buildings Inventory Table */}
      <div className="rf-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', margin: 0 }}>Building Footprint & Spatial Inventory</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Coimbatore Site Parcel Breakdown (8 Buildings)
            </span>
          </div>
          <span className="rf-badge rf-badge-muted">8 Structures</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Building ID</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Typology</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Floors</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Footprint Area</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Baseline Noise</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Solar Exposure</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Optimization Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#ffffff' }}>Block A1</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>Commercial / Retail</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>G + 4</td>
                <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>1,850 m²</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--rose-primary)', fontWeight: 600 }}>78 dB (High)</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>64%</td>
                <td style={{ padding: '0.65rem 0.75rem' }}><span className="rf-badge rf-badge-cyan">Barrier Shielded</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#ffffff' }}>Block A2</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>Mixed Use Offices</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>G + 6</td>
                <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>2,200 m²</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--rose-primary)', fontWeight: 600 }}>76 dB (High)</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>72%</td>
                <td style={{ padding: '0.65rem 0.75rem' }}><span className="rf-badge rf-badge-cyan">Barrier Shielded</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#ffffff' }}>Block B1</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>Residential</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>G + 5</td>
                <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>1,400 m²</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--emerald-light)' }}>52 dB (Safe)</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>68%</td>
                <td style={{ padding: '0.65rem 0.75rem' }}><span className="rf-badge rf-badge-emerald">Vegetation Buffer</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#ffffff' }}>Block B2</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>Residential (Targeted)</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>G + 5</td>
                <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>1,400 m²</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--emerald-light)' }}>50 dB (Safe)</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--amber-light)', fontWeight: 600 }}>88% (Critical Heat)</td>
                <td style={{ padding: '0.65rem 0.75rem' }}><span className="rf-badge rf-badge-amber">-18° Azimuth Rotation</span></td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#ffffff' }}>Essential Facility</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>Health & Community Clinic</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>G + 2</td>
                <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>950 m²</td>
                <td style={{ padding: '0.65rem 0.75rem', color: 'var(--emerald-light)' }}>48 dB (Safe)</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>45%</td>
                <td style={{ padding: '0.65rem 0.75rem' }}><span className="rf-badge rf-badge-emerald">Direct 8 min Path</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
