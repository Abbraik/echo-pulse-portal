
import React, { useState } from 'react';
import ThinkHeader from '@/components/think/ThinkHeader';
import ThinkBackground from '@/components/think/ThinkBackground';
import DeiAndForesightHub from '@/components/think/DeiAndForesightHub';
import TabbedContentSection from '@/components/think/TabbedContentSection';
import SystemFramingStudio from '@/components/think/SystemFramingStudio';
import AiAdvisorSidebar from '@/components/think/AiAdvisorSidebar';
import FooterCTA from '@/components/think/FooterCTA';
import { DemoContextPanel } from '@/components/think/DemoContextPanel';

const Think = () => {
  const [hideHeader, setHideHeader] = useState(false);
  const [activeTab, setActiveTab] = useState('scenario-analysis');
  const [currentMetrics, setCurrentMetrics] = useState({});
  const [scenarios, setScenarios] = useState([]);

  // Mock data for required props
  const mockMetrics = {
    stability: 75,
    resilience: 68,
    adaptability: 82
  };

  const mockScenarios = [
    { id: 'base', name: 'Base Scenario', data: {} },
    { id: 'optimistic', name: 'Optimistic', data: {} }
  ];

  const mockCldData = { nodes: [], edges: [] };
  const mockSnaData = { actors: [], connections: [] };

  const handleSaveScenario = (scenario: any) => {
    console.log('Saving scenario:', scenario);
  };

  const handleSelectScenario = (scenarioId: string) => {
    console.log('Selected scenario:', scenarioId);
  };

  return (
    <div className="relative min-h-screen">
      <ThinkBackground />
      <div className="relative z-10">
        <ThinkHeader hideHeader={hideHeader} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-screen">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <DemoContextPanel />
              <DeiAndForesightHub 
                metrics={mockMetrics}
                scenarios={mockScenarios}
                onSaveScenario={handleSaveScenario}
                onSelectScenario={handleSelectScenario}
              />
              <TabbedContentSection 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                currentMetrics={currentMetrics}
                scenarios={scenarios}
                onUpdateMetrics={setCurrentMetrics}
                onSaveScenario={handleSaveScenario}
                onSelectScenario={handleSelectScenario}
                cldData={mockCldData}
                snaData={mockSnaData}
                leveragePoints={[]}
                objectives={[]}
              />
              <SystemFramingStudio 
                cldData={mockCldData}
                snaData={mockSnaData}
              />
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
