/**
 * API Service for ResiliForma.
 * Communicates with FastAPI backend with local deterministic fallback logic.
 */

import {
  SiteAnalysisRequest,
  SiteAnalysisResponse,
  DemoSiteInfo,
  ProposalCompareResponse
} from '../types/analysis';
import { DEMO_SITE_DATA } from '../integrations/forma/demoFormaAdapter';

// Environment variable with fallback
const API_BASE_URL = ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL) || 'http://localhost:8000';

/**
 * Fallback local deterministic engine in case backend is unreachable during demo
 */
function localAnalyze(req: SiteAnalysisRequest): SiteAnalysisResponse {
  const barrier_h = Math.max(0, req.barrier_height);
  const veg_d = Math.max(0, req.vegetation_depth);
  const louver_d = Math.max(0, req.louver_depth);
  const theta = req.orientation_offset;

  // Noise
  const barrier_att = Math.min(18.0, barrier_h * 3.1);
  const veg_att = Math.min(8.0, (veg_d / 8.0) * 4.2);
  const total_noise_red = barrier_att + veg_att;
  const opt_noise = Math.max(30.0, req.baseline_noise_db - total_noise_red);

  // Solar
  const ori_relief = Math.abs(theta) > 0.01 ? Math.min(25.0, Math.abs(theta) * 0.45 + 12.0) : 0.0;
  const louver_relief = louver_d > 0.01 ? Math.min(20.0, (louver_d / 1.2) * 11.9) : 0.0;
  const total_solar_red = Math.min(45.0, ori_relief + louver_relief);
  const est_irradiance = Math.max(100.0, req.baseline_irradiance * (1.0 - total_solar_red / 100.0));

  // Stormwater
  const C = Math.max(0.2, Math.min(0.98, req.runoff_coefficient));
  const I = Math.max(10.0, req.rainfall_intensity);
  const A_ha = Math.max(1.0, req.catchment_area_ha);
  const swale_m = Math.max(0, req.bioswale_length);
  const ret_m3 = Math.max(0, req.retention_capacity);

  const area_km2 = A_ha / 100.0;
  const peak_runoff = 0.278 * C * I * area_km2;
  const total_vol = (I / 1000.0) * (A_ha * 10000.0) * C;

  const base_infil = 10.0;
  const swale_comp = swale_m > 0 ? Math.min(36.0, (swale_m / 644.0) * 36.0) : 0;
  const ret_comp = ret_m3 > 0 ? Math.min(36.0, (ret_m3 / 7800.0) * 36.0) : 0;
  const sw_mgmt = swale_m === 0 && ret_m3 === 0 ? base_infil : Math.min(98.0, Number((base_infil + swale_comp + ret_comp).toFixed(1)));

  const mit_vol = total_vol * (sw_mgmt / 100.0);
  const net_vol = Math.max(0, total_vol - mit_vol);
  const net_peak = peak_runoff * (1.0 - (sw_mgmt / 100.0) * 0.75);

  // Score
  const noise_sc = Math.max(10, Math.min(100, 44.0 + (78.0 - opt_noise) * (44.1 / 15.05)));
  const solar_sc = Math.max(10, Math.min(100, 45.0 + Math.min(50.0, (total_solar_red / 32.0) * 41.0)));
  const sw_sc = Math.max(10, Math.min(100, 42.0 + ((sw_mgmt - 10.0) / 72.0) * 44.0));
  const access_sc = 68.0 + Math.min(22.0, (barrier_h / 3.5) * 10.0 + (veg_d / 8.0) * 10.0);
  const green_sc = 63.0 + Math.min(25.0, (swale_m / 644.0) * 13.0 + (ret_m3 / 7800.0) * 12.0);

  const comp_val = Math.round(
    noise_sc * 0.30 +
    solar_sc * 0.25 +
    sw_sc * 0.25 +
    access_sc * 0.10 +
    green_sc * 0.10
  );

  const grade = comp_val >= 85 ? 'A' : comp_val >= 70 ? 'B' : comp_val >= 55 ? 'C' : 'D';
  const grade_label = comp_val >= 85 ? 'Resilient / Exceptional' : comp_val >= 70 ? 'Moderate Resilience' : comp_val >= 55 ? 'Sub-optimal' : 'Vulnerable / High Exposure';
  const status_color = comp_val >= 85 ? '#10b981' : comp_val >= 70 ? '#3B82F6' : comp_val >= 55 ? '#F59E0B' : '#EF4444';

  return {
    noise: {
      baseline_db: Number(req.baseline_noise_db.toFixed(1)),
      barrier_height_m: Number(barrier_h.toFixed(1)),
      vegetation_depth_m: Number(veg_d.toFixed(1)),
      barrier_attenuation_db: Number(barrier_att.toFixed(2)),
      vegetation_attenuation_db: Number(veg_att.toFixed(2)),
      total_reduction_db: Number(total_noise_red.toFixed(2)),
      optimized_noise_db: Number(opt_noise.toFixed(2)),
      status: opt_noise <= 65 ? 'Optimal (< 65 dBA)' : opt_noise <= 70 ? 'Moderate (65-70 dBA)' : 'High Exposure (> 70 dBA)',
      disclaimer: 'Deterministic screening estimate; not a substitute for detailed acoustic simulation.'
    },
    solar: {
      baseline_irradiance: Number(req.baseline_irradiance.toFixed(1)),
      orientation_offset_deg: Number(theta.toFixed(1)),
      louver_depth_m: Number(louver_d.toFixed(1)),
      orientation_relief_percent: Number(ori_relief.toFixed(1)),
      louver_relief_percent: Number(louver_relief.toFixed(1)),
      total_reduction_percent: Number(total_solar_red.toFixed(1)),
      estimated_irradiance: Number(est_irradiance.toFixed(1)),
      status: est_irradiance <= 500 ? 'Low Thermal Load (< 500 W/m²)' : est_irradiance <= 620 ? 'Moderate Thermal Load (500-620 W/m²)' : 'High Thermal Load (> 620 W/m²)',
      disclaimer: 'Early-stage solar exposure screening; detailed results should be verified with Autodesk Forma analysis.'
    },
    stormwater: {
      runoff_coefficient: Number(C.toFixed(2)),
      rainfall_intensity_mmhr: Number(I.toFixed(1)),
      catchment_area_ha: Number(A_ha.toFixed(2)),
      area_km2: Number(area_km2.toFixed(4)),
      peak_runoff_m3s: Number(peak_runoff.toFixed(2)),
      total_runoff_volume_m3: Number(total_vol.toFixed(1)),
      bioswale_length_m: Number(swale_m.toFixed(1)),
      retention_capacity_m3: Number(ret_m3.toFixed(1)),
      runoff_management_percent: sw_mgmt,
      mitigated_volume_m3: Number(mit_vol.toFixed(1)),
      net_discharge_m3: Number(net_vol.toFixed(1)),
      net_peak_discharge_m3s: Number(net_peak.toFixed(2)),
      status: sw_mgmt >= 75 ? 'Resilient Retention (>= 75%)' : sw_mgmt >= 45 ? 'Moderate Attenuation (45-75%)' : 'High Vulnerability (< 45%)',
      disclaimer: 'Deterministic screening estimate; not a substitute for dynamic hydraulic/hydrological simulation.'
    },
    score: {
      composite_score: comp_val,
      grade,
      grade_label,
      status_color,
      sub_scores: {
        noise: Number(noise_sc.toFixed(1)),
        solar: Number(solar_sc.toFixed(1)),
        stormwater: Number(sw_sc.toFixed(1)),
        accessibility: Number(access_sc.toFixed(1)),
        land_efficiency: Number(green_sc.toFixed(1))
      },
      weights: { noise: 0.30, solar: 0.25, stormwater: 0.25, accessibility: 0.10, land_efficiency: 0.10 },
      disclaimer: 'Conceptual resilience screening score for project decision support; not an official statutory or Autodesk rating.'
    }
  };
}

