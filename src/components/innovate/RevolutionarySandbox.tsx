
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Archive, Rocket, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScenarioFork } from './revolutionary/ScenarioFork';
import { ParameterControls } from './revolutionary/ParameterControls';
import { ImpactDashboardRev } from './revolutionary/ImpactDashboardRev';
import { ComparativeInnovationDashboard } from './revolutionary/ComparativeInnovationDashboard';
import { CoCreationForum } from './revolutionary/CoCreationForum';

export const RevolutionarySandbox: React.FC = () => {
  const { t } = useTranslation();
  const [engineMode, setEngineMode] = useState('system-dynamics');
  const [showCoDashboard, setShowCoDashboard] = useState(false);
  const [showCoForum, setShowCoForum] = useState(false);
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with actions */}
      <div className="glass-panel p-4 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('revolutionarySandbox')}</h2>
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
      
      {/* Engine Mode Switcher */}
      <div className="mb-4">
        <Tabs value={engineMode} onValueChange={setEngineMode}>
          <TabsList className="glass-panel">
            <TabsTrigger value="system-dynamics">{t('systemDynamics')}</TabsTrigger>
            <TabsTrigger value="agent-based">{t('agentBased')}</TabsTrigger>
            <TabsTrigger value="econometric">{t('econometric')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Main Scenario Runner (50% height) */}
      <div className="flex gap-4 h-[50%] mb-4">
        {/* Scenario Fork Tool (25% width) */}
        <GlassCard className="w-1/4 p-4 overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">{t('scenarioFork')}</h3>
          <div className="h-[calc(100%-2rem)] overflow-y-auto">
            <ScenarioFork />
          </div>
        </GlassCard>
        
        {/* Parameter Controls (45% width) */}
        <GlassCard className="w-[45%] p-4 overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">{t('parameterControls')}</h3>
          <div className="h-[calc(100%-2rem)] overflow-y-auto">
            <ParameterControls />
          </div>
        </GlassCard>
        
        {/* Impact Dashboard (30% width) */}
        <GlassCard className="w-[30%] p-4 overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">{t('impactDashboard')}</h3>
          <div className="h-[calc(100%-2rem)] overflow-y-auto">
            <ImpactDashboardRev />
          </div>
        </GlassCard>
      </div>
      
      {/* Expandable Panels */}
      <div className="flex gap-4">
        <Button 
          onClick={() => setShowCoDashboard(!showCoDashboard)} 
          variant={showCoDashboard ? "default" : "outline"}
          className="flex items-center gap-1"
        >
          {t('comparativeInnovationDashboard')}
        </Button>
        <Button 
          onClick={() => setShowCoForum(!showCoForum)} 
          variant={showCoForum ? "default" : "outline"}
          className="flex items-center gap-1"
        >
          {t('futuresCoCreationForum')}
        </Button>
      </div>
      
      {/* Conditional Expandable Panels */}
      {showCoDashboard && (
        <div className="mt-4 h-[30%]">
          <GlassCard className="h-full p-4 overflow-hidden">
            <ComparativeInnovationDashboard />
          </GlassCard>
        </div>
      )}
      
      {showCoForum && (
        <div className="mt-4 h-[30%]">
          <GlassCard className="h-full p-4 overflow-hidden">
            <CoCreationForum />
          </GlassCard>
        </div>
      )}
    </div>
  );
};
