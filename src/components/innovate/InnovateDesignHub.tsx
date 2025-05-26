
import React, { useState } from 'react';
import { InnovateToolbox } from './InnovateToolbox';
import { GlassCard } from '../ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImpactDashboard } from './evolutionary/ImpactDashboard';
import { CLDSketchCanvas } from './revolutionary/CLDSketchCanvas';
import { RequestSimulationPanel } from './revolutionary/RequestSimulationPanel';
import { ResultsInnovationTools } from './revolutionary/ResultsInnovationTools';
import { ComparativeInnovationDashboard } from './revolutionary/ComparativeInnovationDashboard';
import { CoCreationForum } from './revolutionary/CoCreationForum';

interface InnovateDesignHubProps {
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
}

export const InnovateDesignHub: React.FC<InnovateDesignHubProps> = ({ mode }) => {
  const { t, isRTL } = useTranslation();
  const [engineMode, setEngineMode] = useState<string>('system-dynamics');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const handleGenerateSimulation = () => {
    setIsGenerating(true);
    
    // Simulate API call or processing delay
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setShowResults(true);
    }, 2000);
  };
  
  return (
    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} h-full gap-3`}>
      {/* Left sidebar: Toolbox */}
      <div className="w-1/3">
        <InnovateToolbox mode={mode} />
      </div>

      {/* Right side: Canvas & Controls */}
      <div className="w-2/3 flex flex-col gap-3">
        {/* Top section: CLD Sketch & Diagram Tools */}
        <div className="h-[45%]">
          <GlassCard className="h-full">
            <CLDSketchCanvas mode={mode} />
          </GlassCard>
        </div>

        {/* Middle section: Scenario Fork & Simulation Request */}
        <div className="h-[20%]">
          <GlassCard className="h-full">
            <RequestSimulationPanel 
              engineMode={engineMode}
              setEngineMode={setEngineMode}
              onGenerateSimulation={handleGenerateSimulation}
              isGenerating={isGenerating}
              isGenerated={isGenerated}
            />
          </GlassCard>
        </div>

        {/* Bottom section: Results & Innovation Tabs */}
        <div className="h-[35%]">
          <GlassCard className="h-full p-2">
            <Tabs defaultValue="impact" className="w-full h-full">
              <TabsList className="mb-2">
                <TabsTrigger value="impact">{t('impactDashboardTab')}</TabsTrigger>
                <TabsTrigger value="blueprint">{t('metaDesignBlueprintTab')}</TabsTrigger>
                <TabsTrigger value="compare">{t('comparativeInnovationTab')}</TabsTrigger>
                <TabsTrigger value="co-create">{t('futuresCoCreationTab')}</TabsTrigger>
              </TabsList>
              <div className="overflow-auto h-[calc(100%-40px)]">
                <TabsContent value="impact">
                  <ImpactDashboard />
                </TabsContent>
                <TabsContent value="blueprint">
                  <ResultsInnovationTools 
                    showResults={showResults} 
                    engine={engineMode} 
                    activeTab="blueprint"
                  />
                </TabsContent>
                <TabsContent value="compare">
                  <ComparativeInnovationDashboard />
                </TabsContent>
                <TabsContent value="co-create">
                  <CoCreationForum />
                </TabsContent>
              </div>
            </Tabs>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
