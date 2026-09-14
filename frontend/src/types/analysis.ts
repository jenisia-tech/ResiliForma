export interface SiteAnalysisRequest {
  barrier_height: number;
  vegetation_depth: number;
  louver_depth: number;
  orientation_offset: number;
  baseline_noise_db: number;
  baseline_irradiance: number;
  runoff_coefficient: number;
  rainfall_intensity: number;
  catchment_area_ha: number;
  bioswale_length: number;
  retention_capacity: number;
}

export interface NoiseAnalysisResult {
  baseline_db: number;
  barrier_height_m: number;
  vegetation_depth_m: number;
  barrier_attenuation_db: number;
  vegetation_attenuation_db: number;
  total_reduction_db: number;
  optimized_noise_db: number;
  status: string;
  disclaimer: string;
}

export interface SolarAnalysisResult {
  baseline_irradiance: number;
  orientation_offset_deg: number;
  louver_depth_m: number;
  orientation_relief_percent: number;
  louver_relief_percent: number;
  total_reduction_percent: number;
  estimated_irradiance: number;
  status: string;
  disclaimer: string;
}

export interface StormwaterAnalysisResult {
  runoff_coefficient: number;
  rainfall_intensity_mmhr: number;
  catchment_area_ha: number;
  area_km2: number;
  peak_runoff_m3s: number;
  total_runoff_volume_m3: number;
  bioswale_length_m: number;
  retention_capacity_m3: number;
  runoff_management_percent: number;
  mitigated_volume_m3: number;
  net_discharge_m3: number;
  net_peak_discharge_m3s: number;
  status: string;
  disclaimer: string;
}

export interface SubScores {
  noise: number;
  solar: number;
  stormwater: number;
  accessibility: number;
  land_efficiency: number;
}

export interface ResilienceScoreResult {
  composite_score: number;
  grade: string;
  grade_label: string;
  status_color: string;
  sub_scores: SubScores;
  weights: Record<string, number>;
  disclaimer: string;
}

export interface SiteAnalysisResponse {
  noise: NoiseAnalysisResult;
  solar: SolarAnalysisResult;
  stormwater: StormwaterAnalysisResult;
  score: ResilienceScoreResult;
}

export interface DemoSiteInfo {
  site_name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  site_area_km2: number;
  site_area_ha: number;
  site_area_m2: number;
  context: {
    geography: string;
    climate: string;
    transit_corridor: string;
    building_blocks: number;
    primary_platform: string;
    extension_role: string;
  };
  forma_integration_status: string;
}

export interface ProposalCompareResponse {
  baseline: SiteAnalysisResponse;
  resilient: SiteAnalysisResponse;
  delta_score: number;
  noise_reduction_gain_db: number;
  solar_reduction_gain_percent: number;
  stormwater_management_gain_percent: number;
  summary: string;
}
