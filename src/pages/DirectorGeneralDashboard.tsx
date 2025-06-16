
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { AnimatedPage } from '@/components/ui/motion';
import DirectorHeader from '@/components/dashboard/DirectorHeader';
import StrategicOverview from '@/components/dashboard/StrategicOverview';
import ThinkSnapshot from '@/components/dashboard/ThinkSnapshot';
import ActSnapshot from '@/components/dashboard/ActSnapshot';
import LearnSnapshot from '@/components/dashboard/LearnSnapshot';
import InnovateSnapshot from '@/components/dashboard/InnovateSnapshot';
import MonitorSnapshot from '@/components/dashboard/MonitorSnapshot';
import SystemStabilityGauge from '@/components/home/SystemStabilityGauge';
import KpiCarousel from '@/components/home/KpiCarousel';
import { PulseData } from '@/api/dashboard';

const DirectorGeneralDashboard: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [viewMode, setViewMode] = useState<'classic' | 'enhanced'>('enhanced');
  const [isLoading, setIsLoading] = useState(true);
  const [pulseData, setPulseData] = useState<PulseData | null>(null);

  // Simulate loading and data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setPulseData({
        id: 1,
        timestamp: new Date().toISOString(),
        level: 78,
        performance: 92,
        stability: 78,
        status: 'System operating within equilibrium thresholds'
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <DirectorHeader 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            isLoading={isLoading}
          />

          {/* Main Dashboard Content */}
          <div className="max-w-[1600px] mx-auto p-6 space-y-6">
            {/* Strategic Overview - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full"
            >
              <StrategicOverview />
            </motion.div>

            {/* System Health Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <SystemStabilityGauge pulse={pulseData} />
              <KpiCarousel />
            </motion.div>

            {/* Zone Snapshots Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            >
              <div className="lg:col-span-1">
                <ThinkSnapshot />
              </div>
              <div className="lg:col-span-1">
                <ActSnapshot />
              </div>
              <div className="lg:col-span-1">
                <LearnSnapshot />
              </div>
              <div className="lg:col-span-1">
                <InnovateSnapshot />
              </div>
              <div className="lg:col-span-1">
                <MonitorSnapshot />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default DirectorGeneralDashboard;
