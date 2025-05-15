
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PuffLoader } from 'react-spinners';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getKPIs, getAlerts, getActivity, getPulse } from '../api/dashboard';
import { KPI, Alert, ActivityEvent, PulseData } from '../api/dashboard';
import { useTranslation } from '@/hooks/use-translation';
import { ArrowRight, Activity, BarChart, LineChart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import KpiCarousel from '../components/home/KpiCarousel';
import SystemPulseOrb from '../components/home/SystemPulseOrb';
import AlertStream from '../components/home/AlertStream';
import ActivityTimeline from '../components/home/ActivityTimeline';
import WelcomeOverlay from '../components/home/WelcomeOverlay';
import Footer from '../components/layout/Footer';
import ParticlesBackground from '@/components/ui/particles-background';
import Gauge from '@/components/ui/custom/Gauge';
import HeroCard from "@/components/home/HeroCard";
import LoopNavigation from "@/components/home/LoopNavigation";
import ScenarioComparator from "@/components/home/ScenarioComparator";
import QuickActions from "@/components/home/QuickActions";
import EventsTimeline from "@/components/home/EventsTimeline";

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
      
      <main className="flex-1 overflow-auto px-4 md:px-8 py-6 space-y-8 pt-24 container mx-auto z-10">
        {/* Hero section with dynamic narrative card */}
        <section className="flex justify-center mb-8">
          <HeroCard />
        </section>
        
        {/* Loop Navigation */}
        <LoopNavigation />
        
        {/* Main dashboard tiles */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* System Stability Gauge */}
          <div className="lg:col-span-3">
            <ParallaxCard className="h-full">
              <GlassCard className="h-full p-6">
                <GlassCardHeader>
                  <GlassCardTitle gradient>{t('systemPulse')}</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="flex flex-col items-center justify-center">
                  <Gauge 
                    value={pulse?.stability || 75} 
                    min={0} 
                    max={100}
                    size="lg"
                    color="teal"
                    label={t('systemStability')}
                  />
                  <p className="mt-4 text-muted-foreground text-sm">
                    {pulse?.status || t('allSystemsOperational')}
                  </p>
                </GlassCardContent>
              </GlassCard>
            </ParallaxCard>
          </div>
          
          {/* Scenario Comparator */}
          <div className="lg:col-span-6">
            <ScenarioComparator />
          </div>
          
          {/* KPI Summary */}
          <div className="lg:col-span-3">
            <ParallaxCard className="h-full">
              <GlassCard className="h-full p-6">
                <GlassCardHeader>
                  <GlassCardTitle gradient>{t('kpiTitle')}</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <KpiCarousel />
                </GlassCardContent>
              </GlassCard>
            </ParallaxCard>
          </div>
        </section>
        
        {/* Secondary panels */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-3">
            <QuickActions />
          </div>
          
          {/* Alerts & Recommendations */}
          <div className="lg:col-span-5">
            <ParallaxCard className="h-full">
              <GlassCard className="h-full p-6">
                <GlassCardHeader>
                  <GlassCardTitle gradient>{t('alertStream')}</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <AlertStream alerts={alerts} />
                </GlassCardContent>
              </GlassCard>
            </ParallaxCard>
          </div>
          
          {/* Recent Activity */}
          <div className="lg:col-span-4">
            <ParallaxCard className="h-full">
              <GlassCard className="h-full p-6">
                <GlassCardHeader>
                  <GlassCardTitle gradient>{t('activityTitle')}</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <ActivityTimeline activities={activity} />
                </GlassCardContent>
              </GlassCard>
            </ParallaxCard>
          </div>
        </section>
        
        {/* Events Timeline */}
        <section className="mt-10">
          <EventsTimeline />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
