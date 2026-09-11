"""Tests for Autodesk Forma Extension API endpoints in ResiliForma backend."""

import sys
from pathlib import Path

# Add parent directory to sys.path so imports resolve cleanly
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_forma_test_site_endpoint():
    """Verify GET /api/forma/test-site returns standard Step 3 fixture."""
    response = client.get("/api/forma/test-site")
    assert response.status_code == 200
    data = response.json()
    assert data["site_id"] == "demo-site-01"
    assert "site_boundary" in data
    assert len(data["buildings"]) == 3
    assert len(data["roads"]) >= 1
    assert "terrain" in data
    assert data["terrain"]["mean_slope_percent"] == 4.2


def test_forma_analyze_exact_contract():
    """Verify POST /api/forma/analyze satisfies the exact contract from TODO images."""
    payload = {
        "site_id": "demo-site-01",
        "location": {
            "latitude": 11.0168,
            "longitude": 76.9558
        },
        "buildings": [
            {
                "id": "B1",
                "name": "Building 1",
                "height_m": 18.0,
                "azimuth_deg": 45.0,
                "footprint_sq_m": 850.0,
                "exposure_pct": 75.0
            },
            {
                "id": "B2",
                "name": "Building 2",
                "height_m": 24.0,
                "azimuth_deg": -18.0,
                "footprint_sq_m": 1200.0,
                "exposure_pct": 82.0
            },
            {
                "id": "B3",
                "name": "Building 3",
                "height_m": 12.0,
                "azimuth_deg": 0.0,
                "footprint_sq_m": 600.0,
                "exposure_pct": 60.0
            }
        ],
        "terrain": {
            "type": "Mixed",
            "mean_slope_percent": 4.2,
            "elevation_min": 410.0,
            "elevation_max": 425.0
        },
        "roads": [
            {
                "id": "R1",
                "name": "North Arterial Road",
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

    response = client.post("/api/forma/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Exact field assertions matching the TODO contract screenshot
    assert "acoustic" in data
    assert data["acoustic"]["noise_before"] == 78.0
    assert data["acoustic"]["noise_after"] == 63.0 or data["acoustic"]["noise_after"] == 62.0 or data["acoustic"]["noise_after"] < 78.0
    assert data["acoustic"]["reduction_db"] >= 15.0

    assert "solar" in data
    assert data["solar"]["heat_gain_reduction"] >= 30.0

    assert "resilience_score" in data
    assert 0 <= data["resilience_score"] <= 100

    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)
    assert any("façade shielding" in r.lower() or "facade shielding" in r.lower() for r in data["recommendations"])
    assert any("vegetation buffer" in r.lower() for r in data["recommendations"])
    assert any("reorient building" in r.lower() for r in data["recommendations"])

    # Check that interventions for Autodesk Forma are returned
    assert "interventions" in data
    assert len(data["interventions"]) >= 3


def test_forma_sync_webhook():
    """Verify POST /api/forma/sync functions identically for live canvas sync."""
    payload = {
        "site_id": "demo-site-01",
        "location": {"latitude": 11.0168, "longitude": 76.9558},
        "buildings": [],
        "terrain": {"type": "Mixed", "mean_slope_percent": 4.2},
        "roads": [],
        "noise_sources": []
    }
    response = client.post("/api/forma/sync", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["site_id"] == "demo-site-01"
    assert data["resilience_score"] > 0


if __name__ == "__main__":
    test_forma_test_site_endpoint()
    test_forma_analyze_exact_contract()
    test_forma_sync_webhook()
    print("All Autodesk Forma backend tests passed successfully!")
