# ResiliForma REST API Documentation

This document outlines the API endpoints exposed by the **ResiliForma** FastAPI backend service (`http://localhost:8000`).

Interactive Swagger UI documentation is available at:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 🧭 Overview of Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status & mode check |
| `GET` | `/api/sites` | List all available demo sites |
| `GET` | `/api/sites/{site_id}` | Retrieve details for a specific demo site |
| `POST` | `/api/analyze` | Comprehensive multi-hazard site analysis & scoring |
| `POST` | `/api/analyze/urban` | High-density urban noise & solar heat analysis |
| `POST` | `/api/analyze/rural` | Rural watershed stormwater, agrivoltaics & logistics |
| `POST` | `/api/optimize` | Multi-objective candidate Pareto layout evaluation |

---

## 1. System Health Endpoint

### `GET /api/health`
Checks whether the backend API service is online.

#### Request
```http
GET /api/health HTTP/1.1
Host: localhost:8000
```

#### Response (`200 OK`)
```json
{
  "status": "success",
  "service": "ResiliForma API",
  "version": "1.0.0",
  "mode": "prototype",
  "docs_url": "/docs"
}
```

---

## 2. Demo Sites Endpoints

### `GET /api/sites`
Returns a list of all configured demo site parcels.

#### Response (`200 OK`)
```json
{
  "count": 2,
  "sites": [
    {
      "site_id": "demo-site-01",
      "name": "Coimbatore Demo Site",
      "location": {
        "city": "Coimbatore",
        "state": "Tamil Nadu",
        "country": "India",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "formatted_address": "Coimbatore, Tamil Nadu, India"
      },
      "area_hectares": 12.4,
      "building_count": 8,
      "terrain": {
        "type": "Mixed / Moderate Slope",
        "mean_slope_percent": 4.2,
        "drainage_direction": "North to South-East"
      },
      "climate": {
        "zone": "Tropical Wet & Dry (Aw - Köppen)",
        "design_temperature_c": 41.0,
        "peak_monsoon_rainfall_mm_hr": 65.0
      },
      "noise": {
        "source": "Road Traffic (NH 544 Arterial Corridor)",
        "baseline_db": 78.0,
        "target_db": 65.0
      },
      "solar": {
        "peak_exposure_percent": 82.0,
        "annual_irradiance_kwh_m2": 1780.0,
        "critical_façade": "West / South-West"
      },
      "hydrology": {
        "runoff_risk": "Moderate",
        "peak_precipitation_capacity_mm_hr": 65.0,
        "proposed_recharge_area_sq_m": 4200.0
      },
      "accessibility": {
        "nearest_essential_facility_minutes": 8.0,
        "connectivity_status": "Good"
      },
      "meta": {
        "mode": "prototype",
        "forma_connected": false,
        "forma_status": "Demo Mode / Integration Pending",
        "api_version": "1.0.0"
      }
    }
  ]
}
```

### `GET /api/sites/{site_id}`
Retrieves a single site parcel by ID.

#### Request Example
```http
GET /api/sites/demo-site-01 HTTP/1.1
Host: localhost:8000
```

#### Error Response (`404 Not Found`)
```json
{
  "status": "error",
  "error_code": 404,
  "message": "Site with ID 'unknown-site' not found. Available sites: ['demo-site-01', 'demo-site-02']"
}
```

---

## 3. Comprehensive Site Analysis Endpoint

### `POST /api/analyze`
Accepts site spatial parameters and runs multi-hazard analysis, resilience scoring, and rule-based recommendation generation.

#### Request Example
```json
{
  "site_id": "demo-site-01",
  "location": {
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "country": "India",
    "latitude": 11.0168,
    "longitude": 76.9558
  },
  "area_hectares": 12.4,
  "building_count": 8,
  "terrain": {
    "type": "Mixed",
    "mean_slope_percent": 4.2
  },
  "noise": {
    "source": "Road Traffic",
    "baseline_db": 78.0,
    "barrier_height_m": 3.5,
    "veg_depth_m": 8.0
  },
  "solar": {
    "peak_exposure_percent": 82.0,
    "orientation_offset_deg": -18.0,
    "louver_depth_m": 1.2
  },
  "hydrology": {
    "runoff_risk": "Moderate",
    "precipitation_intensity_mm_hr": 65.0,
    "proposed_recharge_area_sq_m": 4200.0
  }
}
```

