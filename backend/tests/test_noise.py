import pytest
from app.calculations.noise import calculate_noise_screening

def test_baseline_noise():
    # Baseline: no barrier, no vegetation
    res = calculate_noise_screening(baseline_noise_db=78.0, barrier_height=0.0, vegetation_depth=0.0)
    assert res["baseline_db"] == 78.0
    assert res["barrier_attenuation_db"] == 0.0
    assert res["vegetation_attenuation_db"] == 0.0
    assert res["total_reduction_db"] == 0.0
    assert res["optimized_noise_db"] == 78.0

def test_resilient_noise_reduction():
    # Resilient proposal: 3.5m barrier, 8m vegetation buffer
    res = calculate_noise_screening(baseline_noise_db=78.0, barrier_height=3.5, vegetation_depth=8.0)
    # A_barrier = min(18, 3.5 * 3.1) = 10.85
    # A_vegetation = min(8, (8 / 8) * 4.2) = 4.20
    # Total reduction = 10.85 + 4.20 = 15.05 dB (~15 dB)
    # Optimized noise = 78 - 15.05 = 62.95 dBA (~63 dBA)
    assert res["barrier_attenuation_db"] == 10.85
    assert res["vegetation_attenuation_db"] == 4.20
    assert res["total_reduction_db"] == 15.05
    assert 62.0 <= res["optimized_noise_db"] <= 64.0

def test_noise_bounds_and_caps():
    # Test capping
    res = calculate_noise_screening(baseline_noise_db=78.0, barrier_height=10.0, vegetation_depth=30.0)
    assert res["barrier_attenuation_db"] == 18.0
    assert res["vegetation_attenuation_db"] == 8.0
    assert res["total_reduction_db"] == 26.0
    assert res["optimized_noise_db"] == 52.0
    assert res["optimized_noise_db"] >= 30.0
