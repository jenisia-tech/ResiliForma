import React from 'react';
import { MapPin, Maximize2, Building2, Wind, Droplets, Volume2, Sun } from 'lucide-react';
import { DemoSiteInfo } from '../types/analysis';

interface SiteOverviewProps {
  siteInfo: DemoSiteInfo;
}

export const SiteOverview: React.FC<SiteOverviewProps> = ({ siteInfo }) => {
  return (
    <div className="card" style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <MapPin size={18} style={{ color: '#38bdf8' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              {siteInfo.site_name}
            </h2>
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>SIH Benchmark Site</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {siteInfo.location} • <span className="font-mono">{siteInfo.coordinates.lat}° N, {siteInfo.coordinates.lng}° E</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Maximize2 size={16} style={{ color: '#10b981' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Site Area</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                {siteInfo.site_area_km2} km² <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>({siteInfo.site_area_ha} ha)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={16} style={{ color: '#818cf8' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Parcels</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                26 Building Blocks
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wind size={16} style={{ color: '#f59e0b' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Geography</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Western Ghats Corridor</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        paddingTop: '0.85rem', 
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
            <Volume2 size={14} style={{ color: '#ef4444' }} /> NH-544 Road Noise Corridor (78 dBA)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
            <Sun size={14} style={{ color: '#f59e0b' }} /> High West Solar Irradiance (710 W/m²)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
            <Droplets size={14} style={{ color: '#38bdf8' }} /> Monsoon Stormwater Catchment (21.04 ha)
          </span>
        </div>

        <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>
          Primary Site Design: <strong style={{ color: '#f8fafc' }}>Autodesk Forma</strong> • Screening: <strong style={{ color: '#38bdf8' }}>ResiliForma</strong>
        </div>
      </div>
    </div>
  );
};
