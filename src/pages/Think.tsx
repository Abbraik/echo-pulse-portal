import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { useTranslation } from '@/hooks/use-translation';
import { toast } from '@/components/ui/use-toast';
import { SNAData, ExecutionPathway } from '@/components/think/types/sna-types';
import ParticlesBackground from '@/components/ui/particles-background';
import ThinkBackground from '@/components/think/ThinkBackground';
import ThinkHeader from '@/components/think/ThinkHeader';
import SystemFramingSection from '@/components/think/SystemFramingSection';
import TabbedContentSection from '@/components/think/TabbedContentSection';
import FooterCTA from '@/components/think/FooterCTA';
import AiAdvisorSection from '@/components/think/AiAdvisorSection';
import { useDemoIntegration } from '@/hooks/use-demo-integration';

// Demo-consistent DEI metrics
const mockDEIMetrics = { 
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

// Updated execution pathways to match demo scenarios
const allMockPathways: ExecutionPathway[] = [
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

// Updated scenarios to match demo data
const mockScenarios = [
  { id: 1, name: "Resource Management Demo", date: "2025-01-01", probability: 0.6, sparkline: [65, 68, 72, 78, 82] },
  { id: 2, name: "Birth-Rate Stability Demo", date: "2025-02-15", probability: 0.4, sparkline: [65, 70, 75, 79, 81] },
  { id: 3, name: "Baseline Scenario", date: "2025-03-10", probability: 0.3, sparkline: [65, 62, 58, 60, 65] },
];

// Updated sensitivity data to match demo focus
const mockSensitivity = [
  { parameter: "Resource Stock Target", delta: 12, impact: 38 },
  { parameter: "Extraction Pressure Control", delta: -8, impact: 32 },
  { parameter: "Population Growth Balance", delta: 6, impact: 28 },
  { parameter: "Marriage Rate Incentives", delta: 9, impact: 25 },
  { parameter: "Renewal vs Consumption Ratio", delta: 7, impact: 22 },
];

const mockExecutionImpact = {
  bundlesAffected: 5,
  budgetChange: 38000000,
  timelineShift: 6,
};

const ThinkPage: React.FC = () => {
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { t } = useTranslation();
  const [scenarios, setScenarios] = useState(mockScenarios);
  const [currentMetrics, setCurrentMetrics] = useState(mockDEIMetrics);
  const [highlightedActors, setHighlightedActors] = useState<string[]>([]);
  const [activeApproach, setActiveApproach] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [pathways, setPathways] = useState<ExecutionPathway[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState('dei');
  const [showAiAdvisor, setShowAiAdvisor] = useState(false);
  
  const demoIntegration = useDemoIntegration();

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

  const handleScenarioSelect = (selectedScenarioId: number) => {
    const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
    if (!selectedScenario) return;
    
    const adjustedMetrics = {...currentMetrics};
    
    const trendDirection = selectedScenario.sparkline[selectedScenario.sparkline.length - 1] - 
                           selectedScenario.sparkline[0];
    
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
  
  const handleHighlightActors = (actorIds: string[]) => {
    setHighlightedActors(actorIds);
  };
  
  useEffect(() => {
    console.log("Effect triggered: Objectives or approach changed", { 
      selectedObjectives, 
      activeApproach 
    });
    
    let relevantPathways = allMockPathways.filter(pathway => {
      if (selectedObjectives.length === 0) return true;
      
      const isRelatedToSelectedObjective = pathway.relatedObjectives.some(
        objId => selectedObjectives.includes(objId)
      );
      
      const isGenerallyRelevant = pathway.relatedObjectives.length === 0 && 
        (activeApproach === 'aggressive' || pathway.impact > 4.5);
        
      return isRelatedToSelectedObjective || isGenerallyRelevant;
    });
    
    console.log("Filtered pathways after objective check:", relevantPathways);
    
    relevantPathways.sort((a, b) => {
      const aHasRelation = a.relatedObjectives.some(id => selectedObjectives.includes(id));
      const bHasRelation = b.relatedObjectives.some(id => selectedObjectives.includes(id));
      
      if (aHasRelation && !bHasRelation) return -1;
      if (!aHasRelation && bHasRelation) return 1;
      
      return b.impact - a.impact;
    });
    
    let filteredPathways: ExecutionPathway[];
    
    if (activeApproach === 'conservative') {
      filteredPathways = relevantPathways.slice(0, Math.max(1, Math.min(2, selectedObjectives.length)));
    } else if (activeApproach === 'balanced') {
      filteredPathways = relevantPathways.slice(0, Math.min(4, relevantPathways.length));
    } else {
      filteredPathways = relevantPathways.slice(0, 6);
    }
    
    console.log("Final filtered pathways:", filteredPathways);
    setPathways(filteredPathways);
  }, [activeApproach, selectedObjectives]);
  
  const handleAdoptPathway = (pathway: ExecutionPathway) => {
    toast({
      title: t("pathwayAdopted"),
      description: t("redirectToAct"),
      duration: 3000,
    });
  };
  
  const handleApproachChange = (approach: 'conservative' | 'balanced' | 'aggressive') => {
    setActiveApproach(approach);
  };
  
  const handleStrategyBuilderCompute = (approach: string, objectiveIds?: number[]) => {
    console.log("Strategy builder computed with:", { approach, objectiveIds });
    
    setActiveApproach(approach as 'conservative' | 'balanced' | 'aggressive');
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <ParticlesBackground 
        count={60}
        colorStart="#14B8A6"
        colorEnd="#2563EB"
        minSize={2}
        maxSize={4}
        speed={0.5}
      />
      <ThinkBackground />

      <AnimatedPage>
        <ThinkHeader hideHeader={hideHeader} />
        
        <div className="max-w-[1440px] mx-auto px-6 pb-8 relative z-10">
          <SystemFramingSection 
            mockSnaData={mockSnaData}
            mockCldData={mockCldData}
          />

          <TabbedContentSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentMetrics={currentMetrics}
            scenarios={scenarios}
            onSaveScenario={handleSaveScenario}
            onSelectScenario={handleScenarioSelect}
            mockSnaData={mockSnaData}
            onHighlightActors={handleHighlightActors}
            mockSensitivity={mockSensitivity}
            mockExecutionImpact={mockExecutionImpact}
            onStrategyBuilderCompute={handleStrategyBuilderCompute}
            pathways={pathways}
            onAdoptPathway={handleAdoptPathway}
          />

          <FooterCTA />
        </div>
        
        <AiAdvisorSection 
          showAiAdvisor={showAiAdvisor}
          setShowAiAdvisor={setShowAiAdvisor}
        />
      </AnimatedPage>
    </div>
  );
};

export default ThinkPage;
