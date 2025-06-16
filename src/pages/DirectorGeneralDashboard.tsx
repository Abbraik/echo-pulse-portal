
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
        stability: 78,
        status: 'System operating within equilibrium thresholds'
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedPage>
      <div className="min-h-screen">
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
    </AnimatedPage>
  );
};

export default DirectorGeneralDashboard;
