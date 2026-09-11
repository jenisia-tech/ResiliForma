"""Solar Exposure & Building Orientation Optimization Analysis Module.

IMPORTANT SCIENTIFIC DISCLAIMER:
This module provides a deterministic PROTOTYPE ESTIMATE for early-stage spatial planning exploration.
It is NOT a certified EnergyPlus, Radiance, or CFD solar radiation physics simulation.
Future development phases will connect this interface to validated building physics engines.
"""

from typing import Dict, Any


def calculate_solar_performance(
    peak_exposure_percent: float = 82.0,
    orientation_offset_deg: float = -18.0,
    louver_depth_m: float = 1.2
) -> Dict[str, Any]:
    """Calculates deterministic prototype solar heat gain reduction and façade shading efficiency.

    Parameters:
    -----------
    peak_exposure_percent : float
        Current peak façade solar exposure percentage (e.g., 82% on critical west façade).
    orientation_offset_deg : float
        Rotation offset in degrees from baseline orientation (e.g. -18° rotates long axis away from peak west sun).
    louver_depth_m : float
        Overhang / external shading louver depth in meters (e.g. 1.2m).

    Returns:
    --------
    Dict[str, Any] with solar performance metrics and prototype status flags.
    """
    # 1. Orientation heat relief heuristic (rotating long axis away from western afternoon azimuth)
    # Absolute degrees offset contributes ~0.45% cooling per degree + baseline passive shift
    orientation_relief = round(min(25.0, abs(orientation_offset_deg) * 0.45 + 12.0), 1)

    # 2. Louver & canopy solar block heuristic (~9.9% cut per 1.2m depth)
    louver_relief = round(min(20.0, (louver_depth_m / 1.2) * 9.9), 1)

    # 3. Net estimated heat-gain reduction (capped at 45% for passive measures)
    heat_gain_reduction = round(min(45.0, max(5.0, orientation_relief + louver_relief)), 1)

    # 4. Annual Solar Irradiance baseline vs optimized (in kWh/m²)
    baseline_radiation = 1780.0
    optimized_radiation = round(baseline_radiation * (1.0 - (heat_gain_reduction / 100.0)), 1)

    # 5. Shading efficiency index
    shading_efficiency = round(min(95.0, 50.0 + louver_relief * 2.0 + abs(orientation_offset_deg) * 0.5), 1)

    # 6. Orientation recommendation guidance
    if orientation_offset_deg < 0:
        recommended_orientation = f"{abs(orientation_offset_deg):.0f}° North-of-East (Minimizes West Glazing)"
    elif orientation_offset_deg > 0:
        recommended_orientation = f"{orientation_offset_deg:.0f}° South-of-East (Prevailing Breeze Alignment)"
    else:
        recommended_orientation = "Cardinal Baseline (High Afternoon Thermal Load)"

    return {
        "peak_exposure_percent": float(peak_exposure_percent),
        "estimated_heat_gain_reduction_percent": float(heat_gain_reduction),
        "annual_baseline_radiation_kwh_m2": float(baseline_radiation),
        "annual_optimized_radiation_kwh_m2": float(optimized_radiation),
        "recommended_orientation": str(recommended_orientation),
        "shading_efficiency_percent": float(shading_efficiency),
        "status": "prototype_estimate",
        "methodology_note": (
            "Prototype geometric heuristic based on building long-axis rotation and exterior louver geometry. "
            "Not a certified solar physics / CFD simulation."
        )
    }
