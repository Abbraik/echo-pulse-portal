
import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Lightbulb, Info, Archive, Rocket, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GlassCard } from '@/components/ui/glass-card';
import { InnovateDesignHub } from '@/components/innovate/InnovateDesignHub';
import { FabButton } from '@/components/innovate/FabButton';
import { MetaDesignModal } from '@/components/innovate/MetaDesignModal';
import { motion } from 'framer-motion';

const Innovate: React.FC = () => {
  const [isMetaDesignOpen, setIsMetaDesignOpen] = useState(false);
  const { t, isRTL } = useTranslation();

  return (
    <AnimatedPage>
      <div className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
        {/* Cinematic Header */}
        <motion.header 
          className="flex-none mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="glass-panel-cinematic p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.div 
                  className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/30 to-teal-500/30 text-teal-300 border border-teal-400/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lightbulb size={32} />
                </motion.div>
                <div className="text-left">
                  <div className="flex items-center">
                    <h1 className="font-noto-bold text-teal-300 text-3xl leading-tight">
                      {t('innovateZoneTitle')} 🚀: {t('systemRedesignHub')}
                    </h1>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-3 h-8 w-8 text-teal-400 hover:text-teal-300">
                          <Info size={18} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="glass-panel-deep border-teal-400/30">
                        <p className="max-w-xs font-noto-regular text-gray-200">{t('innovateZoneDescription')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="font-noto-medium text-gray-300 mt-1">Design & R&D Innovation Hub</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-panel border-teal-400/30 hover:border-teal-300/50 text-teal-300 hover:text-teal-200 transition-all duration-300"
                    >
                      <RefreshCw size={16} className="mr-2" />
                      <span className="font-noto-medium">{t('scenarioForkButton')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('scenarioForkTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-panel border-blue-400/30 hover:border-blue-300/50 text-blue-300 hover:text-blue-200 transition-all duration-300"
                    >
                      <Archive size={16} className="mr-2" />
                      <span className="font-noto-medium">{t('archiveScenarioButton')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('archiveScenarioTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-panel border-gold-400/30 hover:border-gold-300/50 text-gold-300 hover:text-gold-200 transition-all duration-300"
                    >
                      <Rocket size={16} className="mr-2" />
                      <span className="font-noto-medium">{t('promoteBlueprintButton')}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('promoteBlueprintTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </motion.header>
        
        {/* Main content area with cinematic entrance */}
        <motion.div 
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <InnovateDesignHub mode="moonshot" />
        </motion.div>
        
        {/* Enhanced Floating Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <FabButton 
            onClick={() => setIsMetaDesignOpen(true)}
            tooltip={t('generateMetaDesignBlueprint')}
            icon={<Rocket size={20} />}
          />
        </motion.div>
        
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
