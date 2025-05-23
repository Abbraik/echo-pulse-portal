
import React from 'react';
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
  
  return (
    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} h-full`}>
      {/* Left sidebar: Toolbox */}
      <div className="w-1/3 p-2">
        <InnovateToolbox mode={mode} />
      </div>

      {/* Right side: Canvas & Controls */}
      <div className="w-2/3 flex flex-col p-2 space-y-2">
        {/* Top section: CLD Sketch & Diagram Tools */}
        <div className="h-[45%]">
          <GlassCard className="h-full">
            <CLDSketchCanvas mode={mode} />
          </GlassCard>
        </div>

        {/* Middle section: Scenario Fork & Simulation Request */}
        <div className="h-[20%]">
          <GlassCard className="h-full">
            <RequestSimulationPanel />
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
                  <ResultsInnovationTools />
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
