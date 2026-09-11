# ResiliForma — FastAPI Backend

Welcome to the backend service for **ResiliForma**, an AI-powered disaster-adaptive site-planning co-pilot.

This backend provides REST API endpoints for:
- 🔊 **Acoustic Noise Diffraction** & Highway Perimeter Buffering
- ☀️ **Solar Heat Gain Reduction** & Façade Azimuth Orientation
- 🌊 **Watershed Hydrology Runoff Infiltration** & Bioswales
- 🚶 **Multimodal Accessibility** & Healthcare/Transit Catchment
- 🛡️ **Composite Weighted Disaster Resilience Scoring** (0-100)
- 🎯 **Multi-Objective Pareto Candidate Evaluation**
- 💡 **Climate-Adaptive Engineering & Ecological Recommendations**

---

## 🚀 Quick Start Guide (Beginner Friendly)

Follow these simple steps to run the backend on your computer:

### 1. Open your terminal in the backend folder
```bash
cd c:\Users\haeue\OneDrive\Desktop\ResiliForma\backend
```

### 2. Create a Python virtual environment
```bash
python -m venv venv
```

### 3. Activate the virtual environment
- **On Windows (PowerShell):**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
- **On Windows (Command Prompt):**
  ```cmd
  .\venv\Scripts\activate.bat
  ```
- **On macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Start the FastAPI development server
```bash
uvicorn main:app --reload
```

---

## 🌐 Interactive API Documentation (Swagger)

Once the server is running, open your browser:

- **Swagger UI (Interactive Playground):**
  [http://localhost:8000/docs](http://localhost:8000/docs)
- **Redoc Documentation:**
  [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check Endpoint:**
  [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🧪 Testing the API

You can test the endpoints directly using Python or `pytest`:

```bash
# Run the built-in standalone test script:
python tests/test_api.py

# Or with pytest:
pytest tests/
```

---

## 📬 Example API Requests

### 1. Health Check
```bash
curl -X GET http://localhost:8000/api/health
```

### 2. Comprehensive Site Analysis
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "site_id": "demo-site-01",
    "location": {
      "city": "Coimbatore",
      "state": "Tamil Nadu",
      "country": "India"
    },
    "area_hectares": 12.4,
    "building_count": 8,
    "noise": { "baseline_db": 78.0, "barrier_height_m": 3.5 },
    "solar": { "peak_exposure_percent": 82.0, "orientation_offset_deg": -18.0 },
    "hydrology": { "runoff_risk": "Moderate" }
  }'
```

### 3. Multi-Objective Optimization
```bash
curl -X POST http://localhost:8000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "acoustic_weight": 30,
    "solar_weight": 25,
    "hydrology_weight": 20,
    "accessibility_weight": 15,
    "land_utilization_weight": 10
  }'
```

---

## 🔗 How the Frontend Connects

The React frontend (`ResiliForma/frontend`) communicates with this backend over HTTP:

1. Frontend sends a `POST /api/analyze` request with the user's site parameters or slider adjustments.
2. Backend runs deterministic spatial calculations and returns the JSON payload.
3. React renders the results in KPIs, 2.5D visualizers, resilience gauges, and recommendation cards.

CORS is already pre-configured to allow requests from `http://localhost:5173`.

---

## 🔬 Scientific Honesty & Prototype Notice

> **Smart India Hackathon (SIH) Compliance Notice:**
> The calculations currently implemented in `analysis/acoustic.py`, `analysis/solar.py`, `analysis/hydrology.py`, and `analysis/access.py` are **deterministic prototype heuristics** designed for early-stage spatial exploration.
> They are **not** certified ISO 9613-2 acoustic ray tracing, full CFD thermal simulations, or hydrodynamic SWMM runoff models.

---

## 🏗️ Future Autodesk Forma Extension Integration

This backend is designed with modular interfaces. In the future, an Autodesk Forma Extension will connect directly:

```text
Autodesk Forma Canvas
        ↓ (3D Building Footprints & Terrain Contours)
Forma Extension / API
        ↓ (REST Payload)
FastAPI Backend (/api/analyze)
        ↓
ResiliForma Analysis & Optimization Engines
        ↓
Results returned to Autodesk Forma & React Co-Pilot
```

---

## 📁 Directory Structure

```text
backend/
├── main.py                   ← FastAPI application entrypoint & routing
├── requirements.txt          ← Python dependencies
├── README.md                 ← Beginner setup guide (this file)
├── API.md                    ← Full REST API specification
│
├── models/
│   ├── __init__.py
│   └── schemas.py            ← Pydantic v2 request/response validation
│
├── analysis/
│   ├── __init__.py
│   ├── acoustic.py           ← Highway noise diffraction & barrier heuristic
│   ├── solar.py              ← Solar heat gain & building azimuth optimization
│   ├── hydrology.py          ← Stormwater runoff, swales & recharge basins
│   ├── access.py             ← Multimodal transit & emergency connectivity
│   └── resilience.py         ← Transparent weighted composite score (0-100)
│
├── optimization/
│   ├── __init__.py
│   └── optimizer.py          ← Multi-objective Pareto candidate evaluation
│
├── recommendations/
│   ├── __init__.py
│   └── engine.py             ← Climate-adaptive intervention generator
│
├── data/
│   └── demo_sites.json       ← Coimbatore & regional demo site datasets
│
└── tests/
    ├── __init__.py
    └── test_api.py           ← Comprehensive automated test suite
```
