
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

  // Enhanced mock data for DEI metrics with proper structure
  const mockMetrics = {
    overall: 75,
    pillars: {
      population: { value: 72, trend: [70, 71, 72, 73, 72] },
      resources: { value: 68, trend: [65, 66, 67, 68, 68] },
      goods: { value: 82, trend: [80, 81, 82, 83, 82] },
      social: { value: 78, trend: [75, 76, 77, 78, 78] }
    },
    equilibriumBands: {
      overall: { min: 70, max: 85 },
      population: { min: 65, max: 80 },
      resources: { min: 60, max: 75 },
      goods: { min: 75, max: 90 },
      social: { min: 70, max: 85 }
    }
  };

  const mockScenarios = [
    { id: 'base', name: 'Base Scenario', data: {} },
    { id: 'optimistic', name: 'Optimistic', data: {} }
  ];

  const mockCldData = { nodes: [], edges: [] };
  
  // Enhanced SNA data with proper structure
  const mockSnaData = {
    nodes: [],
    edges: [],
    metrics: {
      density: 0.25,
      avgClustering: 0.4,
      avgPathLength: 2.8,
      centralization: 0.6
    }
  };

  const handleSaveScenario = (scenario: any) => {
    console.log('Saving scenario:', scenario);
  };

  // Fixed to handle string IDs consistently
  const handleSelectScenario = (scenarioId: string) => {
    console.log('Selected scenario:', scenarioId);
  };

  return (
    <div className="relative min-h-screen">
      <ThinkBackground />
      <div className="relative z-10">
        {!hideHeader && <ThinkHeader hideHeader={hideHeader} />}
        
        <main className="container mx-auto px-4 py-8">
          {/* Demo Context Panel - positioned at the top */}
          <DemoContextPanel />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* DEI and Foresight Hub */}
              <DeiAndForesightHub 
                metrics={mockMetrics}
                scenarios={mockScenarios}
                onSaveScenario={handleSaveScenario}
                onSelectScenario={handleSelectScenario}
              />
              
              {/* Tabbed Content Section */}
              <TabbedContentSection 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                currentMetrics={currentMetrics}
                scenarios={scenarios}
                onSaveScenario={handleSaveScenario}
                onSelectScenario={handleSelectScenario}
                cldData={mockCldData}
                snaData={mockSnaData}
                leveragePoints={[]}
                objectives={[]}
              />
              
              {/* System Framing Studio */}
              <SystemFramingStudio 
                cldData={mockCldData}
                snaData={mockSnaData}
              />
            </div>
            
            {/* Right Column - AI Advisor Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <AiAdvisorSidebar />
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer CTA */}
        <FooterCTA />
      </div>
    </div>
  );
};

export default Think;
