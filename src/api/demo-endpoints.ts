
// Demo API endpoints that serve mock data for demo mode
import { DEMO_DATASETS } from './demo-data';

export class DemoAPI {
  private static isDemo = false;
  private static currentScenario: string | null = null;

  static setDemoMode(enabled: boolean, scenario?: string) {
    this.isDemo = enabled;
    this.currentScenario = scenario || null;
  }

  static isDemoMode() {
    return this.isDemo;
  }

  // Scenarios endpoint
  static async getScenarios() {
    if (!this.isDemo || !this.currentScenario) return [];
    
    const dataset = DEMO_DATASETS[this.currentScenario as keyof typeof DEMO_DATASETS];
    return dataset?.scenarios || [];
  }

  // Health metrics endpoint
  static async getHealthMetrics(zone?: string) {
    if (!this.isDemo || !this.currentScenario) return [];
    
    const dataset = DEMO_DATASETS[this.currentScenario as keyof typeof DEMO_DATASETS];
    let metrics = dataset?.healthMetrics || [];
    
    if (zone) {
      metrics = metrics.filter((m: any) => m.zone === zone);
    }
    
    return metrics;
  }

  // Bundles endpoint
  static async getBundles() {
    if (!this.isDemo || !this.currentScenario) return [];
    
    const dataset = DEMO_DATASETS[this.currentScenario as keyof typeof DEMO_DATASETS];
    return dataset?.bundles || [];
  }

  // Tasks endpoint
  static async getTasks(bundleId?: string) {
    if (!this.isDemo || !this.currentScenario) return [];
    
    const dataset = DEMO_DATASETS[this.currentScenario as keyof typeof DEMO_DATASETS];
    let tasks = dataset?.tasks || [];
    
    if (bundleId) {
      // Filter tasks by bundle if needed
      tasks = tasks.filter((t: any) => t.bundle_id === bundleId);
    }
    
    return tasks;
  }

  // SNA Data endpoint
  static async getSNAData() {
    if (!this.isDemo || !this.currentScenario) return null;
    
    const dataset = DEMO_DATASETS[this.currentScenario as keyof typeof DEMO_DATASETS];
    return dataset?.snaData || null;
  }

  // Loop Analysis endpoint
  static async getLoopAnalysis() {
    if (!this.isDemo || !this.currentScenario) return null;
    
    const dataset = DEMO_DATASETS[this.currentScenario as keyof typeof DEMO_DATASETS];
    return dataset?.loopAnalysis || null;
  }

  // Anomalies endpoint (simulated)
  static async getAnomalies() {
    if (!this.isDemo || !this.currentScenario) return [];
    
    const mockAnomalies = [
      {
        id: 'anomaly-1',
        indicator: this.currentScenario === 'resource-management' ? 'Resource Stock' : 'Marriage Rate',
        deviation: this.currentScenario === 'resource-management' ? -12 : 8,
        severity: 'medium',
        timestamp: new Date().toISOString(),
        details: `Unusual ${this.currentScenario === 'resource-management' ? 'resource depletion' : 'demographic shift'} detected`
      }
    ];
    
    return mockAnomalies;
  }

  // Claims endpoint (simulated)
  static async getClaims() {
    if (!this.isDemo || !this.currentScenario) return [];
    
    const mockClaims = [
      {
        id: 'claim-1',
        zone: 'ACT',
        taskId: 'demo-task-1',
        status: 'open',
        openedAt: new Date().toISOString(),
        metadata: {
          scenario: this.currentScenario,
          priority: 'high'
        }
      }
    ];
    
    return mockClaims;
  }
}
