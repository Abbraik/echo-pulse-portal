
import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/ui/motion';
import { useNewHealthMetrics } from '@/hooks/useNewHealthMetrics';
import { useNewBundles } from '@/hooks/useNewBundles';
import { useNewClaims } from '@/hooks/useNewClaims';
import { useCurrentProfile } from '@/hooks/useNewProfiles';
import DirectorHeader from '@/components/dashboard/DirectorHeader';
import StrategicOverview from '@/components/dashboard/StrategicOverview';
import SystemHealth from '@/components/dashboard/SystemHealth';
import ZoneSnapshots from '@/components/dashboard/ZoneSnapshots';

const DirectorGeneralDashboard: React.FC = () => {
  const { data: profile } = useCurrentProfile();
  const { data: healthMetrics } = useNewHealthMetrics();
  const { data: bundles } = useNewBundles();
  const { data: claims } = useNewClaims();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <AnimatedPage>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col min-h-screen relative z-10"
        >
          <DirectorHeader profile={profile} />

          <div className="flex-1 max-w-7xl mx-auto px-4 pb-8 w-full space-y-8">
            <StrategicOverview bundles={bundles} />
            <SystemHealth metrics={healthMetrics} />
            <ZoneSnapshots claims={claims} metrics={healthMetrics} />
          </div>
        </motion.div>
      </AnimatedPage>
    </div>
  );
};

export default DirectorGeneralDashboard;
