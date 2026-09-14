"""
FastAPI Backend Application for ResiliForma.
Deterministic Multi-Hazard Design Screening Extension for Autodesk Forma.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    SiteAnalysisRequest,
    SiteAnalysisResponse,
    ProposalCompareRequest,
    ProposalCompareResponse
)
from .calculations import (
    calculate_noise_screening,
    calculate_solar_screening,
    calculate_stormwater_screening,
    calculate_composite_score
)

app = FastAPI(
    title="ResiliForma API",
    description="Deterministic Multi-Hazard Design Screening Extension for Autodesk Forma Site Design (SIH26114)",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEMO_SITE_INFO = {
    "site_name": "Karunya Nagar Smart City Sector",
    "location": "Coimbatore South, Tamil Nadu, India",
    "coordinates": {"lat": 10.9366, "lng": 76.7441},
    "site_area_km2": 1.2,
    "site_area_ha": 120.0,
    "site_area_m2": 1200000.0,
    "context": {
        "geography": "Western Ghats Foothills Corridor",
        "climate": "Tropical Wet & Dry / Monsoon Heavy Runoff",
        "transit_corridor": "NH-544 / Siruvani Road Arterial",
        "building_blocks": 26,
        "primary_platform": "Autodesk Forma Site Design",
        "extension_role": "Supplementary Multi-Hazard Screening (Road Noise, Solar Façade, Stormwater Runoff)"
    },
    "forma_integration_status": "Extension-Ready (Normalized Site Context Schema)"
}

PROPOSAL_BASELINE = SiteAnalysisRequest(
    orientation_offset=0.0,
    barrier_height=0.0,
    vegetation_depth=0.0,
    louver_depth=0.0,
    runoff_coefficient=0.85,
    rainfall_intensity=65.0,
    catchment_area_ha=21.04,
    baseline_noise_db=78.0,
    baseline_irradiance=710.0,
    bioswale_length=0.0,
    retention_capacity=0.0
)

PROPOSAL_RESILIENT = SiteAnalysisRequest(
    orientation_offset=-18.0,
    barrier_height=3.5,
    vegetation_depth=8.0,
    louver_depth=1.2,
    runoff_coefficient=0.85,
    rainfall_intensity=65.0,
    catchment_area_ha=21.04,
    baseline_noise_db=78.0,
    baseline_irradiance=710.0,
    bioswale_length=644.0,
    retention_capacity=7800.0
)


def run_full_analysis(req: SiteAnalysisRequest) -> SiteAnalysisResponse:
    noise_res = calculate_noise_screening(
        baseline_noise_db=req.baseline_noise_db,
        barrier_height=req.barrier_height,
        vegetation_depth=req.vegetation_depth
    )
    solar_res = calculate_solar_screening(
        baseline_irradiance=req.baseline_irradiance,
        orientation_offset=req.orientation_offset,
        louver_depth=req.louver_depth
    )
    stormwater_res = calculate_stormwater_screening(
        runoff_coefficient=req.runoff_coefficient,
        rainfall_intensity=req.rainfall_intensity,
        catchment_area_ha=req.catchment_area_ha,
        bioswale_length=req.bioswale_length,
        retention_capacity=req.retention_capacity
    )
    score_res = calculate_composite_score(
        noise_data=noise_res,
        solar_data=solar_res,
        stormwater_data=stormwater_res
    )

    return SiteAnalysisResponse(
        noise=noise_res,
        solar=solar_res,
        stormwater=stormwater_res,
        score=score_res
    )


@app.get("/")
def root():
    return {
        "name": "ResiliForma API",
        "status": "online",
        "description": "Deterministic Multi-Hazard Design Screening Extension for Autodesk Forma",
        "problem_statement": "SIH26114",
        "primary_platform": "Autodesk Forma Site Design",
        "disclaimer": "Supplementary decision-support extension; site modeling and detailed verification remain in Autodesk Forma."
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "resiliforma-backend"}


@app.get("/api/demo/site")
def get_demo_site():
    return DEMO_SITE_INFO


@app.get("/api/demo/proposals")
def get_demo_proposals():
    baseline_analysis = run_full_analysis(PROPOSAL_BASELINE)
    resilient_analysis = run_full_analysis(PROPOSAL_RESILIENT)
    return {
        "baseline": {
            "name": "Baseline Proposal",
            "description": "Conventional site arrangement with high west-facing solar exposure, no dedicated acoustic buffer and predominantly impervious hardscape.",
            "parameters": PROPOSAL_BASELINE.model_dump(),
            "analysis": baseline_analysis.model_dump()
        },
        "resilient": {
            "name": "Resilient Proposal",
            "description": "Resilience-optimized layout with 3.5m acoustic berm, 8m dense native buffer, -18° solar offset, 1.2m shading louvers, 644m bioswales, and 7,800m³ retention pond.",
            "parameters": PROPOSAL_RESILIENT.model_dump(),
            "analysis": resilient_analysis.model_dump()
        }
    }


@app.post("/api/forma/analyze", response_model=SiteAnalysisResponse)
def analyze_site(request: SiteAnalysisRequest):
    try:
        return run_full_analysis(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Analysis calculation error: {str(e)}")


@app.post("/api/forma/compare", response_model=ProposalCompareResponse)
def compare_proposals(request: ProposalCompareRequest):
    try:
        baseline_res = run_full_analysis(request.baseline)
        resilient_res = run_full_analysis(request.resilient)

        delta_score = resilient_res.score.composite_score - baseline_res.score.composite_score
        noise_gain = round(baseline_res.noise.optimized_noise_db - resilient_res.noise.optimized_noise_db, 2)
        solar_gain = round(resilient_res.solar.total_reduction_percent - baseline_res.solar.total_reduction_percent, 2)
        sw_gain = round(resilient_res.stormwater.runoff_management_percent - baseline_res.stormwater.runoff_management_percent, 2)

        summary = (
            f"The Resilient Proposal achieves a +{delta_score} point composite score improvement (Grade {baseline_res.score.grade} → Grade {resilient_res.score.grade}) "
            f"by mitigating noise by {noise_gain} dB, reducing façade peak solar irradiance by {solar_gain}%, "
            f"and raising stormwater retention by {sw_gain}%."
        )

        return ProposalCompareResponse(
            baseline=baseline_res,
            resilient=resilient_res,
            delta_score=delta_score,
            noise_reduction_gain_db=noise_gain,
            solar_reduction_gain_percent=solar_gain,
            stormwater_management_gain_percent=sw_gain,
            summary=summary
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Comparison calculation error: {str(e)}")
