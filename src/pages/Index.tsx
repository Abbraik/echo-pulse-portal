
import React, { useEffect } from 'react';
import { Staggered } from '@/components/ui/motion';
import KpiCarousel from '@/components/home/KpiCarousel';
import SystemPulseOrb from '@/components/home/SystemPulseOrb';
import AlertStream from '@/components/home/AlertStream';
import ZoneLaunchpad from '@/components/home/ZoneLaunchpad';
import ActivityStrip from '@/components/home/ActivityStrip';
import ActivityTimeline from '@/components/home/ActivityTimeline';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  // Current system phase indicator
  const currentPhase = {
    name: "Optimization",
    color: "from-teal-500 to-teal-400"
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Hero section with animated gradient header */}
      <header className="glass-panel py-8 px-6 relative overflow-hidden mb-8">
        <div className="absolute -inset-1/2 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full blur-3xl transform -rotate-12 pointer-events-none"></div>
        
        <Staggered>
          <motion.h1 
            className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Population Dynamics System
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Analyze, strategize, and optimize population dynamics with real-time insights and collaborative tools
          </motion.p>
          
          <motion.div 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-teal-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className={`inline-block h-3 w-3 rounded-full bg-gradient-to-r ${currentPhase.color} animate-pulse`}></span>
            <span>Current Phase: <span className="font-medium text-white">{currentPhase.name}</span></span>
          </motion.div>
        </Staggered>
      </header>

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
      
      {/* Activity stream at the bottom */}
      <div className="mt-8">
        <ActivityStrip />
      </div>
    </div>
  );
};

export default Index;
