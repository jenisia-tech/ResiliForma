# RESILIFORMA

**Deterministic Multi-Hazard Design Screening Extension for Autodesk Forma**  
**Problem Statement:** SIH26114 — Smart City Site Planning using Autodesk Forma Site Design  
**Target:** Autodesk  

---

## 1. Platform Separation & Core Role

> **Autodesk Forma Site Design = PRIMARY SITE DESIGN PLATFORM**  
> **ResiliForma = SUPPLEMENTARY MULTI-HAZARD SCREENING / DECISION-SUPPORT EXTENSION**

Planners author 3D building masses, roads, terrain, and master plans directly inside **Autodesk Forma**. **ResiliForma** serves as a lightweight, deterministic screening layer to evaluate early-stage spatial parameters across three critical urban hazards:
1. **Road Traffic Noise Attenuation**
2. **Façade Solar Irradiance Relief**
3. **Stormwater Runoff Retention (Rational Method & SuDS)**

---

## 2. Demonstration Site

- **Site:** Karunya Nagar Smart City Sector
- **Location:** Coimbatore South, Tamil Nadu, India
- **Coordinates:** 10.9366° N, 76.7441° E
- **Site Area:** 1.2 km² (120 hectares / 1,200,000 m² — exceeds SIH minimum 1.0 km² requirement)
- **Context:** Western Ghats foothills corridor, NH-544 / Siruvani Road arterial transit corridor, 26 building parcels, heavy monsoon runoff.

---

## 3. Predefined Demonstration Proposals

| Parameter / Metric | Baseline Proposal (Conventional) | Resilient Proposal (Optimized) | Delta / Improvement |
| :--- | :--- | :--- | :--- |
| **Façade Orientation** | `0°` (Direct West Exposure) | `-18°` (Solar Azimuth Deflection) | -18° Offset |
| **Acoustic Earth Berm** | `0.0 m` (None) | `3.5 m` (Engineered Earth Berm) | +3.5 m |
| **Vegetation Buffer** | `0.0 m` (None) | `8.0 m` (Dense Native Planting) | +8.0 m |
| **Shading Louvers** | `0.0 m` (Unshaded) | `1.2 m` (Horizontal Overhangs) | +1.2 m |
| **Bioswales & Retention** | `0 m` / `0 m³` | `644 m` Swales / `7,800 m³` Basin | Full SuDS Network |
| **Road Traffic Noise** | **78.0 dBA** | **62.95 dBA (~63 dBA)** | **-15.05 dB Reduction** |
| **Solar Irradiance** | **710.0 W/m²** | **482.8 W/m² (~480 W/m²)** | **-32.0% Thermal Relief** |
| **Stormwater Management**| **10.0%** | **82.0%** | **+72.0% Retention** |
| **Composite Resilience** | **48 / 100 (Grade D)** | **87 / 100 (Grade A)** | **+39 Points Improvement** |

---

## 4. Screening Calculations Engine

### A. Road Noise Attenuation
$$\text{Optimized Noise (dBA)} = \text{Baseline Noise} - A_{\text{barrier}} - A_{\text{vegetation}}$$
- Barrier Attenuation: $A_{\text{barrier}} = \min(18.0,\, \text{barrier\_height} \times 3.1)$
- Vegetation Attenuation: $A_{\text{vegetation}} = \min(8.0,\, (\text{vegetation\_depth} / 8.0) \times 4.2)$

### B. Solar Irradiance Relief
$$\text{Façade Reduction \%} = \min(45.0,\, \text{Orientation Relief} + \text{Louver Relief})$$
- Orientation Relief: $\min(25.0,\, |\theta_{\text{offset}}| \times 0.45 + 12.0) \quad (\text{if } \theta \neq 0)$
- Louver Relief: $\min(20.0,\, (\text{d\_louver} / 1.2) \times 11.9) \quad (\text{if } d > 0)$
- Estimated Irradiance: $\text{Baseline Irradiance} \times (1 - \text{Total Reduction} / 100)$

### C. Stormwater Runoff (Rational Method)
$$Q_{\text{peak}} = 0.278 \times C \times I \times A$$
- $C$: Runoff Coefficient ($0.85$)
- $I$: Rainfall Intensity ($65\text{ mm/hr}$)
- $A$: Catchment Area in $\text{km}^2$ ($\text{ha} / 100 = 0.2104\text{ km}^2$)

---

## 5. Quick Start Instructions

### Prerequisites
- Python 3.11+
- Bun (`~/.bun/bin/bun`) or Node.js / NPM

### A. Start the Backend API (FastAPI)
```bash
# In project root:
source backend_venv/bin/activate
cd backend
uvicorn app.main:app --reload --port 8000
```
Backend API will be live at: **`http://localhost:8000`**  
API Documentation (Swagger UI): **`http://localhost:8000/docs`**

### B. Run Backend Automated Tests (Pytest)
```bash
cd backend
pytest
```
*All 15 test cases validate mathematical bounds, formula exactness, and API endpoints.*

### C. Start the Frontend (React + TypeScript + Vite)
```bash
cd frontend
bun run dev
# Or with npm: npm run dev
```
Frontend Web Dashboard will be live at: **`http://localhost:5173`**

### D. Build Production Frontend
```bash
cd frontend
bun run build
```

---

## 6. Architecture & Autodesk Forma Integration

```
Autodesk Forma Site Design (3D Masses & Terrain)
         │
         ▼
IFormaAdapter (frontend/src/integrations/forma/formaAdapter.ts)
         │
         ▼
Normalized Site Context & Design Parameters (JSON)
         │
         ▼
FastAPI Analysis Engine (backend/app/calculations/)
         │
         ▼
Multi-Hazard Results & Composite Score (Grade A: 87 / Grade D: 48)
         │
         ▼
Forma Board Proposal Comparison & Revit BIM Handshake
```

- **Demo Mode:** Zero-credential demonstration mode with built-in Karunya Nagar Smart City Sector dataset and offline fallback calculations.
- **Forma Integration Ready:** Structured adapter pattern ready to connect to Autodesk Forma SDK / APS OAuth APIs when deployment credentials are provided.

---

## 7. Disclaimer
ResiliForma is an early-stage multi-hazard decision-support screening extension concept. Detailed engineering and physical simulations should be performed and verified using native Autodesk Forma analyses and certified professional engineering workflows.
