
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { 
  Monitor, Info, Settings, Maximize2, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import LoopNavigation from '@/components/home/LoopNavigation';

// Import new components
import { StrategicOutcomesPanel } from '@/components/monitor/StrategicOutcomesPanel';
import { OperationalHealthPanel } from '@/components/monitor/OperationalHealthPanel';
import { useFullscreenPanel } from '@/hooks/use-fullscreen-panel';

const MonitorPage: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [strategicPanelExpanded, setStrategicPanelExpanded] = useState(false);
  const [operationalPanelExpanded, setOperationalPanelExpanded] = useState(false);
  const [hoverDebounce, setHoverDebounce] = useState<NodeJS.Timeout | null>(null);
  const { fullscreenPanel, toggleFullscreen, exitFullscreen, isFullscreen } = useFullscreenPanel();

  // Handle hover-driven resizing with debounce
  const handlePanelHover = (panelType: 'strategic' | 'operational', isHovering: boolean) => {
    if (hoverDebounce) {
      clearTimeout(hoverDebounce);
    }

    const timeout = setTimeout(() => {
      if (isHovering) {
        if (panelType === 'strategic') {
          setStrategicPanelExpanded(true);
          setOperationalPanelExpanded(false);
        } else {
          setOperationalPanelExpanded(true);
          setStrategicPanelExpanded(false);
        }
      } else {
        setStrategicPanelExpanded(false);
        setOperationalPanelExpanded(false);
      }
    }, 100);

    setHoverDebounce(timeout);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (hoverDebounce) {
        clearTimeout(hoverDebounce);
      }
    };
  }, [hoverDebounce]);

  // Handle escape key for fullscreen exit
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenPanel) {
        exitFullscreen();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [fullscreenPanel, exitFullscreen]);

  const getStrategicPanelHeight = () => {
    if (strategicPanelExpanded) return '65%';
    if (operationalPanelExpanded) return '35%';
    return '50%';
  };

  const getOperationalPanelHeight = () => {
    if (operationalPanelExpanded) return '65%';
    if (strategicPanelExpanded) return '35%';
    return '50%';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced cinematic background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
      </div>

      <AnimatedPage>
        {/* Cinematic Header Bar */}
        <motion.header 
          className="sticky top-0 z-50 w-full backdrop-blur-[24px] py-4 px-6 mb-8"
          style={{
            background: 'rgba(20, 30, 50, 0.6)',
            borderBottom: '1px solid rgba(20, 184, 166, 0.3)',
            boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="p-3 rounded-2xl bg-purple-500/20 text-purple-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Monitor size={28} />
              </motion.div>
              <div className="text-left">
                <motion.h1 
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-teal-500 font-noto-bold"
                  style={{ letterSpacing: '0.05em' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  MONITOR 📊: {t("operationalStrategicTracking", { defaultValue: "OPERATIONAL & STRATEGIC TRACKING" })}
                </motion.h1>
                <motion.p 
                  className="text-base text-gray-300 font-noto-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {t("monitorCoreDesc", { defaultValue: "Real-time system health and performance insights" })}
                </motion.p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <Info size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{t('monitorTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.header>

        {/* Main Content Container */}
        <div className="max-w-[1440px] mx-auto px-6 pb-8 relative z-10">
          {/* Loop Navigation Ribbon */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LoopNavigation />
          </motion.div>
          
          {/* Two-Tiered Dashboard Container */}
          <div className="relative h-[800px] w-full">
            {/* Strategic Outcomes Panel (Top) */}
            <motion.div
              className="absolute top-0 left-0 right-0 transition-all duration-300 ease-out"
              style={{ 
                height: getStrategicPanelHeight(),
                willChange: 'transform, opacity'
              }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onMouseEnter={() => handlePanelHover('strategic', true)}
              onMouseLeave={() => handlePanelHover('strategic', false)}
            >
              <div 
                className="w-full h-full rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
                style={{
                  background: 'rgba(10, 20, 40, 0.6)',
                  boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Panel Header */}
                <div className="h-10 px-6 py-2 flex items-center justify-between border-b border-white/10">
                  <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-noto-bold">
                    Strategic Outcomes
                  </h2>
                  <div className="flex items-center space-x-2">
                    {/* Data refresh indicator */}
                    <motion.div
                      className="w-2 h-2 rounded-full bg-teal-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-teal-400"
                          onClick={() => toggleFullscreen('strategic' as any)}
                        >
                          <Maximize2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Full Screen</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                
                {/* Panel Content */}
                <div className="h-[calc(100%-40px)] p-6 overflow-auto">
                  <StrategicOutcomesPanel />
                </div>
              </div>
            </motion.div>

            {/* Operational Health Panel (Bottom) */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 transition-all duration-300 ease-out"
              style={{ 
                height: getOperationalPanelHeight(),
                willChange: 'transform, opacity'
              }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onMouseEnter={() => handlePanelHover('operational', true)}
              onMouseLeave={() => handlePanelHover('operational', false)}
            >
              <div 
                className="w-full h-full rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
                style={{
                  background: 'rgba(10, 20, 40, 0.6)',
                  boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Panel Header */}
                <div className="h-10 px-6 py-2 flex items-center justify-between border-b border-white/10">
                  <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-noto-bold">
                    Operational Health
                  </h2>
                  <div className="flex items-center space-x-2">
                    {/* Data refresh indicator */}
                    <motion.div
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-blue-400"
                          onClick={() => toggleFullscreen('operational' as any)}
                        >
                          <Maximize2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Full Screen</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                
                {/* Panel Content */}
                <div className="h-[calc(100%-40px)] p-6 overflow-auto">
                  <OperationalHealthPanel />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Fullscreen Overlay */}
        {fullscreenPanel && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => exitFullscreen()}
          >
            <motion.div
              className="absolute inset-4 rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden"
              style={{
                background: 'rgba(10, 20, 40, 0.8)',
                boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fullscreen Header */}
              <div className="h-16 px-6 py-4 flex items-center justify-between border-b border-white/10">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-noto-bold">
                  {fullscreenPanel === 'strategic' ? 'Strategic Outcomes' : 'Operational Health'}
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-red-400"
                  onClick={() => exitFullscreen()}
                >
                  <X size={20} />
                </Button>
              </div>
              
              {/* Fullscreen Content */}
              <div className="h-[calc(100%-64px)] p-6 overflow-auto">
                {fullscreenPanel === 'strategic' ? <StrategicOutcomesPanel /> : <OperationalHealthPanel />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatedPage>
    </div>
  );
};

export default MonitorPage;
