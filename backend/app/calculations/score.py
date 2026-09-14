"""
Composite Resilience Score calculation module for ResiliForma.
Deterministic multi-hazard screening extension for Autodesk Forma workflows.
"""

def calculate_composite_score(
    noise_data: dict,
    solar_data: dict,
    stormwater_data: dict
) -> dict:
    """
    Calculate transparent deterministic composite resilience score.
    Weights:
        - Road Noise Attenuation: 0.30
        - Solar Façade Relief: 0.25
        - Stormwater Management: 0.25
        - Urban Pedestrian Access: 0.10
        - Land Efficiency & Green Infrastructure: 0.10
    
    Calibration:
        - Baseline: 48 / 100 (Grade D)
        - Resilient: 87 / 100 (Grade A)
        - Delta: +39 points
    """
    opt_noise = noise_data.get("optimized_noise_db", 78.0)
    # Baseline 78 dBA -> 44.0 pts; Resilient 62.95 dBA -> 88.1 pts
    noise_score = 44.0 + (78.0 - opt_noise) * (44.1 / 15.05)
    noise_score = max(10.0, min(100.0, noise_score))

    # Solar sub-score: baseline 0% -> 45.0 pts, resilient 32% -> 86.0 pts
    solar_red = solar_data.get("total_reduction_percent", 0.0)
    solar_score = 45.0 + min(50.0, (solar_red / 32.0) * 41.0)
    solar_score = max(10.0, min(100.0, solar_score))

    # Stormwater sub-score: baseline 10% -> 42.0 pts, resilient 82% -> 86.0 pts
    sw_mgmt = stormwater_data.get("runoff_management_percent", 10.0)
    stormwater_score = 42.0 + ((sw_mgmt - 10.0) / 72.0) * 44.0
    stormwater_score = max(10.0, min(100.0, stormwater_score))

    # Urban Pedestrian Access
    barrier_h = noise_data.get("barrier_height_m", 0.0)
    veg_d = noise_data.get("vegetation_depth_m", 0.0)
    access_score = 68.0 + min(22.0, (barrier_h / 3.5) * 10.0 + (veg_d / 8.0) * 10.0)

    # Land Efficiency & Multi-functional Green Infrastructure
    swale_m = stormwater_data.get("bioswale_length_m", 0.0)
    ret_m3 = stormwater_data.get("retention_capacity_m3", 0.0)
    green_infra_score = 63.0 + min(25.0, (swale_m / 644.0) * 13.0 + (ret_m3 / 7800.0) * 12.0)

    # Weights sum to 1.00
    weights = {
        "noise": 0.30,
        "solar": 0.25,
        "stormwater": 0.25,
        "accessibility": 0.10,
        "land_efficiency": 0.10
    }

    composite_value = (
        noise_score * weights["noise"] +
        solar_score * weights["solar"] +
        stormwater_score * weights["stormwater"] +
        access_score * weights["accessibility"] +
        green_infra_score * weights["land_efficiency"]
    )

    final_score = int(round(composite_value))

    # Determine Grade
    if final_score >= 85:
        grade = "A"
        grade_label = "Resilient / Exceptional Performance"
        status_color = "#10B981"  # Emerald
    elif final_score >= 70:
        grade = "B"
        grade_label = "Moderate Resilience"
        status_color = "#3B82F6"  # Blue
    elif final_score >= 55:
        grade = "C"
        grade_label = "Sub-optimal Performance"
        status_color = "#F59E0B"  # Amber
    else:
        grade = "D"
        grade_label = "Vulnerable / High Exposure"
        status_color = "#EF4444"  # Red

    return {
        "composite_score": final_score,
        "grade": grade,
        "grade_label": grade_label,
        "status_color": status_color,
        "sub_scores": {
            "noise": round(noise_score, 1),
            "solar": round(solar_score, 1),
            "stormwater": round(stormwater_score, 1),
            "accessibility": round(access_score, 1),
            "land_efficiency": round(green_infra_score, 1)
        },
        "weights": weights,
        "disclaimer": "Conceptual resilience screening score for project decision support; not an official statutory or Autodesk rating."
    }
