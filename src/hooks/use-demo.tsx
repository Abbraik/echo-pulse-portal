
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

// Demo scenarios data
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
        zone: 'think',
        targetElement: '[data-demo="foresight-sliders"]',
        position: 'bottom'
      },
      {
        id: 'loop-sna-analysis',
        title: 'Loop & SNA Analysis',
        description: 'Identify bottlenecks in the Ministry of Energy',
        zone: 'think',
        targetElement: '[data-demo="sna-tab"]',
        position: 'right'
      },
      {
        id: 'strategy-builder',
        title: 'Strategy Builder',
        description: 'Create SMART objectives and select leverage points',
        zone: 'think',
        targetElement: '[data-demo="strategy-builder"]',
        position: 'left'
      },
      {
        id: 'act-bundle-builder',
        title: 'ACT → Bundle Builder',
        description: 'Transform strategy into actionable bundles',
        zone: 'act',
        targetElement: '[data-demo="bundle-wizard"]',
        position: 'top'
      },
      {
        id: 'monitor-treemap',
        title: 'Monitor & Alert Investigation',
        description: 'Monitor resource metrics and investigate alerts',
        zone: 'monitor',
        targetElement: '[data-demo="treemap-view"]',
        position: 'bottom'
      },
      {
        id: 'innovate-simulation',
        title: 'Innovate & Simulate',
        description: 'Test new approaches and promote scenarios',
        zone: 'innovate',
        targetElement: '[data-demo="innovation-canvas"]',
        position: 'right'
      }
    ]
  },
  {
    id: 'birth-rate-stability',
    name: 'Birth-Rate Stability Demo',
    description: 'Explore population dynamics and stability mechanisms',
    steps: [
      {
        id: 'think-birth-foresight',
        title: 'THINK → Birth-Rate Foresight',
        description: 'Load birth-rate scenario and adjust growth balance',
        zone: 'think',
        targetElement: '[data-demo="scenario-selector"]',
        position: 'bottom'
      },
      {
        id: 'loop-analysis-r3-r6',
        title: 'Loop Analysis R3 & R6',
        description: 'Examine reinforcing loops affecting population stability',
        zone: 'think',
        targetElement: '[data-demo="loop-analysis"]',
        position: 'right'
      },
      {
        id: 'population-strategy',
        title: 'Population Strategy Builder',
        description: 'Define population deviation objectives',
        zone: 'think',
        targetElement: '[data-demo="strategy-builder"]',
        position: 'left'
      },
      {
        id: 'population-bundle',
        title: 'Population Bundle Creation',
        description: 'Create delivery bundles with task generation',
        zone: 'act',
        targetElement: '[data-demo="bundle-wizard"]',
        position: 'top'
      },
      {
        id: 'population-monitoring',
        title: 'Population Sector Monitoring',
        description: 'Track population metrics and marriage rate anomalies',
        zone: 'monitor',
        targetElement: '[data-demo="population-sector"]',
        position: 'bottom'
      },
      {
        id: 'digital-matchmaking',
        title: 'Digital Innovation Experiment',
        description: 'Build and simulate digital matchmaking solutions',
        zone: 'innovate',
        targetElement: '[data-demo="experiment-canvas"]',
        position: 'right'
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
