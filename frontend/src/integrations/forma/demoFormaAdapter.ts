/**
 * Demo Autodesk Forma Adapter for ResiliForma.
 * Provides Karunya Nagar Smart City Sector demonstration data while maintaining 
 * the exact interface required for future Autodesk Forma SDK / APS integration.
 */

import { IFormaAdapter } from './formaAdapter';
import { SiteAnalysisRequest, SiteAnalysisResponse, DemoSiteInfo } from '../../types/analysis';

export const DEMO_SITE_DATA: DemoSiteInfo = {
  site_name: "Karunya Nagar Smart City Sector",
  location: "Coimbatore South, Tamil Nadu, India",
  coordinates: {
    lat: 10.9366,
    lng: 76.7441
  },
  site_area_km2: 1.2,
  site_area_ha: 120.0,
  site_area_m2: 1200000.0,
  context: {
    geography: "Western Ghats Foothills Corridor",
    climate: "Tropical Monsoon High-Runoff Zone",
    transit_corridor: "NH-544 / Siruvani Road Arterial",
    building_blocks: 26,
    primary_platform: "Autodesk Forma Site Design",
    extension_role: "Supplementary Multi-Hazard Screening"
  },
  forma_integration_status: "Extension-Ready (Normalized Site Context)"
};

export const BASELINE_PARAMETERS: SiteAnalysisRequest = {
  orientation_offset: 0.0,
  barrier_height: 0.0,
  vegetation_depth: 0.0,
  louver_depth: 0.0,
  runoff_coefficient: 0.85,
  rainfall_intensity: 65.0,
  catchment_area_ha: 21.04,
  baseline_noise_db: 78.0,
  baseline_irradiance: 710.0,
  bioswale_length: 0.0,
  retention_capacity: 0.0
};

export const RESILIENT_PARAMETERS: SiteAnalysisRequest = {
  orientation_offset: -18.0,
  barrier_height: 3.5,
  vegetation_depth: 8.0,
  louver_depth: 1.2,
  runoff_coefficient: 0.85,
  rainfall_intensity: 65.0,
  catchment_area_ha: 21.04,
  baseline_noise_db: 78.0,
  baseline_irradiance: 710.0,
  bioswale_length: 644.0,
  retention_capacity: 7800.0
};

export class DemoFormaAdapter implements IFormaAdapter {
  isLiveConnected(): boolean {
    return false; // Running safely in zero-dependency Demo Mode
  }

  getConnectionStatus() {
    return {
      status: 'demo' as const,
      message: 'Demo Mode (Karunya Nagar Site Context Active — Forma Integration Ready)'
    };
  }

  async getCurrentSiteContext(): Promise<DemoSiteInfo> {
    return DEMO_SITE_DATA;
  }

  async getSiteDesignParameters(proposalType: 'baseline' | 'resilient'): Promise<SiteAnalysisRequest> {
    return proposalType === 'baseline' ? { ...BASELINE_PARAMETERS } : { ...RESILIENT_PARAMETERS };
  }

  async sendAnalysisResults(results: SiteAnalysisResponse): Promise<boolean> {
    // In live Forma extension, this posts extension results to Autodesk Forma Extension SDK
    // TODO: Connect window.forma.analysis.publish(results) when running inside Forma iframe
    console.info('[ResiliForma Adapter] Results prepared for Forma handshake:', results);
    return true;
  }

  subscribeToDesignChanges(callback: (params: Partial<SiteAnalysisRequest>) => void): () => void {
    // In live Forma environment, subscribes to Autodesk Forma element selection & geometry change events
    // TODO: Connect window.forma.selection.subscribe(callback)
    const timer = setTimeout(() => {
      callback({});
    }, 100);
    return () => clearTimeout(timer);
  }
}

export const activeFormaAdapter = new DemoFormaAdapter();
