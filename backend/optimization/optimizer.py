"""Multi-Objective Spatial Planning Candidate Solver & Optimizer.

IMPORTANT SCIENTIFIC DISCLAIMER:
This module implements a deterministic PROTOTYPE CANDIDATE EVALUATION system.
It is NOT a live NSGA-II / MOEA/D genetic algorithm execution.
The architecture is deliberately structured with clean objective vector interfaces
so that a live `pymoo` / `deap` Pareto solver can replace this prototype module in future development.
"""

from typing import Dict, Any, List
from models.schemas import OptimizationWeightsRequest


def solve_pareto_candidates(weights: OptimizationWeightsRequest) -> Dict[str, Any]:
    """Evaluates multi-objective candidate site layouts against configurable stakeholder weights.

    Parameters:
    -----------
    weights : OptimizationWeightsRequest
        Stakeholder priority weightings for acoustic, solar, hydrology, accessibility, and land use.

    Returns:
    --------
    Dict[str, Any] with scored candidate solutions, the top-ranked layout, and prototype metadata.
    """
    # Normalize weights so they sum to 1.0
    w_acoustic = weights.acoustic_weight
    w_solar = weights.solar_weight
    w_water = weights.hydrology_weight
    w_access = weights.accessibility_weight
    w_land = weights.land_utilization_weight

    total_weight = w_acoustic + w_solar + w_water + w_access + w_land
    if total_weight <= 0:
        total_weight = 100.0

    nw_acoustic = w_acoustic / total_weight
    nw_solar = w_solar / total_weight
    nw_water = w_water / total_weight
    nw_access = w_access / total_weight
    nw_land = w_land / total_weight

    # Candidate spatial archetypes
    raw_candidates = [
        {
            "id": "cand-a",
            "name": "Candidate A — Balanced Eco-Shield",
            "tagline": "Optimal balance of perimeter acoustic deflection, rotated solar axis, and gravity bioswales.",
            "scores": {
                "acoustic": 90,
                "solar": 86,
                "water": 82,
                "accessibility": 94,
                "land_utilization": 80
            },
            "tradeoff_summary": "Provides strong acoustic and solar mitigation with standard 3.5m berm and 4,200 m² recharge area."
        },
        {
            "id": "cand-b",
            "name": "Candidate B — Acoustic Maximizer",
            "tagline": "Prioritizes heavy earth-berm buffering (5.0m) and dense 14m native tree forest along arterial road.",
            "scores": {
                "acoustic": 96,
                "solar": 78,
                "water": 74,
                "accessibility": 86,
                "land_utilization": 68
            },
            "tradeoff_summary": "Achieves highest noise reduction (-18 dB) at the cost of 12% reduced developable ground footprint."
        },
        {
            "id": "cand-c",
            "name": "Candidate C — Solar-Hydrology Synergy",
            "tagline": "Maximizes passive solar orientation (-24° offset), deep overhangs, and expanded 6,000 m² wetland basin.",
            "scores": {
                "acoustic": 76,
                "solar": 94,
                "water": 92,
                "accessibility": 88,
                "land_utilization": 76
            },
            "tradeoff_summary": "Cuts cooling loads by 38% and handles 100-year storm events, but requires higher traffic noise tolerance on north blocks."
        }
    ]

    # Calculate weighted composite score for each candidate
    evaluated_candidates: List[Dict[str, Any]] = []
    for cand in raw_candidates:
        sc = cand["scores"]
        composite = (
            sc["acoustic"] * nw_acoustic +
            sc["solar"] * nw_solar +
            sc["water"] * nw_water +
            sc["accessibility"] * nw_access +
            sc["land_utilization"] * nw_land
        )
        final_score = int(round(composite))

        evaluated_candidates.append({
            "id": cand["id"],
            "name": cand["name"],
            "tagline": cand["tagline"],
            "scores": {
                **sc,
                "overall": final_score
            },
            "tradeoff_summary": cand["tradeoff_summary"],
            "is_recommended": False
        })

    # Find highest scoring candidate
    sorted_candidates = sorted(evaluated_candidates, key=lambda x: x["scores"]["overall"], reverse=True)
    best_candidate_id = sorted_candidates[0]["id"]
    best_candidate_name = sorted_candidates[0]["name"]

    # Mark the best candidate
    final_candidates = []
    for cand in evaluated_candidates:
        cand_copy = dict(cand)
        cand_copy["is_recommended"] = (cand_copy["id"] == best_candidate_id)
        final_candidates.append(cand_copy)

    return {
        "candidates": final_candidates,
        "recommended_candidate": best_candidate_name,
        "applied_weights": {
            "acoustic": round(nw_acoustic * 100, 1),
            "solar": round(nw_solar * 100, 1),
            "hydrology": round(nw_water * 100, 1),
            "accessibility": round(nw_access * 100, 1),
            "land_utilization": round(nw_land * 100, 1)
        },
        "status": "prototype_optimization",
        "methodology_note": (
            "Deterministic multi-attribute candidate scoring. "
            "Structured for future drop-in replacement by NSGA-II / pymoo Pareto genetic algorithms."
        )
    }
