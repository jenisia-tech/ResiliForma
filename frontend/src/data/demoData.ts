import type {
  SiteInfoData,
  KPIItem,
  AcousticAnalysisData,
  SolarAnalysisData,
  HydrologyAnalysisData,
  ResilienceBreakdown,
  OptimizationObjective,
  OptimizationCandidate,
  RecommendationItem,
  FormaConnectionState,
  PlanningMode
} from '../types';

export const initialSiteInfo: SiteInfoData = {
  id: 'site-cbe-001',
  name: 'Coimbatore Demo Site',
  location: 'Coimbatore, Tamil Nadu, India',
  coordinates: '11.0168° N, 76.9558° E',
  areaHectares: 12.4,
  buildingCount: 8,
  terrainType: 'Mixed / Moderate Slope (4.2% mean)',
  slopeCategory: 'Moderate Slope (North to South-East drainage)',
  primaryRisks: ['Urban Heat Island', 'Arterial Traffic Noise', 'Monsoonal Flash Runoff'],
  climateZone: 'Tropical Wet & Dry (Aw - Köppen)',
  lastAnalyzed: 'Just now (Prototype Cache)',
  dataSource: 'Demo Dataset (Synthetic GIS & Building Footprints)'
};

export const initialAcousticData: AcousticAnalysisData = {
  noiseSource: 'Arterial Road Traffic (Northern Edge - NH 544 Corridor)',
  baselineNoiseDb: 78,
  targetNoiseDb: 65,
  optimizedNoiseDb: 63,
  reductionDb: 15,
  barrierHeightMeters: 3.5,
  vegetationDepthMeters: 8.0,
  noiseZones: [
    { zone: 'North Façade (Building A1 & A2)', baseline: 78, optimized: 63, status: 'compliant' },
    { zone: 'Central Courtyard & Plaza', baseline: 69, optimized: 54, status: 'compliant' },
    { zone: 'South Residential Block (B1-B4)', baseline: 62, optimized: 48, status: 'compliant' },
    { zone: 'East Boundary Access Road', baseline: 71, optimized: 59, status: 'compliant' },
    { zone: 'Western Eco-corridor', baseline: 58, optimized: 44, status: 'compliant' }
  ]
};

export const initialSolarData: SolarAnalysisData = {
  peakExposurePercent: 82,
  estimatedReductionPercent: 30,
  annualRadiationKwhM2: 1780,
  optimizedRadiationKwhM2: 1246,
  shadingEfficiencyPercent: 78,
  orientationOffsetDeg: -18,
  façadeMetrics: [
    { façade: 'North', exposure: 42, recommendedShading: 'Minimal Overhang (0.4m)' },
    { façade: 'South', exposure: 88, recommendedShading: 'Dynamic Louvers + Deep Canopy (1.2m)' },
    { façade: 'East', exposure: 76, recommendedShading: 'Vertical Shading Fins' },
    { façade: 'West', exposure: 92, recommendedShading: 'High Performance BIPV + Double Skin' }
  ]
};

export const initialHydrologyData: HydrologyAnalysisData = {
  runoffHandlingPercent: 82,
  terrainSlope: 'Moderate Slope (4.2% grade)',
  averageSlopePercent: 4.2,
  peakPrecipitationCapacityMmHr: 65,
  rechargeZoneAreaSqM: 4200,
  swaleLengthMeters: 380,
  floodRiskLevel: 'Moderate',
  waterRoutingEfficiencyPercent: 84
};

export const initialResilienceBreakdown: ResilienceBreakdown = {
  overallScore: 88,
  ratingLabel: 'High Resilience Potential',
  acousticScore: 90,
  solarScore: 86,
  waterScore: 82,
  accessibilityScore: 94,
  historicalTrend: [
    { month: 'Baseline', score: 54 },
    { month: 'Phase 1', score: 68 },
    { month: 'Phase 2', score: 79 },
    { month: 'Simulation', score: 88 }
  ]
};

