"""Tests for ResiliForma FastAPI backend endpoints.

Can be run via `pytest` or directly with `python tests/test_api.py`.
"""

import sys
from pathlib import Path

# Add parent directory to sys.path so imports resolve cleanly
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    """Verify GET /api/health returns 200 and expected status object."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["service"] == "ResiliForma API"
    assert data["version"] == "1.0.0"
    assert data["mode"] == "prototype"


def test_list_demo_sites():
    """Verify GET /api/sites returns available demo sites."""
    response = client.get("/api/sites")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 1
    assert any(s["site_id"] == "demo-site-01" for s in data["sites"])


def test_get_demo_site_found():
    """Verify GET /api/sites/demo-site-01 returns Coimbatore demo site."""
    response = client.get("/api/sites/demo-site-01")
    assert response.status_code == 200
    data = response.json()
    assert data["site_id"] == "demo-site-01"
    assert "Coimbatore" in data["name"]
    assert data["area_hectares"] == 12.4
    assert data["building_count"] == 8


def test_get_demo_site_not_found():
    """Verify GET /api/sites/non-existent-site returns 404."""
    response = client.get("/api/sites/non-existent-site-xyz")
    assert response.status_code == 404
    data = response.json()
    assert "not found" in data["message"].lower()


def test_comprehensive_analyze_endpoint():
    """Verify POST /api/analyze executes multi-hazard calculations."""
    payload = {
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
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Verify acoustic results
    assert data["acoustic"]["baseline_db"] == 78.0
    assert data["acoustic"]["optimized_db"] == 63.0
    assert data["acoustic"]["reduction_db"] == 15.0
    assert data["acoustic"]["target_achieved"] is True
    assert data["acoustic"]["status"] == "prototype_estimate"

    # Verify solar results
    assert data["solar"]["peak_exposure_percent"] == 82.0
    assert data["solar"]["estimated_heat_gain_reduction_percent"] == 30.0
    assert data["solar"]["status"] == "prototype_estimate"

    # Verify hydrology results
    assert data["hydrology"]["runoff_handling_percent"] == 82.0
    assert data["hydrology"]["status"] == "prototype_estimate"

    # Verify accessibility results
    assert data["access"]["nearest_essential_facility_minutes"] == 8.0
    assert data["access"]["accessibility_status"] == "Good"

    # Verify resilience score
    assert data["resilience"]["score"] == 88
    assert "High Resilience" in data["resilience"]["rating"]
    assert data["resilience"]["components"]["acoustic"] == 90

    # Verify recommendations
    assert len(data["recommendations"]) >= 4

    # Verify meta
    assert data["meta"]["forma_connected"] is False
    assert data["meta"]["mode"] == "prototype"


def test_urban_analysis_endpoint():
    """Verify POST /api/analyze/urban focuses on noise and solar."""
    payload = {
        "site_id": "demo-site-01",
        "area_hectares": 12.4,
        "building_count": 8,
        "baseline_noise_db": 78.0,
        "barrier_height_m": 3.5,
        "veg_buffer_depth_m": 8.0,
        "solar_exposure_percent": 82.0,
        "azimuth_rotation_deg": -18.0,
        "shading_louver_depth_m": 1.2
    }
    response = client.post("/api/analyze/urban", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "urban"
    assert data["acoustic"]["optimized_db"] == 63.0
    assert data["solar"]["estimated_heat_gain_reduction_percent"] == 30.0
    assert len(data["urban_recommendations"]) >= 2


def test_rural_analysis_endpoint():
    """Verify POST /api/analyze/rural focuses on stormwater and agrivoltaics."""
    payload = {
        "site_id": "demo-site-01",
        "area_hectares": 12.4,
        "mean_slope_percent": 4.2,
        "runoff_risk": "Moderate",
        "storm_scenario": "50yr",
        "agrivoltaic_area_pct": 25.0,
        "target_recharge_m2": 4200.0
    }
    response = client.post("/api/analyze/rural", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "rural"
    assert data["hydrology"]["runoff_handling_percent"] == 82.0
    assert data["agrivoltaics"]["proposed_capacity_mw"] > 0
    assert len(data["rural_recommendations"]) >= 2


def test_optimization_endpoint():
    """Verify POST /api/optimize calculates candidate trade-offs and best pick."""
    payload = {
        "acoustic_weight": 30.0,
        "solar_weight": 25.0,
        "hydrology_weight": 20.0,
        "accessibility_weight": 15.0,
        "land_utilization_weight": 10.0
    }
    response = client.post("/api/optimize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["candidates"]) == 3
    assert data["status"] == "prototype_optimization"

    # Verify best candidate is flagged
    recommended_candidates = [c for c in data["candidates"] if c["is_recommended"]]
    assert len(recommended_candidates) == 1
    assert recommended_candidates[0]["name"] == data["recommended_candidate"]


def test_validation_errors():
    """Verify invalid payloads produce 422 with readable errors."""
    invalid_payload = {
        "site_id": "demo-site-01",
        "area_hectares": -5.0,  # Invalid: negative area
        "building_count": 0     # Invalid: less than 1
    }
    response = client.post("/api/analyze", json=invalid_payload)
    assert response.status_code == 422
    data = response.json()
    assert data["status"] == "error"
    assert data["error_type"] == "Validation Error"
    assert len(data["details"]) >= 1


if __name__ == "__main__":
    print("Running ResiliForma API Test Suite...")
    test_health_check()
    print("✓ test_health_check PASSED")
    test_list_demo_sites()
    print("✓ test_list_demo_sites PASSED")
    test_get_demo_site_found()
    print("✓ test_get_demo_site_found PASSED")
    test_get_demo_site_not_found()
    print("✓ test_get_demo_site_not_found PASSED")
    test_comprehensive_analyze_endpoint()
    print("✓ test_comprehensive_analyze_endpoint PASSED")
    test_urban_analysis_endpoint()
    print("✓ test_urban_analysis_endpoint PASSED")
    test_rural_analysis_endpoint()
    print("✓ test_rural_analysis_endpoint PASSED")
    test_optimization_endpoint()
    print("✓ test_optimization_endpoint PASSED")
    test_validation_errors()
    print("✓ test_validation_errors PASSED")
    print("\nAll 9 backend tests PASSED successfully!")
