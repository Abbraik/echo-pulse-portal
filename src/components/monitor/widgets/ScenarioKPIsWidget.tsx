
import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SparklineChart from '@/components/think/components/SparklineChart';

interface ScenarioKPIsWidgetProps {
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const ScenarioKPIsWidget: React.FC<ScenarioKPIsWidgetProps> = ({
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  const scenarioData = [0.10, 0.08, 0.06, 0.04, 0.02, 0.00];
  const actualData = [0.12, 0.11, 0.14, 0.10, 0.09, 0.11];
  
  const kpis = [
    { name: 'Pop Dev', value: 0.02, status: 'green' },
    { name: 'Resource Stock', value: 0.92, status: 'green' },
    { name: 'Social Cohesion', value: 0.71, status: 'green' },
    { name: 'Trust Index', value: 0.64, status: 'amber' },
    { name: 'Migration Flow', value: '+10%', status: 'amber' },
    { name: 'Market Stability', value: 0.68, status: 'green' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">Scenario & KPIs Analysis</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="bg-black/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">12-Month Scenario vs Actual</h3>
            <div className="h-64 relative">
              <svg width="100%" height="100%" viewBox="0 0 600 200">
                <polyline
                  points={scenarioData.map((value, i) => `${i * 100},${200 - value * 1000}`).join(' ')}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                <polyline
                  points={actualData.map((value, i) => `${i * 100},${200 - value * 1000}`).join(' ')}
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute bottom-0 left-0 flex space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-dashed border-indigo-400"></div>
                  <span className="text-gray-300">Scenario</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-teal-400"></div>
                  <span className="text-gray-300">Actual</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Historical KPI Heatmap</h3>
            <div className="grid grid-cols-3 gap-4">
              {kpis.map((kpi, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg ${getStatusColor(kpi.status)} bg-opacity-20 border border-current`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-sm font-medium text-white">{kpi.name}</div>
                  <div className="text-lg font-bold text-white mt-1">{kpi.value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Scenario & KPIs</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-gray-400 hover:text-white"
        >
          <Maximize2 size={14} />
        </Button>
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="bg-black/20 rounded p-2">
          <div className="text-xs text-gray-400 mb-1">Scenario vs Actual</div>
          <SparklineChart data={scenarioData} height={25} width={120} color="#6366f1" />
        </div>
        
        <div className="grid grid-cols-2 gap-1 text-xs">
          {kpis.slice(0, 4).map((kpi, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(kpi.status)}`}></div>
              <span className="text-gray-300 truncate">{kpi.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioKPIsWidget;
