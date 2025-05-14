
export const mockSolverBands = {
  bands: [
    { name: "Population", min: 78, max: 82 },
    { name: "Resources", min: 70, max: 75 },
    { name: "Goods & Services", min: 68, max: 73 },
    { name: "Social Outcomes", min: 80, max: 85 },
  ],
  parameters: {
    population: {
      fertilityRate: { min: 1.8, max: 2.1, current: 2.0 },
      migrationRate: { min: -0.2, max: 0.6, current: 0.4 },
    },
    resources: {
      waterConsumption: { min: 60, max: 120, current: 85 },
      energyEfficiency: { min: 0.2, max: 0.4, current: 0.3 },
    },
    goods: {
      supplyChainRobustness: { min: 50, max: 90, current: 72 },
      marketIntegration: { min: 0.4, max: 0.8, current: 0.65 },
    },
    social: {
      educationAttainment: { min: 75, max: 95, current: 88 },
      healthCoverage: { min: 70, max: 95, current: 82 },
    }
  }
};
