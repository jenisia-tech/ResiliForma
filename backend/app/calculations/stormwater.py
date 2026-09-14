"""
Stormwater runoff screening calculation module for ResiliForma.
Deterministic multi-hazard screening extension for Autodesk Forma workflows.
"""

def calculate_stormwater_screening(
    runoff_coefficient: float = 0.85,
    rainfall_intensity: float = 65.0,
    catchment_area_ha: float = 21.04,
    bioswale_length: float = 0.0,
    retention_capacity: float = 0.0
) -> dict:
    """
    Calculate peak stormwater discharge and runoff management screening using the Rational Method.
    
    Formula:
        area_km2 = catchment_area_ha / 100.0
        Q_peak (m³/s) = 0.278 * C * I * A
        Runoff Management % is derived deterministically from bioswale length and retention capacity.
    """
    C = max(0.2, min(0.98, float(runoff_coefficient)))
    I = max(10.0, float(rainfall_intensity))
    A_ha = max(1.0, float(catchment_area_ha))
    swale_m = max(0.0, float(bioswale_length))
    retention_m3 = max(0.0, float(retention_capacity))

    area_km2 = A_ha / 100.0
    peak_runoff_m3s = 0.278 * C * I * area_km2

    # Calculate 1-hour storm runoff volume (m³)
    total_volume_m3 = (I / 1000.0) * (A_ha * 10000.0) * C

    # Deterministic runoff management percentage calculation
    # Baseline benchmark: bioswale=0, retention=0 gives 10.0% base soil percolation
    # Resilient target: bioswale=644m (36%), retention=7800m3 (36%) yields exactly 82.0%
    base_infiltration = 10.0
    swale_component = min(36.0, (swale_m / 644.0) * 36.0) if swale_m > 0 else 0.0
    retention_component = min(36.0, (retention_m3 / 7800.0) * 36.0) if retention_m3 > 0 else 0.0

    if swale_m == 0 and retention_m3 == 0:
        runoff_management_percent = round(base_infiltration, 1)
    else:
        runoff_management_percent = min(98.0, round(base_infiltration + swale_component + retention_component, 1))

    mitigated_volume_m3 = total_volume_m3 * (runoff_management_percent / 100.0)
    net_discharge_m3 = max(0.0, total_volume_m3 - mitigated_volume_m3)
    net_peak_discharge_m3s = peak_runoff_m3s * (1.0 - (runoff_management_percent / 100.0) * 0.75)

    if runoff_management_percent >= 75.0:
        status = "Resilient Retention (>= 75%)"
    elif runoff_management_percent >= 45.0:
        status = "Moderate Attenuation (45-75%)"
    else:
        status = "High Vulnerability (< 45%)"

    return {
        "runoff_coefficient": round(C, 2),
        "rainfall_intensity_mmhr": round(I, 1),
        "catchment_area_ha": round(A_ha, 2),
        "area_km2": round(area_km2, 4),
        "peak_runoff_m3s": round(peak_runoff_m3s, 2),
        "total_runoff_volume_m3": round(total_volume_m3, 1),
        "bioswale_length_m": round(swale_m, 1),
        "retention_capacity_m3": round(retention_m3, 1),
        "runoff_management_percent": round(runoff_management_percent, 1),
        "mitigated_volume_m3": round(mitigated_volume_m3, 1),
        "net_discharge_m3": round(net_discharge_m3, 1),
        "net_peak_discharge_m3s": round(net_peak_discharge_m3s, 2),
        "status": status,
        "disclaimer": "Deterministic screening estimate; not a substitute for dynamic hydraulic/hydrological simulation."
    }
