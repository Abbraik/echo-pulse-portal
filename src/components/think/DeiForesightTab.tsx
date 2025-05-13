
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CreateScenarioModal from './CreateScenarioModal';

interface SubIndicator {
  name: string;
  value: number;
}

interface Pillar {
  value: number;
  subIndicators: SubIndicator[];
}

interface Metrics {
  pillars: {
    population: Pillar;
    resources: Pillar;
    goods: Pillar;
    social: Pillar;
  };
}

interface Scenario {
  id: number;
  name: string;
  date: string;
  probability: number;
  sparkline: number[];
}

interface DeiForesightTabProps {
  metrics: Metrics;
  scenarios: Scenario[];
}

const DeiForesightTab: React.FC<DeiForesightTabProps> = ({ metrics, scenarios }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const renderSparkline = (data: number[], color: string = 'bg-teal-500') => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end h-6 space-x-0.5">
        {data.map((value, i) => (
          <div 
            key={i}
            className={`w-1 ${color}`}
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: '15%',
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-left">NDI Pillars & Sub-Indicators</h2>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all button-glow"
        >
          <Plus size={16} />
          New Scenario
        </button>
      </div>
      
      {/* Pillar metrics grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Population Dynamics */}
        <div className="bg-navy-800/50 p-4 rounded-lg border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Population</h3>
            <div className="text-2xl font-bold">{metrics.pillars.population.value}%</div>
          </div>
          <div className="space-y-2">
            {metrics.pillars.population.subIndicators.map((indicator, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{indicator.name}</span>
                <span>{typeof indicator.value === 'number' && indicator.value % 1 === 0 
                  ? indicator.value 
                  : indicator.value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource-Market Efficiency */}
        <div className="bg-navy-800/50 p-4 rounded-lg border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Resources</h3>
            <div className="text-2xl font-bold">{metrics.pillars.resources.value}%</div>
          </div>
          <div className="space-y-2">
            {metrics.pillars.resources.subIndicators.map((indicator, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{indicator.name}</span>
                <span>{typeof indicator.value === 'number' && indicator.value % 1 === 0 
                  ? indicator.value 
                  : indicator.value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Goods & Services Stability */}
        <div className="bg-navy-800/50 p-4 rounded-lg border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Goods & Services</h3>
            <div className="text-2xl font-bold">{metrics.pillars.goods.value}%</div>
          </div>
          <div className="space-y-2">
            {metrics.pillars.goods.subIndicators.map((indicator, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{indicator.name}</span>
                <span>{typeof indicator.value === 'number' && indicator.value % 1 === 0 
                  ? indicator.value 
                  : indicator.value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Outcomes */}
        <div className="bg-navy-800/50 p-4 rounded-lg border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Social Outcomes</h3>
            <div className="text-2xl font-bold">{metrics.pillars.social.value}%</div>
          </div>
          <div className="space-y-2">
            {metrics.pillars.social.subIndicators.map((indicator, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{indicator.name}</span>
                <span>{typeof indicator.value === 'number' && indicator.value % 1 === 0 
                  ? indicator.value 
                  : indicator.value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Deviation Heatmap */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-left">Deviation from Equilibrium</h3>
        <div className="flex justify-between">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500/80 to-teal-700/80 flex items-center justify-center text-sm font-medium border border-white/10">
              -3%
            </div>
            <span className="mt-1 text-xs">Population</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500/80 to-yellow-700/80 flex items-center justify-center text-sm font-medium border border-white/10">
              +8%
            </div>
            <span className="mt-1 text-xs">Resources</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500/80 to-green-700/80 flex items-center justify-center text-sm font-medium border border-white/10">
              +1%
            </div>
            <span className="mt-1 text-xs">Goods</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500/80 to-red-700/80 flex items-center justify-center text-sm font-medium border border-white/10">
              -12%
            </div>
            <span className="mt-1 text-xs">Social</span>
          </div>
        </div>
      </div>
      
      {/* Scenario Carousel */}
      <h3 className="text-md font-medium mb-3 text-left">Scenarios</h3>
      <div className="flex overflow-x-auto pb-4 space-x-4 -mx-2 px-2">
        {scenarios.map((scenario) => (
          <div 
            key={scenario.id} 
            className="min-w-[200px] bg-navy-800/50 p-4 rounded-lg border border-white/10 transform hover:scale-[1.02] transition-transform"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium">{scenario.name}</h4>
                <p className="text-xs text-gray-400">{scenario.date}</p>
              </div>
              <span className="text-xs bg-white/10 px-2 py-1 rounded">
                {Math.round(scenario.probability * 100)}%
              </span>
            </div>
            <div className="mb-2">
              {renderSparkline(scenario.sparkline)}
            </div>
          </div>
        ))}
        
        {/* New Scenario Card */}
        <div 
          onClick={() => setIsCreateModalOpen(true)}
          className="min-w-[200px] bg-gradient-to-br from-teal-800/30 to-blue-800/30 p-4 rounded-lg border border-teal-500/30 flex flex-col items-center justify-center transform hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <Plus size={24} className="mb-2 text-teal-400" />
          <span className="text-teal-400 font-medium">New Scenario</span>
        </div>
      </div>

      {/* Create Scenario Modal */}
      <CreateScenarioModal 
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default DeiForesightTab;