#### Response (`200 OK`)
```json
{
  "site": {
    "site_id": "demo-site-01",
    "location": "Coimbatore, Tamil Nadu, India",
    "area_hectares": 12.4,
    "building_count": 8
  },
  "acoustic": {
    "baseline_db": 78.0,
    "optimized_db": 63.0,
    "reduction_db": 15.0,
    "target_db": 65.0,
    "target_achieved": true,
    "barrier_attenuation_db": 10.8,
    "vegetation_loss_db": 4.2,
    "status": "prototype_estimate",
    "methodology_note": "Prototype diffractive heuristic based on barrier height and vegetative foliage depth. Not certified ISO 9613-2 ray tracing."
  },
  "solar": {
    "peak_exposure_percent": 82.0,
    "estimated_heat_gain_reduction_percent": 30.0,
    "annual_baseline_radiation_kwh_m2": 1780.0,
    "annual_optimized_radiation_kwh_m2": 1246.0,
    "recommended_orientation": "18° North-of-East (Minimizes West Glazing)",
    "shading_efficiency_percent": 78.0,
    "status": "prototype_estimate",
    "methodology_note": "Prototype geometric heuristic based on building long-axis rotation and exterior louver geometry. Not a certified solar physics / CFD simulation."
  },
  "hydrology": {
    "runoff_handling_percent": 82.0,
    "terrain_risk": "Moderate Slope (Optimal Gravity Runoff)",
    "peak_discharge_reduction_percent": 79.0,
    "recommended_interventions": [
      "Constructed parabolic vegetated bioswales along topographic contours",
      "Naturalized groundwater recharge basin with siltation forebay",
      "Permeable interlocking concrete pavers (PICP) across pedestrian plazas",
      "Gravity-fed contour drainage avoiding motorized sump pumps"
    ],
    "sized_swale_length_m": 379.4,
    "sized_recharge_basin_m2": 4200.0,
    "status": "prototype_estimate",
    "methodology_note": "Prototype estimate using rational runoff coefficient heuristics. Not certified EPA SWMM hydrodynamic watershed simulation."
  },
  "access": {
    "nearest_essential_facility_minutes": 8.0,
    "accessibility_status": "Good",
    "active_transport_buffer_m": 400.0,
    "emergency_egress_routes": 3,
    "status": "prototype_estimate",
    "methodology_note": "Prototype travel time index. Real spatial network graph routing will integrate in future development phases."
  },
  "resilience": {
    "score": 88,
    "rating": "High Resilience Potential",
    "components": {
      "acoustic": 90,
      "solar": 86,
      "water": 82,
      "accessibility": 94
    },
    "formula_weights": {
      "acoustic": 0.25,
      "solar": 0.25,
      "water": 0.25,
      "accessibility": 0.25
    },
    "status": "prototype_index"
  },
  "recommendations": [
    {
      "id": "rec-1",
      "category": "Acoustic",
      "priority": "High",
      "title": "Add acoustic barrier along northern road edge",
      "explanation": "A 3.5m earth-berm reinforced timber acoustic wall shields residential blocks from heavy arterial traffic noise.",
      "expected_impact": "~15 dB noise reduction along northern arterial road (Estimated Demo Value)",
      "mode": "urban"
    },
    {
      "id": "rec-2",
      "category": "Urban Design",
      "priority": "Medium",
      "title": "Increase vegetation buffer near noise source",
      "explanation": "Multi-tiered native broadleaf tree canopy (Neem, Pongamia, Bamboo) creates a dense 8-meter natural buffer zone.",
      "expected_impact": "Estimated ~3 dB acoustic attenuation & ~1.8°C microclimate cooling (Demo)",
      "mode": "both"
    },
    {
      "id": "rec-3",
      "category": "Solar",
      "priority": "High",
      "title": "Reorient Building B2 to reduce peak solar exposure",
      "explanation": "Rotating long axis 18° north-of-east minimizes intense afternoon tropical radiation while capturing prevailing cross-ventilation breezes.",
      "expected_impact": "~30% solar heat-gain reduction on west-facing glazing (Estimated Demo Value)",
      "mode": "urban"
    },
    {
      "id": "rec-4",
      "category": "Hydrology",
      "priority": "High",
      "title": "Route stormwater toward proposed recharge zone",
      "explanation": "Constructed parabolic bioswales convey site runoff by gravity to the south-eastern natural aquifer recharge zone.",
      "expected_impact": "~82% runoff capture and zero surface ponding during 50-year storm events (Estimated Demo Value)",
      "mode": "both"
    },
    {
      "id": "rec-5",
      "category": "Accessibility",
      "priority": "Medium",
      "title": "Improve pedestrian & emergency access to essential facilities",
      "explanation": "Dedicated permeable multi-modal pathway links the site core directly to primary healthcare and transit nodes.",
      "expected_impact": "Reduces emergency transit time to 8 min with all-weather porous paths",
      "mode": "both"
    },
    {
      "id": "rec-6",
      "category": "Rural Planning",
      "priority": "High",
      "title": "Deploy elevated agrivoltaic dual-use solar arrays",
      "explanation": "Elevated 4.2m bifacial solar canopy enables shade-tolerant horticulture underneath while generating renewable energy.",
      "expected_impact": "74% land utilization with 1.2 MW clean energy generation & shade crops (Demo Est.)",
      "mode": "rural"
    }
  ],
  "meta": {
    "mode": "prototype",
    "forma_connected": false,
    "forma_status": "Demo Mode / Integration Pending",
    "api_version": "1.0.0"
  }
}
```

