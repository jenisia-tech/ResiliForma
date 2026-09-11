export type PlanningMode = 'urban' | 'rural';

export type PageRoute = 
  | 'dashboard'
  | 'site-analysis'
  | 'urban-mode'
  | 'rural-mode'
  | 'acoustic-analysis'
  | 'solar-analysis'
  | 'hydrology'
  | 'optimization'
  | 'recommendations'
  | 'settings';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type RecommendationCategory = 
  | 'Acoustic'
  | 'Solar'
  | 'Hydrology'
  | 'Accessibility'
  | 'Urban Design'
  | 'Rural Planning';

export interface RecommendationItem {
  id: string;
  title: string;
  category: RecommendationCategory;
  priority: PriorityLevel;
  impact: string;
  explanation: string;
  mode: PlanningMode | 'both';
  status: 'recommended' | 'applied' | 'in-review';
  iconType: 'barrier' | 'tree' | 'sun' | 'water' | 'road' | 'shield' | 'zap';
}

export interface KPIItem {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  benchmark?: string;
  description: string;
  iconName: string;
  accentColor: 'cyan' | 'emerald' | 'blue' | 'amber' | 'purple';
}

export interface AcousticAnalysisData {
  noiseSource: string;
  baselineNoiseDb: number;
  targetNoiseDb: number;
  optimizedNoiseDb: number;
  reductionDb: number;
  barrierHeightMeters: number;
  vegetationDepthMeters: number;
  noiseZones: {
    zone: string;
    baseline: number;
    optimized: number;
    status: 'compliant' | 'moderate' | 'exceeded';
  }[];
}

export interface SolarAnalysisData {
  peakExposurePercent: number;
  estimatedReductionPercent: number;
  annualRadiationKwhM2: number;
  optimizedRadiationKwhM2: number;
  shadingEfficiencyPercent: number;
  orientationOffsetDeg: number;
  façadeMetrics: {
    façade: 'North' | 'South' | 'East' | 'West';
    exposure: number;
    recommendedShading: string;
  }[];
}

export interface HydrologyAnalysisData {
  runoffHandlingPercent: number;
  terrainSlope: string;
  averageSlopePercent: number;
  peakPrecipitationCapacityMmHr: number;
  rechargeZoneAreaSqM: number;
  swaleLengthMeters: number;
  floodRiskLevel: 'Low' | 'Moderate' | 'High';
  waterRoutingEfficiencyPercent: number;
}

export interface SiteInfoData {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  areaHectares: number;
  buildingCount: number;
  terrainType: string;
  slopeCategory: string;
  primaryRisks: string[];
  climateZone: string;
  lastAnalyzed: string;
  dataSource: string;
}

export interface OptimizationObjective {
  id: string;
  name: string;
  weight: number; // 0 - 100
  currentScore: number; // 0 - 100
  targetScore: number; // 0 - 100
  color: string;
  unit?: string;
}

export interface OptimizationCandidate {
  id: string;
  name: string;
  tagline: string;
  isBest?: boolean;
  paretoRank: number;
  scores: {
    acoustic: number;
    solar: number;
    water: number;
    accessibility: number;
    landUtilization: number;
    overall: number;
  };
  metrics: {
    noiseReductionDb: number;
    heatReductionPct: number;
    runoffHandlingPct: number;
    accessTimeMin: number;
    greenCoveragePct: number;
  };
  tradeoffSummary: string;
}

export interface ResilienceBreakdown {
  overallScore: number;
  ratingLabel: string;
  acousticScore: number;
  solarScore: number;
  waterScore: number;
  accessibilityScore: number;
  historicalTrend: { month: string; score: number }[];
}

export interface FormaConnectionState {
  status: 'demo_mode' | 'connecting' | 'connected' | 'error';
  extensionId: string;
  projectSync: string;
  lastPing: string;
  message: string;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: number;
}
