// Centralized mock data for the application
export const mockDEIMetrics = {
  overall: 82,
  pillars: {
    population: {
      value: 78,
      subIndicators: [
        { name: 'Population Deviation', value: -2.5, trend: [-3.2, -2.8, -2.5, -2.3, -2.5] },
        { name: 'Structure Deviation', value: 15.2, trend: [16.1, 15.8, 15.5, 15.2, 15.2] },
        { name: 'Natural Growth Balance', value: 1.2, trend: [1.1, 1.15, 1.18, 1.2, 1.2] },
        { name: 'Growth Volatility', value: 0.8, trend: [1.2, 1.0, 0.9, 0.8, 0.8] }
      ]
    },
    resources: {
      value: 65,
      subIndicators: [
        { name: 'Stock vs Target', value: 0.85, trend: [0.82, 0.83, 0.84, 0.85, 0.85] },
        { name: 'Renewal vs Consumption', value: 1.1, trend: [1.05, 1.07, 1.08, 1.1, 1.1] },
        { name: 'Extraction Pressure', value: 0.25, trend: [0.28, 0.27, 0.26, 0.25, 0.25] },
        { name: 'Smoothed Price', value: 245.6, trend: [250.2, 248.1, 246.8, 245.6, 245.6] }
      ]
    },
    goods: {
      value: 82,
      subIndicators: [
        { name: 'Supply-Demand Gap', value: 0.05, trend: [0.08, 0.07, 0.06, 0.05, 0.05] },
        { name: 'Price Deviation', value: -0.03, trend: [-0.05, -0.04, -0.03, -0.03, -0.03] },
        { name: 'Capacity Utilization', value: 0.78, trend: [0.75, 0.76, 0.77, 0.78, 0.78] }
      ]
    },
    social: {
      value: 74,
      subIndicators: [
        { name: 'Employment Rate', value: 74.2, trend: [72.8, 73.2, 73.8, 74.2, 74.2] },
        { name: 'Education Completion', value: 88.5, trend: [87.1, 87.8, 88.2, 88.5, 88.5] },
        { name: 'Health Index', value: 82.1, trend: [80.5, 81.2, 81.8, 82.1, 82.1] },
        { name: 'Living Conditions', value: 76.3, trend: [74.8, 75.5, 76.0, 76.3, 76.3] },
        { name: 'Household Revenue', value: 12450, trend: [12100, 12250, 12350, 12450, 12450] },
        { name: 'Environmental Quality', value: 68.7, trend: [67.2, 67.8, 68.3, 68.7, 68.7] }
      ]
    }
  },
  equilibriumBands: {
    overall: { min: 78, max: 85 },
    population: { min: 75, max: 82 },
    resources: { min: 62, max: 78 },
    goods: { min: 78, max: 88 },
    social: { min: 70, max: 80 },
  }
};

export const mockCldData = {
  nodes: [],
  edges: []
};

