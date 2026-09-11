"""Composite Disaster Resilience Scoring Module.

IMPORTANT SCIENTIFIC DISCLAIMER:
This index provides a deterministic PROTOTYPE COMPOSITE SCORE for early-stage spatial planning exploration.
It combines normalized hazard sub-scores using configurable weights.
Future development phases will calibrate this index with empirical post-disaster recovery data.
"""

from typing import Dict, Any, Optional


def calculate_resilience_score(
    acoustic_score: float = 90.0,
    solar_score: float = 86.0,
    water_score: float = 82.0,
    accessibility_score: float = 94.0,
    custom_weights: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """Calculates a transparent weighted composite disaster resilience score (0-100).

    Parameters:
    -----------
    acoustic_score : float
        Normalized sub-score for acoustic mitigation (0-100).
    solar_score : float
        Normalized sub-score for solar thermal performance (0-100).
    water_score : float
        Normalized sub-score for stormwater / flood handling (0-100).
    accessibility_score : float
        Normalized sub-score for emergency transit & essential facility connectivity (0-100).
    custom_weights : Optional[Dict[str, float]]
        Custom weighting map (default: 25% each).

    Returns:
    --------
    Dict[str, Any] with composite score, rating label, component breakdown, and formula weights.
    """
    weights = custom_weights or {
        "acoustic": 0.25,
        "solar": 0.25,
        "water": 0.25,
        "accessibility": 0.25
    }

    # Normalize weights so they sum to 1.0
    total_weight = sum(weights.values())
    if total_weight > 0:
        norm_weights = {k: v / total_weight for k, v in weights.items()}
    else:
        norm_weights = {"acoustic": 0.25, "solar": 0.25, "water": 0.25, "accessibility": 0.25}

    # Compute weighted composite score
    raw_score = (
        acoustic_score * norm_weights.get("acoustic", 0.25) +
        solar_score * norm_weights.get("solar", 0.25) +
        water_score * norm_weights.get("water", 0.25) +
        accessibility_score * norm_weights.get("accessibility", 0.25)
    )

    final_score = int(round(min(100.0, max(0.0, raw_score))))

    # Categorical rating label
    if final_score >= 85:
        rating_label = "High Resilience Potential"
    elif final_score >= 70:
        rating_label = "Moderate Resilience"
    elif final_score >= 50:
        rating_label = "Developing Resilience"
    else:
        rating_label = "Critical Vulnerability"

    return {
        "score": int(final_score),
        "rating": str(rating_label),
        "components": {
            "acoustic": int(round(acoustic_score)),
            "solar": int(round(solar_score)),
            "water": int(round(water_score)),
            "accessibility": int(round(accessibility_score))
        },
        "formula_weights": {k: round(v, 3) for k, v in norm_weights.items()},
        "status": "prototype_index"
    }
