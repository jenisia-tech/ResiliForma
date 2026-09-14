"""
Noise attenuation screening calculation module for ResiliForma.
Deterministic multi-hazard screening extension for Autodesk Forma workflows.
"""

def calculate_noise_screening(
    baseline_noise_db: float = 78.0,
    barrier_height: float = 0.0,
    vegetation_depth: float = 0.0
) -> dict:
    """
    Calculate road traffic noise reduction from physical barriers and vegetation buffers.
    
    Formula:
        A_barrier = min(18.0, barrier_height * 3.1)
        A_vegetation = min(8.0, (vegetation_depth / 8.0) * 4.2)
        optimized_noise = baseline_noise - A_barrier - A_vegetation
    """
    barrier_height = max(0.0, float(barrier_height))
    vegetation_depth = max(0.0, float(vegetation_depth))
    baseline_db = float(baseline_noise_db)

    # Calculate attenuations
    barrier_attenuation = min(18.0, barrier_height * 3.1)
    vegetation_attenuation = min(8.0, (vegetation_depth / 8.0) * 4.2)
    
    total_reduction = barrier_attenuation + vegetation_attenuation
    optimized_noise = max(30.0, baseline_db - total_reduction)

    # Status classification
    if optimized_noise <= 65.0:
        status = "Optimal (< 65 dBA)"
    elif optimized_noise <= 70.0:
        status = "Moderate (65-70 dBA)"
    else:
        status = "High Exposure (> 70 dBA)"

    return {
        "baseline_db": round(baseline_db, 2),
        "barrier_height_m": round(barrier_height, 2),
        "vegetation_depth_m": round(vegetation_depth, 2),
        "barrier_attenuation_db": round(barrier_attenuation, 2),
        "vegetation_attenuation_db": round(vegetation_attenuation, 2),
        "total_reduction_db": round(total_reduction, 2),
        "optimized_noise_db": round(optimized_noise, 2),
        "status": status,
        "disclaimer": "Deterministic screening estimate; not a substitute for detailed acoustic simulation."
    }