export const mockSNAData = {
  nodes: [
    { id: 'MOE', type: 'government' as const, label: 'Ministry of Economy', degree: 8, betweenness: 0.4, closeness: 0.8 },
    { id: 'MOF', type: 'government' as const, label: 'Ministry of Finance', degree: 7, betweenness: 0.35, closeness: 0.75 },
    { id: 'ADNOC', type: 'private' as const, label: 'ADNOC', degree: 6, betweenness: 0.3, closeness: 0.7 },
    { id: 'EAD', type: 'ngo' as const, label: 'Environment Agency', degree: 5, betweenness: 0.25, closeness: 0.65 },
    { id: 'UAEU', type: 'academic' as const, label: 'UAE University', degree: 4, betweenness: 0.2, closeness: 0.6 },
    { id: 'DMT', type: 'government' as const, label: 'Dept. of Transport', degree: 3, betweenness: 0.15, closeness: 0.55 },
    { id: 'EDB', type: 'private' as const, label: 'Emirates Dev. Bank', degree: 5, betweenness: 0.28, closeness: 0.68 },
    { id: 'RTA', type: 'government' as const, label: 'Roads Authority', degree: 4, betweenness: 0.22, closeness: 0.63 },
  ],
  edges: [
    { source: 'MOE', target: 'MOF', weight: 0.9 },
    { source: 'MOE', target: 'ADNOC', weight: 0.7 },
    { source: 'MOE', target: 'EAD', weight: 0.5 },
    { source: 'MOF', target: 'EDB', weight: 0.8 },
    { source: 'ADNOC', target: 'EAD', weight: 0.6 },
    { source: 'EAD', target: 'UAEU', weight: 0.4 },
    { source: 'UAEU', target: 'DMT', weight: 0.3 },
    { source: 'DMT', target: 'RTA', weight: 0.9 },
    { source: 'EDB', target: 'ADNOC', weight: 0.5 },
    { source: 'RTA', target: 'MOE', weight: 0.4 },
    { source: 'MOF', target: 'DMT', weight: 0.6 },
  ],
  metrics: {
    density: 0.42,
    avgClustering: 0.38,
    avgPathLength: 2.1,
    centralization: 0.52
  }
};

export const mockScenarios = [
  { id: 1, name: "Resource Management Demo", date: "2025-01-01", probability: 0.6, sparkline: [65, 68, 72, 78, 82] },
  { id: 2, name: "Birth-Rate Stability Demo", date: "2025-02-15", probability: 0.4, sparkline: [65, 70, 75, 79, 81] },
  { id: 3, name: "Baseline Scenario", date: "2025-03-10", probability: 0.3, sparkline: [65, 62, 58, 60, 65] },
];

export const mockSensitivity = [
  { parameter: "Resource Stock Target", delta: 12, impact: 38 },
  { parameter: "Extraction Pressure Control", delta: -8, impact: 32 },
  { parameter: "Population Growth Balance", delta: 6, impact: 28 },
  { parameter: "Marriage Rate Incentives", delta: 9, impact: 25 },
  { parameter: "Renewal vs Consumption Ratio", delta: 7, impact: 22 },
];

export const mockExecutionImpact = {
  bundlesAffected: 5,
  budgetChange: 38000000,
  timelineShift: 6,
};

export const allMockPathways = [
  {
    id: 'path1',
    title: 'Resource Optimization Bundle',
    description: 'Reduce extraction pressure by 20% and increase renewal ratio to 1.2',
    actors: ['MOE', 'ADNOC', 'EAD'],
    coordinationTime: 8,
    impact: 4.2,
    relatedObjectives: [1]
  },
  {
    id: 'path2',
    title: 'Population Stability Initiative',
    description: 'Achieve ±3% Population Deviation and increase Social Cohesion to 0.9',
    actors: ['MOF', 'MOE', 'UAEU'],
    coordinationTime: 12,
    impact: 4.5,
    relatedObjectives: [2]
  },
  {
    id: 'path3',
    title: 'Water Resource Management',
    description: 'Implement advanced water recycling systems in cooperation with key agencies',
    actors: ['EAD', 'MOE', 'UAEU'],
    coordinationTime: 7,
    impact: 4.0,
    relatedObjectives: [1]
  },
  {
    id: 'path4',
    title: 'Digital Matchmaking Platform',
    description: 'Research and develop digital solutions for marriage rate enhancement',
    actors: ['MOF', 'UAEU', 'DMT'],
    coordinationTime: 10,
    impact: 3.8,
    relatedObjectives: [2]
  },
  {
    id: 'path5',
    title: 'Renewable Energy Expansion',
    description: 'Coordinate solar infrastructure development in underutilized desert regions',
    actors: ['ADNOC', 'MOE', 'EDB'],
    coordinationTime: 10,
    impact: 4.5,
    relatedObjectives: [1]
  }
];