
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import ParticlesBackground from '@/components/ui/particles-background';
import DirectorHeader from '@/components/dashboard/DirectorHeader';
import StrategicOverview from '@/components/dashboard/StrategicOverview';
import ThinkSnapshot from '@/components/dashboard/ThinkSnapshot';
import ActSnapshot from '@/components/dashboard/ActSnapshot';
import MonitorSnapshot from '@/components/dashboard/MonitorSnapshot';
import LearnSnapshot from '@/components/dashboard/LearnSnapshot';
import InnovateSnapshot from '@/components/dashboard/InnovateSnapshot';
import GlobalUtilities from '@/components/dashboard/GlobalUtilities';
import { getDashboardData } from '@/api/dashboard';

const DirectorGeneralDashboard: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 bg-teal-500/20 rounded-full animate-pulse blur-xl"></div>
          <div className="relative z-10 h-full w-full rounded-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Animated background */}
      <ParticlesBackground count={60} colorStart="#14B8A680" colorEnd="#2563EB80" />
      
      {/* Main Dashboard Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Director Header with Role Banner */}
        <DirectorHeader />
        
        {/* Main Content Grid */}
        <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
          {/* Strategic Overview - Top 40% of viewport */}
          <motion.section 
            className="h-[40vh] min-h-[400px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StrategicOverview data={dashboardData?.strategic} />
          </motion.section>
          
          {/* Zone Snapshots Grid - Remaining space */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            {/* THINK and ACT - Top Row */}
            <motion.section 
              className="lg:col-span-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ThinkSnapshot data={dashboardData?.think} />
            </motion.section>
            
            <motion.section 
              className="lg:col-span-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ActSnapshot data={dashboardData?.act} />
            </motion.section>
            
            {/* MONITOR, LEARN, INNOVATE - Bottom Row */}
            <motion.section 
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MonitorSnapshot data={dashboardData?.monitor} />
            </motion.section>
            
            <motion.section 
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <LearnSnapshot data={dashboardData?.learn} />
            </motion.section>
            
            <motion.section 
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <InnovateSnapshot data={dashboardData?.innovate} />
            </motion.section>
          </div>
        </main>
        
        {/* Global Utilities Footer */}
        <GlobalUtilities />
      </div>
    </div>
  );
};

export default DirectorGeneralDashboard;
