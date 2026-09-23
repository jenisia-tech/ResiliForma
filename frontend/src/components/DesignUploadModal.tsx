import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Building,
  MapPin,
  Sparkles,
  Layers,
  ArrowRight,
  Activity,
  Scan
} from 'lucide-react';
import { CustomSiteDesign } from '../types/analysis';
import {
  parseJsonDesign,
  parseGeoJsonDesign,
  parseCsvDesign,
  screenDesignImage,
  generateSampleJsonTemplate,
  generateSampleCsvTemplate,
  SITE_PRESETS
} from '../integrations/designParser';

interface DesignUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDesign: (design: CustomSiteDesign, openReviewImmediately?: boolean) => void;
  activeDesignId: string;
}

export const DesignUploadModal: React.FC<DesignUploadModalProps> = ({
  isOpen,
  onClose,
  onLoadDesign,
  activeDesignId
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'presets' | 'templates'>('upload');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [pastedContent, setPastedContent] = useState<string>('');
  const [pasteFormat, setPasteFormat] = useState<'json' | 'geojson' | 'csv'>('json');
  const [parsedPreview, setParsedPreview] = useState<CustomSiteDesign | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [autoOpenReview, setAutoOpenReview] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const runScanningAnimation = (design: CustomSiteDesign) => {
    setIsScanning(true);
    setScanStep('Detecting building mass footprints and parcel layout from drawing...');

    setTimeout(() => {
      setScanStep('Screening road traffic acoustic exposure & arterial setback...');
    }, 300);

    setTimeout(() => {
      setScanStep('Screening façade solar thermal irradiance and azimuth deflection...');
    }, 600);

    setTimeout(() => {
      setScanStep('Calculating Rational Method peak stormwater runoff (Q_peak)...');
    }, 900);

    setTimeout(() => {
      setIsScanning(false);
      setParsedPreview(design);
    }, 1200);
  };

  const handleFileProcess = (file: File) => {
    setErrorMessage(null);
    setParsedPreview(null);
    setImagePreviewUrl(null);

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.json') || fileName.endsWith('.geojson')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (fileName.endsWith('.geojson')) {
            const design = parseGeoJsonDesign(content, file.name);
            runScanningAnimation(design);
          } else {
            try {
              const parsed = JSON.parse(content);
              if (parsed.type === 'FeatureCollection' || parsed.type === 'Feature') {
                const design = parseGeoJsonDesign(content, file.name);
                runScanningAnimation(design);
              } else {
                const design = parseJsonDesign(content, file.name);
                runScanningAnimation(design);
              }
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : 'Invalid JSON format';
              setErrorMessage(`JSON Parsing Error: ${msg}`);
            }
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Invalid file structure';
          setErrorMessage(`Failed to parse file: ${msg}`);
        }
      };
      reader.readAsText(file);
    } else if (fileName.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const design = parseCsvDesign(content, file.name);
          runScanningAnimation(design);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Invalid CSV structure';
          setErrorMessage(`CSV Parsing Error: ${msg}`);
        }
      };
      reader.readAsText(file);
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const dataUrl = e.target?.result as string;
          setImagePreviewUrl(dataUrl);
          setIsScanning(true);
          setScanStep('Running computer vision scan on blueprint pixels...');
          const design = await screenDesignImage(dataUrl, file.name);
          runScanningAnimation(design);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error processing image';
          setIsScanning(false);
          setErrorMessage(`Image processing error: ${msg}`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Unsupported file format. Please upload .json, .geojson, .csv, or image files (.png, .jpg, .svg).');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleProcessPasted = () => {
    setErrorMessage(null);
    if (!pastedContent.trim()) {
      setErrorMessage('Please paste your specification content first.');
      return;
    }

    try {
      if (pasteFormat === 'json') {
        const design = parseJsonDesign(pastedContent, "pasted_design.json");
        runScanningAnimation(design);
      } else if (pasteFormat === 'geojson') {
        const design = parseGeoJsonDesign(pastedContent, "pasted_plan.geojson");
        runScanningAnimation(design);
      } else if (pasteFormat === 'csv') {
        const design = parseCsvDesign(pastedContent, "pasted_parcels.csv");
        runScanningAnimation(design);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid structure';
      setErrorMessage(`Parsing Error: ${msg}`);
    }
  };

  const handleDownloadTemplate = (type: 'json' | 'csv') => {
    const content = type === 'json' ? generateSampleJsonTemplate() : generateSampleCsvTemplate();
    const blob = new Blob([content], { type: type === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'json' ? 'resiliforma_sample_design.json' : 'resiliforma_sample_parcels.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmLoad = () => {
    if (parsedPreview) {
      onLoadDesign(parsedPreview, autoOpenReview);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-mark" style={{ width: 36, height: 36, fontSize: '1rem' }}>
              <UploadCloud size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#f8fafc' }}>
                Upload & Review Your Design
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Upload blueprints, site plans, GeoJSON footprints, CSV tables, or JSON specs to run automated multi-hazard screening.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.4rem', borderRadius: '50%', width: 32, height: 32 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="modal-tabs">
          <button 
            className={`modal-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <UploadCloud size={15} />
            <span>Upload File / Image</span>
          </button>
          <button 
            className={`modal-tab ${activeTab === 'paste' ? 'active' : ''}`}
            onClick={() => setActiveTab('paste')}
          >
            <FileCode size={15} />
            <span>Paste Spec</span>
          </button>
          <button 
            className={`modal-tab ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            <Layers size={15} />
            <span>Site Presets</span>
          </button>
          <button 
            className={`modal-tab ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <Download size={15} />
            <span>Sample Templates</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="modal-body">
          {/* TAB 1: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.geojson,.csv,image/png,image/jpeg,image/svg+xml"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />

              <div
                className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: 54,
                    height: 54,
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8'
                  }}>
                    <UploadCloud size={28} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc', marginBottom: '0.2rem' }}>
                      Drag and drop your design image or file here, or <span style={{ color: '#38bdf8', textDecoration: 'underline' }}>browse</span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                      Supports <strong>blueprint images</strong> (.png, .jpg, .svg), <strong>.json</strong> (Forma/ResiliForma), <strong>.geojson</strong>, or <strong>.csv</strong> parcel tables
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span className="badge badge-amber"><ImageIcon size={12} /> Blueprint Drawing (.png, .jpg)</span>
                    <span className="badge badge-cyan"><FileCode size={12} /> JSON / Forma Spec</span>
                    <span className="badge badge-indigo"><Layers size={12} /> GeoJSON Vectors</span>
                    <span className="badge badge-emerald"><FileSpreadsheet size={12} /> CSV Parcels</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE SPEC */}
          {activeTab === 'paste' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    className={`btn ${pasteFormat === 'json' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={() => setPasteFormat('json')}
                  >
                    JSON Spec
                  </button>
                  <button
                    className={`btn ${pasteFormat === 'geojson' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={() => setPasteFormat('geojson')}
                  >
                    GeoJSON
                  </button>
                  <button
                    className={`btn ${pasteFormat === 'csv' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={() => setPasteFormat('csv')}
                  >
                    CSV Rows
                  </button>
                </div>

                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={() => {
                    setPastedContent(pasteFormat === 'json' ? generateSampleJsonTemplate() : generateSampleCsvTemplate());
                  }}
                >
                  <Sparkles size={12} /> Insert Sample
                </button>
              </div>

              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder={
                  pasteFormat === 'json' 
                    ? '{\n  "site_name": "My Custom Urban Sector",\n  "location": "City, Country",\n  "parameters": { ... },\n  "buildings": [ ... ]\n}'
                    : pasteFormat === 'geojson'
                    ? '{\n  "type": "FeatureCollection",\n  "features": [ ... ]\n}'
                    : 'id,name,floors,use_type,x,y,w,h\nP01,Tower 1,12,commercial,80,130,60,45\n...'
                }
                rows={8}
                className="code-editor-area font-mono"
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button 
                  className="btn btn-primary"
                  onClick={handleProcessPasted}
                >
                  <Scan size={14} /> Screen & Preview Spec
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SITE PRESETS */}
          {activeTab === 'presets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {SITE_PRESETS.map((preset) => {
                const isActive = preset.id === activeDesignId;
                return (
                  <div 
                    key={preset.id}
                    className="card"
                    style={{
                      padding: '1rem',
                      background: isActive ? 'rgba(56, 189, 248, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                      borderColor: isActive ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      onLoadDesign(preset, autoOpenReview);
                      onClose();
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Building size={16} style={{ color: '#38bdf8' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                          {preset.site_info.site_name}
                        </span>
                        {isActive && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Active</span>}
                        {preset.id === 'preset-karunya' && <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Default Benchmark</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.775rem' }}>
                        <MapPin size={12} />
                        <span>{preset.site_info.location}</span>
                        <span>•</span>
                        <span>{preset.site_info.site_area_km2} km²</span>
                        <span>•</span>
                        <span>{preset.buildings.length} Parcels</span>
                      </div>
                    </div>

                    <button 
                      className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                    >
                      {isActive ? 'Current Site' : 'Select Preset'} <ArrowRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: DOWNLOAD TEMPLATES */}
          {activeTab === 'templates' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileCode size={20} style={{ color: '#38bdf8' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ResiliForma JSON Spec</div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Comprehensive site specification template including environmental baselines, context parameters, and 19 custom parcels.
                </p>
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: 'auto', width: '100%' }}
                  onClick={() => handleDownloadTemplate('json')}
                >
                  <Download size={14} /> Download .JSON Template
                </button>
              </div>

              <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileSpreadsheet size={20} style={{ color: '#10b981' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Masterplan CSV Spec</div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Clean spreadsheet table template with columns for parcel IDs, names, stories/floors, coordinates, and use types.
                </p>
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: 'auto', width: '100%' }}
                  onClick={() => handleDownloadTemplate('csv')}
                >
                  <Download size={14} /> Download .CSV Template
                </button>
              </div>
            </div>
          )}

          {/* Scanning Animation */}
          {isScanning && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1.25rem',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
                <Activity size={20} className="animate-spin" />
                <strong style={{ fontSize: '0.95rem' }}>AI Multi-Hazard Screening In Progress...</strong>
              </div>
              <div style={{ fontSize: '0.825rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
                {scanStep}
              </div>
              <div className="metric-bar-bg" style={{ maxWidth: '360px', margin: '0 auto' }}>
                <div className="metric-bar-fill" style={{ width: '80%', background: 'linear-gradient(90deg, #38bdf8, #10b981)' }}></div>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#f87171',
              fontSize: '0.825rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Parsed Preview & Screening Results Card */}
          {parsedPreview && !isScanning && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1.15rem',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                  <strong style={{ color: '#a7f3d0', fontSize: '0.95rem' }}>
                    Screening Ready: {parsedPreview.site_info.site_name}
                  </strong>
                </div>
                <span className="badge badge-emerald">
                  {parsedPreview.uploaded_format?.toUpperCase() || 'CUSTOM'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600 }}>PARCELS DETECTED</div>
                  <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>{parsedPreview.buildings.length} Blocks</strong>
                  <div style={{ color: '#64748b', fontSize: '0.675rem' }}>Mapped on 2.5D grid</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600 }}>SITE CATCHMENT</div>
                  <strong style={{ color: '#10b981', fontSize: '1rem' }}>{parsedPreview.site_info.site_area_ha} ha</strong>
                  <div style={{ color: '#64748b', fontSize: '0.675rem' }}>({parsedPreview.site_info.site_area_km2} km²)</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600 }}>ROAD TRAFFIC NOISE</div>
                  <strong style={{ color: '#ef4444', fontSize: '1rem' }}>{parsedPreview.baseline_parameters.baseline_noise_db} dBA</strong>
                  <div style={{ color: '#64748b', fontSize: '0.675rem' }}>Unshielded frontline</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600 }}>SOLAR FAÇADE LOAD</div>
                  <strong style={{ color: '#f59e0b', fontSize: '1rem' }}>{parsedPreview.baseline_parameters.baseline_irradiance} W/m²</strong>
                  <div style={{ color: '#64748b', fontSize: '0.675rem' }}>Peak west irradiance</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600 }}>RUNOFF COEFFICIENT</div>
                  <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>C = {parsedPreview.baseline_parameters.runoff_coefficient}</strong>
                  <div style={{ color: '#64748b', fontSize: '0.675rem' }}>Rational method calc</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600 }}>SCREENING STATUS</div>
                  <strong style={{ color: '#a7f3d0', fontSize: '1rem' }}>Ready to Screen</strong>
                  <div style={{ color: '#64748b', fontSize: '0.675rem' }}>1-Click audit prepared</div>
                </div>
              </div>

              {imagePreviewUrl && (
                <div style={{
                  marginTop: '0.85rem',
                  padding: '0.75rem',
                  background: 'rgba(15,23,42,0.8)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <img 
                    src={imagePreviewUrl} 
                    alt="Blueprint Preview" 
                    style={{ height: '70px', width: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(56,189,248,0.3)' }} 
                  />
                  <div style={{ fontSize: '0.775rem', color: '#cbd5e1' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                      📷 Blueprint Image Calibrated for Screening
                    </div>
                    <div>
                      Spatial canvas will project 2.5D building masses, acoustic barriers, and SuDS flow lines directly onto this blueprint drawing.
                    </div>
                  </div>
                </div>
              )}

              {/* Auto Open Review Checkbox */}
              <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                <input
                  type="checkbox"
                  id="auto-open-review"
                  checked={autoOpenReview}
                  onChange={(e) => setAutoOpenReview(e.target.checked)}
                  style={{ accentColor: '#10b981', cursor: 'pointer' }}
                />
                <label htmlFor="auto-open-review" style={{ cursor: 'pointer', color: '#cbd5e1' }}>
                  Automatically open Full Screening Audit Review report upon loading
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setParsedPreview(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  style={{
                    padding: '0.65rem 1.4rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                  }}
                  onClick={handleConfirmLoad}
                >
                  <Sparkles size={16} /> Start Screening
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
