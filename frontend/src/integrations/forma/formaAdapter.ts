/**
 * Autodesk Forma Integration Adapter Interface.
 * 
 * Defines the contract for fetching site geometric context, design parameters,
 * and publishing deterministic multi-hazard screening results back to Autodesk Forma workflows.
 */

import { SiteAnalysisRequest, SiteAnalysisResponse, DemoSiteInfo } from '../../types/analysis';

export interface FormaSiteContext {
  projectId: string;
  proposalId: string;
  proposalName: string;
  siteBoundaryWkt?: string;
  siteAreaM2: number;
  buildingCount: number;
  roadCenterlines?: Array<{ id: string; type: string; trafficVolumePerHour: number }>;
}

export interface IFormaAdapter {
  isLiveConnected(): boolean;
  getConnectionStatus(): { status: 'demo' | 'connected' | 'offline'; message: string };
  getCurrentSiteContext(): Promise<DemoSiteInfo>;
  getSiteDesignParameters(proposalType: 'baseline' | 'resilient'): Promise<SiteAnalysisRequest>;
  sendAnalysisResults(results: SiteAnalysisResponse): Promise<boolean>;
  subscribeToDesignChanges(callback: (params: Partial<SiteAnalysisRequest>) => void): () => void;
}
