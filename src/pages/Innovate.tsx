
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
      <motion.div 
        className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Cinematic Header with Premium Styling */}
        <motion.header 
          className="flex-none mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div 
            className="p-6 flex items-center justify-between rounded-2xl border border-white/20 relative overflow-hidden"
            style={{
              background: 'rgba(20, 30, 50, 0.6)',
              backdropFilter: 'blur(24px)',
              boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 opacity-50"></div>
            
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-6 ${isRTL ? 'space-x-reverse' : ''} relative z-10`}>
              <motion.div 
                className="p-4 rounded-xl text-teal-400 relative"
                style={{
                  background: 'rgba(20, 184, 166, 0.2)',
                  boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.3)'
                }}
                animate={{ 
                  boxShadow: [
                    'inset 0 0 20px rgba(20, 184, 166, 0.3)',
                    'inset 0 0 30px rgba(20, 184, 166, 0.5)',
                    'inset 0 0 20px rgba(20, 184, 166, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.05 }}
              >
                <Rocket size={32} />
                {/* Subtle pulse effect */}
                <motion.div 
                  className="absolute inset-0 rounded-xl bg-teal-400/20"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
              
              <div className="text-left">
                <div className="flex items-center">
                  <motion.h1 
                    className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
                    style={{ 
                      fontFamily: 'Noto Sans', 
                      fontWeight: 'bold', 
                      letterSpacing: '0.05em' 
                    }}
                    initial={{ letterSpacing: '-0.5em', opacity: 0 }}
                    animate={{ letterSpacing: '0.05em', opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    {t('innovateZoneTitle')}: {t('systemRedesignHub')}
                  </motion.h1>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="icon" className="ml-3 h-8 w-8 text-platinum hover:bg-teal-500/20">
                          <Info size={20} />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{t('innovateZoneDescription')}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <motion.p 
                  className="text-lg text-gray-300 mt-2"
                  style={{ fontFamily: 'Noto Sans', fontWeight: 'medium' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  {t('systemRedesignSubtitle')}
                </motion.p>
              </div>
            </div>
            
            <motion.div 
              className="flex space-x-2 relative z-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" className="flex items-center gap-1 glass-panel-deep">
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
                  <Button size="sm" variant="outline" className="flex items-center gap-1 glass-panel-deep">
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
                  <Button size="sm" className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600">
                    <Rocket size={16} />
                    <span>{t('promoteBlueprintButton')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('promoteBlueprintTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>

            {/* Premium border gradient */}
            <motion.div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(45deg, rgba(20, 184, 166, 0.3), rgba(37, 99, 235, 0.3), rgba(20, 184, 166, 0.3))',
                backgroundSize: '300% 300%'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.header>
        
        {/* Main content area with enhanced design hub */}
        <motion.div 
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <InnovateDesignHub mode="moonshot" />
        </motion.div>
        
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

        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-teal-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-20, -60, -20],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatedPage>
  );
};

export default Innovate;
