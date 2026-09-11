# ResiliForma — Autodesk Forma Extension

This is the dedicated **Autodesk Forma Extension** for **ResiliForma** (Disaster-Adaptive Site-Planning Co-Pilot).

It connects directly with the Autodesk Forma 3D canvas, extracts site proposals, building footprints, terrain, and road networks, and communicates with the ResiliForma FastAPI backend over the agreed REST API contract.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd forma-extension
bun install   # or npm install
```

### 2. Start Extension Development Server
```bash
bun run dev   # or npm run dev
```
The extension will run on `http://localhost:5174`.

### 3. Ensure Backend is Running
In another terminal:
```bash
cd ../backend
source ~/central_env/bin/activate
uvicorn main:app --reload --port 8000
```

---

## 🌐 Embedding in Autodesk Forma

1. **Sign into Autodesk Forma**: Open [https://app.autodeskforma.com](https://app.autodeskforma.com).
2. **Open Project**: Open an existing project or create a new test project (e.g. Coimbatore Site).
3. **Extensions**: Click on the **Extensions** icon in the right-hand panel.
4. **Developer Mode**: Enable **Developer Mode** in Forma Extension Settings.
5. **Add Local Extension**:
   - **Name**: `ResiliForma Co-Pilot`
   - **URL**: `http://localhost:5174`
   - **Manifest**: Located at `forma-extension/manifest.json`
6. Click **Save & Run**. The ResiliForma panel will load seamlessly inside your Autodesk Forma canvas!

---

## 🔗 Data Contract Exchange

As agreed in the project specifications:

### Forma Side → Sends:
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

### Backend → Returns:
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
