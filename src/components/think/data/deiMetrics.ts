
export const mockDeiMetrics = {
  pillars: {
    population: {
      value: 68,
      subIndicators: [
        { name: "Growth Rate", value: 1.2 },
        { name: "Fertility Rate", value: 2.1 },
        { name: "Migration Rate", value: 0.4 },
        { name: "Dependency Ratio", value: 0.52 }
      ]
    },
    resources: {
      value: 74,
      subIndicators: [
        { name: "Water Availability", value: 1240 },
        { name: "Land Use Efficiency", value: 0.83 },
        { name: "Energy Consumption", value: 4.7 },
        { name: "Resource Recycling", value: 27 }
      ]
    },
    goods: {
      value: 62,
      subIndicators: [
        { name: "Production Index", value: 112 },
        { name: "Trade Balance", value: -3.8 },
        { name: "Market Stability", value: 7.2 },
        { name: "Supply Chain Resilience", value: 68 }
      ]
    },
    social: {
      value: 81,
      subIndicators: [
        { name: "Education Access", value: 93 },
        { name: "Healthcare Coverage", value: 87 },
        { name: "Income Equality", value: 0.42 },
        { name: "Social Cohesion", value: 76 }
      ]
    }
  },
  deviations: {
    population: -3,
    resources: 8,
    goods: 1, 
    social: -12
  },
  scenarios: [
    {
      id: 1,
      name: "Baseline",
      date: "2025-01-15",
      probability: 1.0,
      sparkline: [68, 71, 70, 68, 69, 71, 74]
    },
    {
      id: 2,
      name: "Water Shortage",
      date: "2025-03-22",
      probability: 0.35,
      sparkline: [68, 65, 61, 58, 55, 52, 48]
    },
    {
      id: 3,
      name: "Migration Surge",
      date: "2025-04-10",
      probability: 0.28,
      sparkline: [68, 72, 75, 78, 82, 85, 83]
    }
  ]
};
