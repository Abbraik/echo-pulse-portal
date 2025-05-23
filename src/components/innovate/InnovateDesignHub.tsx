
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { InnovateToolbox } from './InnovateToolbox';
import { CLDSketchCanvas } from './revolutionary/CLDSketchCanvas';
import { RequestSimulationPanel } from './revolutionary/RequestSimulationPanel';
import { ResultsInnovationTools } from './revolutionary/ResultsInnovationTools';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InnovateDesignHubProps {
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
}

export const InnovateDesignHub: React.FC<InnovateDesignHubProps> = ({ mode }) => {
  const { t } = useTranslation();
  const [engineMode, setEngineMode] = useState('system-dynamics');
  const [simulationGenerated, setSimulationGenerated] = useState(false);
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  const [activeCanvasTab, setActiveCanvasTab] = useState('sketch');
  
  const handleGenerateSimulation = () => {
    setSimulationInProgress(true);
    // Simulate API call or processing delay
    setTimeout(() => {
      setSimulationInProgress(false);
      setSimulationGenerated(true);
      setActiveCanvasTab('results');
    }, 2500);
  };

  return (
    <div className="grid grid-cols-[30%_70%] gap-2 h-full">
      {/* Left Column - Toolbox */}
      <motion.div 
        className="h-full overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <InnovateToolbox mode={mode} />
      </motion.div>
      
      {/* Right Column - Canvas & Controls */}
      <motion.div 
        className="flex flex-col h-full gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* CLD Sketch & Diagram Tools - 45% height */}
        <GlassCard className="h-[45%] shadow-[inset_0_0_15px_rgba(20,184,166,0.2)] backdrop-blur-xl overflow-hidden">
          <div className="h-full p-3">
            <CLDSketchCanvas />
          </div>
        </GlassCard>
        
        {/* Scenario Fork & Request Simulation - 20% height */}
        <GlassCard className="h-[20%] shadow-[inset_0_0_15px_rgba(20,184,166,0.2)] backdrop-blur-xl overflow-hidden">
          <div className="h-full">
            <RequestSimulationPanel 
              engineMode={engineMode}
              setEngineMode={setEngineMode}
              onGenerateSimulation={handleGenerateSimulation}
              isGenerating={simulationInProgress}
              isGenerated={simulationGenerated}
            />
          </div>
        </GlassCard>
        
        {/* Results & Innovation Tabs - 35% height */}
        <GlassCard className="flex-1 shadow-[inset_0_0_15px_rgba(20,184,166,0.2)] backdrop-blur-xl overflow-hidden">
          <Tabs 
            value={activeCanvasTab} 
            onValueChange={setActiveCanvasTab} 
            className="h-full flex flex-col"
          >
            <TabsList className="grid grid-cols-4 mx-3 mt-3 mb-2">
              <TabsTrigger value="impact">
                {t('impactDashboardTab')}
              </TabsTrigger>
              <TabsTrigger value="blueprint">
                {t('metaDesignBlueprintTab')}
              </TabsTrigger>
              <TabsTrigger value="compare">
                {t('comparativeInnovationTab')}
              </TabsTrigger>
              <TabsTrigger value="co-create">
                {t('futuresCoCreationTab')}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden px-3 pb-3">
              <TabsContent value="impact" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ResultsInnovationTools
                  showResults={simulationGenerated}
                  engine={engineMode}
                  activeTab="impact"
                />
              </TabsContent>
              
              <TabsContent value="blueprint" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ResultsInnovationTools
                  showResults={simulationGenerated}
                  engine={engineMode}
                  activeTab="blueprint"
                />
              </TabsContent>
              
              <TabsContent value="compare" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ResultsInnovationTools
                  showResults={simulationGenerated}
                  engine={engineMode}
                  activeTab="compare"
                />
              </TabsContent>
              
              <TabsContent value="co-create" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ResultsInnovationTools
                  showResults={simulationGenerated}
                  engine={engineMode}
                  activeTab="cocreate"
                />
              </TabsContent>
            </div>
          </Tabs>
        </GlassCard>
      </motion.div>
    </div>
  );
};
