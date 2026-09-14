"""
Pydantic data schemas for ResiliForma API.
Deterministic multi-hazard screening extension for Autodesk Forma workflows.
"""
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class SiteAnalysisRequest(BaseModel):
    barrier_height: float = Field(default=0.0, ge=0.0, le=10.0, description="Acoustic barrier height in meters")
    vegetation_depth: float = Field(default=0.0, ge=0.0, le=30.0, description="Vegetation buffer depth in meters")
    louver_depth: float = Field(default=0.0, ge=0.0, le=5.0, description="Solar shading louver depth in meters")
    orientation_offset: float = Field(default=0.0, ge=-90.0, le=90.0, description="Façade orientation offset in degrees")
    baseline_noise_db: float = Field(default=78.0, ge=40.0, le=110.0, description="Baseline road traffic noise in dBA")
    baseline_irradiance: float = Field(default=710.0, ge=100.0, le=1200.0, description="Baseline peak solar irradiance in W/m²")
    runoff_coefficient: float = Field(default=0.85, ge=0.2, le=0.98, description="Catchment runoff coefficient (C)")
    rainfall_intensity: float = Field(default=65.0, ge=10.0, le=200.0, description="Design rainfall intensity in mm/hr")
    catchment_area_ha: float = Field(default=21.04, ge=1.0, le=200.0, description="Site catchment area in hectares")
    bioswale_length: float = Field(default=0.0, ge=0.0, le=5000.0, description="Total bioswale length in meters")
    retention_capacity: float = Field(default=0.0, ge=0.0, le=50000.0, description="Stormwater retention pond capacity in m³")

class NoiseAnalysisResult(BaseModel):
    baseline_db: float
    barrier_height_m: float
    vegetation_depth_m: float
    barrier_attenuation_db: float
    vegetation_attenuation_db: float
    total_reduction_db: float
    optimized_noise_db: float
    status: str
    disclaimer: str

class SolarAnalysisResult(BaseModel):
    baseline_irradiance: float
    orientation_offset_deg: float
    louver_depth_m: float
    orientation_relief_percent: float
    louver_relief_percent: float
    total_reduction_percent: float
    estimated_irradiance: float
    status: str
    disclaimer: str

class StormwaterAnalysisResult(BaseModel):
    runoff_coefficient: float
    rainfall_intensity_mmhr: float
    catchment_area_ha: float
    area_km2: float
    peak_runoff_m3s: float
    total_runoff_volume_m3: float
    bioswale_length_m: float
    retention_capacity_m3: float
    runoff_management_percent: float
    mitigated_volume_m3: float
    net_discharge_m3: float
    net_peak_discharge_m3s: float
    status: str
    disclaimer: str

class SubScores(BaseModel):
    noise: float
    solar: float
    stormwater: float
    accessibility: float
    land_efficiency: float

class ResilienceScoreResult(BaseModel):
    composite_score: int
    grade: str
    grade_label: str
    status_color: str
    sub_scores: SubScores
    weights: Dict[str, float]
    disclaimer: str

class SiteAnalysisResponse(BaseModel):
    noise: NoiseAnalysisResult
    solar: SolarAnalysisResult
    stormwater: StormwaterAnalysisResult
    score: ResilienceScoreResult

class ProposalCompareRequest(BaseModel):
    baseline: SiteAnalysisRequest
    resilient: SiteAnalysisRequest

class ProposalCompareResponse(BaseModel):
    baseline: SiteAnalysisResponse
    resilient: SiteAnalysisResponse
    delta_score: int
    noise_reduction_gain_db: float
    solar_reduction_gain_percent: float
    stormwater_management_gain_percent: float
    summary: str
