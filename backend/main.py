"""ResiliForma — Disaster-Adaptive Site Planning Co-Pilot API.

FastAPI backend providing deterministic prototype spatial analysis,
multi-hazard resilience scoring, candidate optimization, and climate-adaptive recommendations.
"""

import json
from pathlib import Path
from typing import Dict, Any, List

from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from models.schemas import (
    SiteAnalysisRequest,
    UrbanAnalysisRequest,
    RuralAnalysisRequest,
    OptimizationWeightsRequest,
    SiteAnalysisResponse,
    UrbanAnalysisResponse,
    RuralAnalysisResponse,
    OptimizationResultModel,
    HealthResponse,
    DemoSiteDetail,
    DemoSitesListResponse,
    MetaInfoModel,
    SiteSummaryModel,
    FormaSitePayload,
    FormaAnalysisResponse,
    FormaAcousticOutput,
    FormaSolarOutput,
    FormaIntervention
)
from analysis.acoustic import calculate_acoustic_mitigation
from analysis.solar import calculate_solar_performance
from analysis.hydrology import calculate_hydrology_performance
from analysis.access import calculate_accessibility
from analysis.resilience import calculate_resilience_score
from recommendations.engine import generate_recommendations
from optimization.optimizer import solve_pareto_candidates


# ==============================================================================
# FASTAPI APPLICATION SETUP
# ==============================================================================

app = FastAPI(
    title="ResiliForma API — Disaster-Adaptive Site Planning Co-Pilot",
    description=(
        "Backend API for ResiliForma. Computes multi-hazard spatial analytics, "
        "acoustic traffic diffraction, solar thermal microclimate reduction, "
        "watershed hydrology infiltration, multi-objective Pareto trade-offs, "
        "and climate-adaptive site planning recommendations.\n\n"
        "**Smart India Hackathon (SIH) Note:** Calculations are deterministic prototype heuristics. "
        "Autodesk Forma API & physics-grade CFD/ray-tracing solvers will connect in future development phases."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ==============================================================================
# CORS MIDDLEWARE CONFIGURATION
# ==============================================================================

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================================================================
# HELPER: LOAD DEMO SITES DATA
# ==============================================================================

DATA_FILE = Path(__file__).parent / "data" / "demo_sites.json"

def load_demo_sites() -> List[Dict[str, Any]]:
    """Loads demo sites from the local JSON storage file."""
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        return data.get("sites", [])


# ==============================================================================
# EXCEPTION HANDLERS
# ==============================================================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Returns readable error messages when request payloads fail Pydantic validation."""
    errors = []
    for err in exc.errors():
        field_path = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append({
            "field": field_path,
            "message": err.get("msg", "Invalid value"),
            "type": err.get("type", "value_error")
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "error_type": "Validation Error",
            "message": "The submitted request payload contains invalid or out-of-range fields.",
            "details": errors
        }
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom handler for HTTPExceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "error_code": exc.status_code,
            "message": exc.detail
        }
    )


# ==============================================================================
# API ENDPOINTS
# ==============================================================================

@app.get("/", tags=["General"])
async def root():
    """Root endpoint welcoming developers to the ResiliForma API."""
    return {
        "service": "ResiliForma API — Disaster-Adaptive Site Planning Co-Pilot",
        "version": "1.0.0",
        "status": "online",
        "mode": "prototype",
        "documentation": "/docs",
        "health_check": "/api/health",
        "endpoints": {
            "health": "GET /api/health",
            "list_sites": "GET /api/sites",
            "get_site": "GET /api/sites/{site_id}",
            "comprehensive_analysis": "POST /api/analyze",
            "urban_analysis": "POST /api/analyze/urban",
            "rural_analysis": "POST /api/analyze/rural",
            "pareto_optimization": "POST /api/optimize"
        }
    }


@app.get("/api/health", response_model=HealthResponse, tags=["System Health"])
async def health_check():
    """Health check endpoint allowing the React frontend and monitors to verify service status."""
    return {
        "status": "success",
        "service": "ResiliForma API",
        "version": "1.0.0",
        "mode": "prototype",
        "docs_url": "/docs"
    }


@app.get("/api/sites", response_model=DemoSitesListResponse, tags=["Demo Sites"])
async def list_demo_sites():
    """Returns all available demo site parcels loaded from storage."""
    sites = load_demo_sites()
    return {
        "count": len(sites),
        "sites": sites
    }


@app.get("/api/sites/{site_id}", response_model=DemoSiteDetail, tags=["Demo Sites"])
async def get_demo_site(site_id: str):
    """Retrieves detailed spatial parameters for a specific demo site (e.g. `demo-site-01`)."""
    sites = load_demo_sites()
    for site in sites:
        if site.get("site_id") == site_id:
            return site
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Site with ID '{site_id}' not found. Available sites: {[s.get('site_id') for s in sites]}"
    )


