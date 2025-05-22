
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { LessonLaunchpad } from './evolutionary/LessonLaunchpad';
import { FreeformExperiment } from './evolutionary/FreeformExperiment';
import { ModelCanvas } from './evolutionary/ModelCanvas';
import { ParameterEditor } from './evolutionary/ParameterEditor';
import { SimulatorControls } from './evolutionary/SimulatorControls';
import { ImpactDashboard } from './evolutionary/ImpactDashboard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EvolutionarySandbox: React.FC = () => {
  const { t } = useTranslation();
  const [isLaunchpadOpen, setIsLaunchpadOpen] = React.useState(true);
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Lesson Launchpad & Freeform Start (20% height) */}
      <Collapsible
        open={isLaunchpadOpen}
        onOpenChange={setIsLaunchpadOpen}
        className="mb-4"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">{t('lessonLaunchpad')}</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isLaunchpadOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="overflow-hidden transition-all duration-300">
          <div className="flex gap-4 h-[20vh]">
            <div className="w-[45%] glass-panel p-4 rounded-xl">
              <LessonLaunchpad />
            </div>
            <div className="w-[45%] glass-panel p-4 rounded-xl">
              <FreeformExperiment />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Main Sandbox Area (80% height when launchpad is closed) */}
      <div className={`flex-1 flex flex-col ${isLaunchpadOpen ? 'h-[60%]' : 'h-[80%]'}`}>
        {/* Model Canvas (50% height) */}
        <div className="h-1/2 mb-4">
          <GlassCard className="h-full p-4 overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">{t('modelCanvas')}</h2>
            <div className="h-[calc(100%-2rem)]">
              <ModelCanvas />
            </div>
          </GlassCard>
        </div>
        
        {/* Controls and Dashboard (50% height) */}
        <div className="h-1/2 flex gap-4">
          <GlassCard className="w-1/3 p-4 overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">{t('parameterEditor')}</h2>
            <div className="h-[calc(100%-2rem)] overflow-y-auto">
              <ParameterEditor />
            </div>
          </GlassCard>
          
          <GlassCard className="w-1/3 p-4 overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">{t('simulatorControls')}</h2>
            <div className="h-[calc(100%-2rem)] overflow-y-auto">
              <SimulatorControls />
            </div>
          </GlassCard>
          
          <GlassCard className="w-1/3 p-4 overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">{t('impactDashboard')}</h2>
            <div className="h-[calc(100%-2rem)] overflow-y-auto">
              <ImpactDashboard />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
