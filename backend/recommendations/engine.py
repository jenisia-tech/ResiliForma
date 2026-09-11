"""Rule-based climate-adaptive recommendation generation engine for ResiliForma."""

from typing import List, Dict, Any


def generate_recommendations(
    acoustic_data: Dict[str, Any],
    solar_data: Dict[str, Any],
    hydrology_data: Dict[str, Any],
    access_data: Dict[str, Any],
    mode: str = "both"
) -> List[Dict[str, Any]]:
    """Generates prioritized engineering & ecological interventions based on multi-hazard diagnostics.

    Parameters:
    -----------
    acoustic_data : Dict[str, Any]
        Results from acoustic mitigation calculation.
    solar_data : Dict[str, Any]
        Results from solar performance calculation.
    hydrology_data : Dict[str, Any]
        Results from hydrology analysis.
    access_data : Dict[str, Any]
        Results from accessibility analysis.
    mode : str
        Target mode ('urban', 'rural', or 'both').

    Returns:
    --------
    List[Dict[str, Any]] containing prioritized recommendation objects.
    """
    recommendations: List[Dict[str, Any]] = []

    # 1. Acoustic Intervention
    baseline_db = acoustic_data.get("baseline_db", 78.0)
    reduction_db = acoustic_data.get("reduction_db", 15.0)
    if baseline_db > 65.0:
        recommendations.append({
            "id": "rec-1",
            "category": "Acoustic",
            "priority": "High",
            "title": "Add acoustic barrier along northern road edge",
            "explanation": (
                "A 3.5m earth-berm reinforced timber acoustic wall shields residential blocks "
                "from heavy arterial traffic noise."
            ),
            "expected_impact": f"~{reduction_db:.0f} dB noise reduction along northern arterial road (Estimated Demo Value)",
            "mode": "urban"
        })

    # 2. Vegetation Buffer Intervention
    recommendations.append({
        "id": "rec-2",
        "category": "Urban Design",
        "priority": "Medium",
        "title": "Increase vegetation buffer near noise source",
        "explanation": (
            "Multi-tiered native broadleaf tree canopy (Neem, Pongamia, Bamboo) creates a dense "
            "8-meter natural buffer zone."
        ),
        "expected_impact": "Estimated ~3 dB acoustic attenuation & ~1.8°C microclimate cooling (Demo)",
        "mode": "both"
    })

    # 3. Solar Orientation Intervention
    peak_solar = solar_data.get("peak_exposure_percent", 82.0)
    solar_cut = solar_data.get("estimated_heat_gain_reduction_percent", 30.0)
    if peak_solar >= 60.0:
        recommendations.append({
            "id": "rec-3",
            "category": "Solar",
            "priority": "High",
            "title": "Reorient Building B2 to reduce peak solar exposure",
            "explanation": (
                "Rotating long axis 18° north-of-east minimizes intense afternoon tropical radiation "
                "while capturing prevailing cross-ventilation breezes."
            ),
            "expected_impact": f"~{solar_cut:.0f}% solar heat-gain reduction on west-facing glazing (Estimated Demo Value)",
            "mode": "urban"
        })

    # 4. Hydrology & Bioswale Intervention
    capture_pct = hydrology_data.get("runoff_handling_percent", 82.0)
    recommendations.append({
        "id": "rec-4",
        "category": "Hydrology",
        "priority": "High",
        "title": "Route stormwater toward proposed recharge zone",
        "explanation": (
            "Constructed parabolic bioswales convey site runoff by gravity to the south-eastern "
            "natural aquifer recharge zone."
        ),
        "expected_impact": f"~{capture_pct:.0f}% runoff capture and zero surface ponding during 50-year storm events (Estimated Demo Value)",
        "mode": "both"
    })

    # 5. Accessibility & Emergency Egress Intervention
    facility_min = access_data.get("nearest_essential_facility_minutes", 8.0)
    recommendations.append({
        "id": "rec-5",
        "category": "Accessibility",
        "priority": "Medium",
        "title": "Improve pedestrian & emergency access to essential facilities",
        "explanation": (
            "Dedicated permeable multi-modal pathway links the site core directly to primary "
            "healthcare and transit nodes."
        ),
        "expected_impact": f"Reduces emergency transit time to {facility_min:.0f} min with all-weather porous paths",
        "mode": "both"
    })

    # 6. Agrivoltaics Intervention (Rural Focus)
    if mode in ["rural", "both"]:
        recommendations.append({
            "id": "rec-6",
            "category": "Rural Planning",
            "priority": "High",
            "title": "Deploy elevated agrivoltaic dual-use solar arrays",
            "explanation": (
                "Elevated 4.2m bifacial solar canopy enables shade-tolerant horticulture underneath "
                "while generating renewable energy."
            ),
            "expected_impact": "74% land utilization with 1.2 MW clean energy generation & shade crops (Demo Est.)",
            "mode": "rural"
        })

    # Filter recommendations if specific mode requested
    if mode == "urban":
        return [r for r in recommendations if r["mode"] in ["urban", "both"]]
    elif mode == "rural":
        return [r for r in recommendations if r["mode"] in ["rural", "both"]]
    return recommendations
