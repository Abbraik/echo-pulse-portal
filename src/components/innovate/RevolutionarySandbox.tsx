
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { ChevronDown, ChevronUp, GitBranch, Book, BarChart4, Network, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTranslation } from '@/hooks/use-translation';
import { ScenarioFork } from './revolutionary/ScenarioFork';
import { ParameterControls } from './revolutionary/ParameterControls';
import { ImpactDashboardRev } from './revolutionary/ImpactDashboardRev';

export const RevolutionarySandbox: React.FC = () => {
  const { t } = useTranslation();
  const [modelEngine, setModelEngine] = useState('systemDynamics');

  return (
    <div className="flex flex-col h-full">
      {/* Engine Switcher */}
      <div className="mb-4">
        <Tabs defaultValue="systemDynamics" onValueChange={setModelEngine} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="systemDynamics" className="text-xs">
              {t('systemDynamics')}
            </TabsTrigger>
            <TabsTrigger value="agentBased" className="text-xs">
              {t('agentBased')}
            </TabsTrigger>
            <TabsTrigger value="econometric" className="text-xs">
              {t('econometric')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Main Panel Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-y-auto pb-6">
        {/* Scenario Fork (25% width) */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full">
            <GlassCardHeader className="pb-2">
              <div className="flex items-center">
                <GitBranch className="mr-2 h-5 w-5 text-purple-400" />
                <GlassCardTitle gradient>{t('scenarioFork')}</GlassCardTitle>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              <ScenarioFork />
            </GlassCardContent>
          </GlassCard>
        </div>
        
        {/* Parameter Controls (45% width) */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <GlassCardHeader className="pb-2">
              <div className="flex items-center">
                <Book className="mr-2 h-5 w-5 text-purple-400" />
                <GlassCardTitle gradient>{t('parameterControls')}</GlassCardTitle>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              <ParameterControls engine={modelEngine} />
            </GlassCardContent>
          </GlassCard>
        </div>
        
        {/* Impact Dashboard (30% width) */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full">
            <GlassCardHeader className="pb-2">
              <div className="flex items-center">
                <BarChart4 className="mr-2 h-5 w-5 text-purple-400" />
                <GlassCardTitle gradient>{t('impactDashboard')}</GlassCardTitle>
              </div>
            </GlassCardHeader>
            <GlassCardContent>
              <ImpactDashboardRev />
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
