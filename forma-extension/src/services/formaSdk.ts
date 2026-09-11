import { FormaSiteData, FormaBuilding, SdkConnectionState, FormaIntervention } from '../types/forma';

/**
 * Autodesk Forma Embedded View SDK Bridge.
 * 
 * Provides transparent communication with Autodesk Forma canvas if running inside an iframe,
 * or gracefully falls back to a high-fidelity mock sandbox for local development and testing.
 */

// Step 3 Test Site Fixture matching TODO requirements
export const DEFAULT_FORMA_TEST_SITE: FormaSiteData = {
  site_id: "demo-site-01",
  location: {
    city: "Coimbatore",
    state: "Tamil Nadu",
    country: "India",
    latitude: 11.0168,
    longitude: 76.9558
  },
  site_boundary: {
    type: "Polygon",
    coordinates: [
      [-120, -90],
      [120, -90],
      [120, 90],
      [-120, 90],
      [-120, -90]
    ],
    area_sq_m: 43200
  },
  buildings: [
    {
      id: "B1",
      name: "Building 1 (Residential Block)",
      height_m: 18.0,
      azimuth_deg: 45.0,
      footprint_sq_m: 850.0,
      exposure_pct: 75.0,
      geometry_polygon: [[-70, 15], [-25, 15], [-25, 55], [-70, 55]]
    },
    {
      id: "B2",
      name: "Building 2 (Commercial Tower B2)",
      height_m: 24.0,
      azimuth_deg: -18.0,
      footprint_sq_m: 1200.0,
      exposure_pct: 82.0,
      geometry_polygon: [[15, 10], [75, 10], [75, 50], [15, 50]]
    },
    {
      id: "B3",
      name: "Building 3 (Community Center B3)",
      height_m: 12.0,
      azimuth_deg: 0.0,
      footprint_sq_m: 600.0,
      exposure_pct: 60.0,
      geometry_polygon: [[-30, -55], [30, -55], [30, -25], [-30, -25]]
    }
  ],
  terrain: {
    type: "Mixed",
    mean_slope_percent: 4.2,
    elevation_min: 410.0,
    elevation_max: 425.0,
    drainage_vector: [0.0, -1.0]
  },
  roads: [
    {
      id: "R1",
      name: "North Arterial Highway (NH-544 Connector)",
      traffic_type: "heavy",
      distance_to_site_m: 15.0,
      baseline_db: 78.0
    }
  ],
  noise_sources: [
    {
      id: "N1",
      source_type: "highway",
      baseline_db: 78.0,
      barrier_height_m: 3.5,
      veg_depth_m: 8.0
    }
  ],
  barrier_height_m: 3.5,
  veg_depth_m: 8.0,
  louver_depth_m: 1.2
};

class FormaSdkService {
  private connectionState: SdkConnectionState = {
    isConnected: false,
    mode: 'mock_sandbox',
    projectId: 'forma-prj-coimbatore-01',
    proposalId: 'proposal-main-001',
    lastSyncedAt: null
  };

  private isIframe(): boolean {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }

  public async initialize(): Promise<SdkConnectionState> {
    if (this.isIframe()) {
      try {
        // Attempt to connect to Autodesk Forma Embedded View SDK (injected on window or via iframe postMessage)
        const forma = (window as any).Forma;
        if (forma) {
          this.connectionState = {
            isConnected: true,
            mode: 'live_forma',
            projectId: forma.project ? (await forma.project.get()?.catch(() => null))?.name || 'Forma Live Project' : 'Forma Project',
            proposalId: forma.proposal ? (await forma.proposal.getRootProposal()?.catch(() => null))?.urn || 'Active Proposal' : 'Proposal',
            lastSyncedAt: new Date().toLocaleTimeString()
          };
          console.log('[ResiliForma] Connected to live Autodesk Forma session:', this.connectionState);
          return this.connectionState;
        }
      } catch (err) {
        console.warn('[ResiliForma] Live Forma SDK initialization deferred, running in simulation mode:', err);
      }
    }

    // Fallback: Standalone simulation sandbox
    this.connectionState = {
      isConnected: true,
      mode: 'mock_sandbox',
      projectId: 'Autodesk Forma — Demo Project (Coimbatore)',
      proposalId: 'proposal-resilience-v1',
      lastSyncedAt: new Date().toLocaleTimeString()
    };
    return this.connectionState;
  }

  public getConnectionState(): SdkConnectionState {
    return this.connectionState;
  }

  public async fetchSiteData(): Promise<FormaSiteData> {
    // In live mode, we would query Forma.proposal.getRootProposal() and Forma.elements.get()
    // For now we return the calibrated test site
    this.connectionState.lastSyncedAt = new Date().toLocaleTimeString();
    return JSON.parse(JSON.stringify(DEFAULT_FORMA_TEST_SITE));
  }

  public async applyIntervention(intervention: FormaIntervention, siteData: FormaSiteData): Promise<FormaSiteData> {
    console.log(`[ResiliForma] Executing Forma Command: ${intervention.forma_command}`, intervention);
    const updated = JSON.parse(JSON.stringify(siteData)) as FormaSiteData;

    if (intervention.id === 'int-acoustic-wall') {
      updated.barrier_height_m = intervention.parameters.height_m || 3.5;
      if (updated.noise_sources.length > 0) {
        updated.noise_sources[0].barrier_height_m = updated.barrier_height_m;
      }
    } else if (intervention.id === 'int-veg-buffer') {
      updated.veg_depth_m = intervention.parameters.depth_m || 8.0;
      if (updated.noise_sources.length > 0) {
        updated.noise_sources[0].veg_depth_m = updated.veg_depth_m;
      }
    } else if (intervention.id === 'int-rotate-b2') {
      const b2 = updated.buildings.find(b => b.id === 'B2');
      if (b2) {
        b2.azimuth_deg = intervention.parameters.rotation_deg || -18.0;
        b2.exposure_pct = 58.0; // reduced exposure
      }
    }

    this.connectionState.lastSyncedAt = new Date().toLocaleTimeString();
    return updated;
  }

  public async updateBuildingOrientation(buildingId: string, newAzimuth: number, siteData: FormaSiteData): Promise<FormaSiteData> {
    const updated = JSON.parse(JSON.stringify(siteData)) as FormaSiteData;
    const b = updated.buildings.find((item: FormaBuilding) => item.id === buildingId);
    if (b) {
      b.azimuth_deg = newAzimuth;
    }
    this.connectionState.lastSyncedAt = new Date().toLocaleTimeString();
    return updated;
  }
}

export const formaSdkService = new FormaSdkService();
