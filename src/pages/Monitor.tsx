
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Monitor, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

// Import new components
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
          animate={{ y: hideHeader ? -100 : 0, opacity: 1 }}
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
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-teal-500 font-['Noto_Sans']"
                  style={{ letterSpacing: '0.05em' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  MONITOR 📊: OPERATIONAL & STRATEGIC TRACKING
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
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <Info size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Monitor key indicators, track alerts, and detect anomalies</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.header>

        {/* Zone Selector Pills */}
        <motion.div 
          className="max-w-[1440px] mx-auto px-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-center">
            <div className="flex items-center gap-2 p-2 rounded-2xl border border-white/20" 
                 style={{ background: 'rgba(20,30,50,0.6)', backdropFilter: 'blur(24px)' }}>
              {['think', 'act', 'monitor', 'learn', 'innovate'].map((zone, index) => (
                <button
                  key={zone}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 font-['Noto_Sans'] ${
                    zone === 'monitor' 
                      ? 'bg-[#00FFC3] text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Container */}
        <div className="max-w-[1440px] mx-auto px-6 pb-8 relative z-10">
          
          {/* Master Treemap Section - Top 65% */}
          <motion.section 
            className="mb-8"
            style={{ height: '65vh', minHeight: '400px' }}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <MasterTreemap className="h-full" />
          </motion.section>
          
          {/* Alert & Anomaly Section - Bottom 35% */}
          <motion.section
            className="h-[35vh] min-h-[200px]"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              {/* Universal Alert Hub - 60% width */}
              <div className="lg:col-span-3">
                <UniversalAlertHub className="h-full" />
              </div>
              
              {/* Combined Anomaly Detector - 40% width */}
              <div className="lg:col-span-2">
                <CombinedAnomalyDetector className="h-full" />
              </div>
            </div>
          </motion.section>
        </div>
      </AnimatedPage>
    </div>
  );
};

export default MonitorPage;
