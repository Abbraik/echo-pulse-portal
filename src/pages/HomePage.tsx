
import React, { useEffect, useState } from "react";
import { PuffLoader } from 'react-spinners';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getKPIs, getAlerts, getActivity, getPulse } from '../api/dashboard';
import { KPI, Alert, ActivityEvent, PulseData } from '../api/dashboard';
import KpiCarousel from '../components/home/KpiCarousel';
import SystemPulseOrb from '../components/home/SystemPulseOrb';
import AlertStream from '../components/home/AlertStream';
import ZoneLaunchpad from '../components/home/ZoneLaunchpad';
import ActivityTimeline from '../components/home/ActivityTimeline';
import WelcomeOverlay from '../components/home/WelcomeOverlay';
import Footer from '../components/layout/Footer';

const HomePage: React.FC = () => {
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {!showWelcome && <WelcomeOverlay onDismiss={handleDismissWelcome} />}
      
      <main className="flex-1 overflow-auto px-6 py-4 space-y-8 pt-20">
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - KPI carousel and Activity timeline */}
          <div className="lg:col-span-2 space-y-6">
            <KpiCarousel />
            <ActivityTimeline />
          </div>
          
          {/* Right column - System pulse and alerts */}
          <div className="space-y-6">
            <SystemPulseOrb />
            <AlertStream />
          </div>
        </div>
        
        {/* Zone launchpad section */}
        <ZoneLaunchpad />
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