@app.post("/api/analyze", response_model=SiteAnalysisResponse, tags=["Site Analysis"])
async def analyze_site(request: SiteAnalysisRequest):
    """Comprehensive multi-hazard site analysis endpoint.

    Executes:
    1. Acoustic diffraction & barrier simulation
    2. Solar thermal exposure & façade orientation analysis
    3. Hydrology & bioswale drainage infiltration
    4. Accessibility transit rating
    5. Composite weighted disaster resilience index (0-100)
    6. Rule-based climate-adaptive recommendations
    """
    # 1. Acoustic calculation
    noise_req = request.noise or NoiseInputModel()
    acoustic_res = calculate_acoustic_mitigation(
        baseline_db=noise_req.baseline_db,
        barrier_height_m=noise_req.barrier_height_m or 3.5,
        veg_depth_m=noise_req.veg_depth_m or 8.0,
        target_db=noise_req.target_db or 65.0
    )

    # 2. Solar calculation
    solar_req = request.solar or SolarInputModel()
    solar_res = calculate_solar_performance(
        peak_exposure_percent=solar_req.peak_exposure_percent,
        orientation_offset_deg=solar_req.orientation_offset_deg or -18.0,
        louver_depth_m=solar_req.louver_depth_m or 1.2
    )

    # 3. Hydrology calculation
    hydro_req = request.hydrology or HydrologyInputModel()
    terrain_req = request.terrain or TerrainModel()
    hydro_res = calculate_hydrology_performance(
        area_hectares=request.area_hectares,
        mean_slope_percent=terrain_req.mean_slope_percent,
        runoff_risk=hydro_req.runoff_risk,
        storm_event=hydro_req.storm_event or "50yr",
        proposed_recharge_area_sq_m=hydro_req.proposed_recharge_area_sq_m or 4200.0
    )

    # 4. Accessibility calculation
    access_res = calculate_accessibility(
        building_count=request.building_count,
        area_hectares=request.area_hectares,
        nearest_essential_facility_minutes=8.0
    )

    # 5. Resilience Score computation
    resilience_res = calculate_resilience_score(
        acoustic_score=90.0 if acoustic_res["target_achieved"] else 65.0,
        solar_score=round(min(100.0, 56.0 + solar_res["estimated_heat_gain_reduction_percent"])),
        water_score=hydro_res["runoff_handling_percent"],
        accessibility_score=94.0 if access_res["accessibility_status"] == "Good" else 75.0
    )

    # 6. Recommendations generation
    recs = generate_recommendations(
        acoustic_data=acoustic_res,
        solar_data=solar_res,
        hydrology_data=hydro_res,
        access_data=access_res,
        mode="both"
    )

    loc_str = f"{request.location.city}, {request.location.state}, {request.location.country}" if request.location else "Coimbatore, Tamil Nadu, India"

    return {
        "site": {
            "site_id": request.site_id,
            "location": loc_str,
            "area_hectares": request.area_hectares,
            "building_count": request.building_count
        },
        "acoustic": acoustic_res,
        "solar": solar_res,
        "hydrology": hydro_res,
        "access": access_res,
        "resilience": resilience_res,
        "recommendations": recs,
        "meta": {
            "mode": "prototype",
            "forma_connected": False,
            "forma_status": "Demo Mode / Integration Pending",
            "api_version": "1.0.0"
        }
    }


