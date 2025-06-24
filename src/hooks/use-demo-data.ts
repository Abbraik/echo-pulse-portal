
import { useState, useEffect } from 'react';
import { useDemo } from './use-demo';

// Mock data for Resource Management Demo
const RESOURCE_DEMO_DATA = {
  scenarios: [
    {
      id: 'resource-demo',
      name: 'Resource Management Demo',
      description: 'Optimize resource allocation and reduce extraction pressure',
      parameters: {
        resourceStock: { min: 0.90, max: 1.05, current: 0.97 },
        renewalRatio: { min: 0.8, max: 1.2, current: 1.1 },
        extractionPressure: { min: 0.5, max: 2.0, current: 1.8 }
      },
      results: {
        deiComposite: 0.82,
        systemStability: 0.74,
        projectedOutcome: 'Moderate improvement expected'
      }
    }
  ],
  healthMetrics: [
    { id: '1', zone: 'MONITOR', name: 'Resource Stock', value: 0.97, target: 1.0, timestamp: new Date().toISOString() },
    { id: '2', zone: 'MONITOR', name: 'Renewal Ratio', value: 1.1, target: 1.2, timestamp: new Date().toISOString() },
    { id: '3', zone: 'MONITOR', name: 'Extraction Pressure', value: 1.8, target: 1.0, timestamp: new Date().toISOString() },
    { id: '4', zone: 'THINK', name: 'System Coherence', value: 0.78, target: 0.85, timestamp: new Date().toISOString() },
    { id: '5', zone: 'ACT', name: 'Implementation Rate', value: 0.65, target: 0.80, timestamp: new Date().toISOString() }
  ],
  snaData: {
    bottleneck: 'Ministry of Energy',
    criticalPath: ['Resource Allocation', 'Ministry of Energy', 'Distribution Networks'],
    networkHealth: 0.72,
    nodes: [
      { id: 'ministry-energy', label: 'Ministry of Energy', type: 'bottleneck', centrality: 0.85 },
      { id: 'resource-allocation', label: 'Resource Allocation', type: 'hub', centrality: 0.72 },
      { id: 'distribution', label: 'Distribution Networks', type: 'connector', centrality: 0.68 }
    ],
    edges: [
      { source: 'resource-allocation', target: 'ministry-energy', strength: 0.9 },
      { source: 'ministry-energy', target: 'distribution', strength: 0.8 }
    ]
  },
  bundles: [
    {
      id: 'resource-bundle-demo',
      name: 'Resource Optimization Bundle',
      status: 'draft',
      objectives: ['Reduce extraction pressure by 20%', 'Increase renewal ratio to 1.2'],
      leveragePoints: ['Policy Interventions', 'Technology Adoption', 'Stakeholder Engagement'],
      coherence: 75,
      ndiImpact: 0.68
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Assess Current Resource Stock',
      status: 'completed',
      assignee: 'Resource Analyst',
      assignee_initial: 'RA',
      due_date: '2025-06-30',
      needs_approval: false
    },
    {
      id: 'task-2', 
      title: 'Implement Extraction Controls',
      status: 'in-progress',
      assignee: 'Policy Lead',
      assignee_initial: 'PL',
      due_date: '2025-07-15',
      needs_approval: true
    }
  ]
};

