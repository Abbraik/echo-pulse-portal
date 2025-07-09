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
import { logger } from '@/utils/logger';
import { 
  mockDEIMetrics, 
  mockCldData, 
  mockSNAData, 
  mockScenarios, 
  mockSensitivity, 
  mockExecutionImpact, 
  allMockPathways 
} from '@/utils/mockData';

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
    logger.debug("Strategy pathways updated", { selectedObjectives, activeApproach });
    
    let relevantPathways = allMockPathways.filter(pathway => {
      if (selectedObjectives.length === 0) return true;
      
      const isRelatedToSelectedObjective = pathway.relatedObjectives.some(
        objId => selectedObjectives.includes(objId)
      );
      
      const isGenerallyRelevant = pathway.relatedObjectives.length === 0 && 
        (activeApproach === 'aggressive' || pathway.impact > 4.5);
        
      return isRelatedToSelectedObjective || isGenerallyRelevant;
    });
    
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
    logger.action("Strategy builder compute", { approach, objectiveIds });
    
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
            mockSnaData={mockSNAData}
            mockCldData={mockCldData}
          />

          <TabbedContentSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentMetrics={currentMetrics}
            scenarios={scenarios}
            onSaveScenario={handleSaveScenario}
            onSelectScenario={handleScenarioSelect}
            mockSnaData={mockSNAData}
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
