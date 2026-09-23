import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Volume2,
  Sun,
  Droplets,
  Building,
  FileText,
  UploadCloud,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Eye,
  X
} from 'lucide-react';
import { CustomSiteDesign, SiteAnalysisResponse } from '../types/analysis';

interface UploadedImageExplanationProps {
  design: CustomSiteDesign;
  analysis: SiteAnalysisResponse;
  onOpenReviewAudit: () => void;
  onOpenUploadModal: () => void;
  onApplyResilientOptimization: () => void;
  selectedProposal: 'baseline' | 'resilient';
}

export const UploadedImageExplanation: React.FC<UploadedImageExplanationProps> = ({
  design,
  analysis,
  onOpenReviewAudit,
  onOpenUploadModal,
  onApplyResilientOptimization,
  selectedProposal
}) => {
  const [showFullImage, setShowFullImage] = useState<boolean>(false);
  const summary = design.image_analysis_summary;

  if (!summary && !design.custom_image_overlay) return null;

  const fileName = summary?.file_name || design.uploaded_file_name || "Uploaded Drawing";
  const blocksCount = summary?.detected_blocks || design.buildings.length;
  const description = summary?.description || `ResiliForma has screened your uploaded design image "${fileName}" across road traffic noise, façade solar irradiance, and stormwater runoff retention.`;
  const keyFindings = summary?.key_findings || [
    `Extracted ${blocksCount} building parcel footprints and calibrated spatial boundaries.`,
    `Acoustic screening: Northern boundary is exposed to ${analysis.noise.baseline_db} dBA traffic noise.`,
    `Solar screening: Direct west exposure receives ${analysis.solar.baseline_irradiance} W/m² peak irradiance.`,
    `Stormwater screening: Catchment area (${design.site_info.site_area_ha} ha) requires active SuDS retention.`
  ];

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.35)',
      boxShadow: '0 8px 30px rgba(56, 189, 248, 0.12)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Image Thumbnail & Visual Tag */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div 
            style={{
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              background: '#070d19',
              aspectRatio: '4/3',
              cursor: 'pointer'
            }}
            onClick={() => setShowFullImage(true)}
          >
            {design.custom_image_overlay ? (
              <img 
                src={design.custom_image_overlay} 
                alt="Uploaded blueprint preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <ImageIcon size={48} />
              </div>
            )}

            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '6px',
              right: '6px',
              background: 'rgba(15, 23, 42, 0.85)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#f8fafc'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Eye size={12} style={{ color: '#38bdf8' }} /> Click to View
              </span>
              <span className="badge badge-emerald" style={{ padding: '1px 5px', fontSize: '0.65rem' }}>Scanned</span>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
            <strong>{fileName}</strong> • {blocksCount} Parcels Mapped
          </div>

          <button
            className="btn btn-secondary"
            style={{ padding: '0.4rem', fontSize: '0.75rem', width: '100%' }}
            onClick={onOpenUploadModal}
          >
            <UploadCloud size={13} /> Upload Another Image
          </button>
        </div>

        {/* Right Column: AI Extraction Details & Multi-Hazard Screening Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                  <Sparkles size={11} /> AI Image Feature Extraction
                </span>
                <span className={`badge ${analysis.score.grade === 'A' ? 'badge-emerald' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                  Screening Grade {analysis.score.grade} ({analysis.score.composite_score}/100)
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                Uploaded Image Screening & Spatial Vulnerability Analysis
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-primary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                onClick={onOpenReviewAudit}
              >
                <FileText size={14} /> Full Screening Audit Report
              </button>
              {selectedProposal === 'baseline' && (
                <button
                  className="btn btn-success"
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                  onClick={onApplyResilientOptimization}
                >
                  <Sparkles size={14} /> Auto-Optimize Design
                </button>
              )}
            </div>
          </div>

          {/* Description Text */}
          <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5 }}>
            {description}
          </p>

          {/* 4 Screening Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(15,23,42,0.7)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#818cf8', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                <Building size={12} /> Parcels Detected
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                {blocksCount} Blocks
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {summary?.density_label || 'Medium-High Density'}
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.7)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                <Volume2 size={12} /> Road Traffic Noise
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f87171' }}>
                {analysis.noise.optimized_noise_db} dBA
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {analysis.noise.total_reduction_db > 0 ? `-${analysis.noise.total_reduction_db} dB shielded` : 'Unshielded front'}
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.7)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                <Sun size={12} /> Solar Façade Load
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                {Math.round(analysis.solar.estimated_irradiance)} W/m²
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {analysis.solar.total_reduction_percent > 0 ? `-${analysis.solar.total_reduction_percent}% relieved` : 'Direct West'}
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.7)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                <Droplets size={12} /> SuDS Runoff
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                {analysis.stormwater.runoff_management_percent}% Managed
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {analysis.stormwater.mitigated_volume_m3.toLocaleString()} m³ retained
              </div>
            </div>
          </div>

          {/* Key Findings Bullet List */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
              Screening Insights & Identified Deficiencies:
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
              {keyFindings.map((finding, idx) => (
                <li key={idx} style={{ lineHeight: 1.4 }}>
                  {finding}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Full-Screen Image Modal */}
      {showFullImage && design.custom_image_overlay && (
        <div className="modal-backdrop" onClick={() => setShowFullImage(false)}>
          <div className="modal-content" style={{ maxWidth: '900px', padding: '1rem', background: '#070d19' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <strong style={{ color: '#f8fafc' }}>{fileName} — Blueprint Preview</strong>
              <button className="btn btn-secondary" style={{ padding: '0.3rem', borderRadius: '50%' }} onClick={() => setShowFullImage(false)}>
                <X size={16} />
              </button>
            </div>
            <img 
              src={design.custom_image_overlay} 
              alt="Full size blueprint" 
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
