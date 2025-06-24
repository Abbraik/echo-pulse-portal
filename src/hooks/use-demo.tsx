
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  zone: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
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

// Enhanced demo scenarios with more detailed descriptions and proper step sequencing
const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'resource-management',
    name: 'Resource Management Demo',
    description: 'Learn how to analyze and optimize resource allocation using the Population Dynamics System through a comprehensive workflow',
    steps: [
      {
        id: 'think-foresight',
        title: 'THINK → DEI & Foresight Analysis',
        description: 'Begin by examining the current state of your system through the DEI (Dynamic Equilibrium Index) dashboard. Adjust Resource Stock bounds in the DEI & Foresight panel to understand how resource availability impacts system stability. This foundational analysis helps identify potential stress points and equilibrium ranges that guide decision-making.',
        zone: 'think',
        targetElement: '[data-demo="foresight-sliders"]',
        position: 'bottom'
      },
      {
        id: 'loop-sna-analysis',
        title: 'THINK → Loop & SNA Analysis',
        description: 'Dive deeper into system dynamics by analyzing the Social Network Analysis (SNA) tab. Focus on identifying critical bottlenecks within the Ministry of Energy network. Examine actor centrality, betweenness scores, and network density to understand how information and resources flow through the system. This analysis reveals which actors are most influential and where coordination challenges may arise.',
        zone: 'think',
        targetElement: '[data-demo="sna-tab"]',
        position: 'right'
      },
      {
        id: 'strategy-builder',
        title: 'THINK → Strategy Builder',
        description: 'Transform your analytical insights into actionable strategy by using the Strategy Builder. Create SMART (Specific, Measurable, Achievable, Relevant, Time-bound) objectives based on your DEI and SNA findings. Select appropriate leverage points that align with your strategic goals and consider the coordination requirements identified in your network analysis.',
        zone: 'think',
        targetElement: '[data-demo="strategy-builder"]',
        position: 'left'
      },
      {
        id: 'act-bundle-builder',
        title: 'ACT → Bundle Builder & Strategy Implementation',
        description: 'Move from strategy to execution by using the Bundle Builder to transform your strategic objectives into actionable delivery bundles. Configure bundle parameters, assign stakeholders, set timelines, and define success metrics. Each bundle should contain coordinated activities that work together to achieve your strategic objectives while considering resource constraints and stakeholder capabilities.',
        zone: 'act',
        targetElement: '[data-demo="bundle-wizard"]',
        position: 'top'
      },
      {
        id: 'monitor-treemap',
        title: 'MONITOR → Real-time Tracking & Alert Investigation',
        description: 'Establish continuous monitoring of your implemented strategies using the comprehensive monitoring dashboard. Examine the treemap visualization to track resource metrics across different sectors and organizational levels. Investigate emerging alerts, analyze trend patterns, and identify early warning signals that may indicate the need for course correction or intervention.',
        zone: 'monitor',
        targetElement: '[data-demo="treemap-view"]',
        position: 'bottom'
      },
      {
        id: 'learn-knowledge-extraction',
        title: 'LEARN → Knowledge Synthesis & Pattern Recognition',
        description: 'Extract valuable insights from your monitoring data and execution experiences through the Learning zone. Analyze patterns in system behavior, document lessons learned, and identify best practices that emerged during implementation. Use the knowledge graph to connect insights across different initiatives and build institutional memory for future decision-making.',
        zone: 'learn',
        targetElement: '[data-demo="knowledge-graph"]',
        position: 'right'
      },
      {
        id: 'innovate-simulation',
        title: 'INNOVATE → Scenario Testing & System Innovation',
        description: 'Test new approaches and innovative solutions using the Innovation Canvas and simulation tools. Design experiments to explore alternative strategies, test different parameter configurations, and evaluate potential improvements to your current approach. Use scenario modeling to understand potential outcomes and promote successful experiments to full implementation.',
        zone: 'innovate',
        targetElement: '[data-demo="innovation-canvas"]',
        position: 'right'
      },
      {
        id: 'think-continuous-improvement',
        title: 'THINK → Continuous Improvement Loop',
        description: 'Complete the improvement cycle by returning to the THINK zone with enriched understanding from your experience. Use insights from monitoring, learning, and innovation to refine your system analysis, update your strategy, and identify new opportunities for optimization. This continuous loop ensures your governance approach evolves and improves over time.',
        zone: 'think',
        targetElement: '[data-demo="foresight-panel"]',
        position: 'bottom'
      }
    ]
  },
  {
    id: 'birth-rate-stability',
    name: 'Birth-Rate Stability Demo',
    description: 'Explore population dynamics and stability mechanisms through comprehensive demographic analysis and policy intervention',
    steps: [
      {
        id: 'think-birth-foresight',
        title: 'THINK → Population Dynamics Foresight',
        description: 'Start by loading the birth-rate scenario in the DEI dashboard to understand current population trends and stability indicators. Examine fertility rates, age-dependency ratios, and migration patterns. Adjust growth balance parameters to explore how different demographic scenarios might impact long-term population stability and resource requirements.',
        zone: 'think',
        targetElement: '[data-demo="scenario-selector"]',
        position: 'bottom'
      },
      {
        id: 'loop-analysis-r3-r6',
        title: 'THINK → Reinforcing Loop Analysis (R3 & R6)',
        description: 'Examine the complex reinforcing loops R3 and R6 that affect population stability. R3 typically involves the relationship between economic prosperity, family formation, and birth rates, while R6 focuses on social support systems and their impact on demographic decisions. Understanding these loops is crucial for designing effective population policies.',
        zone: 'think',
        targetElement: '[data-demo="loop-analysis"]',
        position: 'right'
      },
      {
        id: 'population-strategy',
        title: 'THINK → Population Strategy Development',
        description: 'Develop comprehensive population strategy objectives that address identified demographic challenges. Define specific population deviation targets, create family support program objectives, and establish metrics for measuring policy effectiveness. Consider both short-term interventions and long-term demographic sustainability goals.',
        zone: 'think',
        targetElement: '[data-demo="strategy-builder"]',
        position: 'left'
      },
      {
        id: 'population-bundle',
        title: 'ACT → Population Policy Bundle Creation',
        description: 'Transform your population strategy into executable policy bundles with integrated task generation. Create coordinated delivery packages that include family support services, educational programs, economic incentives, and social infrastructure development. Each bundle should address multiple aspects of the demographic challenge while maintaining policy coherence.',
        zone: 'act',
        targetElement: '[data-demo="bundle-wizard"]',
        position: 'top'
      },
      {
        id: 'population-monitoring',
        title: 'MONITOR → Demographic Sector Monitoring',
        description: 'Establish comprehensive monitoring of population sector metrics including birth rates, marriage rate trends, family formation patterns, and social service utilization. Track key demographic indicators and investigate anomalies in marriage rates or fertility patterns that might indicate the need for policy adjustments or targeted interventions.',
        zone: 'monitor',
        targetElement: '[data-demo="population-sector"]',
        position: 'bottom'
      },
      {
        id: 'learn-demographic-insights',
        title: 'LEARN → Demographic Pattern Learning',
        description: 'Analyze demographic data patterns and policy outcomes to extract actionable insights about population dynamics. Study the effectiveness of different intervention approaches, identify successful policy combinations, and document lessons learned about demographic transition management for future policy development.',
        zone: 'learn',
        targetElement: '[data-demo="demographic-patterns"]',
        position: 'right'
      },
      {
        id: 'digital-matchmaking',
        title: 'INNOVATE → Digital Innovation Experiment',
        description: 'Design and simulate innovative digital solutions to support family formation and population stability. Build experimental digital matchmaking platforms, family support applications, or community engagement tools. Test these innovations through simulation to understand their potential impact on demographic trends before full-scale implementation.',
        zone: 'innovate',
        targetElement: '[data-demo="experiment-canvas"]',
        position: 'right'
      },
      {
        id: 'population-optimization',
        title: 'THINK → Population Policy Optimization',
        description: 'Return to strategic analysis with enhanced understanding from implementation, monitoring, and innovation. Optimize your population policies based on real-world feedback, refine demographic projections, and develop next-generation approaches to population stability that integrate lessons learned from the complete policy cycle.',
        zone: 'think',
        targetElement: '[data-demo="foresight-panel"]',
        position: 'bottom'
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
    const newDemoMode = !isDemoMode;
    setIsDemoMode(newDemoMode);
    
    if (!newDemoMode) {
      // When disabling demo mode, clean up completely
      setIsActive(false);
      setCurrentScenario(null);
      setCurrentStep(0);
    } else {
      // When enabling demo mode, show scenario selection
      setIsActive(false);
      setCurrentScenario(null);
      setCurrentStep(0);
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