export async function fetchDemoSite(): Promise<DemoSiteInfo> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/demo/site`);
    if (!res.ok) throw new Error('Network response not ok');
    return await res.json();
  } catch {
    return DEMO_SITE_DATA;
  }
}

export async function analyzeSite(request: SiteAnalysisRequest): Promise<SiteAnalysisResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/forma/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[ResiliForma API] Falling back to local calculation engine:', err);
    return localAnalyze(request);
  }
}

export async function compareProposals(
  baseline: SiteAnalysisRequest,
  resilient: SiteAnalysisRequest
): Promise<ProposalCompareResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/forma/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseline, resilient })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[ResiliForma API] Comparing using local calculation engine:', err);
    const bRes = localAnalyze(baseline);
    const rRes = localAnalyze(resilient);
    const delta = rRes.score.composite_score - bRes.score.composite_score;
    const nGain = Number((bRes.noise.optimized_noise_db - rRes.noise.optimized_noise_db).toFixed(2));
    const sGain = Number((rRes.solar.total_reduction_percent - bRes.solar.total_reduction_percent).toFixed(2));
    const swGain = Number((rRes.stormwater.runoff_management_percent - bRes.stormwater.runoff_management_percent).toFixed(2));

    return {
      baseline: bRes,
      resilient: rRes,
      delta_score: delta,
      noise_reduction_gain_db: nGain,
      solar_reduction_gain_percent: sGain,
      stormwater_management_gain_percent: swGain,
      summary: `The Resilient Proposal achieves a +${delta} point composite score improvement (Grade ${bRes.score.grade} → Grade ${rRes.score.grade}) by mitigating noise by ${nGain} dB, reducing façade peak solar irradiance by ${sGain}%, and raising stormwater retention by ${swGain}%.`
    };
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}
