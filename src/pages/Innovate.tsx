
import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Lightbulb, Info, Zap, FlaskConical, Archive, Rocket, RefreshCw, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GlassCard } from '@/components/ui/glass-card';
import { InnovateDesignHub } from '@/components/innovate/InnovateDesignHub';
import { FabButton } from '@/components/innovate/FabButton';
import { MetaDesignModal } from '@/components/innovate/MetaDesignModal';

const Innovate: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'lesson-driven' | 'freeform' | 'moonshot'>('moonshot');
  const [isMetaDesignOpen, setIsMetaDesignOpen] = useState(false);
  const { t, isRTL } = useTranslation();

  return (
    <AnimatedPage>
      <div className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
        {/* Header with title and mode selector */}
        <header className="flex-none mb-4">
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                  <Lightbulb size={24} />
                </div>
                <div className="text-left">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-extrabold">
                      {t('innovateZoneTitle')}: {t('systemRedesignHub')}
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
                  <div className="flex mt-3">
                    <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'lesson-driven' | 'freeform' | 'moonshot')}>
                      <TabsList className="grid w-auto grid-cols-3 bg-background/30">
                        <TabsTrigger
                          value="lesson-driven"
                          className={`${activeMode === 'lesson-driven' ? 'bg-teal-500/30 text-teal-300' : ''} 
                            flex items-center gap-2 px-4 py-1`}
                        >
                          <BookOpen size={16} />
                          {t('lessonDrivenMode')}
                        </TabsTrigger>
                        <TabsTrigger
                          value="freeform"
                          className={`${activeMode === 'freeform' ? 'bg-blue-500/30 text-blue-300' : ''} 
                            flex items-center gap-2 px-4 py-1`}
                        >
                          <FlaskConical size={16} />
                          {t('freeformMode')}
                        </TabsTrigger>
                        <TabsTrigger
                          value="moonshot"
                          className={`${activeMode === 'moonshot' ? 'bg-purple-500/30 text-purple-300' : ''} 
                            flex items-center gap-2 px-4 py-1`}
                        >
                          <Zap size={16} />
                          {t('moonshotModeText')}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <RefreshCw size={16} />
                      <span>{t('scenarioForkButton')}</span>
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
                      <span>{t('archiveScenarioButton')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('archiveScenarioTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Rocket size={16} />
                      <span>{t('promoteBlueprintButton')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('promoteBlueprintTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          <InnovateDesignHub mode={activeMode} />
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