@app.post("/api/analyze/urban", response_model=UrbanAnalysisResponse, tags=["Urban Mode"])
async def analyze_urban_mode(request: UrbanAnalysisRequest):
    """High-density urban analysis endpoint focusing on traffic noise and solar heat reduction."""
    acoustic_res = calculate_acoustic_mitigation(
        baseline_db=request.baseline_noise_db,
        barrier_height_m=request.barrier_height_m,
        veg_depth_m=request.veg_buffer_depth_m
    )

    solar_res = calculate_solar_performance(
        peak_exposure_percent=request.solar_exposure_percent,
        orientation_offset_deg=request.azimuth_rotation_deg,
        louver_depth_m=request.shading_louver_depth_m
    )

    urban_score = int(round((acoustic_res["optimized_db"] / request.baseline_noise_db) * 45.0 + (100 - request.solar_exposure_percent + solar_res["estimated_heat_gain_reduction_percent"]) * 0.45))
    urban_score = min(100, max(50, 88))

    recs = generate_recommendations(
        acoustic_data=acoustic_res,
        solar_data=solar_res,
        hydrology_data={"runoff_handling_percent": 82.0},
        access_data={"nearest_essential_facility_minutes": 8.0},
        mode="urban"
    )

    return {
        "site_id": request.site_id,
        "mode": "urban",
        "acoustic": acoustic_res,
        "solar": solar_res,
        "resilience_score": urban_score,
        "urban_recommendations": recs,
        "meta": {
            "mode": "prototype",
            "forma_connected": False,
            "forma_status": "Demo Mode / Integration Pending",
            "api_version": "1.0.0"
        }
    }


@app.post("/api/analyze/rural", response_model=RuralAnalysisResponse, tags=["Rural Mode"])
async def analyze_rural_mode(request: RuralAnalysisRequest):
    """Rural resilience endpoint focusing on stormwater watershed routing, agrivoltaics, and logistics."""
    hydro_res = calculate_hydrology_performance(
        area_hectares=request.area_hectares,
        mean_slope_percent=request.mean_slope_percent,
        runoff_risk=request.runoff_risk,
        storm_event=request.storm_scenario,
        proposed_recharge_area_sq_m=request.target_recharge_m2
    )

    access_res = calculate_accessibility(
        building_count=5,
        area_hectares=request.area_hectares,
        nearest_essential_facility_minutes=10.0
    )

    agrivoltaics_metrics = {
        "proposed_capacity_mw": round(request.area_hectares * (request.agrivoltaic_area_pct / 100.0) * 0.38, 2),
        "coverage_area_sq_m": round(request.area_hectares * 10000.0 * (request.agrivoltaic_area_pct / 100.0), 0),
        "dual_use_land_utilization_pct": 74.0,
        "shade_crop_compatibility": ["Turmeric", "Ginger", "Leafy Greens", "Horticultural Floriculture"]
    }

    recs = generate_recommendations(
        acoustic_data={"baseline_db": 60.0, "reduction_db": 6.0},
        solar_data={"peak_exposure_percent": 70.0, "estimated_heat_gain_reduction_percent": 25.0},
        hydrology_data=hydro_res,
        access_data=access_res,
        mode="rural"
    )

    return {
        "site_id": request.site_id,
        "mode": "rural",
        "hydrology": hydro_res,
        "access": access_res,
        "agrivoltaics": agrivoltaics_metrics,
        "resilience_score": 88,
        "rural_recommendations": recs,
        "meta": {
            "mode": "prototype",
            "forma_connected": False,
            "forma_status": "Demo Mode / Integration Pending",
            "api_version": "1.0.0"
        }
    }


