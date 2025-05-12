
import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Layout } from 'lucide-react';
import SystemFramingStudio from '@/components/think/SystemFramingStudio';
import DeiForesightTab from '@/components/think/DeiForesightTab';
import EquilibriumSolverTab from '@/components/think/EquilibriumSolverTab';
import SensitivityTab from '@/components/think/SensitivityTab';
import StrategyGeneratorTab from '@/components/think/StrategyGeneratorTab';
import AiAdvisorSidebar from '@/components/think/AiAdvisorSidebar';
import FooterCTA from '@/components/think/FooterCTA';

// Mock data
const mockCLD = { nodes: [], links: [] };
const mockSNA = { nodes: [], edges: [] };
const mockDEIMetrics = { diversity: 78, equity: 65, inclusion: 82 };
const mockScenarios = [
  { id: 1, name: "Baseline", probability: 0.4 },
  { id: 2, name: "Optimistic", probability: 0.2 },
  { id: 3, name: "Pessimistic", probability: 0.4 }
];
const mockBands = [
  { name: "Low", min: 0, max: 30 },
  { name: "Medium", min: 30, max: 70 },
  { name: "High", min: 70, max: 100 }
];
const mockSensitivity = [
  { parameter: "Growth Rate", sensitivity: 0.8 },
  { parameter: "Adoption Rate", sensitivity: 0.6 },
  { parameter: "Churn", sensitivity: 0.4 }
];
// Fixed the priority types to be specific string literals
const mockObjectives = [
  { id: 1, name: "Increase Diversity", priority: "High" as const },
  { id: 2, name: "Reduce Inequity", priority: "Medium" as const },
  { id: 3, name: "Enhance Inclusion", priority: "High" as const }
];

const tabs = [
  { key: 'dei', label: 'DEI & Foresight' },
  { key: 'solver', label: 'Equilibrium Solver' },
  { key: 'sensitivity', label: 'Sensitivity Analysis' },
  { key: 'strategy', label: 'Initial Strategy' }
];

const ThinkPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dei');

  return (
    <AnimatedPage>
      <header className="mb-8">
        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
            <Layout size={24} />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-extrabold">THINK Zone</h1>
            <p className="text-gray-400">
              Analyze systems, model relationships, and identify patterns
            </p>
          </div>
        </div>
      </header>
      
      {/* Main Split-Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* System Framing Studio */}
        <div className="lg:col-span-3 glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4 text-left">System Framing Studio</h2>
          <SystemFramingStudio
            cldData={mockCLD}
            snaData={mockSNA}
          />
          <div className="mt-4 flex justify-between">
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">2D View</button>
              <button className="px-3 py-1.5 text-sm bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">3D View</button>
            </div>
            <div>
              <button className="px-3 py-1.5 text-sm bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">Save</button>
            </div>
          </div>
        </div>
        
        {/* Tabs Section */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          {/* Tab Navigation */}
          <div className="glass-panel p-4">
            <nav className="flex space-x-2">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    activeTab === tab.key 
                      ? 'bg-teal-500/70 text-white' 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="glass-panel p-6 flex-grow">
            {activeTab === 'dei' && (
              <DeiForesightTab metrics={mockDEIMetrics} scenarios={mockScenarios} />
            )}
            
            {activeTab === 'solver' && (
              <EquilibriumSolverTab initialBands={mockBands} />
            )}
            
            {activeTab === 'sensitivity' && (
              <SensitivityTab parameters={mockSensitivity} />
            )}
            
            {activeTab === 'strategy' && (
              <StrategyGeneratorTab objectives={mockObjectives} />
            )}
          </div>
          
          {/* AI Advisor Section */}
          <AiAdvisorSidebar className="glass-panel p-4" />
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ThinkPage;
