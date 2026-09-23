import React from 'react';
import { MapPin, Maximize2, Building2, Wind, Droplets, Volume2, Sun, UploadCloud, FileText } from 'lucide-react';
import { DemoSiteInfo } from '../types/analysis';

interface SiteOverviewProps {
  siteInfo: DemoSiteInfo;
  onOpenUploadModal: () => void;
  onOpenReviewAudit?: () => void;
  isCustomUpload?: boolean;
  parcelCount?: number;
}

export const SiteOverview: React.FC<SiteOverviewProps> = ({
  siteInfo,
  onOpenUploadModal,
  onOpenReviewAudit,
  isCustomUpload = false,
  parcelCount
}) => {
  const blocksCount = parcelCount ?? siteInfo.context.building_blocks ?? 26;

  return (
    <div className="card" style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <MapPin size={18} style={{ color: '#38bdf8' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              {siteInfo.site_name}
            </h2>
            {isCustomUpload ? (
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Custom Uploaded Site</span>
            ) : siteInfo.site_name.includes('Karunya') ? (
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Benchmark Site</span>
            ) : (
              <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>Site Preset</span>
            )}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {siteInfo.location} • <span className="font-mono">{siteInfo.coordinates.lat}° N, {siteInfo.coordinates.lng}° E</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
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
                  {blocksCount} Building Blocks
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wind size={16} style={{ color: '#f59e0b' }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Geography</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{siteInfo.context.geography}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onOpenReviewAudit && (
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                onClick={onOpenReviewAudit}
              >
                <FileText size={14} style={{ color: '#38bdf8' }} />
                <span>Screening Audit</span>
              </button>
            )}
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              onClick={onOpenUploadModal}
            >
              <UploadCloud size={14} />
              <span>Upload / Switch Design</span>
            </button>
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
            <Volume2 size={14} style={{ color: '#ef4444' }} /> {siteInfo.context.transit_corridor}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
            <Sun size={14} style={{ color: '#f59e0b' }} /> {siteInfo.context.climate}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
            <Droplets size={14} style={{ color: '#38bdf8' }} /> Catchment ({siteInfo.site_area_ha} ha)
          </span>
        </div>

        <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>
          Primary Site Design: <strong style={{ color: '#f8fafc' }}>Autodesk Forma</strong> • Screening: <strong style={{ color: '#38bdf8' }}>ResiliForma</strong>
        </div>
      </div>
    </div>
  );
};
