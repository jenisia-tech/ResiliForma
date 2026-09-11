export interface FormaLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

export interface FormaBuilding {
  id: string;
  name: string;
  height_m: number;
  azimuth_deg: number;
  footprint_sq_m: number;
  exposure_pct: number;
  geometry_polygon?: number[][];
}

export interface FormaTerrain {
  type: string;
  mean_slope_percent: number;
  elevation_min: number;
  elevation_max: number;
  drainage_vector?: number[];
}

export interface FormaRoad {
  id: string;
  name: string;
  traffic_type: string;
  distance_to_site_m: number;
  baseline_db: number;
}

export interface FormaNoiseSource {
  id: string;
  source_type: string;
  baseline_db: number;
  barrier_height_m: number;
  veg_depth_m: number;
}

export interface FormaSiteData {
  site_id: string;
  location: FormaLocation;
  buildings: FormaBuilding[];
  terrain: FormaTerrain;
  roads: FormaRoad[];
  noise_sources: FormaNoiseSource[];
  barrier_height_m?: number;
  veg_depth_m?: number;
  louver_depth_m?: number;
  site_boundary?: {
    type: string;
    coordinates: number[][];
    area_sq_m?: number;
  };
}

export interface FormaAcousticOutput {
  noise_before: number;
  noise_after: number;
  reduction_db: number;
  target_achieved?: boolean;
}

export interface FormaSolarOutput {
  heat_gain_reduction: number;
  peak_exposure_percent?: number;
  recommended_azimuth_deg?: number;
}

export interface FormaIntervention {
  id: string;
  type: string;
  target_element_id?: string;
  title: string;
  description: string;
  parameters: Record<string, any>;
  forma_command: string;
  applied?: boolean;
}

export interface FormaAnalysisResponse {
  site_id: string;
  acoustic: FormaAcousticOutput;
  solar: FormaSolarOutput;
  resilience_score: number;
  recommendations: string[];
  interventions?: FormaIntervention[];
  details?: Record<string, any>;
  meta?: {
    mode: string;
    forma_connected: boolean;
    forma_status: string;
    api_version: string;
  };
}

export interface SdkConnectionState {
  isConnected: boolean;
  mode: 'live_forma' | 'mock_sandbox';
  projectId: string;
  proposalId: string;
  lastSyncedAt: string | null;
}
