
import React, { useState } from 'react';
import { InnovateToolbox } from './InnovateToolbox';
import { GlassCard } from '../ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImpactDashboard } from './evolutionary/ImpactDashboard';
import { CLDSketchCanvas } from './revolutionary/CLDSketchCanvas';
import { RequestSimulationPanel } from './revolutionary/RequestSimulationPanel';
import { ResultsInnovationTools } from './revolutionary/ResultsInnovationTools';
import { ComparativeInnovationDashboard } from './revolutionary/ComparativeInnovationDashboard';
import { CoCreationForum } from './revolutionary/CoCreationForum';
import { useFullscreenPanel } from '@/hooks/use-fullscreen-panel';
import { FullscreenButton } from './FullscreenButton';

interface InnovateDesignHubProps {
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
}

export const InnovateDesignHub: React.FC<InnovateDesignHubProps> = ({ mode }) => {
  const { t, isRTL } = useTranslation();
  const [engineMode, setEngineMode] = useState<string>('system-dynamics');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const { fullscreenPanel, toggleFullscreen, isFullscreen } = useFullscreenPanel();
  
  const handleGenerateSimulation = () => {
    setIsGenerating(true);
    
    // Simulate API call or processing delay
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setShowResults(true);
    }, 2000);
  };

  // If any panel is in fullscreen mode, render only that panel
  if (fullscreenPanel) {
    return (
      <div className="h-full w-full">
        {fullscreenPanel === 'toolbox' && (
          <GlassCard className="h-full relative">
            <div className="absolute top-2 right-2 z-10">
              <FullscreenButton
                isFullscreen={true}
                onToggle={() => toggleFullscreen('toolbox')}
                tooltip="Exit fullscreen"
              />
            </div>
            <ScrollArea className="h-full">
              <InnovateToolbox mode={mode} />
            </ScrollArea>
          </GlassCard>
        )}
        
        {fullscreenPanel === 'canvas' && (
          <GlassCard className="h-full relative">
            <div className="absolute top-2 right-2 z-10">
              <FullscreenButton
                isFullscreen={true}
                onToggle={() => toggleFullscreen('canvas')}
                tooltip="Exit fullscreen"
              />
            </div>
            <ScrollArea className="h-full">
              <CLDSketchCanvas mode={mode} />
            </ScrollArea>
          </GlassCard>
        )}
        
        {fullscreenPanel === 'simulation' && (
          <GlassCard className="h-full relative">
            <div className="absolute top-2 right-2 z-10">
              <FullscreenButton
                isFullscreen={true}
                onToggle={() => toggleFullscreen('simulation')}
                tooltip="Exit fullscreen"
              />
            </div>
            <ScrollArea className="h-full">
              <RequestSimulationPanel 
                engineMode={engineMode}
                setEngineMode={setEngineMode}
                onGenerateSimulation={handleGenerateSimulation}
                isGenerating={isGenerating}
                isGenerated={isGenerated}
              />
            </ScrollArea>
          </GlassCard>
        )}
        
        {fullscreenPanel === 'results' && (
          <GlassCard className="h-full p-2 relative">
            <div className="absolute top-4 right-4 z-10">
              <FullscreenButton
                isFullscreen={true}
                onToggle={() => toggleFullscreen('results')}
                tooltip="Exit fullscreen"
              />
            </div>
            <Tabs defaultValue="impact" className="w-full h-full flex flex-col">
              <TabsList className="mb-2 flex-none">
                <TabsTrigger value="impact">{t('impactDashboardTab')}</TabsTrigger>
                <TabsTrigger value="blueprint">{t('metaDesignBlueprintTab')}</TabsTrigger>
                <TabsTrigger value="compare">{t('comparativeInnovationTab')}</TabsTrigger>
                <TabsTrigger value="co-create">{t('futuresCoCreationTab')}</TabsTrigger>
              </TabsList>
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <TabsContent value="impact" className="m-0">
                    <ImpactDashboard />
                  </TabsContent>
                  <TabsContent value="blueprint" className="m-0">
                    <ResultsInnovationTools 
                      showResults={showResults} 
                      engine={engineMode} 
                      activeTab="blueprint"
                    />
                  </TabsContent>
                  <TabsContent value="compare" className="m-0">
                    <ComparativeInnovationDashboard />
                  </TabsContent>
                  <TabsContent value="co-create" className="m-0">
                    <CoCreationForum />
                  </TabsContent>
                </ScrollArea>
              </div>
            </Tabs>
          </GlassCard>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} h-full gap-4`}>
      {/* Left sidebar: Toolbox */}
      <div className="w-1/3 min-h-0">
        <GlassCard className="h-full relative">
          <div className="absolute top-2 right-2 z-10">
            <FullscreenButton
              isFullscreen={false}
              onToggle={() => toggleFullscreen('toolbox')}
              tooltip="Expand toolbox"
            />
          </div>
          <ScrollArea className="h-full">
            <InnovateToolbox mode={mode} />
          </ScrollArea>
        </GlassCard>
      </div>

      {/* Right side: Canvas & Controls */}
      <div className="w-2/3 flex flex-col gap-4 min-h-0">
        {/* Top section: CLD Sketch & Diagram Tools */}
        <div className="flex-1 min-h-[300px]">
          <GlassCard className="h-full relative">
            <div className="absolute top-2 right-2 z-10">
              <FullscreenButton
                isFullscreen={false}
                onToggle={() => toggleFullscreen('canvas')}
                tooltip="Expand canvas"
              />
            </div>
            <ScrollArea className="h-full">
              <CLDSketchCanvas mode={mode} />
            </ScrollArea>
          </GlassCard>
        </div>

        {/* Middle section: Scenario Fork & Simulation Request */}
        <div className="flex-none min-h-[200px]">
          <GlassCard className="h-full relative">
            <div className="absolute top-2 right-2 z-10">
              <FullscreenButton
                isFullscreen={false}
                onToggle={() => toggleFullscreen('simulation')}
                tooltip="Expand simulation panel"
              />
            </div>
            <ScrollArea className="h-full">
              <RequestSimulationPanel 
                engineMode={engineMode}
                setEngineMode={setEngineMode}
                onGenerateSimulation={handleGenerateSimulation}
                isGenerating={isGenerating}
                isGenerated={isGenerated}
              />
            </ScrollArea>
          </GlassCard>
        </div>

        {/* Bottom section: Results & Innovation Tabs */}
        <div className="flex-1 min-h-[300px]">
          <GlassCard className="h-full p-2 relative">
            <div className="absolute top-4 right-4 z-10">
              <FullscreenButton
                isFullscreen={false}
                onToggle={() => toggleFullscreen('results')}
                tooltip="Expand results panel"
              />
            </div>
            <Tabs defaultValue="impact" className="w-full h-full flex flex-col">
              <TabsList className="mb-2 flex-none">
                <TabsTrigger value="impact">{t('impactDashboardTab')}</TabsTrigger>
                <TabsTrigger value="blueprint">{t('metaDesignBlueprintTab')}</TabsTrigger>
                <TabsTrigger value="compare">{t('comparativeInnovationTab')}</TabsTrigger>
                <TabsTrigger value="co-create">{t('futuresCoCreationTab')}</TabsTrigger>
              </TabsList>
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <TabsContent value="impact" className="m-0">
                    <ImpactDashboard />
                  </TabsContent>
                  <TabsContent value="blueprint" className="m-0">
                    <ResultsInnovationTools 
                      showResults={showResults} 
                      engine={engineMode} 
                      activeTab="blueprint"
                    />
                  </TabsContent>
                  <TabsContent value="compare" className="m-0">
                    <ComparativeInnovationDashboard />
                  </TabsContent>
                  <TabsContent value="co-create" className="m-0">
                    <CoCreationForum />
                  </TabsContent>
                </ScrollArea>
              </div>
            </Tabs>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
