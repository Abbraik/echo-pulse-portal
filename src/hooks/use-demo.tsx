
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  zone: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
  content?: {
    highlights?: string[];
    instructions?: string[];
    expectedOutcome?: string;
  };
}

interface DemoScenario {
  id: string;
  name: string;
  description: string;
  steps: DemoStep[];
}

interface DemoContextType {
  isDemoMode: boolean;
  currentScenario: string | null;
  currentStep: number;
  isActive: boolean;
  scenarios: DemoScenario[];
  toggleDemoMode: () => void;
  startScenario: (scenarioId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  exitDemo: () => void;
  getCurrentStep: () => DemoStep | null;
  skipToStep: (stepIndex: number) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Enhanced demo scenarios with detailed descriptions
const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'resource-management',
    name: 'Resource Management Demo',
    description: 'Learn how to analyze and optimize resource allocation using the Population Dynamics System',
    steps: [
      {
        id: 'think-foresight',
        title: 'THINK → Foresight Analysis',
        description: 'Adjust Resource Stock bounds in the DEI & Foresight panel',
        detailedDescription: 'In this step, you will learn how to use the foresight analysis tools to understand resource dynamics. The DEI (Dynamic Equilibrium Index) panel allows you to adjust stock bounds and observe how different resource allocation scenarios affect system stability.',
        zone: 'think',
        targetElement: '[data-demo="foresight-sliders"]',
        position: 'bottom',
        content: {
          highlights: ['Resource Stock bounds', 'DEI indicators', 'Foresight projections'],
          instructions: [
            'Locate the DEI & Foresight panel on the right side',
            'Adjust the Resource Stock sliders to see impact',
            'Observe how changes affect the stability indicators'
          ],
          expectedOutcome: 'You should see real-time updates to the resource allocation forecasts and understand how different bounds affect system resilience.'
        }
      },
      {
        id: 'loop-sna-analysis',
        title: 'Loop & SNA Analysis',
        description: 'Identify bottlenecks in the Ministry of Energy network structure',
        detailedDescription: 'Social Network Analysis (SNA) helps identify key actors and bottlenecks in organizational networks. In this step, you will analyze the Ministry of Energy\'s network structure to understand communication patterns and identify potential points of failure or optimization.',
        zone: 'think',
        targetElement: '[data-demo="sna-tab"]',
        position: 'right',
        content: {
          highlights: ['Network density metrics', 'Centrality measures', 'Bottleneck identification'],
          instructions: [
            'Click on the SNA Analysis tab',
            'Review the network metrics displayed',
            'Identify actors with high betweenness centrality',
            'Look for potential single points of failure'
          ],
          expectedOutcome: 'You will understand the network structure and identify key stakeholders who are critical for information flow and decision-making processes.'
        }
      },
      {
        id: 'strategy-builder',
        title: 'Strategy Builder',
        description: 'Create SMART objectives and select appropriate leverage points for intervention',
        detailedDescription: 'The Strategy Builder helps you translate insights from analysis into actionable strategies. You will create SMART (Specific, Measurable, Achievable, Relevant, Time-bound) objectives and identify the most effective leverage points based on Donella Meadows\' hierarchy for systems intervention.',
        zone: 'think',
        targetElement: '[data-demo="strategy-builder"]',
        position: 'left',
        content: {
          highlights: ['SMART objectives framework', 'Leverage points hierarchy', 'Strategy coherence'],
          instructions: [
            'Access the Strategy Builder section',
            'Define specific objectives using the SMART framework',
            'Select leverage points from Meadows\' hierarchy',
            'Ensure alignment between objectives and leverage points'
          ],
          expectedOutcome: 'You will have a well-structured strategy with clear objectives and identified intervention points that maximize impact with minimal effort.'
        }
      },
      {
        id: 'act-bundle-builder',
        title: 'ACT → Bundle Builder',
        description: 'Transform strategic insights into actionable delivery bundles with specific tasks and timelines',
        detailedDescription: 'The Bundle Builder converts your strategic thinking into operational reality. You will create delivery bundles that package related activities, assign resources, set timelines, and establish accountability structures to ensure strategy execution.',
        zone: 'act',
        targetElement: '[data-demo="bundle-wizard"]',
        position: 'top',
        content: {
          highlights: ['Bundle creation wizard', 'Task generation', 'Resource allocation'],
          instructions: [
            'Use the Bundle Wizard to create a new delivery bundle',
            'Import objectives from the Strategy Builder',
            'Generate specific tasks and sub-activities',
            'Assign timelines and responsible parties'
          ],
          expectedOutcome: 'You will have concrete, actionable bundles with clear deliverables, timelines, and accountability that bridge strategy and implementation.'
        }
      },
      {
        id: 'monitor-treemap',
        title: 'Monitor & Alert Investigation',
        description: 'Track resource metrics in real-time and investigate system alerts using the treemap visualization',
        detailedDescription: 'The monitoring system provides real-time visibility into system performance. You will learn to interpret treemap visualizations, identify anomalies, investigate alerts, and understand how different sectors and metrics interrelate in the overall system health.',
        zone: 'monitor',
        targetElement: '[data-demo="treemap-view"]',
        position: 'bottom',
        content: {
          highlights: ['Treemap visualization', 'Alert investigation', 'Metric relationships'],
          instructions: [
            'Examine the treemap view showing system sectors',
            'Identify areas with performance issues (red/orange)',
            'Click on specific sectors to drill down',
            'Review alert details and their system implications'
          ],
          expectedOutcome: 'You will be able to quickly identify system issues, understand their context, and prioritize intervention efforts based on real-time data.'
        }
      },
      {
        id: 'innovate-simulation',
        title: 'Innovate & Simulate',
        description: 'Test new approaches through simulation and promote successful scenarios to broader implementation',
        detailedDescription: 'The Innovation Lab allows you to safely experiment with new approaches before full implementation. You will create simulations, test different scenarios, analyze results, and promote successful innovations to the broader system.',
        zone: 'innovate',
        targetElement: '[data-demo="innovation-canvas"]',
        position: 'right',
        content: {
          highlights: ['Simulation environments', 'Scenario testing', 'Innovation promotion'],
          instructions: [
            'Access the Innovation Canvas',
            'Set up a simulation environment',
            'Test different parameter combinations',
            'Analyze simulation results and insights',
            'Promote successful innovations for broader adoption'
          ],
          expectedOutcome: 'You will understand how to safely test innovations, validate approaches through simulation, and scale successful experiments across the system.'
        }
      }
    ]
  },
  {
    id: 'birth-rate-stability',
    name: 'Birth-Rate Stability Demo',
    description: 'Explore population dynamics and stability mechanisms through demographic policy analysis',
    steps: [
      {
        id: 'think-birth-foresight',
        title: 'THINK → Birth-Rate Foresight',
        description: 'Load birth-rate scenario and adjust growth balance parameters for demographic stability',
        detailedDescription: 'Population dynamics require careful balance between birth rates, death rates, and migration patterns. In this step, you will load a demographic scenario and learn how to adjust growth balance parameters to achieve sustainable population stability while considering social and economic factors.',
        zone: 'think',
        targetElement: '[data-demo="scenario-selector"]',
        position: 'bottom',
        content: {
          highlights: ['Birth-rate scenarios', 'Growth balance parameters', 'Demographic projections'],
          instructions: [
            'Select the birth-rate stability scenario',
            'Review current demographic indicators',
            'Adjust growth balance parameters',
            'Observe projected population trends'
          ],
          expectedOutcome: 'You will understand how demographic parameters interact and how small adjustments can have significant long-term effects on population stability.'
        }
      },
      {
        id: 'loop-analysis-r3-r6',
        title: 'Loop Analysis R3 & R6',
        description: 'Examine reinforcing loops R3 (Social Cohesion) and R6 (Economic Stability) affecting population dynamics',
        detailedDescription: 'Population stability is influenced by complex reinforcing loops involving social cohesion and economic factors. You will analyze loops R3 and R6 to understand how social policies, economic conditions, and demographic trends reinforce each other in positive or negative cycles.',
        zone: 'think',
        targetElement: '[data-demo="loop-analysis"]',
        position: 'right',
        content: {
          highlights: ['Reinforcing loop R3', 'Reinforcing loop R6', 'Feedback dynamics'],
          instructions: [
            'Navigate to the Loop Analysis section',
            'Focus on reinforcing loops R3 and R6',
            'Trace the causal relationships',
            'Identify intervention points within the loops'
          ],
          expectedOutcome: 'You will identify key leverage points where interventions can strengthen positive reinforcing loops or break negative ones affecting population stability.'
        }
      },
      {
        id: 'population-strategy',
        title: 'Population Strategy Builder',
        description: 'Define population deviation objectives and select policy leverage points for demographic intervention',
        detailedDescription: 'Creating effective population policy requires understanding demographic deviations and their causes. You will define specific objectives for population stability, identify root causes of deviations, and select appropriate policy leverage points for intervention.',
        zone: 'think',
        targetElement: '[data-demo="strategy-builder"]',
        position: 'left',
        content: {
          highlights: ['Population deviation metrics', 'Policy leverage points', 'Demographic objectives'],
          instructions: [
            'Define objectives for population stability',
            'Set acceptable deviation parameters',
            'Select policy leverage points',
            'Ensure strategic coherence across objectives'
          ],
          expectedOutcome: 'You will have a comprehensive population strategy with clear objectives and identified policy intervention points that address root causes of demographic instability.'
        }
      },
      {
        id: 'population-bundle',
        title: 'Population Bundle Creation',
        description: 'Create delivery bundles with automated task generation for population policy implementation',
        detailedDescription: 'Implementing population policy requires coordinated action across multiple domains. You will create delivery bundles that automatically generate tasks for different policy areas, ensuring comprehensive coverage of demographic interventions.',
        zone: 'act',
        targetElement: '[data-demo="bundle-wizard"]',
        position: 'top',
        content: {
          highlights: ['Population policy bundles', 'Task automation', 'Cross-domain coordination'],
          instructions: [
            'Create a new population policy bundle',
            'Enable automatic task generation',
            'Review generated tasks across policy domains',
            'Adjust priorities and timelines'
          ],
          expectedOutcome: 'You will have comprehensive implementation bundles that coordinate population policy across health, education, housing, and economic domains.'
        }
      },
      {
        id: 'population-monitoring',
        title: 'Population Sector Monitoring',
        description: 'Track population metrics and investigate marriage rate anomalies affecting demographic stability',
        detailedDescription: 'Population monitoring requires tracking multiple interconnected metrics. You will learn to monitor key population indicators, identify anomalies in marriage rates and other demographic factors, and understand their implications for overall population stability.',
        zone: 'monitor',
        targetElement: '[data-demo="population-sector"]',
        position: 'bottom',
        content: {
          highlights: ['Population metrics dashboard', 'Marriage rate anomalies', 'Demographic trends'],
          instructions: [
            'Access the population sector monitoring view',
            'Review key demographic indicators',
            'Investigate marriage rate anomalies',
            'Assess impact on population projections'
          ],
          expectedOutcome: 'You will be able to detect early warning signs of demographic instability and understand how social factors like marriage rates affect overall population dynamics.'
        }
      },
      {
        id: 'digital-matchmaking',
        title: 'Digital Innovation Experiment',
        description: 'Build and simulate digital matchmaking solutions to address demographic challenges through social innovation',
        detailedDescription: 'Modern demographic challenges may require innovative social solutions. You will experiment with digital matchmaking systems as a potential intervention to address declining marriage rates and their impact on population stability, testing different approaches through simulation.',
        zone: 'innovate',
        targetElement: '[data-demo="experiment-canvas"]',
        position: 'right',
        content: {
          highlights: ['Digital matchmaking systems', 'Social innovation', 'Demographic interventions'],
          instructions: [
            'Design a digital matchmaking intervention',
            'Set up simulation parameters',
            'Test different matching algorithms',
            'Evaluate impact on marriage rates and demographics'
          ],
          expectedOutcome: 'You will understand how technological innovations can address social challenges and learn to evaluate their potential impact on demographic stability through simulation.'
        }
      }
    ]
  }
];

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Load demo state from localStorage
  useEffect(() => {
    const savedDemoState = localStorage.getItem('pds-demo-state');
    if (savedDemoState) {
      try {
        const state = JSON.parse(savedDemoState);
        setIsDemoMode(state.isDemoMode || false);
        setCurrentScenario(state.currentScenario || null);
        setCurrentStep(state.currentStep || 0);
        setIsActive(state.isActive || false);
      } catch (error) {
        console.warn('Failed to load demo state:', error);
      }
    }
  }, []);

  // Save demo state to localStorage
  useEffect(() => {
    const state = {
      isDemoMode,
      currentScenario,
      currentStep,
      isActive
    };
    localStorage.setItem('pds-demo-state', JSON.stringify(state));
  }, [isDemoMode, currentScenario, currentStep, isActive]);

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
    if (!isDemoMode) {
      // When enabling demo mode, show scenario selection
      setIsActive(false);
      setCurrentScenario(null);
      setCurrentStep(0);
    } else {
      // When disabling demo mode, clean up
      exitDemo();
    }
  };

  const startScenario = (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setCurrentScenario(scenarioId);
      setCurrentStep(0);
      setIsActive(true);
    }
  };

  const nextStep = () => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === currentScenario);
    if (scenario && currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // End of scenario
      exitDemo();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToStep = (stepIndex: number) => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === currentScenario);
    if (scenario && stepIndex >= 0 && stepIndex < scenario.steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const exitDemo = () => {
    setIsActive(false);
    setCurrentScenario(null);
    setCurrentStep(0);
  };

  const getCurrentStep = (): DemoStep | null => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === currentScenario);
    return scenario?.steps[currentStep] || null;
  };

  const value: DemoContextType = {
    isDemoMode,
    currentScenario,
    currentStep,
    isActive,
    scenarios: DEMO_SCENARIOS,
    toggleDemoMode,
    startScenario,
    nextStep,
    previousStep,
    exitDemo,
    getCurrentStep,
    skipToStep
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
