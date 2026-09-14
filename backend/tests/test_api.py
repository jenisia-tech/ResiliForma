import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["name"] == "ResiliForma API"

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_demo_site():
    response = client.get("/api/demo/site")
    assert response.status_code == 200
    data = response.json()
    assert data["site_name"] == "Karunya Nagar Smart City Sector"
    assert data["site_area_km2"] == 1.2

def test_demo_proposals():
    response = client.get("/api/demo/proposals")
    assert response.status_code == 200
    data = response.json()
    assert "baseline" in data
    assert "resilient" in data
    assert data["baseline"]["analysis"]["score"]["grade"] == "D"
    assert data["resilient"]["analysis"]["score"]["grade"] == "A"

def test_analyze_endpoint():
    payload = {
        "barrier_height": 3.5,
        "vegetation_depth": 8.0,
        "louver_depth": 1.2,
        "orientation_offset": -18.0,
        "baseline_noise_db": 78.0,
        "baseline_irradiance": 710.0,
        "runoff_coefficient": 0.85,
        "rainfall_intensity": 65.0,
        "catchment_area_ha": 21.04,
        "bioswale_length": 644.0,
        "retention_capacity": 7800.0
    }
    response = client.post("/api/forma/analyze", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["noise"]["total_reduction_db"] == 15.05
    assert res["solar"]["total_reduction_percent"] == 32.0
    assert res["stormwater"]["runoff_management_percent"] >= 80.0
    assert res["score"]["composite_score"] >= 85

def test_compare_endpoint():
    payload = {
        "baseline": {
            "barrier_height": 0.0,
            "vegetation_depth": 0.0,
            "louver_depth": 0.0,
            "orientation_offset": 0.0,
            "baseline_noise_db": 78.0,
            "baseline_irradiance": 710.0,
            "runoff_coefficient": 0.85,
            "rainfall_intensity": 65.0,
            "catchment_area_ha": 21.04,
            "bioswale_length": 0.0,
            "retention_capacity": 0.0
        },
        "resilient": {
            "barrier_height": 3.5,
            "vegetation_depth": 8.0,
            "louver_depth": 1.2,
            "orientation_offset": -18.0,
            "baseline_noise_db": 78.0,
            "baseline_irradiance": 710.0,
            "runoff_coefficient": 0.85,
            "rainfall_intensity": 65.0,
            "catchment_area_ha": 21.04,
            "bioswale_length": 644.0,
            "retention_capacity": 7800.0
        }
    }
    response = client.post("/api/forma/compare", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["delta_score"] >= 37
    assert res["noise_reduction_gain_db"] >= 14.0
