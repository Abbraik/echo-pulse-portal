
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { AnimatedPage } from '@/components/ui/motion';
import ParticlesBackground from '@/components/ui/particles-background';
import HeroCard from '@/components/home/HeroCard';
import ZoneLaunchpad from '@/components/home/ZoneLaunchpad';
import QuickActions from '@/components/home/QuickActions';
import SystemStabilityGauge from '@/components/home/SystemStabilityGauge';
import KpiCarousel from '@/components/home/KpiCarousel';
import AlertsPanel from '@/components/home/AlertsPanel';
import ActivityPanel from '@/components/home/ActivityPanel';
import WelcomeOverlay from '@/components/home/WelcomeOverlay';
import { PulseData, Alert, ActivityEvent, getAlerts, getActivity } from '@/api/dashboard';

const HomePage: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [pulseData, setPulseData] = useState<PulseData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  // Check for first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('pds-hasVisited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('pds-hasVisited', 'true');
    }
  }, []);

  // Simulate loading pulse data
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
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Load alerts and activities
  useEffect(() => {
    const loadData = async () => {
      try {
        const [alertsData, activitiesData] = await Promise.all([
          getAlerts(),
          getActivity()
        ]);
        setAlerts(alertsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set empty arrays as fallback
        setAlerts([]);
        setActivities([]);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <ParticlesBackground 
        count={75}
        colorStart="#14B8A6"
        colorEnd="#3B82F6"
        minSize={1}
        maxSize={4}
        speed={0.4}
      />
      
      <AnimatedPage>
        <div className="relative z-10">
          {/* Main content with proper layering */}
          <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <HeroCard />
            </motion.div>

            {/* System Health & KPIs Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <SystemStabilityGauge pulse={pulseData} />
              <KpiCarousel />
            </motion.div>

            {/* Zone Launchpad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ZoneLaunchpad />
            </motion.div>

            {/* Quick Actions & Activity Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <QuickActions />
              <AlertsPanel alerts={alerts} />
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <ActivityPanel activities={activities} />
            </motion.div>
          </div>
        </div>

        {/* Welcome Overlay */}
        {showWelcome && (
          <WelcomeOverlay 
            open={showWelcome} 
            onClose={() => setShowWelcome(false)} 
          />
        )}
      </AnimatedPage>
    </div>
  );
};

export default HomePage;
