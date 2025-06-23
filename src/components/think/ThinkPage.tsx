
import React, { useCallback } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import ThinkPageLayout from './ThinkPageLayout';
import DeiMetricsManager from './DeiMetricsManager';
import StrategyControls from './StrategyControls';
import ExecutionPathwayPanel from './ExecutionPathwayPanel';
import DeiForesightTab from './DeiForesightTab';
import { useThinkPageState } from './hooks/useThinkPageState';
import { ExecutionPathway } from './types/sna-types';
import { toast } from '@/components/ui/use-toast';

const ThinkPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    state,
    toggleAiAdvisor,
    setSelectedObjectives,
    setActiveApproach,
    setHighlightedPathway,
  } = useThinkPageState();

  // Mock data for pathways
  const mockPathways: ExecutionPathway[] = [
    {
      id: 'path1',
      title: 'Water Resource Strategy',
      description: 'Implement advanced water recycling systems',
      actors: ['EAD', 'MOE', 'UAEU'],
      coordinationTime: 7,
      impact: 4.0,
      relatedObjectives: [1],
    },
    {
      id: 'path2',
      title: 'Environmental Standards',
      description: 'Establish integrated environmental standards',
      actors: ['EAD', 'UAEU', 'MOE'],
      coordinationTime: 6,
      impact: 3.8,
      relatedObjectives: [1],
    },
  ];

  // Mock DEI metrics
  const deiMetrics = {
    pillars: {
      population: { value: 78, subIndicators: [] },
      resources: { value: 65, subIndicators: [] },
      goods: { value: 82, subIndicators: [] },
      social: { value: 79, subIndicators: [] }
    },
    equilibriumBands: {
      overall: { min: 72, max: 82 },
      population: { min: 70, max: 85 },
      resources: { min: 60, max: 80 },
      goods: { min: 75, max: 90 },
      social: { min: 70, max: 85 }
    }
  };

  const scenarios = [
    { id: 1, name: 'Baseline Scenario', date: '2024-01-15', probability: 0.4, sparkline: [65, 68, 71, 74, 76] },
    { id: 2, name: 'Growth Scenario', date: '2024-02-01', probability: 0.35, sparkline: [70, 73, 76, 79, 82] },
    { id: 3, name: 'Crisis Scenario', date: '2024-01-28', probability: 0.25, sparkline: [60, 58, 55, 58, 62] },
  ];

  const handleObjectiveToggle = useCallback((id: number) => {
    const newObjectives = state.selectedObjectives.includes(id)
      ? state.selectedObjectives.filter(obj => obj !== id)
      : [...state.selectedObjectives, id];
    setSelectedObjectives(newObjectives);
  }, [state.selectedObjectives, setSelectedObjectives]);

  const handleHighlightPathway = useCallback((actorIds: string[]) => {
    setHighlightedPathway(actorIds);
  }, [setHighlightedPathway]);

  const handleAdoptPathway = useCallback((pathway: ExecutionPathway) => {
    toast({
      title: t('pathwayAdopted', { defaultValue: 'Pathway Adopted' }),
      description: t('pathwayAdoptedDesc', { 
        defaultValue: 'Execution pathway has been added to your strategy',
        pathway: pathway.title 
      }),
    });
  }, [t]);

  return (
    <ThinkPageLayout 
      pageState={state} 
      onToggleAiAdvisor={toggleAiAdvisor}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - DEI Metrics */}
        <div className="lg:col-span-1">
          <DeiMetricsManager />
        </div>

        {/* Middle Column - Strategy Controls */}
        <div className="lg:col-span-1">
          <StrategyControls
            selectedObjectives={state.selectedObjectives}
            activeApproach={state.activeApproach}
            onObjectiveToggle={handleObjectiveToggle}
            onApproachChange={setActiveApproach}
          />
        </div>

        {/* Right Column - DEI Foresight */}
        <div className="lg:col-span-1">
          <DeiForesightTab 
            metrics={deiMetrics}
            scenarios={scenarios}
          />
        </div>
      </div>

      {/* Execution Pathways */}
      <ExecutionPathwayPanel
        pathways={mockPathways}
        onHighlightPathway={handleHighlightPathway}
        onAdoptPathway={handleAdoptPathway}
      />
    </ThinkPageLayout>
  );
};

export default ThinkPage;
