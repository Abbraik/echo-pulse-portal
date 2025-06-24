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
        description: `**Context:** Start your analytical journey by establishing a baseline understanding of system stability and resource dynamics.

**What You'll Do:**
• Navigate to the DEI & Foresight Hub to examine the Dynamic Equilibrium Index (DEI) dashboard
• Analyze current stability metrics across Population, Resources, Goods, and Social pillars
• Adjust Resource Stock bounds using the interactive sliders to test equilibrium ranges
• Observe how different resource availability scenarios impact overall system stability

**Key Actions:**
1. Review the overall DEI gauge and identify which pillars are within/outside equilibrium bands
2. Click on sub-indicators within each pillar to understand granular metrics
3. Use the foresight sliders to test "what-if" scenarios for resource bounds
4. Set targets for critical indicators that are underperforming

**Expected Outcomes:**
• Clear understanding of current system stability state
• Identification of resource stress points and bottlenecks
• Established target ranges for key resource indicators
• Foundation for strategic decision-making based on equilibrium analysis`,
        zone: 'think',
        targetElement: '[data-demo="foresight-sliders"]',
        position: 'bottom'
      },
      {
        id: 'loop-sna-analysis',
        title: 'THINK → Loop & SNA Analysis',
        description: `**Context:** Deepen your understanding by analyzing the underlying network dynamics and feedback loops that drive system behavior.

**What You'll Do:**
• Switch to the Loop Analysis tab to examine Social Network Analysis (SNA) data
• Study the Ministry of Energy network topology and actor relationships
• Identify critical bottlenecks, influential actors, and coordination challenges
• Analyze centrality measures, betweenness scores, and network density metrics

**Key Actions:**
1. Click on the "Loop Analysis" tab to access network visualization
2. Examine actor nodes and their interconnections in the network diagram
3. Identify actors with high centrality scores (key influencers)
4. Look for structural holes and potential coordination breakdowns
5. Assess information flow patterns and decision-making pathways

**Expected Outcomes:**
• Map of critical stakeholders and their influence levels
• Understanding of information and resource flow bottlenecks
• Identification of coordination vulnerabilities in the network
• Strategic insights on which actors to engage for maximum leverage`,
        zone: 'think',
        targetElement: '[data-demo="sna-tab"]',
        position: 'right'
      },
      {
        id: 'strategy-builder',
        title: 'THINK → Strategy Builder',
        description: `**Context:** Transform analytical insights into actionable strategic objectives using the integrated Strategy Builder.

**What You'll Do:**
• Access the Strategy Builder to create SMART objectives based on your analysis
• Select appropriate leverage points that align with identified network positions
• Design intervention strategies that address both stability and coordination challenges
• Prepare strategic framework for implementation planning

**Key Actions:**
1. Click "Apply Targets" to trigger strategy generation based on your DEI analysis
2. Navigate to the Strategy Builder interface
3. Create SMART objectives targeting critical resource and coordination gaps
4. Select leverage points that correspond to high-influence network positions
5. Define success metrics and timeline for each strategic objective

**Expected Outcomes:**
• Set of clearly defined SMART strategic objectives
• Alignment between network analysis and strategic intervention points
• Measurable targets with defined success criteria
• Ready-to-implement strategic framework for resource optimization`,
        zone: 'think',
        targetElement: '[data-demo="strategy-builder"]',
        position: 'left'
      },
      {
        id: 'act-bundle-builder',
        title: 'ACT → Bundle Builder & Strategy Implementation',
        description: `**Context:** Convert strategic objectives into executable delivery bundles with coordinated activities and clear accountability structures.

**What You'll Do:**
• Access the Bundle Builder to transform strategies into actionable delivery packages
• Configure bundle parameters including scope, resources, timelines, and stakeholders
• Generate integrated task lists with dependencies and coordination requirements
• Establish governance structure for bundle execution and monitoring

**Key Actions:**
1. Navigate to the ACT zone and open the Bundle Wizard
2. Import strategic objectives from the Strategy Builder
3. Configure bundle settings: scope, timeline, resource allocation, team assignments
4. Generate coordinated task packages with clear dependencies
5. Set up stakeholder engagement and communication protocols
6. Define bundle success metrics and milestone checkpoints

**Expected Outcomes:**
• Comprehensive delivery bundles ready for execution
• Clear task assignments with defined roles and responsibilities
• Established coordination mechanisms between stakeholders
• Monitoring framework with defined success metrics and milestones`,
        zone: 'act',
        targetElement: '[data-demo="bundle-wizard"]',
        position: 'top'
      },
      {
        id: 'monitor-treemap',
        title: 'MONITOR → Real-time Tracking & Alert Investigation',
        description: `**Context:** Establish continuous monitoring systems to track bundle execution progress and identify emerging issues requiring intervention.

**What You'll Do:**
• Set up comprehensive monitoring dashboard for real-time bundle tracking
• Configure alert systems for early warning of potential deviations
• Analyze sector-wise performance using treemap visualizations
• Investigate anomalies and trigger corrective actions when needed

**Key Actions:**
1. Navigate to the MONITOR zone and access the treemap visualization
2. Configure monitoring parameters for your active bundles
3. Set up alert thresholds for key performance indicators
4. Review sector performance using the interactive treemap interface
5. Drill down into specific sectors showing anomalies or underperformance
6. Document emerging patterns and trigger alerts for immediate attention

**Expected Outcomes:**
• Real-time visibility into bundle execution progress
• Early warning system for potential issues and deviations
• Sector-wise performance insights with drill-down capabilities
• Documented evidence base for course corrections and interventions`,
        zone: 'monitor',
        targetElement: '[data-demo="treemap-view"]',
        position: 'bottom'
      },
      {
        id: 'learn-knowledge-extraction',
        title: 'LEARN → Knowledge Synthesis & Pattern Recognition',
        description: `**Context:** Extract actionable insights from execution experience to build institutional knowledge and improve future decision-making.

**What You'll Do:**
• Analyze execution patterns and outcomes from your bundle implementation
• Identify successful practices and lessons learned from challenges
• Document insights using the knowledge management system
• Build connections between different initiatives and their outcomes

**Key Actions:**
1. Navigate to the LEARN zone and access knowledge synthesis tools
2. Review execution data and outcomes from your monitoring activities
3. Identify patterns in successful vs. challenging implementation areas
4. Document key lessons learned and best practices discovered
5. Create knowledge entries linking insights to specific contexts and conditions
6. Build knowledge graphs connecting insights across different initiatives

**Expected Outcomes:**
• Structured knowledge base of lessons learned and best practices
• Pattern recognition insights for improved future decision-making
• Connected knowledge graph linking insights across initiatives
• Enhanced institutional memory for sustainable governance improvement`,
        zone: 'learn',
        targetElement: '[data-demo="knowledge-graph"]',
        position: 'right'
      },
      {
        id: 'innovate-simulation',
        title: 'INNOVATE → Scenario Testing & System Innovation',
        description: `**Context:** Design and test innovative approaches to address persistent challenges and explore new possibilities for system improvement.

**What You'll Do:**
• Use innovation canvas to design experimental approaches
• Test alternative strategies using simulation environments
• Evaluate potential improvements and breakthrough solutions
• Prepare successful innovations for scaling and implementation

**Key Actions:**
1. Navigate to the INNOVATE zone and access the Innovation Canvas
2. Design experimental approaches to address identified system challenges
3. Configure simulation parameters to test alternative scenarios
4. Run comparative analysis between current and innovative approaches
5. Evaluate results and identify promising innovations with high impact potential
6. Prepare business case for scaling successful experimental approaches

**Expected Outcomes:**
• Tested innovative approaches with proven potential for system improvement
• Comparative analysis demonstrating value of new vs. current approaches
• Business case for scaling successful innovations
• Enhanced system capability through breakthrough solution integration`,
        zone: 'innovate',
        targetElement: '[data-demo="innovation-canvas"]',
        position: 'right'
      },
      {
        id: 'think-continuous-improvement',
        title: 'THINK → Continuous Improvement Loop',
        description: `**Context:** Complete the governance improvement cycle by integrating insights from execution, learning, and innovation back into strategic analysis.

**What You'll Do:**
• Return to strategic analysis with enriched understanding from the full cycle
• Update system models and assumptions based on real execution experience
• Refine analytical approaches using lessons learned and proven innovations
• Prepare for next iteration of the improvement cycle with enhanced capabilities

**Key Actions:**
1. Return to the THINK zone with comprehensive experience from the full cycle
2. Update DEI analysis incorporating lessons learned from execution
3. Refine network analysis models based on observed stakeholder behavior
4. Integrate successful innovations into standard analytical approaches
5. Update strategy templates and frameworks based on proven practices
6. Prepare enhanced analytical foundation for the next improvement cycle

**Expected Outcomes:**
• Enhanced analytical capabilities informed by real execution experience
• Updated system models reflecting proven insights and innovations
• Refined strategic frameworks incorporating lessons learned
• Strengthened foundation for continuous governance improvement cycles`,
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
        description: `**Context:** Begin comprehensive analysis of population stability challenges by examining demographic trends, birth-rate patterns, and structural population dynamics.

**What You'll Do:**
• Load the birth-rate scenario to examine current demographic equilibrium state
• Analyze fertility rates, population structure, and growth balance indicators
• Assess migration patterns and their impact on population stability
• Identify critical demographic stress points requiring policy intervention

**Key Actions:**
1. Access scenario selector and load the "Birth-Rate Stability" scenario
2. Review population pillar indicators in the DEI dashboard
3. Examine sub-indicators: Population Deviation, Structure Deviation, Natural Growth Balance
4. Analyze growth volatility patterns and demographic transition indicators
5. Set targets for critical population stability metrics

**Expected Outcomes:**
• Clear understanding of current population stability challenges
• Identification of demographic stress points and equilibrium gaps
• Established baseline for population policy development
• Target ranges for key demographic stability indicators`,
        zone: 'think',
        targetElement: '[data-demo="scenario-selector"]',
        position: 'bottom'
      },
      {
        id: 'loop-analysis-r3-r6',
        title: 'THINK → Reinforcing Loop Analysis (R3 & R6)',
        description: `**Context:** Examine the complex reinforcing loops that influence population dynamics, particularly economic-demographic feedback cycles and social support system impacts.

**What You'll Do:**
• Analyze reinforcing loop R3: Economic prosperity → Family formation → Birth rates feedback cycle
• Study reinforcing loop R6: Social support systems → Family stability → Demographic decisions
• Understand how these loops interact to create population stability or instability
• Identify leverage points within these loops for effective policy intervention

**Key Actions:**
1. Navigate to Loop Analysis tab and focus on demographic-related loops
2. Examine R3 loop structure: economic conditions affecting family formation decisions
3. Study R6 loop dynamics: social support systems influencing demographic choices
4. Identify critical connection points where loops interact and amplify effects
5. Map potential intervention points that could strengthen positive demographic loops

**Expected Outcomes:**
• Deep understanding of economic-demographic feedback mechanisms
• Identification of social support system impacts on population stability
• Strategic leverage points for strengthening positive demographic loops
• Framework for designing policies that work with natural demographic cycles`,
        zone: 'think',
        targetElement: '[data-demo="loop-analysis"]',
        position: 'right'
      },
      {
        id: 'population-strategy',
        title: 'THINK → Population Strategy Development',
        description: `**Context:** Develop comprehensive population strategy that addresses demographic challenges through integrated policy approaches targeting multiple intervention points.

**What You'll Do:**
• Create SMART objectives targeting specific population stability challenges
• Design family support program frameworks with measurable outcomes
• Establish demographic sustainability goals balancing short and long-term needs
• Integrate economic incentives with social support mechanisms

**Key Actions:**
1. Access Strategy Builder and create population-focused strategic objectives
2. Define specific population deviation targets with realistic timelines
3. Design family support program objectives addressing economic and social factors
4. Create demographic sustainability metrics with short, medium, and long-term indicators
5. Align strategic objectives with identified reinforcing loop leverage points

**Expected Outcomes:**
• Comprehensive population strategy with clear measurable objectives
• Integrated approach addressing economic, social, and demographic factors
• Timeline-based implementation plan with milestone checkpoints
• Strategic framework aligned with natural demographic feedback cycles`,
        zone: 'think',
        targetElement: '[data-demo="strategy-builder"]',
        position: 'left'
      },
      {
        id: 'population-bundle',
        title: 'ACT → Population Policy Bundle Creation',
        description: `**Context:** Transform population strategy into coordinated delivery bundles that address multiple aspects of demographic stability through integrated programming.

**What You'll Do:**
• Create comprehensive policy bundles integrating family support, economic incentives, and social services
• Design coordinated delivery packages addressing demographic challenges holistically  
• Establish task generation systems for complex multi-agency coordination
• Set up governance structures for population policy implementation

**Key Actions:**
1. Navigate to ACT zone and open Bundle Wizard for population policy implementation
2. Configure integrated delivery bundles combining family services, economic support, and social programs
3. Generate coordinated task lists addressing demographic challenges across multiple agencies
4. Set up stakeholder coordination mechanisms for multi-sector policy delivery
5. Establish monitoring systems for demographic policy effectiveness tracking

**Expected Outcomes:**
• Coordinated delivery bundles ready for multi-agency implementation
• Integrated task structures addressing demographic challenges holistically
• Clear governance frameworks for complex population policy coordination
• Monitoring systems designed for demographic policy impact assessment`,
        zone: 'act',
        targetElement: '[data-demo="bundle-wizard"]',
        position: 'top'
      },
      {
        id: 'population-monitoring',
        title: 'MONITOR → Demographic Sector Monitoring',
        description: `**Context:** Establish comprehensive monitoring systems for tracking demographic policy effectiveness and identifying emerging population stability challenges.

**What You'll Do:**
• Set up sector-specific monitoring for population, family services, and social support systems
• Configure alert systems for demographic anomalies and policy effectiveness indicators
• Track key demographic metrics including birth rates, family formation, and social service utilization
• Monitor policy implementation progress and demographic outcome indicators

**Key Actions:**
1. Navigate to MONITOR zone and configure population sector monitoring
2. Set up treemap visualization focusing on demographic and family service sectors
3. Configure alerts for marriage rate anomalies, birth rate deviations, and family service utilization
4. Establish monitoring for social support program effectiveness and demographic impact
5. Track coordination effectiveness between agencies implementing population policies

**Expected Outcomes:**
• Real-time monitoring of demographic trends and policy implementation
• Early warning systems for population stability challenges
• Sector-wise visibility into family services and social support effectiveness
• Evidence base for demographic policy adjustments and improvements`,
        zone: 'monitor',
        targetElement: '[data-demo="population-sector"]',
        position: 'bottom'
      },
      {
        id: 'learn-demographic-insights',
        title: 'LEARN → Demographic Pattern Learning',
        description: `**Context:** Extract insights from demographic policy implementation to understand effective approaches and build knowledge for sustainable population stability.

**What You'll Do:**
• Analyze demographic policy outcomes and implementation effectiveness patterns
• Identify successful family support approaches and social program combinations
• Document lessons learned about demographic transition management
• Build knowledge base connecting policy interventions with demographic outcomes

**Key Actions:**
1. Navigate to LEARN zone and access demographic pattern analysis tools
2. Review demographic policy outcomes and family support program effectiveness
3. Identify patterns in successful vs. challenging demographic interventions
4. Document insights about family formation support and social program integration
5. Create knowledge connections between economic incentives and demographic behaviors

**Expected Outcomes:**
• Comprehensive understanding of effective demographic policy approaches
• Pattern recognition for successful family support and social program integration
• Knowledge base documenting demographic policy best practices
• Insights connecting economic, social, and demographic intervention effectiveness`,
        zone: 'learn',
        targetElement: '[data-demo="demographic-patterns"]',
        position: 'right'
      },
      {
        id: 'digital-matchmaking',
        title: 'INNOVATE → Digital Innovation Experiment',
        description: `**Context:** Design and test innovative digital solutions to support family formation and address population stability challenges through technological innovation.

**What You'll Do:**
• Design experimental digital platforms supporting family formation and social connection
• Test innovative approaches to community engagement and demographic stability
• Simulate digital solution effectiveness using population dynamics models
• Evaluate breakthrough potential of digital innovation for demographic challenges

**Key Actions:**
1. Navigate to INNOVATE zone and access experimental design canvas
2. Design digital matchmaking and family support platform concepts
3. Configure simulation parameters to test digital innovation demographic impact
4. Run comparative analysis between traditional and digital approach effectiveness
5. Evaluate scalability and implementation feasibility of successful digital innovations

**Expected Outcomes:**
• Tested digital innovation approaches with demonstrated demographic impact potential
• Simulation-validated understanding of digital solution effectiveness for family formation
• Scalable digital platform concepts ready for pilot implementation
• Integration framework for combining digital and traditional demographic policy approaches`,
        zone: 'innovate',
        targetElement: '[data-demo="experiment-canvas"]',
        position: 'right'
      },
      {
        id: 'population-optimization',
        title: 'THINK → Population Policy Optimization',
        description: `**Context:** Complete the population policy improvement cycle by integrating implementation experience, learning insights, and innovation outcomes into optimized demographic strategy.

**What You'll Do:**
• Return to strategic analysis with comprehensive understanding from policy implementation
• Optimize population policies based on real-world feedback and demographic outcomes
• Integrate successful innovations into standard demographic policy approaches
• Prepare next-generation population stability strategies incorporating all lessons learned

**Key Actions:**
1. Return to THINK zone with full cycle experience of population policy implementation
2. Update demographic analysis incorporating implementation lessons and outcome data
3. Refine population strategy frameworks based on proven effective approaches
4. Integrate successful digital innovations into comprehensive demographic policy toolkit
5. Prepare optimized population stability approach for next implementation cycle

**Expected Outcomes:**
• Optimized population policies incorporating implementation experience and innovation
• Enhanced demographic analysis capabilities informed by real policy outcomes
• Next-generation population stability strategies with proven effectiveness components
• Comprehensive demographic policy toolkit ready for sustainable implementation cycles`,
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
