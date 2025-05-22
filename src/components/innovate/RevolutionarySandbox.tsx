
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Archive, Rocket, RefreshCw, Info, CirclePlay, Download, PlusSquare, Undo, Redo } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ConceptBlocksPalette } from './revolutionary/ConceptBlocksPalette';
import { CLDSketchCanvas } from './revolutionary/CLDSketchCanvas';
import { RequestSimulationPanel } from './revolutionary/RequestSimulationPanel';
import { ResultsInnovationTools } from './revolutionary/ResultsInnovationTools';

export const RevolutionarySandbox: React.FC = () => {
  const { t } = useTranslation();
  const [engineMode, setEngineMode] = useState('system-dynamics');
  const [simulationGenerated, setSimulationGenerated] = useState(false);
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  
  const handleGenerateSimulation = () => {
    setSimulationInProgress(true);
    // Simulate API call or processing delay
    setTimeout(() => {
      setSimulationInProgress(false);
      setSimulationGenerated(true);
    }, 2500);
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with title and info tooltip */}
      <div className="glass-panel p-4 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{t('revolutionarySandboxTitle')}</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{t('revolutionarySandboxTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <RefreshCw size={16} />
                <span>{t('scenarioFork')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('scenarioForkTooltip')}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Archive size={16} />
                <span>{t('archiveRadicalScenario')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('archiveRadicalScenarioTooltip')}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <Rocket size={16} />
                <span>{t('promoteRadicalBlueprint')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('promoteRadicalBlueprintTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      {/* Main content with flex layout to ensure proper spacing */}
      <div className="flex flex-col flex-1 overflow-hidden space-y-4">
        {/* Concept Blocks Palette (10% height) */}
        <div className="h-[10%] min-h-[80px] flex-shrink-0">
          <GlassCard className="p-3 h-full">
            <ConceptBlocksPalette />
          </GlassCard>
        </div>
        
        {/* CLD Sketch Canvas (40% height) */}
        <div className="h-[40%] min-h-[200px] flex-shrink-0">
          <GlassCard className="p-3 h-full glass-glow">
            <CLDSketchCanvas />
          </GlassCard>
        </div>
        
        {/* Request Simulation Panel (20% height) */}
        <div className="h-[15%] min-h-[100px] flex-shrink-0">
          <RequestSimulationPanel 
            engineMode={engineMode}
            setEngineMode={setEngineMode}
            onGenerateSimulation={handleGenerateSimulation}
            isGenerating={simulationInProgress}
            isGenerated={simulationGenerated}
          />
        </div>
        
        {/* Results & Innovation Tools (30% height) */}
        <div className="h-[35%] min-h-[180px] flex-shrink-0">
          <ResultsInnovationTools 
            showResults={simulationGenerated}
            engine={engineMode}
          />
        </div>
      </div>
    </div>
  );
};
