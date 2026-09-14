"""
Solar irradiance screening calculation module for ResiliForma.
Deterministic multi-hazard screening extension for Autodesk Forma workflows.
"""

def calculate_solar_screening(
    baseline_irradiance: float = 710.0,
    orientation_offset: float = 0.0,
    louver_depth: float = 0.0
) -> dict:
    """
    Calculate peak direct solar façade irradiance reduction through orientation offset and shading louvers.
    
    Formula:
        Orientation Relief % = min(25.0, |theta_offset| * 0.45 + 12.0) if theta_offset != 0 else 0.0
        Louver Relief % = min(20.0, (d_louver / 1.2) * 11.9) if d_louver > 0 else 0.0
        Total Reduction % = min(45.0, Orientation Relief + Louver Relief)
        Estimated Irradiance = baseline_irradiance * (1 - Total Reduction / 100)
    """
    baseline_irr = float(baseline_irradiance)
    theta = float(orientation_offset)
    d_louver = max(0.0, float(louver_depth))

    # Orientation relief calculation
    if abs(theta) > 0.01:
        orientation_relief = min(25.0, abs(theta) * 0.45 + 12.0)
    else:
        orientation_relief = 0.0

    # Louver shading relief calculation
    if d_louver > 0.01:
        louver_relief = min(20.0, (d_louver / 1.2) * 11.9)
    else:
        louver_relief = 0.0

    total_reduction_pct = min(45.0, orientation_relief + louver_relief)
    estimated_irradiance = max(100.0, baseline_irr * (1.0 - total_reduction_pct / 100.0))

    if estimated_irradiance <= 500.0:
        status = "Low Thermal Load (< 500 W/m²)"
    elif estimated_irradiance <= 620.0:
        status = "Moderate Thermal Load (500-620 W/m²)"
    else:
        status = "High Thermal Load (> 620 W/m²)"

    return {
        "baseline_irradiance": round(baseline_irr, 2),
        "orientation_offset_deg": round(theta, 1),
        "louver_depth_m": round(d_louver, 2),
        "orientation_relief_percent": round(orientation_relief, 2),
        "louver_relief_percent": round(louver_relief, 2),
        "total_reduction_percent": round(total_reduction_pct, 2),
        "estimated_irradiance": round(estimated_irradiance, 2),
        "status": status,
        "disclaimer": "Early-stage solar exposure screening; detailed results should be verified with Autodesk Forma analysis."
    }
