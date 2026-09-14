import pytest
from app.calculations.stormwater import calculate_stormwater_screening

def test_baseline_stormwater():
    res = calculate_stormwater_screening(
        runoff_coefficient=0.85,
        rainfall_intensity=65.0,
        catchment_area_ha=21.04,
        bioswale_length=0.0,
        retention_capacity=0.0
    )
    # Area = 21.04 ha = 0.2104 km²
    # Q_peak = 0.278 * 0.85 * 65.0 * 0.2104 = 3.23 m³/s
    assert res["area_km2"] == 0.2104
    assert 3.10 <= res["peak_runoff_m3s"] <= 3.35
    assert res["bioswale_length_m"] == 0.0
    assert res["retention_capacity_m3"] == 0.0
    assert res["runoff_management_percent"] < 25.0

def test_resilient_stormwater():
    res = calculate_stormwater_screening(
        runoff_coefficient=0.85,
        rainfall_intensity=65.0,
        catchment_area_ha=21.04,
        bioswale_length=644.0,
        retention_capacity=7800.0
    )
    # Resilient target: ~82% management
    assert 80.0 <= res["runoff_management_percent"] <= 85.0
    assert res["mitigated_volume_m3"] > 0
    assert res["net_peak_discharge_m3s"] < res["peak_runoff_m3s"]