// Mock data for Birth-Rate Stability Demo
const BIRTH_RATE_DEMO_DATA = {
  scenarios: [
    {
      id: 'birth-rate-demo',
      name: 'Birth-Rate Stability Demo',
      description: 'Stabilize population growth and enhance social cohesion',
      parameters: {
        naturalGrowthBalance: { min: 0.8, max: 1.2, current: 1.0 },
        populationDeviation: { min: -5, max: 5, current: 2.3 },
        socialCohesion: { min: 0.6, max: 1.0, current: 0.78 }
      },
      results: {
        deiComposite: 0.79,
        systemStability: 0.81,
        projectedOutcome: 'Population stability achievable'
      }
    }
  ],
  healthMetrics: [
    { id: '6', zone: 'MONITOR', name: 'Natural Growth Balance', value: 1.0, target: 1.0, timestamp: new Date().toISOString() },
    { id: '7', zone: 'MONITOR', name: 'Population Deviation', value: 2.3, target: 0, timestamp: new Date().toISOString() },
    { id: '8', zone: 'MONITOR', name: 'Social Cohesion', value: 0.78, target: 0.9, timestamp: new Date().toISOString() },
    { id: '9', zone: 'THINK', name: 'Marriage Rate Index', value: 0.82, target: 0.90, timestamp: new Date().toISOString() },
    { id: '10', zone: 'ACT', name: 'Program Effectiveness', value: 0.71, target: 0.85, timestamp: new Date().toISOString() }
  ],
  loopAnalysis: {
    R3: { 
      name: 'Marriage Rate Loop', 
      strength: 0.85, 
      status: 'active',
      description: 'Reinforcing loop connecting marriage rates to social stability'
    },
    R6: { 
      name: 'Education-Employment Loop', 
      strength: 0.92, 
      status: 'active',
      description: 'Educational outcomes driving employment and family formation'
    },
    B2: {
      name: 'Resource Constraint Loop',
      strength: 0.67,
      status: 'balancing',
      description: 'Economic constraints limiting family size decisions'
    }
  },
  bundles: [
    {
      id: 'birth-rate-bundle-demo',
      name: 'Population Stability Initiative',
      status: 'active',
      objectives: ['Achieve ±3% Population Deviation', 'Increase Social Cohesion to 0.9'],
      leveragePoints: ['Education Reform', 'Economic Incentives', 'Social Programs'],
      coherence: 82,
      ndiImpact: 0.74
    }
  ],
  tasks: [
    {
      id: 'task-3',
      title: 'Digital Matchmaking Platform Research',
      status: 'to-do',
      assignee: 'Innovation Team',
      assignee_initial: 'IT',
      due_date: '2025-07-20',
      needs_approval: false
    },
    {
      id: 'task-4',
      title: 'Social Cohesion Survey Analysis',
      status: 'in-progress', 
      assignee: 'Research Lead',
      assignee_initial: 'RL',
      due_date: '2025-07-10',
      needs_approval: true
    }
  ]
};

// Combined demo datasets
const DEMO_DATASETS = {
  'resource-management': RESOURCE_DEMO_DATA,
  'birth-rate-stability': BIRTH_RATE_DEMO_DATA
};

export const useDemoData = () => {
  const { isDemoMode, currentScenario } = useDemo();
  const [demoData, setDemoData] = useState<any>(null);

  useEffect(() => {
    if (!isDemoMode || !currentScenario) {
      setDemoData(null);
      return;
    }

    // Load appropriate demo data based on current scenario
    const scenarioData = DEMO_DATASETS[currentScenario as keyof typeof DEMO_DATASETS];
    if (scenarioData) {
      setDemoData(scenarioData);
    }
  }, [isDemoMode, currentScenario]);

  // Helper functions to get specific data types
  const getDemoScenarios = () => {
    return demoData?.scenarios || [];
  };

  const getDemoHealthMetrics = () => {
    return demoData?.healthMetrics || [];
  };

  const getDemoSNAData = () => {
    return demoData?.snaData || null;
  };

  const getDemoLoopAnalysis = () => {
    return demoData?.loopAnalysis || null;
  };

  const getDemoBundles = () => {
    return demoData?.bundles || [];
  };

  const getDemoTasks = () => {
    return demoData?.tasks || [];
  };

  // Function to get filtered health metrics by zone
  const getDemoHealthMetricsByZone = (zone: string) => {
    return demoData?.healthMetrics?.filter((metric: any) => metric.zone === zone) || [];
  };

  // Function to simulate real-time updates for demo
  const getUpdatedDemoMetric = (metricId: string, variance = 0.05) => {
    const metric = demoData?.healthMetrics?.find((m: any) => m.id === metricId);
    if (!metric) return null;

    const randomVariance = (Math.random() - 0.5) * variance;
    return {
      ...metric,
      value: Math.max(0, metric.value + randomVariance),
      timestamp: new Date().toISOString()
    };
  };

  return {
    isDemoMode,
    demoData,
    getDemoScenarios,
    getDemoHealthMetrics,
    getDemoSNAData,
    getDemoLoopAnalysis,
    getDemoBundles,
    getDemoTasks,
    getDemoHealthMetricsByZone,
    getUpdatedDemoMetric
  };
};