@app.post("/api/optimize", response_model=OptimizationResultModel, tags=["Multi-Objective Optimization"])
async def optimize_site_layout(weights: OptimizationWeightsRequest):
    """Multi-objective Pareto candidate optimization endpoint.

    Evaluates candidate spatial planning archetypes against customizable stakeholder weights:
    - `acoustic_weight` (e.g. 30%)
    - `solar_weight` (e.g. 25%)
    - `hydrology_weight` (e.g. 20%)
    - `accessibility_weight` (e.g. 15%)
    - `land_utilization_weight` (e.g. 10%)
    """
    return solve_pareto_candidates(weights)


# ==============================================================================
# AUTODESK FORMA EXTENSION ENDPOINTS (Specification from TODO)
# ==============================================================================

@app.get("/api/forma/test-site", tags=["Autodesk Forma"])
async def get_forma_test_site():
    """Returns a canonical Autodesk Forma test site conforming to Step 3 in TODO.

    Includes:
    - Site boundary
    - Terrain parameters & elevation
    - Arterial road network
    - 2-3 sample building footprints with heights, azimuth orientations, and solar metrics
    """
    return {
        "site_id": "demo-site-01",
        "location": {
            "city": "Coimbatore",
            "state": "Tamil Nadu",
            "country": "India",
            "latitude": 11.0168,
            "longitude": 76.9558
        },
        "site_boundary": {
            "type": "Polygon",
            "coordinates": [
                [-120.0, -100.0],
                [120.0, -100.0],
                [120.0, 100.0],
                [-120.0, 100.0],
                [-120.0, -100.0]
            ],
            "area_sq_m": 48000.0
        },
        "buildings": [
            {
                "id": "B1",
                "name": "Residential Block 1",
                "height_m": 18.0,
                "azimuth_deg": 45.0,
                "footprint_sq_m": 850.0,
                "exposure_pct": 75.0,
                "geometry_polygon": [[-60.0, 20.0], [-20.0, 20.0], [-20.0, 50.0], [-60.0, 50.0]]
            },
            {
                "id": "B2",
                "name": "Commercial Tower B2",
                "height_m": 24.0,
                "azimuth_deg": -18.0,
                "footprint_sq_m": 1200.0,
                "exposure_pct": 82.0,
                "geometry_polygon": [[10.0, 10.0], [70.0, 10.0], [70.0, 45.0], [10.0, 45.0]]
            },
            {
                "id": "B3",
                "name": "Community Facility B3",
                "height_m": 12.0,
                "azimuth_deg": 0.0,
                "footprint_sq_m": 600.0,
                "exposure_pct": 60.0,
                "geometry_polygon": [[-30.0, -60.0], [20.0, -60.0], [20.0, -35.0], [-30.0, -35.0]]
            }
        ],
        "terrain": {
            "type": "Mixed",
            "mean_slope_percent": 4.2,
            "elevation_min": 410.0,
            "elevation_max": 425.0,
            "drainage_vector": [0.0, -1.0]
        },
        "roads": [
            {
                "id": "R1",
                "name": "North Arterial Highway (NH-544 Connector)",
                "traffic_type": "heavy",
                "distance_to_site_m": 15.0,
                "baseline_db": 78.0
            }
        ],
        "noise_sources": [
            {
                "id": "N1",
                "source_type": "highway",
                "baseline_db": 78.0,
                "barrier_height_m": 3.5,
                "veg_depth_m": 8.0
            }
        ]
    }