---

## 4. Urban & Rural Specific Endpoints

### `POST /api/analyze/urban`
#### Request Example
```json
{
  "site_id": "demo-site-01",
  "area_hectares": 12.4,
  "building_count": 8,
  "baseline_noise_db": 78.0,
  "barrier_height_m": 3.5,
  "veg_buffer_depth_m": 8.0,
  "solar_exposure_percent": 82.0,
  "azimuth_rotation_deg": -18.0,
  "shading_louver_depth_m": 1.2
}
```

### `POST /api/analyze/rural`
#### Request Example
```json
{
  "site_id": "demo-site-01",
  "area_hectares": 12.4,
  "mean_slope_percent": 4.2,
  "runoff_risk": "Moderate",
  "storm_scenario": "50yr",
  "agrivoltaic_area_pct": 25.0,
  "target_recharge_m2": 4200.0
}
```

---

## 5. Multi-Objective Optimization Endpoint

### `POST /api/optimize`
Evaluates 3 candidate layouts using customizable stakeholder weights.

#### Request Example
```json
{
  "acoustic_weight": 30.0,
  "solar_weight": 25.0,
  "hydrology_weight": 20.0,
  "accessibility_weight": 15.0,
  "land_utilization_weight": 10.0
}
```

#### Response (`200 OK`)
```json
{
  "candidates": [
    {
      "id": "cand-a",
      "name": "Candidate A — Balanced Eco-Shield",
      "tagline": "Optimal balance of perimeter acoustic deflection, rotated solar axis, and gravity bioswales.",
      "scores": {
        "acoustic": 90,
        "solar": 86,
        "water": 82,
        "accessibility": 94,
        "land_utilization": 80,
        "overall": 87
      },
      "tradeoff_summary": "Provides strong acoustic and solar mitigation with standard 3.5m berm and 4,200 m² recharge area.",
      "is_recommended": true
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
        "land_utilization": 68,
        "overall": 83
      },
      "tradeoff_summary": "Achieves highest noise reduction (-18 dB) at the cost of 12% reduced developable ground footprint.",
      "is_recommended": false
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
        "land_utilization": 76,
        "overall": 85
      },
      "tradeoff_summary": "Cuts cooling loads by 38% and handles 100-year storm events, but requires higher traffic noise tolerance on north blocks.",
      "is_recommended": false
    }
  ],
  "recommended_candidate": "Candidate A — Balanced Eco-Shield",
  "applied_weights": {
    "acoustic": 30.0,
    "solar": 25.0,
    "hydrology": 20.0,
    "accessibility": 15.0,
    "land_utilization": 10.0
  },
  "status": "prototype_optimization",
  "methodology_note": "Deterministic multi-attribute candidate scoring. Structured for future drop-in replacement by NSGA-II / pymoo Pareto genetic algorithms."
}
```
