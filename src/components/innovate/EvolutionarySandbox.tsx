
import React, { useState } from 'react';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, MousePointer, Play, Save, BookOpen, BarChart4 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { ParameterEditor } from './evolutionary/ParameterEditor';
import { SimulatorControls } from './evolutionary/SimulatorControls';
import { ImpactDashboard } from './evolutionary/ImpactDashboard';

export const EvolutionarySandbox: React.FC = () => {
  const { t } = useTranslation();
  const [isCanvasCollapsed, setIsCanvasCollapsed] = useState(false);
  const [isParametersCollapsed, setIsParametersCollapsed] = useState(false);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto pb-6">
      {/* Canvas + Parameters (Left Column) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Canvas Panel */}
        <Collapsible open={!isCanvasCollapsed} onOpenChange={setIsCanvasCollapsed}>
          <GlassCard className="overflow-hidden">
            <GlassCardHeader className="flex justify-between items-center pb-2">
              <div className="flex items-center">
                <MousePointer className="mr-2 h-5 w-5 text-teal-400" />
                <GlassCardTitle gradient>{t('modelCanvas')}</GlassCardTitle>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isCanvasCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Button>
              </CollapsibleTrigger>
            </GlassCardHeader>
            <CollapsibleContent>
              <GlassCardContent>
                <div className="bg-gray-900/50 border border-white/10 rounded-lg h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">{t('dragElementsToCreateModel')}</p>
                    <div className="flex space-x-2 justify-center">
                      <Button variant="outline" size="sm" className="text-xs">
                        {t('addStock')}
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        {t('addFlow')}
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        {t('addVariable')}
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </CollapsibleContent>
          </GlassCard>
        </Collapsible>
        
        {/* Parameter Editor Panel */}
        <Collapsible open={!isParametersCollapsed} onOpenChange={setIsParametersCollapsed}>
          <GlassCard>
            <GlassCardHeader className="flex justify-between items-center pb-2">
              <div className="flex items-center">
                <BarChart4 className="mr-2 h-5 w-5 text-teal-400" />
                <GlassCardTitle gradient>{t('parameterEditor')}</GlassCardTitle>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isParametersCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Button>
              </CollapsibleTrigger>
            </GlassCardHeader>
            <CollapsibleContent>
              <GlassCardContent>
                <ParameterEditor />
              </GlassCardContent>
            </CollapsibleContent>
          </GlassCard>
        </Collapsible>
        
        {/* Simulator Controls Panel */}
        <Collapsible open={!isControlsCollapsed} onOpenChange={setIsControlsCollapsed}>
          <GlassCard>
            <GlassCardHeader className="flex justify-between items-center pb-2">
              <div className="flex items-center">
                <Play className="mr-2 h-5 w-5 text-teal-400" />
                <GlassCardTitle gradient>{t('simulatorControls')}</GlassCardTitle>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isControlsCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Button>
              </CollapsibleTrigger>
            </GlassCardHeader>
            <CollapsibleContent>
              <GlassCardContent>
                <SimulatorControls />
              </GlassCardContent>
            </CollapsibleContent>
          </GlassCard>
        </Collapsible>
      </div>
      
      {/* Right Column - Impact Dashboard */}
      <div>
        <Collapsible open={!isDashboardCollapsed} onOpenChange={setIsDashboardCollapsed} className="h-full">
          <GlassCard className="h-full">
            <GlassCardHeader className="flex justify-between items-center pb-2">
              <div className="flex items-center">
                <BarChart4 className="mr-2 h-5 w-5 text-teal-400" />
                <GlassCardTitle gradient>{t('impactDashboard')}</GlassCardTitle>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isDashboardCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Button>
              </CollapsibleTrigger>
            </GlassCardHeader>
            <CollapsibleContent>
              <GlassCardContent className="h-[calc(100%-4rem)]">
                <ImpactDashboard />
                
                <div className="mt-6 space-y-2">
                  <Button className="w-full bg-teal-600 hover:bg-teal-500 flex items-center">
                    <Save size={16} className="mr-2" />
                    {t('saveAsPlaybook')}
                  </Button>
                  <Button variant="outline" className="w-full flex items-center">
                    <BookOpen size={16} className="mr-2" />
                    {t('publishToLibrary')}
                  </Button>
                </div>
              </GlassCardContent>
            </CollapsibleContent>
          </GlassCard>
        </Collapsible>
      </div>
    </div>
  );
};
