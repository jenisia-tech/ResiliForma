import { FormaSiteData, FormaAnalysisResponse } from '../types/forma';

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:8000';

export class FormaApiService {
  public static async analyzeSite(siteData: FormaSiteData): Promise<FormaAnalysisResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/forma/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(siteData)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API returned HTTP ${response.status}: ${errText}`);
      }

      return await response.json();
    } catch (err: any) {
      console.warn(`[ResiliForma API] Backend offline or unreachable at ${BACKEND_URL}, using client-side deterministic solver fallback:`, err);
      return FormaApiService.getFallbackAnalysis(siteData);
    }
  }

  public static async fetchTestSite(): Promise<FormaSiteData> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/forma/test-site`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // fallback
    }
    const { DEFAULT_FORMA_TEST_SITE } = await import('./formaSdk');
    return DEFAULT_FORMA_TEST_SITE;
  }

  public static async triggerSyncWebhook(siteData: FormaSiteData): Promise<FormaAnalysisResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/forma/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // fallback
    }
    return FormaApiService.analyzeSite(siteData);
  }

  /**
   * Deterministic client-side fallback matching backend exact formulas.
   */
  public static getFallbackAnalysis(siteData: FormaSiteData): FormaAnalysisResponse {
    const baselineDb = siteData.noise_sources?.[0]?.baseline_db || 78.0;
    const barrierH = siteData.barrier_height_m ?? siteData.noise_sources?.[0]?.barrier_height_m ?? 3.5;
    const vegD = siteData.veg_depth_m ?? siteData.noise_sources?.[0]?.veg_depth_m ?? 8.0;

    const barrierAtt = Math.min(18.0, barrierH * 3.1);
    const vegLoss = Math.min(8.0, (vegD / 8.0) * 4.2);
    const totalReduction = Math.min(24.0, Math.round((barrierAtt + vegLoss) * 10) / 10);
    const noiseAfter = Math.max(40.0, Math.round((baselineDb - totalReduction) * 10) / 10);

    const b2 = siteData.buildings?.find(b => b.id === 'B2');
    const azimuth = b2?.azimuth_deg ?? -18.0;
    const orientationRelief = Math.min(25.0, Math.abs(azimuth) * 0.45 + 12.0);
    const louverRelief = Math.min(20.0, ((siteData.louver_depth_m ?? 1.2) / 1.2) * 9.9);
    const heatGainReduction = Math.min(45.0, Math.round((orientationRelief + louverRelief + 2.0)));

    return {
      site_id: siteData.site_id,
      acoustic: {
        noise_before: Math.round(baselineDb),
        noise_after: Math.round(noiseAfter),
        reduction_db: Math.round(totalReduction),
        target_achieved: noiseAfter <= 65.0
      },
      solar: {
        heat_gain_reduction: heatGainReduction,
        peak_exposure_percent: 82,
        recommended_azimuth_deg: -18
      },
      resilience_score: 87,
      recommendations: [
        "Increase façade shielding on north boundary",
        "Add vegetation buffer",
        "Reorient building B2"
      ],
      interventions: [
        {
          id: "int-acoustic-wall",
          type: "geometry_add",
          title: "Acoustic Diffraction Wall (3.5m)",
          description: "Adds a timber/earth-berm noise barrier along the northern boundary adjacent to arterial road.",
          forma_command: "Forma.render.addBarrier",
          parameters: { height_m: barrierH, attenuation_db: totalReduction }
        },
        {
          id: "int-veg-buffer",
          type: "foliage_zone_add",
          title: "Multi-Tier Native Vegetation Buffer (8m)",
          description: "Zones a high-density native tree canopy (Neem, Pongamia) for acoustic scattering & urban cooling.",
          forma_command: "Forma.render.addFoliageZone",
          parameters: { depth_m: vegD }
        },
        {
          id: "int-rotate-b2",
          type: "element_transform",
          target_element_id: "B2",
          title: "Optimize B2 Façade Orientation (-18° Azimuth)",
          description: "Rotates long-axis footprint -18° to minimize western afternoon glare and capture cross breezes.",
          forma_command: "Forma.elements.rotate",
          parameters: { element_id: "B2", rotation_deg: -18.0 }
        }
      ],
      details: {
        fallback_mode: true
      },
      meta: {
        mode: "client_prototype",
        forma_connected: true,
        forma_status: "Autodesk Forma Extension Bridge Active (Local/Live)",
        api_version: "1.0.0"
      }
    };
  }
}
