
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Monitor, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

// Import existing components
import MasterTreemap from '@/components/monitor/MasterTreemap';
import UniversalAlertHub from '@/components/monitor/UniversalAlertHub';
import CombinedAnomalyDetector from '@/components/monitor/CombinedAnomalyDetector';

const MonitorPage: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll behavior for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHideHeader(currentScrollY > lastScrollY && currentScrollY > 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Vertical Gradient */}
      <div className="fixed inset-0 z-0" style={{
        background: 'linear-gradient(180deg, #0A1632 0%, #081226 100%)'
      }}>
        {/* Particle Field Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300FFC3' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'drift 20s ease-in-out infinite'
        }}>
        </div>
        {/* Additional atmospheric layers */}
        <div className="absolute inset-0 bg-gradient-radial from-teal-500/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
      </div>

      <AnimatedPage>
        {/* Enhanced Cinematic Header Bar */}
        <motion.header 
          className="sticky top-0 z-50 w-full backdrop-blur-[32px] py-4 px-8 mb-8"
          style={{
            background: 'rgba(10, 20, 40, 0.8)',
            borderBottom: '1px solid rgba(0, 255, 195, 0.3)',
            boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: hideHeader ? -100 : 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="p-3 rounded-2xl"
                style={{
                  background: 'rgba(138, 43, 226, 0.3)',
                  boxShadow: '0 0 12px rgba(138, 43, 226, 0.4)'
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Monitor size={28} className="text-purple-300" />
              </motion.div>
              <div className="text-left">
                <motion.h1 
                  className="text-3xl font-bold text-white font-['Noto_Sans']"
                  style={{ 
                    letterSpacing: '0.05em',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
                    background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  MONITOR ▮ : OPERATIONAL & STRATEGIC TRACKING
                </motion.h1>
                <motion.p 
                  className="text-base text-gray-300 font-['Noto_Sans']"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Real-time system health and performance insights
                </motion.p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Info size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Monitor key indicators, track alerts, and detect anomalies</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.header>

        {/* Enhanced Zone Selector Pills */}
        <motion.div 
          className="max-w-[1440px] mx-auto px-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-center">
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-white/20" 
                 style={{ 
                   background: 'rgba(10, 20, 40, 0.45)', 
                   backdropFilter: 'blur(24px)',
                   boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)'
                 }}>
              {['think', 'act', 'monitor', 'learn', 'innovate'].map((zone, index) => (
                <button
                  key={zone}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 font-['Noto_Sans'] ${
                    zone === 'monitor' 
                      ? 'bg-[#00FFC3] text-[#081226] shadow-[0_0_8px_rgba(0,255,195,0.6)]' 
                      : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)] text-[#E0E0E0] hover:bg-[rgba(255,255,255,0.10)] hover:text-white'
                  }`}
                  style={zone === 'monitor' ? { 
                    boxShadow: '0 0 8px rgba(0,255,195,0.6)' 
                  } : {}}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Container with Enhanced Spacing */}
        <div className="max-w-[1440px] mx-auto px-8 pb-8 relative z-10">
          
          {/* Master Treemap Section - Enhanced Glass Design */}
          <motion.section 
            className="mb-6"
            style={{ height: '65vh', minHeight: '400px' }}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <MasterTreemap className="h-full" />
          </motion.section>
          
          {/* Alert & Anomaly Section with Enhanced Spacing */}
          <motion.section
            className="h-[35vh] min-h-[240px]"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              {/* Universal Alert Hub - Enhanced Design */}
              <div className="lg:col-span-3">
                <UniversalAlertHub className="h-full" />
              </div>
              
              {/* Combined Anomaly Detector - Enhanced Design */}
              <div className="lg:col-span-2">
                <CombinedAnomalyDetector className="h-full" />
              </div>
            </div>
          </motion.section>
        </div>
      </AnimatedPage>

      {/* CSS for particle drift animation */}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-3px); }
          75% { transform: translateY(-15px) translateX(8px); }
        }
      `}</style>
    </div>
  );
};

export default MonitorPage;