export const getKPIs = (mode: PlanningMode = 'urban'): KPIItem[] => [
  {
    id: 'kpi-noise',
    label: 'Noise Reduction (Est.)',
    value: '~15',
    unit: 'dB',
    delta: 'Estimated Demo Value',
    trend: 'positive',
    benchmark: 'Demo Baseline: 78 dB → Est: ~63 dB',
    description: 'Estimated demo value: 3.5m perimeter acoustic barrier + vegetation buffer heuristic.',
    iconName: 'Volume2',
    accentColor: 'cyan'
  },
  {
    id: 'kpi-solar',
    label: 'Solar Heat Reduction (Est.)',
    value: '~30',
    unit: '%',
    delta: 'Estimated Demo Value',
    trend: 'positive',
    benchmark: 'Demo Est: ~534 kWh/m² cooling cut',
    description: 'Estimated demo value: -18° façade azimuth reorientation & shading louvers.',
    iconName: 'Sun',
    accentColor: 'amber'
  },
  {
    id: 'kpi-runoff',
    label: 'Runoff Handling (Est.)',
    value: '~82',
    unit: '%',
    delta: 'Estimated Demo Value',
    trend: 'positive',
    benchmark: 'Demo Est: 65 mm/hr storm capacity',
    description: 'Estimated demo value: 380m bioswales & 4,200 m² retention recharge basin.',
    iconName: 'Waves',
    accentColor: 'blue'
  },
  {
    id: 'kpi-resilience',
    label: 'Resilience Score (Proto)',
    value: '88',
    unit: '/ 100',
    delta: 'Prototype Index',
    trend: 'positive',
    benchmark: 'High Resilience Potential (Demo)',
    description: 'Estimated composite score balancing acoustic, solar, flood, and connectivity.',
    iconName: 'ShieldCheck',
    accentColor: 'emerald'
  }
];

export const initialRecommendations: RecommendationItem[] = [
  {
    id: 'rec-1',
    title: 'Add acoustic barrier along northern road edge',
    category: 'Acoustic',
    priority: 'high',
    impact: '~15 dB noise reduction along northern arterial road (Estimated Demo Value)',
    explanation: 'A 3.5m earth-berm reinforced timber acoustic wall shields residential blocks A1 and A2 from heavy NH 544 traffic noise.',
    mode: 'urban',
    status: 'recommended',
    iconType: 'barrier'
  },
  {
    id: 'rec-2',
    title: 'Increase vegetation buffer near noise source',
    category: 'Urban Design',
    priority: 'medium',
    impact: 'Estimated ~3 dB acoustic attenuation & ~1.8°C microclimate cooling (Demo)',
    explanation: 'Multi-tiered native broadleaf tree canopy (Neem, Pongamia, Bamboo) creates a dense 8-meter natural buffer zone.',
    mode: 'both',
    status: 'recommended',
    iconType: 'tree'
  },
  {
    id: 'rec-3',
    title: 'Reorient Building B2 to reduce peak solar exposure',
    category: 'Solar',
    priority: 'high',
    impact: '~30% solar heat-gain reduction on west-facing glazing (Estimated Demo Value)',
    explanation: 'Rotating long axis 18° north-of-east minimizes intense afternoon tropical radiation while capturing prevailing cross-ventilation breezes.',
    mode: 'urban',
    status: 'recommended',
    iconType: 'sun'
  },
  {
    id: 'rec-4',
    title: 'Route stormwater toward proposed recharge zone',
    category: 'Hydrology',
    priority: 'high',
    impact: '~82% runoff capture and zero surface ponding during 50-year storm events (Estimated Demo Value)',
    explanation: 'Constructed parabolic bioswales convey site runoff by gravity to the south-eastern natural aquifer recharge zone.',
    mode: 'both',
    status: 'recommended',
    iconType: 'water'
  },
  {
    id: 'rec-5',
    title: 'Improve pedestrian & emergency access to essential facilities',
    category: 'Accessibility',
    priority: 'medium',
    impact: 'Reduces emergency transit time to 8 min with all-weather porous paths',
    explanation: 'Dedicated permeable multi-modal pathway links the site core directly to primary healthcare and transit nodes.',
    mode: 'both',
    status: 'recommended',
    iconType: 'road'
  },
  {
    id: 'rec-6',
    title: 'Deploy elevated agrivoltaic dual-use solar arrays',
    category: 'Rural Planning',
    priority: 'high',
    impact: '74% land utilization with 1.2 MW clean energy generation & shade crops',
    explanation: '3.8m high single-axis tracking photovoltaic canopies allow tractor access and cultivate shade-tolerant pulses underneath.',
    mode: 'rural',
    status: 'recommended',
    iconType: 'zap'
  }
];

export const initialOptimizationObjectives: OptimizationObjective[] = [
  { id: 'obj-noise', name: 'Noise Reduction', weight: 30, currentScore: 90, targetScore: 95, color: '#06b6d4', unit: 'dB' },
  { id: 'obj-solar', name: 'Solar Reduction', weight: 25, currentScore: 82, targetScore: 90, color: '#f59e0b', unit: '%' },
  { id: 'obj-water', name: 'Water Management', weight: 20, currentScore: 84, targetScore: 90, color: '#3b82f6', unit: '%' },
  { id: 'obj-access', name: 'Accessibility', weight: 15, currentScore: 94, targetScore: 95, color: '#10b981', unit: 'min' },
  { id: 'obj-land', name: 'Land Utilization', weight: 10, currentScore: 78, targetScore: 85, color: '#a855f7', unit: '%' }
];

