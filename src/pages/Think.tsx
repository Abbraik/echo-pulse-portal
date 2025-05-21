import React, { useState, useEffect, useRef } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Layout, Layers, Network, BarChart3, ArrowRight, GitBranch } from 'lucide-react';
import SystemFramingStudio from '@/components/think/SystemFramingStudio';
import AiAdvisorSidebar from '@/components/think/AiAdvisorSidebar';
import FooterCTA from '@/components/think/FooterCTA';
import DeiAndForesightHub from '@/components/think/DeiAndForesightHub';
import SnaAnalysisPanel from '@/components/think/SnaAnalysisPanel';
import StrategyBuilder from '@/components/think/StrategyBuilder';
import ExecutionPathwayPanel from '@/components/think/ExecutionPathwayPanel';
import { GlassCard } from '@/components/ui/glass-card';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { SNAData, ExecutionPathway } from '@/components/think/types/sna-types';
import { adaptSNADataToSystemFraming } from '@/components/think/utils/sna-adapter';

// Mock data for DEI metrics and scenarios
const mockDEIMetrics = { 
  overall: 74,
  pillars: {
    population: {
      value: 78,
      subIndicators: [
        { name: 'Fertility Rate', value: 2.1, trend: [2.0, 2.1, 2.1, 2.2, 2.1] },
        { name: 'Age-Dependency Ratio', value: 52, trend: [55, 54, 53, 52, 52] },
        { name: 'Migration Volatility', value: 18, trend: [22, 20, 19, 18, 18] },
        { name: 'Population Growth Stability', value: 76, trend: [72, 73, 75, 76, 76] }
      ]
    },
    resources: {
      value: 65,
      subIndicators: [
        { name: 'Water Consumption per Capita', value: 130, trend: [145, 140, 135, 132, 130] },
        { name: 'Energy Use per GDP', value: 68, trend: [72, 70, 69, 68, 68] },
        { name: 'Agricultural Yield Index', value: 72, trend: [68, 69, 70, 71, 72] }
      ]
    },
    goods: {
      value: 82,
      subIndicators: [
        { name: 'Manufacturing Output Growth', value: 3.2, trend: [2.9, 3.0, 3.1, 3.2, 3.2] },
        { name: 'Service Sector Resilience Index', value: 79, trend: [75, 76, 78, 79, 79] },
        { name: 'Supply-Chain Robustness', value: 81, trend: [77, 78, 79, 80, 81] }
      ]
    },
    social: {
      value: 71,
      subIndicators: [
        { name: 'Education Attainment Rate', value: 74, trend: [70, 71, 73, 74, 74] },
        { name: 'Health Service Coverage', value: 82, trend: [78, 79, 80, 81, 82] },
        { name: 'Social Cohesion Index', value: 68, trend: [64, 65, 66, 67, 68] },
        { name: 'Trust Index', value: 72, trend: [68, 69, 70, 71, 72] }
      ]
    }
  },
  equilibriumBands: {
    overall: { min: 70, max: 85 },
    population: { min: 75, max: 85 },
    resources: { min: 60, max: 80 },
    goods: { min: 70, max: 90 },
    social: { min: 65, max: 85 },
  }
};

// Mock data for the SystemFramingStudio component
const mockCldData = {
  nodes: [],
  edges: []
};

