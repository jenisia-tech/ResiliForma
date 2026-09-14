import pytest
from app.calculations.noise import calculate_noise_screening
from app.calculations.solar import calculate_solar_screening
from app.calculations.stormwater import calculate_stormwater_screening
from app.calculations.score import calculate_composite_score

def test_composite_scores():
    # Baseline
    b_noise = calculate_noise_screening(78.0, 0.0, 0.0)
    b_solar = calculate_solar_screening(710.0, 0.0, 0.0)
    b_sw = calculate_stormwater_screening(0.85, 65.0, 21.04, 0.0, 0.0)
    b_score = calculate_composite_score(b_noise, b_solar, b_sw)

    # Resilient
    r_noise = calculate_noise_screening(78.0, 3.5, 8.0)
    r_solar = calculate_solar_screening(710.0, -18.0, 1.2)
    r_sw = calculate_stormwater_screening(0.85, 65.0, 21.04, 644.0, 7800.0)
    r_score = calculate_composite_score(r_noise, r_solar, r_sw)

    assert b_score["composite_score"] == 48 or 46 <= b_score["composite_score"] <= 50
    assert b_score["grade"] == "D"
    assert r_score["composite_score"] == 87 or 85 <= r_score["composite_score"] <= 89
    assert r_score["grade"] == "A"
    assert (r_score["composite_score"] - b_score["composite_score"]) == 39 or 37 <= (r_score["composite_score"] - b_score["composite_score"]) <= 41
