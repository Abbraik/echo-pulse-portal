import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Lightbulb, Info, Archive, Rocket, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { useUIContent } from '@/hooks/use-ui-content';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GlassCard } from '@/components/ui/glass-card';
import ParticlesBackground from '@/components/ui/particles-background';
import { InnovateDesignHub } from '@/components/innovate/InnovateDesignHub';
import { FabButton } from '@/components/innovate/FabButton';
import { MetaDesignModal } from '@/components/innovate/MetaDesignModal';
import { motion } from 'framer-motion';

const Innovate: React.FC = () => {
  const [isMetaDesignOpen, setIsMetaDesignOpen] = useState(false);
  const { t, isRTL } = useTranslation();
  const { getContent } = useUIContent('innovate');

  return (
    <AnimatedPage>
      <div className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden relative">
        <ParticlesBackground 
          count={50}
          colorStart="#8B5CF6"
          colorEnd="#14B8A6"
          minSize={2}
          maxSize={5}
          speed={0.4}
        />
        
        {/* Cinematic Header */}
        <motion.header 
          className="flex-none mb-6 relative z-10"
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
                      {getContent('innovate.zone_title', 'INNOVATE ZONE')} 🚀: {getContent('innovate.system_redesign_hub', 'System Redesign Hub')}
                    </h1>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-3 h-8 w-8 text-teal-400 hover:text-teal-300">
                          <Info size={18} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="glass-panel-deep border-teal-400/30">
                        <p className="max-w-xs font-noto-regular text-gray-200">
                          {getContent('innovate.zone_description', 'Advanced innovation and system redesign workspace for breakthrough solutions')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="font-noto-medium text-gray-300 mt-1">
                    {getContent('zones.innovate.description', 'Design & R&D Innovation Hub')}
                  </p>
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
                      <span className="font-noto-medium">
                        {getContent('innovate.scenario_fork_button', 'Fork Scenario')}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getContent('innovate.scenario_fork_tooltip', 'Create a new scenario branch for experimentation')}</p>
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
                      <span className="font-noto-medium">
                        {getContent('innovate.archive_scenario_button', 'Archive')}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getContent('innovate.archive_scenario_tooltip', 'Archive this scenario for future reference')}</p>
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
                      <span className="font-noto-medium">
                        {getContent('innovate.promote_blueprint_button', 'Promote')}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getContent('innovate.promote_blueprint_tooltip', 'Promote this blueprint to implementation')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </motion.header>
        
        {/* Main content area with cinematic entrance */}
        <motion.div 
          className="flex-1 overflow-hidden relative z-10"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <InnovateDesignHub mode="moonshot" />
        </motion.div>
        
        {/* Enhanced Floating Action Button */}
        <motion.div
          className="relative z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <FabButton 
            onClick={() => setIsMetaDesignOpen(true)}
            tooltip={getContent('innovate.generate_meta_design_blueprint', 'Generate Meta Design Blueprint')}
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
