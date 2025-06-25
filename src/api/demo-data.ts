
// Centralized demo data definitions
export const DEMO_DATASETS = {
  'resource-management': {
    scenarios: [
      {
        id: 'resource-demo',
        name: 'Resource Optimization Bundle',
        description: 'Reduce extraction pressure by 20% and increase renewal ratio to 1.2',
        parameters: {
          resourceStock: { min: 0.80, max: 1.00, current: 0.85 },
          renewalRatio: { min: 0.8, max: 1.2, current: 1.1 },
          extractionPressure: { min: 0.15, max: 0.35, current: 0.25 }
        },
        results: {
          deiComposite: 0.82,
          systemStability: 0.78,
          projectedOutcome: 'Resource stability achievable with focused intervention'
        }
      }
    ],
    healthMetrics: [
      { id: '1', zone: 'MONITOR', name: 'Resource Stock Target', value: 0.85, target: 1.0, timestamp: new Date().toISOString() },
      { id: '2', zone: 'MONITOR', name: 'Renewal vs Consumption', value: 1.1, target: 1.2, timestamp: new Date().toISOString() },
      { id: '3', zone: 'MONITOR', name: 'Extraction Pressure', value: 0.25, target: 0.20, timestamp: new Date().toISOString() },
      { id: '4', zone: 'THINK', name: 'System Coherence', value: 0.78, target: 0.85, timestamp: new Date().toISOString() },
      { id: '5', zone: 'ACT', name: 'Implementation Rate', value: 0.72, target: 0.80, timestamp: new Date().toISOString() }
    ],
    snaData: {
      bottleneck: 'Ministry of Energy',
      criticalPath: ['Resource Allocation', 'Ministry of Energy', 'Distribution Networks'],
      networkHealth: 0.74,
      nodes: [
        { id: 'ministry-energy', label: 'Ministry of Energy', type: 'bottleneck', centrality: 0.85 },
        { id: 'resource-allocation', label: 'Resource Allocation', type: 'hub', centrality: 0.72 },
        { id: 'distribution', label: 'Distribution Networks', type: 'connector', centrality: 0.68 }
      ]
    },
    loopAnalysis: {
      R2: { name: 'Resource Extraction Loop', strength: 0.78, status: 'active' },
      B4: { name: 'Resource Constraint Loop', strength: 0.82, status: 'balancing' }
    },
    bundles: [
      {
        id: 'resource-bundle-demo',
        name: 'Resource Optimization Bundle',
        status: 'active',
        objectives: [
          'Reduce extraction pressure from 0.25 to 0.20 (20% reduction)',
          'Increase renewal ratio from 1.1 to 1.2',
          'Achieve resource stock target of 1.0 ratio'
        ],
        leveragePoints: ['Policy Interventions', 'Technology Adoption', 'Stakeholder Engagement'],
        coherence: 78,
        description: 'Comprehensive approach to optimize resource allocation and reduce extraction pressure through policy reforms and technological innovations.',
        timeline: '8-12 months',
        budget: 38000000,
        stakeholders: ['Ministry of Energy', 'ADNOC', 'Environment Agency']
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Assess Current Resource Stock Levels',
        status: 'completed',
        assignee: 'Resource Analyst Team',
        assignee_initial: 'RA',
        bundle_id: 'resource-bundle-demo',
        description: 'Comprehensive analysis of current resource stock against target levels'
      },
      {
        id: 'task-2', 
        title: 'Implement Extraction Controls',
        status: 'in-progress',
        assignee: 'Policy Implementation Lead',
        assignee_initial: 'PL',
        bundle_id: 'resource-bundle-demo',
        description: 'Deploy extraction pressure control mechanisms'
      },
      {
        id: 'task-3',
        title: 'Monitor Renewal Rate Improvements',
        status: 'to-do',
        assignee: 'Sustainability Team',
        assignee_initial: 'ST',
        bundle_id: 'resource-bundle-demo',
        description: 'Track improvements in renewal vs consumption ratio'
      }
    ]
  },
  'birth-rate-stability': {
    scenarios: [
      {
        id: 'birth-rate-demo',
        name: 'Population Stability Initiative',
        description: 'Achieve ±3% Population Deviation and increase Social Cohesion to 0.9',
        parameters: {
          naturalGrowthBalance: { min: 0.8, max: 1.2, current: 1.2 },
          populationDeviation: { min: -5, max: 5, current: -2.5 },
          socialCohesion: { min: 0.6, max: 1.0, current: 0.74 }
        },
        results: {
          deiComposite: 0.81,
          systemStability: 0.79,
          projectedOutcome: 'Population stability achievable through targeted social programs'
        }
      }
    ],
    healthMetrics: [
      { id: '6', zone: 'MONITOR', name: 'Natural Growth Balance', value: 1.2, target: 1.0, timestamp: new Date().toISOString() },
      { id: '7', zone: 'MONITOR', name: 'Population Deviation', value: -2.5, target: 0, timestamp: new Date().toISOString() },
      { id: '8', zone: 'MONITOR', name: 'Social Cohesion Index', value: 0.74, target: 0.9, timestamp: new Date().toISOString() }
    ],
    snaData: {
      bottleneck: 'Ministry of Education',
      criticalPath: ['Population Planning', 'Ministry of Education', 'Social Services'],
      networkHealth: 0.71,
      nodes: [
        { id: 'education-ministry', label: 'Ministry of Education', type: 'bottleneck', centrality: 0.82 },
        { id: 'population-planning', label: 'Population Planning', type: 'hub', centrality: 0.75 },
        { id: 'social-services', label: 'Social Services', type: 'connector', centrality: 0.71 }
      ]
    },
    loopAnalysis: {
      R3: { name: 'Marriage Rate Enhancement Loop', strength: 0.85, status: 'active' },
      R6: { name: 'Education-Employment Loop', strength: 0.92, status: 'active' }
    },
    bundles: [
      {
        id: 'birth-rate-bundle-demo',
        name: 'Population Stability Initiative',
        status: 'draft',
        objectives: [
          'Achieve ±3% Population Deviation target',
          'Increase Social Cohesion Index to 0.9',
          'Enhance marriage rate through digital platform'
        ],
        leveragePoints: ['Social Programs', 'Digital Innovation', 'Education Policy'],
        coherence: 75,
        description: 'Multi-faceted approach to population stability through social cohesion programs and digital matchmaking innovations.',
        timeline: '12-18 months',
        budget: 25000000,
        stakeholders: ['Ministry of Education', 'Population Planning Authority', 'UAE University']
      }
    ],
    tasks: [
      {
        id: 'task-4',
        title: 'Digital Matchmaking Platform Research',
        status: 'in-progress',
        assignee: 'Innovation Research Team',
        assignee_initial: 'IR',
        bundle_id: 'birth-rate-bundle-demo',
        description: 'Research and design digital platform for marriage rate enhancement'
      },
      {
        id: 'task-5',
        title: 'Social Cohesion Program Design',
        status: 'to-do',
        assignee: 'Social Policy Team',
        assignee_initial: 'SP',
        bundle_id: 'birth-rate-bundle-demo',
        description: 'Develop comprehensive social cohesion enhancement programs'
      }
    ]
  }
};

// Unified demo objectives for strategy builder
export const DEMO_OBJECTIVES = [
  {
    id: 1,
    title: 'Resource Sustainability',
    description: 'Optimize resource allocation and reduce extraction pressure',
    scenarios: ['resource-management'],
    kpis: ['Resource Stock Target', 'Extraction Pressure', 'Renewal Ratio']
  },
  {
    id: 2,
    title: 'Population Stability',
    description: 'Achieve demographic balance and social cohesion',
    scenarios: ['birth-rate-stability'],
    kpis: ['Population Deviation', 'Social Cohesion', 'Marriage Rate']
  }
];
