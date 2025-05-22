
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

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
      
      {/* Two-column layout for main content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left Column - Concept Blocks Sidebar (35%) */}
        <motion.div 
          className="w-[35%] flex-shrink-0 flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="flex-1 p-3 h-full shadow-[inset_0_0_15px_rgba(20,184,166,0.2)] backdrop-blur-xl overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold mb-3">{t('buildingBlocks')}</h3>
            <ScrollArea className="flex-1">
              <ConceptBlocksPalette />
            </ScrollArea>
            <Button className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-md">
              <PlusSquare size={16} />
              {t('createNewConcept')}
            </Button>
          </GlassCard>
        </motion.div>
        
        {/* Right Column - Main Content Area (65%) */}
        <motion.div 
          className="w-[65%] flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* CLD Sketch Canvas (45% height) */}
          <div className="h-[45%] min-h-[250px]">
            <GlassCard className="p-3 h-full glass-glow shadow-[inset_0_0_20px_rgba(20,184,166,0.25)]">
              <CLDSketchCanvas />
            </GlassCard>
          </div>
          
          {/* Request Simulation Panel (15% height) */}
          <div className="h-[15%] min-h-[120px]">
            <RequestSimulationPanel 
              engineMode={engineMode}
              setEngineMode={setEngineMode}
              onGenerateSimulation={handleGenerateSimulation}
              isGenerating={simulationInProgress}
              isGenerated={simulationGenerated}
            />
          </div>
          
          {/* Results & Innovation Tools (40% height) - Now using tabs */}
          <div className="h-[40%] min-h-[200px]">
            <ResultsInnovationTools 
              showResults={simulationGenerated}
              engine={engineMode}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
