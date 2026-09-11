# Autodesk Forma Integration Guide — ResiliForma

This document provides a step-by-step manual for connecting **Autodesk Forma** with **ResiliForma**, fulfilling all requirements from the team's `TODO` architectural specification.

---

## 🏗️ Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                       RESILIFORMA                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
     ┌───────────────────┐           ┌───────────────────┐
     │  VS CODE / APP    │           │  AUTODESK FORMA   │
     │                   │           │                   │
     │  • Dashboard UI   │           │  • Site/design    │
     │  • Controls       │           │  • Buildings      │
     │  • KPIs           │           │  • Terrain        │
     │  • AI Results     │           │  • Site proposals │
     │  • Interventions  │           │  • Forma analysis │
     └─────────┬─────────┘           └─────────┬─────────┘
               │                               │
               └───────────────┬───────────────┘
                               ▼
                    ┌─────────────────────┐
                    │    REST API BRIDGE  │
                    │   (FastAPI Backend) │
                    └─────────────────────┘
```

---

## 📋 The 4-Step Forma Implementation Workflow

### Step 1 — Autodesk Access & Developer Setup
Your team member should set up:
- **Autodesk Account**: Register at [https://www.autodesk.com](https://www.autodesk.com).
- **Student/Education Access**: If eligible, activate free educational licensing for Autodesk Forma.
- **Autodesk Forma Project**: Access [https://app.autodeskforma.com](https://app.autodeskforma.com).
- **Autodesk Platform Services (APS)**: Register developer portal access at [https://aps.autodesk.com](https://aps.autodesk.com).

---

### Step 2 — Forma Extension Workflow
Autodesk supports custom embedded iframe extensions:

```text
Autodesk Forma (Canvas)
       ↓
Forma Extension (Panel UI at http://localhost:5174)
       ↓
Forma API Bridge (POST /api/forma/analyze)
       ↓
ResiliForma Backend (FastAPI on http://localhost:8000)
```

---

### Step 3 — Canonical Test Forma Project
Set up a simple test site in Autodesk Forma with the following spatial features:
- **Site boundary**: ~4.8 Hectares parcel
- **Terrain**: 4.2% mean slope, north-to-southeast drainage
- **Road Corridor**: North arterial highway (15m offset, 78 dBA heavy traffic)
- **2–3 Buildings**:
  - **B1 (Residential)**: Height 18m, Azimuth 45°, Footprint 850 m², Exposure 75%
  - **B2 (Commercial Tower)**: Height 24m, Azimuth -18°, Footprint 1200 m², Exposure 82%
  - **B3 (Community Facility)**: Height 12m, Azimuth 0°, Footprint 600 m², Exposure 60%

*(A canonical fixture is available at `GET http://localhost:8000/api/forma/test-site`)*

---

### Step 4 — Test API Communication & Data Contract

#### 1. Forma Side → Sends (JSON Payload):
```json
{
  "site_id": "demo-site-01",
  "location": {
    "latitude": 11.0168,
    "longitude": 76.9558
  },
  "buildings": [
    { "id": "B1", "name": "Building 1", "height_m": 18, "azimuth_deg": 45, "footprint_sq_m": 850, "exposure_pct": 75 },
    { "id": "B2", "name": "Building 2", "height_m": 24, "azimuth_deg": -18, "footprint_sq_m": 1200, "exposure_pct": 82 },
    { "id": "B3", "name": "Building 3", "height_m": 12, "azimuth_deg": 0, "footprint_sq_m": 600, "exposure_pct": 60 }
  ],
  "terrain": {
    "type": "Mixed",
    "mean_slope_percent": 4.2,
    "elevation_min": 410,
    "elevation_max": 425
  },
  "roads": [
    { "id": "R1", "name": "North Arterial Road", "traffic_type": "heavy", "distance_to_site_m": 15, "baseline_db": 78 }
  ],
  "noise_sources": [
    { "id": "N1", "source_type": "highway", "baseline_db": 78, "barrier_height_m": 3.5, "veg_depth_m": 8.0 }
  ]
}
```

#### 2. Backend → Returns (JSON Results):
```json
{
  "acoustic": {
    "noise_before": 78,
    "noise_after": 63,
    "reduction_db": 15
  },
  "solar": {
    "heat_gain_reduction": 32
  },
  "resilience_score": 87,
  "recommendations": [
    "Increase façade shielding on north boundary",
    "Add vegetation buffer",
    "Reorient building B2"
  ]
}
```

---

## ⚡ How to Run Everything Locally

### 1. Start the FastAPI Backend
```bash
cd backend
source ~/central_env/bin/activate
python -m uvicorn main:app --reload --port 8000
```
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Test Site Endpoint: [http://localhost:8000/api/forma/test-site](http://localhost:8000/api/forma/test-site)

### 2. Start the Autodesk Forma Extension
```bash
cd forma-extension
bun install
bun run dev
```
- Extension running at [http://localhost:5174](http://localhost:5174)

### 3. Start the ResiliForma Dashboard
```bash
cd frontend
bun install
bun run dev
```
- Dashboard running at [http://localhost:5173](http://localhost:5173)

---

## 🧪 Automated Tests
To run all test suites verifying the Forma contract and endpoints:
```bash
cd backend
source ~/central_env/bin/activate
python tests/test_forma_api.py
python tests/test_api.py
```