export const optimizationCandidates: OptimizationCandidate[] = [
  {
    id: 'cand-a',
    name: 'Candidate A — Balanced Resilience',
    tagline: 'Recommended Pareto-Optimal Plan (Multi-Hazard Equilibrium)',
    isBest: true,
    paretoRank: 1,
    scores: {
      acoustic: 90,
      solar: 86,
      water: 84,
      accessibility: 94,
      landUtilization: 82,
      overall: 88
    },
    metrics: {
      noiseReductionDb: 15,
      heatReductionPct: 30,
      runoffHandlingPct: 82,
      accessTimeMin: 8,
      greenCoveragePct: 38
    },
    tradeoffSummary: 'Optimal harmony between acoustic perimeter berms, building solar orientation, and bioswale drainage network.'
  },
  {
    id: 'cand-b',
    name: 'Candidate B — Acoustic & Ecological Focus',
    tagline: 'Maximized Noise Attenuation & Green Buffers',
    isBest: false,
    paretoRank: 2,
    scores: {
      acoustic: 96,
      solar: 78,
      water: 88,
      accessibility: 82,
      landUtilization: 72,
      overall: 84
    },
    metrics: {
      noiseReductionDb: 18,
      heatReductionPct: 24,
      runoffHandlingPct: 88,
      accessTimeMin: 11,
      greenCoveragePct: 46
    },
    tradeoffSummary: 'Thicker 14m vegetation buffer and high berms provide 18 dB acoustic cut at the expense of slightly reduced buildable area.'
  },
  {
    id: 'cand-c',
    name: 'Candidate C — Solar & Density Focus',
    tagline: 'Maximum Solar Shading & Compact Footprint',
    isBest: false,
    paretoRank: 3,
    scores: {
      acoustic: 80,
      solar: 94,
      water: 76,
      accessibility: 90,
      landUtilization: 91,
      overall: 83
    },
    metrics: {
      noiseReductionDb: 11,
      heatReductionPct: 38,
      runoffHandlingPct: 74,
      accessTimeMin: 7,
      greenCoveragePct: 29
    },
    tradeoffSummary: 'Aggressive building orientation and extensive solar canopy structures minimize cooling load with compact utility lines.'
  }
];

export const formaConnectionStatus: FormaConnectionState = {
  status: 'demo_mode',
  extensionId: 'resiliforma-forma-ext-v0.9-alpha',
  projectSync: 'Coimbatore_Urban_Demo_v2.forma',
  lastPing: 'Local Mock Environment',
  message: 'ResiliForma is currently running with prototype site data. Autodesk Forma API/Extension integration will be connected in a later development phase.'
};

/**
 * Prototype simulation helpers for realistic interactive dashboard experience
 */
export async function simulateSiteAnalysis(): Promise<{
  updatedSite: SiteInfoData;
  updatedKPIs: KPIItem[];
  updatedBreakdown: ResilienceBreakdown;
}> {
  await new Promise(resolve => setTimeout(resolve, 1400));
  
  return {
    updatedSite: {
      ...initialSiteInfo,
      lastAnalyzed: 'Just now (Recalculated Simulation)'
    },
    updatedKPIs: getKPIs('urban'),
    updatedBreakdown: {
      ...initialResilienceBreakdown,
      overallScore: 89,
      acousticScore: 91,
      solarScore: 87,
      waterScore: 83,
      accessibilityScore: 95
    }
  };
}

export async function simulatePlanGeneration(mode: PlanningMode): Promise<{
  planName: string;
  generatedDate: string;
  score: number;
  highlight: string;
}> {
  await new Promise(resolve => setTimeout(resolve, 1600));

  if (mode === 'urban') {
    return {
      planName: 'ResiliForma Urban Master Plan v2.4',
      generatedDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      score: 89,
      highlight: 'Integrated 3.5m northern acoustic wall + 18° solar azimuth rotation on Block B2.'
    };
  } else {
    return {
      planName: 'ResiliForma Agrivoltaic Rural Plan v1.8',
      generatedDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      score: 91,
      highlight: 'Configured 74% agrivoltaic dual-use land with gravity-fed detention bioswales.'
    };
  }
}