// Mock SNA data
const mockSnaData: SNAData = {
  nodes: [
    { id: 'MOE', type: 'government', label: 'Ministry of Economy', degree: 8, betweenness: 0.4, closeness: 0.8 },
    { id: 'MOF', type: 'government', label: 'Ministry of Finance', degree: 7, betweenness: 0.35, closeness: 0.75 },
    { id: 'ADNOC', type: 'private', label: 'ADNOC', degree: 6, betweenness: 0.3, closeness: 0.7 },
    { id: 'EAD', type: 'ngo', label: 'Environment Agency', degree: 5, betweenness: 0.25, closeness: 0.65 },
    { id: 'UAEU', type: 'academic', label: 'UAE University', degree: 4, betweenness: 0.2, closeness: 0.6 },
    { id: 'DMT', type: 'government', label: 'Dept. of Transport', degree: 3, betweenness: 0.15, closeness: 0.55 },
    { id: 'EDB', type: 'private', label: 'Emirates Dev. Bank', degree: 5, betweenness: 0.28, closeness: 0.68 },
    { id: 'RTA', type: 'government', label: 'Roads Authority', degree: 4, betweenness: 0.22, closeness: 0.63 },
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

// All potential execution pathways
const allMockPathways: ExecutionPathway[] = [
  {
    id: 'path1',
    title: 'Energy Policy Reform',
    description: 'Coordinate across agencies to reform energy subsidy structure',
    actors: ['MOF', 'ADNOC', 'EAD'],
    coordinationTime: 8,
    impact: 4.2,
    relatedObjectives: [2] // Connected to renewable energy objective
  },
  {
    id: 'path2',
    title: 'Environmental Standards',
    description: 'Establish integrated environmental standards across sectors',
    actors: ['EAD', 'UAEU', 'MOE'],
    coordinationTime: 6,
    impact: 3.8,
    relatedObjectives: [1] // Connected to water management
  },
  {
    id: 'path3',
    title: 'Transportation Initiative',
    description: 'Develop sustainable transportation initiative with key stakeholders',
    actors: ['DMT', 'RTA', 'EAD'],
    coordinationTime: 12,
    impact: 5.1,
    relatedObjectives: []
  },
  {
    id: 'path4',
    title: 'Water Resource Strategy',
    description: 'Implement advanced water recycling systems in cooperation with key agencies',
    actors: ['EAD', 'MOE', 'UAEU'],
    coordinationTime: 7,
    impact: 4.0,
    relatedObjectives: [1] // Connected to water management
  },
  {
    id: 'path5',
    title: 'Renewable Energy Expansion',
    description: 'Coordinate solar infrastructure development in underutilized desert regions',
    actors: ['ADNOC', 'MOE', 'EDB'],
    coordinationTime: 10,
    impact: 4.5,
    relatedObjectives: [2] // Connected to renewable energy
  },
  {
    id: 'path6',
    title: 'Population Growth Management',
    description: 'Design and implement family support programs for population stability',
    actors: ['MOF', 'MOE', 'UAEU'],
    coordinationTime: 14,
    impact: 3.5,
    relatedObjectives: [3] // Connected to birth rate stability
  }
];

// Initial mockScenarios - moved from DeiForesightTab to be shared
const mockScenarios = [
  { id: 1, name: "Baseline", date: "2025-01-01", probability: 0.4, sparkline: [65, 68, 72, 78, 76] },
  { id: 2, name: "Optimistic", date: "2025-02-15", probability: 0.2, sparkline: [65, 70, 75, 82, 88] },
  { id: 3, name: "Pessimistic", date: "2025-03-10", probability: 0.4, sparkline: [65, 62, 58, 55, 52] },
];

const mockSensitivity = [
  { parameter: "Water Tariff", delta: 8, impact: 34 },
  { parameter: "Migration Policy", delta: 5, impact: 28 },
  { parameter: "Educational Investment", delta: 12, impact: 25 },
  { parameter: "Energy Subsidies", delta: -7, impact: 22 },
  { parameter: "Healthcare Access", delta: 9, impact: 20 },
];

const mockExecutionImpact = {
  bundlesAffected: 7,
  budgetChange: 45000000,
  timelineShift: 4,
};

const ThinkPage: React.FC = () => {
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { t, isRTL } = useTranslation();
  const [scenarios, setScenarios] = useState(mockScenarios);
  const [currentMetrics, setCurrentMetrics] = useState(mockDEIMetrics);
  const [highlightedActors, setHighlightedActors] = useState<string[]>([]);
  const [activeApproach, setActiveApproach] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [pathways, setPathways] = useState<ExecutionPathway[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<number[]>([1]);
  
  // Reference for the network visualization
  const networkRef = useRef<any>(null);

  // Handle scroll behavior for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Handle mouse near top to reveal header
    const handleMouseNearTop = (e: MouseEvent) => {
      if (e.clientY < 20 && hideHeader) {
        setHideHeader(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseNearTop);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseNearTop);
    };
  }, [lastScrollY, hideHeader]);

  // Handle saving a new scenario
  const handleSaveScenario = (newScenario: any) => {
    const id = scenarios.length > 0 ? Math.max(...scenarios.map(s => s.id)) + 1 : 1;
    const scenarioToAdd = {
      ...newScenario,
      id,
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedScenarios = [...scenarios, scenarioToAdd];
    setScenarios(updatedScenarios);
    
    toast({
      title: t("scenarioSaved"),
      description: `${newScenario.name} ${t("hasBeenSaved")}`,
      duration: 3000,
    });
  };

  // Handle updating metrics when a scenario is selected
  const handleScenarioSelect = (selectedScenarioId: number) => {
    // Find the selected scenario
    const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
    if (!selectedScenario) return;
    
    // In a real app, this would load detailed metrics for the scenario
    // For now, we'll just simulate a change
    const adjustedMetrics = {...currentMetrics};
    
    // Simulate adjustments based on the scenario trend
    const trendDirection = selectedScenario.sparkline[selectedScenario.sparkline.length - 1] - 
                           selectedScenario.sparkline[0];
    
    // Apply a percentage change to each pillar based on the scenario
    Object.keys(adjustedMetrics.pillars).forEach(pillar => {
      const pillarKey = pillar as keyof typeof adjustedMetrics.pillars;
      const adjustmentFactor = (1 + (trendDirection / 100));
      adjustedMetrics.pillars[pillarKey].value = Math.min(
        100,
        Math.max(1, Math.round(adjustedMetrics.pillars[pillarKey].value * adjustmentFactor))
      );
    });
    
    setCurrentMetrics(adjustedMetrics);
    
    toast({
      title: t("scenarioLoaded"),
      description: `${selectedScenario.name} ${t("scenarioApplied")}`,
      duration: 3000,
    });
  };
  
  // Handle highlighting actors in the network
  const handleHighlightActors = (actorIds: string[]) => {
    setHighlightedActors(actorIds);
  };
  
  // Handle approach and objective changes - update pathways based on selected approach
  useEffect(() => {
    console.log("Effect triggered: Objectives or approach changed", { 
      selectedObjectives, 
      activeApproach 
    });
    
    // Step 1: Filter pathways related to selected objectives
    let relevantPathways = allMockPathways.filter(pathway => {
      // If no objectives selected, all pathways are potentially relevant
      if (selectedObjectives.length === 0) return true;
      
      // Check if pathway is related to any selected objective
      const isRelatedToSelectedObjective = pathway.relatedObjectives.some(
        objId => selectedObjectives.includes(objId)
      );
      
      // For pathways not specifically tied to objectives, include them for aggressive approach 
      // or if they're particularly impactful
      const isGenerallyRelevant = pathway.relatedObjectives.length === 0 && 
        (activeApproach === 'aggressive' || pathway.impact > 4.5);
        
      return isRelatedToSelectedObjective || isGenerallyRelevant;
    });
    
    console.log("Filtered pathways after objective check:", relevantPathways);
    
    // Step 2: Sort by impact and then by relation to selected objectives
    relevantPathways.sort((a, b) => {
      // First prioritize pathways with relations to objectives
      const aHasRelation = a.relatedObjectives.some(id => selectedObjectives.includes(id));
      const bHasRelation = b.relatedObjectives.some(id => selectedObjectives.includes(id));
      
      if (aHasRelation && !bHasRelation) return -1;
      if (!aHasRelation && bHasRelation) return 1;
      
      // Then sort by impact
      return b.impact - a.impact;
    });
    
    // Step 3: Limit pathways based on approach
    let filteredPathways: ExecutionPathway[];
    
    if (activeApproach === 'conservative') {
      // Conservative: show just 1-2 highest impact pathways related to objectives
      filteredPathways = relevantPathways.slice(0, Math.max(1, Math.min(2, selectedObjectives.length)));
    } else if (activeApproach === 'balanced') {
      // Balanced: show moderate number of pathways (2-4)
      filteredPathways = relevantPathways.slice(0, Math.min(4, relevantPathways.length));
    } else {
      // Aggressive: show all relevant pathways up to 6
      filteredPathways = relevantPathways.slice(0, 6);
    }
    
    console.log("Final filtered pathways:", filteredPathways);
    setPathways(filteredPathways);
  }, [activeApproach, selectedObjectives]);
  
  // Handle adopting a pathway - would typically create a delivery bundle
  const handleAdoptPathway = (pathway: ExecutionPathway) => {
    // In a real app, this would create a bundle in the ACT zone
    toast({
      title: t("pathwayAdopted"),
      description: t("redirectToAct"),
      duration: 3000,
    });
  };
  
  // Update the approach based on strategy builder selection
  const handleApproachChange = (approach: 'conservative' | 'balanced' | 'aggressive') => {
    setActiveApproach(approach);
  };
  
  // Handle updates from the strategy builder
  const handleStrategyBuilderCompute = (approach: string, objectiveIds?: number[]) => {
    console.log("Strategy builder computed with:", { approach, objectiveIds });
    
    // Update approach
    setActiveApproach(approach as 'conservative' | 'balanced' | 'aggressive');
    
    // Update objectives if provided
    if (objectiveIds) {
      setSelectedObjectives(objectiveIds);
    }
    
    toast({
      title: t("strategyUpdated"),
      description: t("pathwaysRecalculated"),
      duration: 2000,
    });
  };

  return (
    <AnimatedPage>
      {/* Top Navigation Bar */}
      <motion.header 
        className="sticky top-0 z-50 w-full glass-panel py-3 px-6 mb-8 border-b border-white/20"
        initial={{ y: 0 }}
        animate={{ y: hideHeader ? -100 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Layers size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">THINK 🔍: {t("strategyZone")}</h1>
              <p className="text-sm md:text-base text-gray-400">
                {t("thinkCoreDesc")}
              </p>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content Layout */}
      <div className="flex flex-col gap-6">
        {/* System Framing Studio (Full Width) */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-left flex items-center">
            <Layout className="mr-2" size={20} />
            {t("systemFramingStudio")}
          </h2>
          <SystemFramingStudio 
            cldData={mockCldData} 
            snaData={adaptSNADataToSystemFraming(mockSnaData)} 
          />
        </GlassCard>
        
        {/* DEI & Foresight Hub (Full Width) */}
        <DeiAndForesightHub 
          metrics={currentMetrics}
          scenarios={scenarios}
          onSaveScenario={handleSaveScenario}
          onSelectScenario={handleScenarioSelect}
        />
        
        {/* SNA Analysis Panel (Full Width) */}
        <SnaAnalysisPanel 
          snaData={mockSnaData}
          onHighlightActors={handleHighlightActors}
        />
        
        {/* Strategy Builder with SNA-driven Execution Pathways */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-left flex items-center">
            <GitBranch className="mr-2" size={20} />
            {t("strategyBuilder")}
          </h2>
          <StrategyBuilder 
            sensitivityParameters={mockSensitivity} 
            executionImpact={mockExecutionImpact}
            onCompute={handleStrategyBuilderCompute}
          />
          
          {/* SNA-Driven Execution Pathways */}
          <ExecutionPathwayPanel 
            pathways={pathways} 
            onHighlightPathway={handleHighlightActors}
            onAdoptPathway={handleAdoptPathway}
          />
        </GlassCard>
        
        {/* AI Advisor (Full-Width) */}
        <AiAdvisorSidebar className="glass-panel p-4" />
      </div>

      {/* Footer CTA */}
      <div className="mt-8">
        <FooterCTA />
      </div>
    </AnimatedPage>
  );
};

export default ThinkPage;
