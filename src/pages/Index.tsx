
import React from 'react';
import { Staggered } from '@/components/ui/motion';
import KpiCarousel from '@/components/home/KpiCarousel';
import SystemPulseOrb from '@/components/home/SystemPulseOrb';
import AlertStream from '@/components/home/AlertStream';
import ZoneLaunchpad from '@/components/home/ZoneLaunchpad';
import ActivityStrip from '@/components/home/ActivityStrip';

const Index: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      <header>
        <Staggered>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500 mb-2">
            Population Dynamics System
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Analyze, strategize, and optimize population dynamics with real-time insights and collaborative tools.
          </p>
        </Staggered>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <KpiCarousel />
        </div>
        <div>
          <SystemPulseOrb />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <AlertStream />
        </div>
        <div className="md:col-span-2">
          <ActivityStrip />
        </div>
      </div>

      <ZoneLaunchpad />
    </div>
  );
};

export default Index;
