
import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Lightbulb, Info, Zap, FlaskConical, Archive, Rocket, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GlassCard } from '@/components/ui/glass-card';
import { EvolutionarySandbox } from '@/components/innovate/EvolutionarySandbox';
import { RevolutionarySandbox } from '@/components/innovate/RevolutionarySandbox';
import { ScenarioLibrary } from '@/components/innovate/ScenarioLibrary';
import { FabButton } from '@/components/innovate/FabButton';
import { MetaDesignModal } from '@/components/innovate/MetaDesignModal';

const Innovate: React.FC = () => {
  const [activeTab, setActiveTab] = useState('evolutionary');
  const [isMetaDesignOpen, setIsMetaDesignOpen] = useState(false);
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
            
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Evolutionary Sandbox Content */}
              <TabsContent value="evolutionary" className="mt-0 h-full flex-1 flex flex-col">
                <EvolutionarySandbox />
              </TabsContent>
              
              {/* Revolutionary Sandbox Content */}
              <TabsContent value="revolutionary" className="mt-0 h-full flex-1 flex flex-col">
                <RevolutionarySandbox />
              </TabsContent>
            </div>
          </Tabs>
          
          {/* Shared Scenario Library - Always visible */}
          <div className="h-[20%] mt-4">
            <ScenarioLibrary />
          </div>
        </div>
        
        {/* Floating Action Button for Meta Design Blueprint Generator */}
        <FabButton 
          onClick={() => setIsMetaDesignOpen(true)}
          tooltip={t('generateMetaDesignBlueprint')}
          icon={<Rocket size={20} />}
        />
        
        {/* Meta Design Blueprint Generator Modal */}
        <MetaDesignModal 
          open={isMetaDesignOpen} 
          onOpenChange={setIsMetaDesignOpen} 
        />
      </div>
    </AnimatedPage>
  );
};

export default Innovate;
