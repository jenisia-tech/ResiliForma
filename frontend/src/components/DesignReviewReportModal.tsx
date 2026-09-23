import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  Download,
  Sparkles,
  X,
  Volume2,
  Sun,
  Droplets,
  CheckCircle,
  XCircle,
  Building2,
  Layers,
  Printer
} from 'lucide-react';
import {
  CustomSiteDesign,
  SiteAnalysisResponse
} from '../types/analysis';
import { generateDesignReviewAudit } from '../integrations/designParser';

interface DesignReviewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: CustomSiteDesign;
  analysis: SiteAnalysisResponse;
  onApplyResilientOptimization: () => void;
}

export const DesignReviewReportModal: React.FC<DesignReviewReportModalProps> = ({
  isOpen,
  onClose,
  design,
  analysis,
  onApplyResilientOptimization
}) => {
  if (!isOpen) return null;

  const audit = generateDesignReviewAudit(design, analysis);

  const handleExportJson = () => {
    const reportData = {
      title: "ResiliForma Multi-Hazard Screening Audit Report",
      generated_at: new Date().toISOString(),
      site_information: design.site_info,
      building_parcels_count: design.buildings.length,
      current_parameters: {
        orientation_offset_deg: analysis.solar.orientation_offset_deg,
        barrier_height_m: analysis.noise.barrier_height_m,
        vegetation_depth_m: analysis.noise.vegetation_depth_m,
        louver_depth_m: analysis.solar.louver_depth_m,
        bioswale_length_m: analysis.stormwater.bioswale_length_m,
        retention_capacity_m3: analysis.stormwater.retention_capacity_m3
      },
      screening_results: {
        noise_optimized_dba: analysis.noise.optimized_noise_db,
        solar_estimated_irradiance_wm2: analysis.solar.estimated_irradiance,
        stormwater_retention_percent: analysis.stormwater.runoff_management_percent,
        composite_score: analysis.score.composite_score,
        grade: analysis.score.grade
      },
      audit: audit
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResiliForma_Audit_${design.site_info.site_name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '880px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-mark" style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  Design Resilience Screening Audit
                </h2>
                <span className={`badge ${audit.grade === 'A' ? 'badge-emerald' : audit.grade === 'B' ? 'badge-cyan' : 'badge-red'}`}>
                  Grade {audit.grade} ({audit.composite_score}/100)
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {design.site_info.site_name} • {design.site_info.location} • {design.buildings.length} Parcels Reviewed
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
              onClick={handlePrint}
              title="Print Audit Report"
            >
              <Printer size={14} /> Print
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
              onClick={handleExportJson}
              title="Download Audit JSON"
            >
              <Download size={14} /> Export JSON
            </button>
            <button 
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '0.4rem', borderRadius: '50%', width: 32, height: 32 }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2.5rem' }}>
          
          {/* Executive Score Summary */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.7) 100%)',
            border: `1px solid ${audit.status_color}`,
            borderRadius: '10px',
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>
                Resilience Rating & Compliance Status
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.15rem' }}>
                {audit.grade_label}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Evaluated against deterministic acoustic, thermal, and Rational Method runoff screening models.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: audit.status_color, lineHeight: 1 }}>
                  {audit.composite_score}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginTop: '0.2rem' }}>
                  Score / 100
                </div>
              </div>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: audit.status_color,
                color: '#070b14',
                fontSize: '1.6rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {audit.grade}
              </div>
            </div>
          </div>

          {/* Sub-scores Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '0.75rem' }}>
            <div className="card" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ color: '#818cf8', fontSize: '0.7rem', fontWeight: 700 }}>ACOUSTIC SAFETY</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>{audit.sub_scores.noise}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>30% Weight</div>
            </div>
            <div className="card" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700 }}>SOLAR COMFORT</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>{audit.sub_scores.solar}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>25% Weight</div>
            </div>
            <div className="card" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ color: '#38bdf8', fontSize: '0.7rem', fontWeight: 700 }}>STORMWATER SuDS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>{audit.sub_scores.stormwater}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>25% Weight</div>
            </div>
            <div className="card" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 700 }}>BUFFER INTEGRITY</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>{audit.sub_scores.accessibility}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>10% Weight</div>
            </div>
            <div className="card" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ color: '#c084fc', fontSize: '0.7rem', fontWeight: 700 }}>GREEN NETWORK</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>{audit.sub_scores.land_efficiency}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>10% Weight</div>
            </div>
          </div>

          {/* Standard Compliance Check Matrix */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} style={{ color: '#38bdf8' }} />
              <span>Multi-Hazard Standard Compliance Matrix</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
              {/* Noise Check */}
              <div style={{
                background: 'rgba(15,23,42,0.6)',
                padding: '0.85rem',
                borderRadius: '8px',
                border: audit.compliance.noise_compliant ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#818cf8' }}>
                    <Volume2 size={14} /> Road Traffic Noise
                  </span>
                  {audit.compliance.noise_compliant ? (
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}><CheckCircle size={10} /> Safe</span>
                  ) : (
                    <span className="badge badge-red" style={{ fontSize: '0.65rem' }}><XCircle size={10} /> Exceeded</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>
                  {analysis.noise.optimized_noise_db} dBA
                </div>
                <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  {audit.compliance.noise_standard_note}
                </div>
              </div>

              {/* Solar Check */}
              <div style={{
                background: 'rgba(15,23,42,0.6)',
                padding: '0.85rem',
                borderRadius: '8px',
                border: audit.compliance.solar_compliant ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#f59e0b' }}>
                    <Sun size={14} /> Solar Heat Gain
                  </span>
                  {audit.compliance.solar_compliant ? (
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}><CheckCircle size={10} /> Relieved</span>
                  ) : (
                    <span className="badge badge-red" style={{ fontSize: '0.65rem' }}><XCircle size={10} /> High Load</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>
                  {Math.round(analysis.solar.estimated_irradiance)} W/m²
                </div>
                <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  {audit.compliance.solar_standard_note}
                </div>
              </div>

              {/* Stormwater Check */}
              <div style={{
                background: 'rgba(15,23,42,0.6)',
                padding: '0.85rem',
                borderRadius: '8px',
                border: audit.compliance.stormwater_compliant ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: '#38bdf8' }}>
                    <Droplets size={14} /> SuDS Runoff Retention
                  </span>
                  {audit.compliance.stormwater_compliant ? (
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}><CheckCircle size={10} /> Retained</span>
                  ) : (
                    <span className="badge badge-red" style={{ fontSize: '0.65rem' }}><XCircle size={10} /> Flood Risk</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>
                  {analysis.stormwater.runoff_management_percent}% Managed
                </div>
                <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  {audit.compliance.stormwater_standard_note}
                </div>
              </div>
            </div>
          </div>

          {/* Identified Vulnerabilities */}
          {audit.vulnerabilities.length > 0 && (
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
                <AlertTriangle size={16} />
                <span>Identified Multi-Hazard Vulnerabilities ({audit.vulnerabilities.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {audit.vulnerabilities.map((vuln) => (
                  <div 
                    key={vuln.id}
                    style={{
                      padding: '0.85rem',
                      background: vuln.severity === 'critical' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                      border: vuln.severity === 'critical' ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <strong style={{ color: '#f8fafc', fontSize: '0.875rem' }}>{vuln.title}</strong>
                      <span className={`badge ${vuln.severity === 'critical' ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                        {vuln.severity.toUpperCase()}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.775rem', color: '#cbd5e1', marginBottom: '0.4rem', lineHeight: 1.45 }}>
                      {vuln.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.725rem' }}>
                      <span style={{ color: '#94a3b8' }}>
                        Threshold Ref: <em>{vuln.threshold_reference}</em>
                      </span>
                      <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                        Recommendation: {vuln.suggested_fix}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Recommendations Checklist */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
              <Sparkles size={16} />
              <span>Recommended Spatial Interventions</span>
            </div>

            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
              {audit.recommendations.map((rec, idx) => (
                <li key={idx} style={{ lineHeight: 1.45 }}>
                  {rec}
                </li>
              ))}
            </ul>

            {audit.grade !== 'A' && (
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    onApplyResilientOptimization();
                    onClose();
                  }}
                >
                  <Sparkles size={14} /> Auto-Generate & Apply Resilient Proposal
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
            * ResiliForma early-stage decision-support screening. Physical engineering verified in Autodesk Forma.
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
