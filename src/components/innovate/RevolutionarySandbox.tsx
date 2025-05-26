
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

interface ConceptBlock {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  type: string;
}

interface ScenarioForkData {
  id: string;
  name: string;
  active: boolean;
}

export const RevolutionarySandbox: React.FC = () => {
  const { t } = useTranslation();
  const [engineMode, setEngineMode] = useState('system-dynamics');
  const [simulationGenerated, setSimulationGenerated] = useState(false);
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  const [activeTab, setActiveTab] = useState('sketch');
  
  // New state for dynamic content
  const [selectedBlock, setSelectedBlock] = useState<ConceptBlock | null>(null);
  const [selectedFork, setSelectedFork] = useState<ScenarioForkData | null>(null);
  const [activeToolboxTab, setActiveToolboxTab] = useState('blocks');
  
  const handleGenerateSimulation = () => {
    setSimulationInProgress(true);
    // Simulate API call or processing delay
    setTimeout(() => {
      setSimulationInProgress(false);
      setSimulationGenerated(true);
      setActiveTab('results');
    }, 2500);
  };

  const handleBlockSelect = (block: ConceptBlock) => {
    setSelectedBlock(block);
    setActiveToolboxTab('blocks'); // Ensure we're on blocks tab when selecting a block
  };

  const handleForkSelect = (fork: ScenarioForkData) => {
    setSelectedFork(fork);
    setActiveToolboxTab('forks'); // Ensure we're on forks tab when selecting a fork
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with title and action buttons */}
      <div className="glass-panel p-3 mb-2 flex justify-between items-center">
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
          
          {/* Dynamic context indicator */}
          {(selectedBlock || selectedFork) && (
            <div className="ml-4 px-3 py-1 bg-white/10 rounded-full text-sm">
              {selectedBlock && (
                <span className="text-teal-300">Block: {selectedBlock.name}</span>
              )}
              {selectedFork && (
                <span className="text-purple-300">Fork: {selectedFork.name}</span>
              )}
            </div>
          )}
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
      <div className="grid grid-cols-[35%_65%] gap-2 flex-1 overflow-hidden">
        {/* Left Column - Concept Blocks Sidebar */}
        <motion.div 
          className="h-full overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="h-full shadow-[inset_0_0_15px_rgba(20,184,166,0.2)] backdrop-blur-xl flex flex-col">
            <Tabs value={activeToolboxTab} onValueChange={setActiveToolboxTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-3 mb-2">
                <TabsTrigger value="blocks" className="flex items-center gap-1">
                  <span className="hidden sm:inline">Blocks</span>
                </TabsTrigger>
                <TabsTrigger value="forks" className="flex items-center gap-1">
                  <span className="hidden sm:inline">Forks</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-hidden">
                <TabsContent value="blocks" className="h-full m-0">
                  <ConceptBlocksPalette 
                    mode="moonshot" 
                    onBlockSelect={handleBlockSelect}
                    selectedBlockId={selectedBlock?.id}
                  />
                </TabsContent>
                
                <TabsContent value="forks" className="h-full m-0">
                  <div className="px-3">
                    <h3 className="text-lg font-semibold mb-4">{t('scenarioVariants')}</h3>
                  </div>
                  {/* ScenarioFork component would go here with selection props */}
                </TabsContent>
              </div>
            </Tabs>
          </GlassCard>
        </motion.div>
        
        {/* Right Column - Main Workspace */}
        <motion.div 
          className="h-full flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="flex-1 shadow-[inset_0_0_15px_rgba(20,184,166,0.2)] overflow-hidden flex flex-col">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="flex-1 flex flex-col h-full"
            >
              <TabsList className="grid grid-cols-3 mx-3 mt-3 mb-2">
                <TabsTrigger value="sketch" className="flex items-center gap-1.5">
                  <PlusSquare size={16} />
                  {t('cldSketchCanvas')}
                </TabsTrigger>
                <TabsTrigger 
                  value="simulate" 
                  className="flex items-center gap-1.5"
                >
                  <CirclePlay size={16} />
                  {t('requestSimulation')}
                </TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  className="flex items-center gap-1.5"
                  disabled={!simulationGenerated}
                >
                  <Download size={16} />
                  {t('resultsInnovation')}
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden px-3 pb-3">
                <TabsContent value="sketch" className="h-full m-0 p-0">
                  <div className="h-full">
                    <CLDSketchCanvas 
                      mode="moonshot"
                      selectedBlock={selectedBlock}
                      selectedFork={selectedFork}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="simulate" className="h-full m-0 p-0">
                  <div className="h-full flex flex-col justify-center">
                    <RequestSimulationPanel 
                      engineMode={engineMode}
                      setEngineMode={setEngineMode}
                      onGenerateSimulation={handleGenerateSimulation}
                      isGenerating={simulationInProgress}
                      isGenerated={simulationGenerated}
                      selectedBlock={selectedBlock}
                      selectedFork={selectedFork}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="results" className="h-full m-0 p-0">
                  <div className="h-full">
                    <ResultsInnovationTools 
                      showResults={simulationGenerated}
                      engine={engineMode}
                      selectedBlock={selectedBlock}
                      selectedFork={selectedFork}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};
