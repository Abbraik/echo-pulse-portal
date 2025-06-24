
import React from 'react';
import ThinkHeader from '@/components/think/ThinkHeader';
import ThinkBackground from '@/components/think/ThinkBackground';
import DeiAndForesightHub from '@/components/think/DeiAndForesightHub';
import TabbedContentSection from '@/components/think/TabbedContentSection';
import SystemFramingStudio from '@/components/think/SystemFramingStudio';
import AiAdvisorSidebar from '@/components/think/AiAdvisorSidebar';
import FooterCTA from '@/components/think/FooterCTA';
import { DemoContextPanel } from '@/components/think/DemoContextPanel';

const Think = () => {
  return (
    <div className="relative min-h-screen">
      <ThinkBackground />
      <div className="relative z-10">
        <ThinkHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-screen">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <DemoContextPanel />
              <DeiAndForesightHub />
              <TabbedContentSection />
              <SystemFramingStudio />
            </div>
            
            {/* AI Advisor Sidebar */}
            <div className="lg:col-span-4">
              <AiAdvisorSidebar />
            </div>
          </div>
        </div>
        <FooterCTA />
      </div>
    </div>
  );
};

export default Think;
