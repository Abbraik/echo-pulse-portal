
// Centralized demo data definitions
export const DEMO_DATASETS = {
  'resource-management': {
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
      ]
    },
    bundles: [
      {
        id: 'resource-bundle-demo',
        name: 'Resource Optimization Bundle',
        status: 'draft',
        objectives: ['Reduce extraction pressure by 20%', 'Increase renewal ratio to 1.2'],
        leveragePoints: ['Policy Interventions', 'Technology Adoption', 'Stakeholder Engagement'],
        coherence: 75
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Assess Current Resource Stock',
        status: 'completed',
        assignee: 'Resource Analyst',
        assignee_initial: 'RA'
      },
      {
        id: 'task-2', 
        title: 'Implement Extraction Controls',
        status: 'in-progress',
        assignee: 'Policy Lead',
        assignee_initial: 'PL'
      }
    ]
  },
  'birth-rate-stability': {
    scenarios: [
      {
        id: 'birth-rate-demo',
        name: 'Birth-Rate Stability Demo',
        description: 'Stabilize population growth and enhance social cohesion',
        parameters: {
          naturalGrowthBalance: { min: 0.8, max: 1.2, current: 1.0 },
          populationDeviation: { min: -5, max: 5, current: 2.3 },
          socialCohesion: { min: 0.6, max: 1.0, current: 0.78 }
        }
      }
    ],
    healthMetrics: [
      { id: '6', zone: 'MONITOR', name: 'Natural Growth Balance', value: 1.0, target: 1.0, timestamp: new Date().toISOString() },
      { id: '7', zone: 'MONITOR', name: 'Population Deviation', value: 2.3, target: 0, timestamp: new Date().toISOString() },
      { id: '8', zone: 'MONITOR', name: 'Social Cohesion', value: 0.78, target: 0.9, timestamp: new Date().toISOString() }
    ],
    loopAnalysis: {
      R3: { name: 'Marriage Rate Loop', strength: 0.85, status: 'active' },
      R6: { name: 'Education-Employment Loop', strength: 0.92, status: 'active' }
    },
    bundles: [
      {
        id: 'birth-rate-bundle-demo',
        name: 'Population Stability Initiative',
        status: 'active',
        objectives: ['Achieve ±3% Population Deviation', 'Increase Social Cohesion to 0.9']
      }
    ],
    tasks: [
      {
        id: 'task-3',
        title: 'Digital Matchmaking Platform Research',
        status: 'to-do',
        assignee: 'Innovation Team'
      }
    ]
  }
};
