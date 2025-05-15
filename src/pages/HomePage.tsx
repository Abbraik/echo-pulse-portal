
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PuffLoader } from 'react-spinners';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getKPIs, getAlerts, getActivity, getPulse } from '../api/dashboard';
import { KPI, Alert, ActivityEvent, PulseData } from '../api/dashboard';
import { useTranslation } from '@/hooks/use-translation';
import ParticlesBackground from "@/components/ui/particles-background";
import WelcomeOverlay from '../components/home/WelcomeOverlay';
import Footer from '../components/layout/Footer';

// Import new components
import HeroNarrative from "@/components/home/HeroNarrative";
import SystemStabilityGauge from "@/components/home/SystemStabilityGauge";
import ScenarioComparator from "@/components/home/ScenarioComparator";
import ActivityPanel from "@/components/home/ActivityPanel";
import AlertsPanel from "@/components/home/AlertsPanel";
import QuickActions from "@/components/home/QuickActions";
import EventsTimeline from "@/components/home/EventsTimeline";
import LanguageToggle from "@/components/home/LanguageToggle";
import ThemeToggle from "@/components/home/ThemeToggle";

import "./HomePage.css";

const HomePage: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [showWelcome, setShowWelcome] = useLocalStorage('seenWelcome', false);
  const [kpis, setKpis] = useState<KPI[] | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [pulse, setPulse] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all data in parallel
    Promise.all([
      getKPIs(),
      getAlerts(),
      getActivity(),
      getPulse()
    ]).then(([kpisData, alertsData, activityData, pulseData]) => {
      setKpis(kpisData);
      setAlerts(alertsData);
      setActivity(activityData);
      setPulse(pulseData);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    });
  }, []);

  const handleDismissWelcome = () => {
    setShowWelcome(true);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <PuffLoader color="#14B8A6" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Animated background with particles */}
      <ParticlesBackground count={40} colorStart="#14B8A680" colorEnd="#2563EB80" />
      
      {/* Welcome overlay */}
      {!showWelcome && <WelcomeOverlay onDismiss={handleDismissWelcome} />}
      
      <main className="flex-1 overflow-auto pt-24 pb-12 px-4 md:px-8 space-y-8 container mx-auto z-10">
        {/* Hero narrative - top section */}
        <section className="w-full">
          <HeroNarrative />
        </section>
        
        {/* First row - System Stability and Scenario Comparator */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* System Stability Gauge - left section (60%) */}
          <div className="lg:col-span-7">
            <SystemStabilityGauge pulse={pulse} />
          </div>
          
          {/* Scenario Comparator - right section (40%) */}
          <div className="lg:col-span-5">
            <ScenarioComparator />
          </div>
        </section>
        
        {/* Second row - Activity, Alerts, Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activity - left section (40%) */}
          <div className="lg:col-span-5">
            <ActivityPanel activities={activity} />
          </div>
          
          {/* Alerts & Recommendations - middle section (40%) */}
          <div className="lg:col-span-5">
            <AlertsPanel alerts={alerts} />
          </div>
          
          {/* Quick Actions - right section (20%) */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
        </section>
        
        {/* Third row - Events Timeline */}
        <section className="w-full">
          <EventsTimeline />
        </section>
        
        {/* Footer with language and theme toggles */}
        <section className="flex items-center justify-between mt-8">
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <p className="text-sm text-muted-foreground">
            {t('copyright')}
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
