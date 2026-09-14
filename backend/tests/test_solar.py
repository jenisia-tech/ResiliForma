import pytest
from app.calculations.solar import calculate_solar_screening

def test_baseline_solar():
    # Baseline: orientation 0, louver 0
    res = calculate_solar_screening(baseline_irradiance=710.0, orientation_offset=0.0, louver_depth=0.0)
    assert res["baseline_irradiance"] == 710.0
    assert res["orientation_relief_percent"] == 0.0
    assert res["louver_relief_percent"] == 0.0
    assert res["total_reduction_percent"] == 0.0
    assert res["estimated_irradiance"] == 710.0

def test_resilient_solar():
    # Resilient proposal: orientation -18 deg, louver 1.2m
    # Orientation relief: |-18| * 0.45 + 12 = 8.1 + 12 = 20.1%
    # Louver relief: (1.2 / 1.2) * 11.9 = 11.9%
    # Total reduction: min(45, 20.1 + 11.9) = 32.0%
    # Estimated irradiance: 710 * (1 - 0.32) = 482.8 W/m² (~480 W/m²)
    res = calculate_solar_screening(baseline_irradiance=710.0, orientation_offset=-18.0, louver_depth=1.2)
    assert res["orientation_relief_percent"] == 20.1
    assert res["louver_relief_percent"] == 11.9
    assert res["total_reduction_percent"] == 32.0
    assert 475.0 <= res["estimated_irradiance"] <= 490.0

def test_solar_caps():
    # Cap at 45%
    res = calculate_solar_screening(baseline_irradiance=710.0, orientation_offset=60.0, louver_depth=3.0)
    assert res["total_reduction_percent"] <= 45.0
    assert res["estimated_irradiance"] == pytest.approx(710.0 * 0.55, rel=1e-2)
