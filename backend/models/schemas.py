from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, field_validator, model_validator


# ==============================================================================
# BASE COMPONENT INPUT MODELS
# ==============================================================================

class LocationModel(BaseModel):
    city: str = Field(default="Coimbatore", description="City name")
    state: str = Field(default="Tamil Nadu", description="State or province")
    country: str = Field(default="India", description="Country name")
    latitude: Optional[float] = Field(default=11.0168, ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    longitude: Optional[float] = Field(default=76.9558, ge=-180.0, le=180.0, description="Longitude in decimal degrees")
    formatted_address: Optional[str] = Field(default=None, description="Formatted location label")


class TerrainModel(BaseModel):
    type: str = Field(default="Mixed", description="Terrain typology (e.g. Flat, Mixed, Steep Slope)")
    mean_slope_percent: float = Field(default=4.2, ge=0.0, le=100.0, description="Mean terrain slope percentage")
    drainage_direction: Optional[str] = Field(default="North to South-East", description="Natural runoff direction")


class NoiseInputModel(BaseModel):
    source: str = Field(default="Road Traffic", description="Primary environmental noise source")
    baseline_db: float = Field(default=78.0, ge=30.0, le=130.0, description="Ambient baseline sound pressure level in decibels (dBA)")
    target_db: Optional[float] = Field(default=65.0, ge=30.0, le=100.0, description="Target regulatory sound level (e.g., WHO residential standard)")
    barrier_height_m: Optional[float] = Field(default=3.5, ge=0.0, le=10.0, description="Proposed acoustic barrier height in meters")
    veg_depth_m: Optional[float] = Field(default=8.0, ge=0.0, le=30.0, description="Proposed vegetation buffer depth in meters")


class SolarInputModel(BaseModel):
    peak_exposure_percent: float = Field(default=82.0, ge=0.0, le=100.0, description="Peak solar exposure percentage on critical façades")
    orientation_offset_deg: Optional[float] = Field(default=-18.0, ge=-90.0, le=90.0, description="Building long-axis rotation angle in degrees")
    louver_depth_m: Optional[float] = Field(default=1.2, ge=0.0, le=5.0, description="Exterior shading louver overhang depth in meters")
    critical_façade: Optional[str] = Field(default="West", description="Façade with peak afternoon thermal exposure")


class HydrologyInputModel(BaseModel):
    runoff_risk: Literal["Low", "Moderate", "High", "Critical"] = Field(default="Moderate", description="Site surface runoff risk category")
    precipitation_intensity_mm_hr: Optional[float] = Field(default=65.0, ge=0.0, le=300.0, description="Design storm rainfall intensity in mm/hr")
    storm_event: Optional[Literal["25yr", "50yr", "100yr"]] = Field(default="50yr", description="Storm return period scenario")
    proposed_recharge_area_sq_m: Optional[float] = Field(default=4200.0, ge=0.0, description="Sized retention & aquifer recharge basin area in m²")


# ==============================================================================
# API REQUEST MODELS
# ==============================================================================

class SiteAnalysisRequest(BaseModel):
    site_id: str = Field(default="demo-site-01", description="Unique site identifier")
    location: Optional[LocationModel] = Field(default_factory=LocationModel, description="Geographic location details")
    area_hectares: float = Field(default=12.4, gt=0.0, le=10000.0, description="Total developable parcel area in hectares")
    building_count: int = Field(default=8, ge=1, le=500, description="Number of building footprints on site")
    terrain: Optional[TerrainModel] = Field(default_factory=TerrainModel, description="Terrain and topography parameters")
    noise: Optional[NoiseInputModel] = Field(default_factory=NoiseInputModel, description="Acoustic hazard parameters")
    solar: Optional[SolarInputModel] = Field(default_factory=SolarInputModel, description="Solar thermal exposure parameters")
    hydrology: Optional[HydrologyInputModel] = Field(default_factory=HydrologyInputModel, description="Watershed and stormwater parameters")

    model_config = {
        "json_schema_extra": {
            "example": {
                "site_id": "demo-site-01",
                "location": {
                    "city": "Coimbatore",
                    "state": "Tamil Nadu",
                    "country": "India",
                    "latitude": 11.0168,
                    "longitude": 76.9558
                },
                "area_hectares": 12.4,
                "building_count": 8,
                "terrain": {
                    "type": "Mixed",
                    "mean_slope_percent": 4.2
                },
                "noise": {
                    "source": "Road Traffic",
                    "baseline_db": 78.0,
                    "barrier_height_m": 3.5,
                    "veg_depth_m": 8.0
                },
                "solar": {
                    "peak_exposure_percent": 82.0,
                    "orientation_offset_deg": -18.0,
                    "louver_depth_m": 1.2
                },
                "hydrology": {
                    "runoff_risk": "Moderate",
                    "precipitation_intensity_mm_hr": 65.0
                }
            }
        }
    }


class UrbanAnalysisRequest(BaseModel):
    site_id: str = Field(default="demo-site-01", description="Unique site identifier")
    area_hectares: float = Field(default=12.4, gt=0.0)
    building_count: int = Field(default=8, ge=1)
    baseline_noise_db: float = Field(default=78.0, ge=30.0, le=130.0)
    barrier_height_m: float = Field(default=3.5, ge=0.0, le=10.0)
    veg_buffer_depth_m: float = Field(default=8.0, ge=0.0, le=30.0)
    solar_exposure_percent: float = Field(default=82.0, ge=0.0, le=100.0)
    azimuth_rotation_deg: float = Field(default=-18.0, ge=-90.0, le=90.0)
    shading_louver_depth_m: float = Field(default=1.2, ge=0.0, le=5.0)


class RuralAnalysisRequest(BaseModel):
    site_id: str = Field(default="demo-site-01", description="Unique site identifier")
    area_hectares: float = Field(default=12.4, gt=0.0)
    mean_slope_percent: float = Field(default=4.2, ge=0.0, le=100.0)
    runoff_risk: Literal["Low", "Moderate", "High", "Critical"] = Field(default="Moderate")
    storm_scenario: Literal["25yr", "50yr", "100yr"] = Field(default="50yr")
    agrivoltaic_area_pct: float = Field(default=25.0, ge=0.0, le=100.0)
    target_recharge_m2: float = Field(default=4200.0, ge=0.0)


class OptimizationWeightsRequest(BaseModel):
    acoustic_weight: float = Field(default=30.0, ge=0.0, le=100.0, description="Weight percentage for acoustic resilience")
    solar_weight: float = Field(default=25.0, ge=0.0, le=100.0, description="Weight percentage for solar performance")
    hydrology_weight: float = Field(default=20.0, ge=0.0, le=100.0, description="Weight percentage for water management")
    accessibility_weight: float = Field(default=15.0, ge=0.0, le=100.0, description="Weight percentage for multimodal accessibility")
    land_utilization_weight: float = Field(default=10.0, ge=0.0, le=100.0, description="Weight percentage for land use efficiency")

    @field_validator("acoustic_weight", "solar_weight", "hydrology_weight", "accessibility_weight", "land_utilization_weight")
    @classmethod
    def check_non_negative(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Weights must be non-negative numbers")
        return v

    @model_validator(mode="after")
    def check_total_weight(self):
        total = (
            self.acoustic_weight +
            self.solar_weight +
            self.hydrology_weight +
            self.accessibility_weight +
            self.land_utilization_weight
        )
        if total <= 0:
            raise ValueError("Total sum of objective weights must be greater than 0")
        return self


# ==============================================================================
# API RESPONSE COMPONENT MODELS
# ==============================================================================

class AcousticResultModel(BaseModel):
    baseline_db: float
    optimized_db: float
    reduction_db: float
    target_db: float
    target_achieved: bool
    barrier_attenuation_db: float
    vegetation_loss_db: float
    status: Literal["prototype_estimate"] = "prototype_estimate"
    methodology_note: str = "Prototype diffractive heuristic based on barrier height and vegetative foliage depth. Not certified ISO 9613-2 ray tracing."


class SolarResultModel(BaseModel):
    peak_exposure_percent: float
    estimated_heat_gain_reduction_percent: float
    annual_baseline_radiation_kwh_m2: float
    annual_optimized_radiation_kwh_m2: float
    recommended_orientation: str
    shading_efficiency_percent: float
    status: Literal["prototype_estimate"] = "prototype_estimate"
    methodology_note: str = "Prototype geometric heuristic based on building long-axis rotation and exterior louver geometry. Not a certified solar physics / CFD simulation."


class HydrologyResultModel(BaseModel):
    runoff_handling_percent: float
    terrain_risk: str
    peak_discharge_reduction_percent: float
    recommended_interventions: List[str]
    sized_swale_length_m: float
    sized_recharge_basin_m2: float
    status: Literal["prototype_estimate"] = "prototype_estimate"
    methodology_note: str = "Prototype estimate using rational runoff coefficient heuristics. Not certified EPA SWMM hydrodynamic watershed simulation."


class AccessResultModel(BaseModel):
    nearest_essential_facility_minutes: float
    accessibility_status: Literal["Good", "Moderate", "Limited"]
    active_transport_buffer_m: float
    emergency_egress_routes: int
    status: Literal["prototype_estimate"] = "prototype_estimate"
    methodology_note: str = "Prototype travel time index. Real spatial network graph routing will integrate in future development phases."


class ResilienceComponentsModel(BaseModel):
    acoustic: int = Field(ge=0, le=100)
    solar: int = Field(ge=0, le=100)
    water: int = Field(ge=0, le=100)
    accessibility: int = Field(ge=0, le=100)


class ResilienceScoreModel(BaseModel):
    score: int = Field(ge=0, le=100)
    rating: str
    components: ResilienceComponentsModel
    formula_weights: Dict[str, float]
    status: Literal["prototype_index"] = "prototype_index"


class RecommendationItemModel(BaseModel):
    id: str
    category: str
    priority: Literal["High", "Medium", "Low", "high", "medium", "low"]
    title: str
    explanation: str
    expected_impact: str
    mode: Literal["urban", "rural", "both"] = "both"


class CandidateScoresModel(BaseModel):
    acoustic: int
    solar: int
    water: int
    accessibility: int
    land_utilization: int
    overall: int


class CandidateSolutionModel(BaseModel):
    id: str
    name: str
    tagline: str
    scores: CandidateScoresModel
    tradeoff_summary: str
    is_recommended: bool


class OptimizationResultModel(BaseModel):
    candidates: List[CandidateSolutionModel]
    recommended_candidate: str
    applied_weights: Dict[str, float]
    status: Literal["prototype_optimization"] = "prototype_optimization"
    methodology_note: str = "Deterministic multi-attribute candidate scoring. Structured for future drop-in replacement by NSGA-II / pymoo Pareto genetic algorithms."


class SiteSummaryModel(BaseModel):
    site_id: str
    location: str
    area_hectares: float
    building_count: int


class MetaInfoModel(BaseModel):
    mode: Literal["prototype"] = "prototype"
    forma_connected: bool = False
    forma_status: str = "Demo Mode / Integration Pending"
    api_version: str = "1.0.0"


# ==============================================================================
# MAIN API RESPONSE MODELS
# ==============================================================================

class SiteAnalysisResponse(BaseModel):
    site: SiteSummaryModel
    acoustic: AcousticResultModel
    solar: SolarResultModel
    hydrology: HydrologyResultModel
    access: AccessResultModel
    resilience: ResilienceScoreModel
    recommendations: List[RecommendationItemModel]
    meta: MetaInfoModel


class UrbanAnalysisResponse(BaseModel):
    site_id: str
    mode: Literal["urban"] = "urban"
    acoustic: AcousticResultModel
    solar: SolarResultModel
    resilience_score: int
    urban_recommendations: List[RecommendationItemModel]
    meta: MetaInfoModel


class RuralAnalysisResponse(BaseModel):
    site_id: str
    mode: Literal["rural"] = "rural"
    hydrology: HydrologyResultModel
    access: AccessResultModel
    agrivoltaics: Dict[str, Any]
    resilience_score: int
    rural_recommendations: List[RecommendationItemModel]
    meta: MetaInfoModel


class HealthResponse(BaseModel):
    status: Literal["success"] = "success"
    service: str = "ResiliForma API"
    version: str = "1.0.0"
    mode: Literal["prototype"] = "prototype"
    docs_url: str = "/docs"


class DemoSiteDetail(BaseModel):
    site_id: str
    name: str
    location: LocationModel
    area_hectares: float
    building_count: int
    terrain: TerrainModel
    climate: Dict[str, Any]
    noise: NoiseInputModel
    solar: SolarInputModel
    hydrology: HydrologyInputModel
    accessibility: Dict[str, Any]
    meta: MetaInfoModel


class DemoSitesListResponse(BaseModel):
    count: int
    sites: List[DemoSiteDetail]


# ==============================================================================
# AUTODESK FORMA EXTENSION MODELS (Contract agreed in TODO)
# ==============================================================================

class FormaBuildingModel(BaseModel):
    id: str = Field(default="B1", description="Forma Element ID / Building identifier")
    name: Optional[str] = Field(default="Building 1", description="Building name or label")
    height_m: Optional[float] = Field(default=18.0, ge=0.0, le=500.0, description="Building height in meters")
    azimuth_deg: Optional[float] = Field(default=0.0, ge=-180.0, le=180.0, description="Orientation long-axis rotation angle in degrees")
    footprint_sq_m: Optional[float] = Field(default=850.0, ge=0.0, description="Gross ground footprint area in m²")
    exposure_pct: Optional[float] = Field(default=75.0, ge=0.0, le=100.0, description="Solar thermal radiation exposure index")
    geometry_polygon: Optional[List[List[float]]] = Field(default=None, description="2D/3D polygon vertices [ [x, y], ... ]")


class FormaTerrainDataModel(BaseModel):
    type: Optional[str] = Field(default="Mixed", description="Terrain classification")
    mean_slope_percent: Optional[float] = Field(default=4.2, ge=0.0, le=100.0, description="Mean slope percentage")
    elevation_min: Optional[float] = Field(default=410.0, description="Minimum elevation above sea level in meters")
    elevation_max: Optional[float] = Field(default=425.0, description="Maximum elevation above sea level in meters")
    drainage_vector: Optional[List[float]] = Field(default=[0.0, -1.0], description="Primary runoff slope vector [dx, dy]")


class FormaRoadModel(BaseModel):
    id: str = Field(default="R1", description="Road segment identifier")
    name: Optional[str] = Field(default="North Arterial Road", description="Road name")
    traffic_type: Optional[str] = Field(default="heavy", description="Traffic classification: heavy, moderate, light")
    distance_to_site_m: Optional[float] = Field(default=15.0, ge=0.0, description="Distance from road edge to nearest building in meters")
    baseline_db: Optional[float] = Field(default=78.0, ge=30.0, le=130.0, description="Noise level emitted at source")


class FormaNoiseSourceModel(BaseModel):
    id: str = Field(default="N1", description="Noise emitter source ID")
    source_type: Optional[str] = Field(default="highway", description="Source classification (highway, rail, industrial)")
    baseline_db: Optional[float] = Field(default=78.0, ge=30.0, le=130.0, description="Baseline unmitigated sound level (dBA)")
    barrier_height_m: Optional[float] = Field(default=3.5, ge=0.0, le=10.0, description="Existing/proposed barrier height")
    veg_depth_m: Optional[float] = Field(default=8.0, ge=0.0, le=50.0, description="Existing/proposed vegetative buffer depth")


class FormaSitePayload(BaseModel):
    site_id: str = Field(default="demo-site-01", description="Unique site / Forma project ID")
    location: Optional[Dict[str, Any]] = Field(
        default_factory=lambda: {"latitude": 11.0168, "longitude": 76.9558},
        description="Site geographic coordinate"
    )
    buildings: Optional[List[FormaBuildingModel]] = Field(default_factory=list, description="Array of Forma building elements")
    terrain: Optional[FormaTerrainDataModel] = Field(default_factory=FormaTerrainDataModel, description="Terrain surface attributes")
    roads: Optional[List[FormaRoadModel]] = Field(default_factory=list, description="Adjacent traffic corridors")
    noise_sources: Optional[List[FormaNoiseSourceModel]] = Field(default_factory=list, description="Acoustic hazard sources")
    barrier_height_m: Optional[float] = Field(default=3.5, ge=0.0, le=10.0, description="Interactive barrier height override in meters")
    veg_depth_m: Optional[float] = Field(default=8.0, ge=0.0, le=50.0, description="Interactive vegetation depth override in meters")
    louver_depth_m: Optional[float] = Field(default=1.2, ge=0.0, le=5.0, description="Interactive solar louver depth in meters")

    model_config = {
        "json_schema_extra": {
            "example": {
                "site_id": "demo-site-01",
                "location": {
                    "latitude": 11.0168,
                    "longitude": 76.9558
                },
                "buildings": [
                    { "id": "B1", "name": "Building 1", "height_m": 18, "azimuth_deg": 45, "footprint_sq_m": 850, "exposure_pct": 75 },
                    { "id": "B2", "name": "Building 2", "height_m": 24, "azimuth_deg": -18, "footprint_sq_m": 1200, "exposure_pct": 82 },
                    { "id": "B3", "name": "Building 3", "height_m": 12, "azimuth_deg": 0, "footprint_sq_m": 600, "exposure_pct": 60 }
                ],
                "terrain": {
                    "type": "Mixed",
                    "mean_slope_percent": 4.2,
                    "elevation_min": 410,
                    "elevation_max": 425
                },
                "roads": [
                    { "id": "R1", "name": "North Arterial Road", "traffic_type": "heavy", "distance_to_site_m": 15, "baseline_db": 78 }
                ],
                "noise_sources": [
                    { "id": "N1", "source_type": "highway", "baseline_db": 78, "barrier_height_m": 3.5, "veg_depth_m": 8.0 }
                ]
            }
        }
    }


class FormaAcousticOutput(BaseModel):
    noise_before: float = Field(description="Ambient sound level before mitigation (dBA)")
    noise_after: float = Field(description="Net sound level after mitigation (dBA)")
    reduction_db: float = Field(description="Total decibel reduction achieved (dB)")
    target_achieved: Optional[bool] = Field(default=True, description="Whether regulatory 65 dBA threshold is satisfied")


class FormaSolarOutput(BaseModel):
    heat_gain_reduction: float = Field(description="Estimated solar heat gain reduction percentage (%)")
    peak_exposure_percent: Optional[float] = Field(default=82.0, description="Peak solar exposure before optimization (%)")
    recommended_azimuth_deg: Optional[float] = Field(default=-18.0, description="Recommended building long-axis azimuth offset")


class FormaIntervention(BaseModel):
    id: str
    type: str
    target_element_id: Optional[str] = None
    title: str
    description: str
    parameters: Dict[str, Any] = Field(default_factory=dict)
    forma_command: str


class FormaAnalysisResponse(BaseModel):
    site_id: str
    acoustic: FormaAcousticOutput
    solar: FormaSolarOutput
    resilience_score: int
    recommendations: List[str]
    interventions: Optional[List[FormaIntervention]] = Field(default_factory=list)
    details: Optional[Dict[str, Any]] = Field(default_factory=dict)
    meta: MetaInfoModel = Field(default_factory=MetaInfoModel)