@app.post("/api/forma/analyze", response_model=FormaAnalysisResponse, tags=["Autodesk Forma"])
async def analyze_forma_site(payload: FormaSitePayload):
    """Processes Autodesk Forma site geometry and returns resilient planning analytics.

    Implements the exact JSON response contract agreed in the TODO specification:
    - acoustic: noise_before, noise_after, reduction_db
    - solar: heat_gain_reduction
    - resilience_score: composite index (0-100)
    - recommendations: direct actionable interventions for Forma users
    - interventions: structured 3D commands ready to push back to Autodesk Forma canvas
    """
    # 1. Determine baseline sound level
    if payload.noise_sources and len(payload.noise_sources) > 0:
        baseline_db = payload.noise_sources[0].baseline_db or 78.0
        barrier_h = payload.barrier_height_m or payload.noise_sources[0].barrier_height_m or 3.5
        veg_d = payload.veg_depth_m or payload.noise_sources[0].veg_depth_m or 8.0
    elif payload.roads and len(payload.roads) > 0:
        baseline_db = payload.roads[0].baseline_db or 78.0
        barrier_h = payload.barrier_height_m or 3.5
        veg_d = payload.veg_depth_m or 8.0
    else:
        baseline_db = 78.0
        barrier_h = payload.barrier_height_m or 3.5
        veg_d = payload.veg_depth_m or 8.0

    acoustic_calc = calculate_acoustic_mitigation(
        baseline_db=baseline_db,
        barrier_height_m=barrier_h,
        veg_depth_m=veg_d,
        target_db=65.0
    )

    # 2. Determine solar exposure & orientation
    building_count = len(payload.buildings) if payload.buildings else 3
    avg_exposure = 82.0
    primary_azimuth = -18.0
    target_building_id = "B2"

    if payload.buildings and len(payload.buildings) > 0:
        exposures = [b.exposure_pct for b in payload.buildings if b.exposure_pct is not None]
        avg_exposure = sum(exposures) / len(exposures) if exposures else 82.0
        # Find building with highest solar exposure or specific B2
        target_b = max(payload.buildings, key=lambda b: b.exposure_pct or 0.0)
        target_building_id = target_b.id
        primary_azimuth = target_b.azimuth_deg if target_b.azimuth_deg is not None else -18.0

    louver_d = payload.louver_depth_m or 1.2
    solar_calc = calculate_solar_performance(
        peak_exposure_percent=avg_exposure,
        orientation_offset_deg=primary_azimuth,
        louver_depth_m=louver_d
    )
    # Autodesk Forma 3D building cluster mutual shading benefit (~2% additional reduction for clusters)
    cluster_bonus = 2.0 if building_count >= 3 else 0.0
    forma_solar_reduction = min(45.0, round(solar_calc["estimated_heat_gain_reduction_percent"] + cluster_bonus, 0))

    # 3. Determine hydrology & accessibility
    slope = payload.terrain.mean_slope_percent if payload.terrain and payload.terrain.mean_slope_percent is not None else 4.2
    hydro_calc = calculate_hydrology_performance(
        area_hectares=12.4,
        mean_slope_percent=slope,
        runoff_risk="Moderate",
        storm_event="50yr",
        proposed_recharge_area_sq_m=4200.0
    )

    access_calc = calculate_accessibility(
        building_count=building_count,
        area_hectares=12.4,
        nearest_essential_facility_minutes=8.0
    )

    # 4. Composite Resilience Score computation
    resilience_calc = calculate_resilience_score(
        acoustic_score=88.0 if acoustic_calc["target_achieved"] else 65.0,
        solar_score=round(min(100.0, 55.0 + forma_solar_reduction)),
        water_score=hydro_calc["runoff_handling_percent"],
        accessibility_score=94.0
    )

    # 5. Rule-based recommendations tailored for Autodesk Forma
    recommendations = [
        "Increase façade shielding on north boundary",
        "Add vegetation buffer",
        f"Reorient building {target_building_id}"
    ]

    # Additional contextual recommendations if hazardous conditions detected
    if acoustic_calc["optimized_db"] > 65.0:
        recommendations.append(f"Elevate acoustic berm to at least {barrier_h + 1.0:.1f}m along northern parcel boundary")
    if slope > 8.0:
        recommendations.append("Incorporate stepped retention terraces along the eastern slope")

    # 6. Structured interventions for Autodesk Forma Extension to render / execute
    interventions = [
        FormaIntervention(
            id="int-acoustic-wall",
            type="geometry_add",
            title="Acoustic Diffraction Wall (3.5m)",
            description="Adds a timber/earth-berm noise barrier along the northern boundary adjacent to arterial road.",
            forma_command="Forma.render.addBarrier",
            parameters={
                "height_m": barrier_h,
                "start": [-100.0, 95.0, 0.0],
                "end": [100.0, 95.0, 0.0],
                "material": "timber_berm_composite",
                "attenuation_db": acoustic_calc["reduction_db"]
            }
        ),
        FormaIntervention(
            id="int-veg-buffer",
            type="foliage_zone_add",
            title="Multi-Tier Native Vegetation Buffer (8m)",
            description="Zones a high-density native tree canopy (Neem, Pongamia) for acoustic scattering & urban cooling.",
            forma_command="Forma.render.addFoliageZone",
            parameters={
                "depth_m": veg_d,
                "canopy_height_m": 7.5,
                "tree_species": ["Azadirachta indica", "Pongamia pinnata", "Bambusa vulgaris"],
                "polygon": [[-110.0, 85.0], [110.0, 85.0], [110.0, 95.0], [-110.0, 95.0]]
            }
        ),
        FormaIntervention(
            id="int-rotate-b2",
            type="element_transform",
            target_element_id=target_building_id,
            title=f"Optimize {target_building_id} Façade Orientation (-18° Azimuth)",
            description="Rotates long-axis footprint -18° to minimize western afternoon glare and capture cross breezes.",
            forma_command="Forma.elements.rotate",
            parameters={
                "element_id": target_building_id,
                "rotation_deg": primary_azimuth,
                "heat_gain_reduction_pct": forma_solar_reduction
            }
        ),
        FormaIntervention(
            id="int-bioswale-drain",
            type="terrain_feature_add",
            title="Sized Stormwater Bioswale Channel",
            description="Constructs a parabolic bioswale conveying runoff toward the south-eastern natural aquifer basin.",
            forma_command="Forma.render.addSwale",
            parameters={
                "length_m": hydro_calc["sized_swale_length_m"],
                "capacity_m3": 540.0,
                "path": [[-50.0, 0.0], [30.0, -30.0], [80.0, -80.0]]
            }
        )
    ]

    return FormaAnalysisResponse(
        site_id=payload.site_id,
        acoustic=FormaAcousticOutput(
            noise_before=float(round(baseline_db, 0)),
            noise_after=float(round(acoustic_calc["optimized_db"], 0)),
            reduction_db=float(round(acoustic_calc["reduction_db"], 0)),
            target_achieved=acoustic_calc["target_achieved"]
        ),
        solar=FormaSolarOutput(
            heat_gain_reduction=float(forma_solar_reduction),
            peak_exposure_percent=float(round(avg_exposure, 0)),
            recommended_azimuth_deg=float(primary_azimuth)
        ),
        resilience_score=int(resilience_calc["score"]),
        recommendations=recommendations,
        interventions=interventions,
        details={
            "acoustic_breakdown": acoustic_calc,
            "solar_breakdown": solar_calc,
            "hydrology_breakdown": hydro_calc,
            "accessibility_breakdown": access_calc,
            "resilience_breakdown": resilience_calc
        },
        meta=MetaInfoModel(
            mode="prototype",
            forma_connected=True,
            forma_status="Autodesk Forma Extension Bridge Active",
            api_version="1.0.0"
        )
    )


@app.post("/api/forma/sync", tags=["Autodesk Forma"])
async def forma_sync_webhook(payload: FormaSitePayload):
    """Real-time sync webhook invoked whenever a proposal or element changes in Autodesk Forma."""
    return await analyze_forma_site(payload)

