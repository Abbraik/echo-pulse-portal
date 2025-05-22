
import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Lightbulb, Info, Layout, Activity, Calendar, Bot, MousePointer, Zap, FlaskConical, GitBranch } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { EvolutionarySandbox } from '@/components/innovate/EvolutionarySandbox';
import { RevolutionarySandbox } from '@/components/innovate/RevolutionarySandbox';

const Innovate: React.FC = () => {
  const [activeTab, setActiveTab] = useState('evolutionary');
  const { t, isRTL } = useTranslation();

  return (
    <AnimatedPage>
      <div className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
        <header className="mb-6">
          <div className="glass-panel p-6 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
              <Lightbulb size={24} />
            </div>
            <div className="text-left">
              <div className="flex items-center">
                <h1 className="text-3xl font-extrabold">
                  {t('innovateZoneTitle')}: {t('evolutionaryRevolutionaryParadigms')}
                </h1>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                      <Info size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{t('innovateZoneDescription')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-gray-400">
                {t('innovateZoneDesc')}
              </p>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs 
            defaultValue="evolutionary" 
            className="w-full h-full flex flex-col" 
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="evolutionary"
                className={`text-sm font-medium py-3 flex items-center justify-center gap-2 ${
                  activeTab === 'evolutionary' ? 'bg-teal-500/30 text-teal-300' : ''
                }`}
              >
                <FlaskConical size={16} />
                {t('evolutionarySandbox')}
              </TabsTrigger>
              <TabsTrigger
                value="revolutionary"
                className={`text-sm font-medium py-3 flex items-center justify-center gap-2 ${
                  activeTab === 'revolutionary' ? 'bg-purple-500/30 text-purple-300' : ''
                }`}
              >
                <Zap size={16} />
                {t('revolutionarySandbox')}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              {/* Evolutionary Sandbox Content */}
              <TabsContent value="evolutionary" className="mt-0 h-full">
                <EvolutionarySandbox />
              </TabsContent>
              
              {/* Revolutionary Sandbox Content */}
              <TabsContent value="revolutionary" className="mt-0 h-full">
                <RevolutionarySandbox />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Innovate;
