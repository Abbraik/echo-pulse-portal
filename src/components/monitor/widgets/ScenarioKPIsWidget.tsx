
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ScenarioKPIsWidgetProps {
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const ScenarioKPIsWidget: React.FC<ScenarioKPIsWidgetProps> = ({ 
  isFullscreen, 
  isHovered 
}) => {
  const scenarioData = [0.10, 0.08, 0.06, 0.04, 0.02, 0.00];
  const actualData = [0.12, 0.11, 0.14, 0.10, 0.09, 0.11];
  
  const kpiData = [
    { name: 'Pop Dev', value: 0.02, status: 'good' },
    { name: 'Resource', value: 0.92, status: 'good' },
    { name: 'Social Coh.', value: 0.71, status: 'good' },
    { name: 'Trust', value: 0.64, status: 'warning' },
    { name: 'Migration', value: '+10%', status: 'warning' },
    { name: 'Market', value: 0.68, status: 'good' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500/80';
      case 'warning': return 'bg-amber-500/80';
      case 'danger': return 'bg-red-500/80';
      default: return 'bg-gray-500/80';
    }
  };

  return (
    <div className="h-full w-full p-4">
      <div className="flex items-center mb-3">
        <BarChart3 className="h-4 w-4 text-teal-400 mr-2" />
        <h4 className="text-sm font-medium text-white">Scenario & KPIs</h4>
      </div>

      {/* Mini line chart */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-1">Scenario vs Actual (6mo)</div>
        <svg width="100%" height="40" className="overflow-visible">
          <polyline
            points={scenarioData.map((value, i) => `${(i / 5) * 260},${35 - value * 200}`).join(' ')}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
          <polyline
            points={actualData.map((value, i) => `${(i / 5) * 260},${35 - value * 200}`).join(' ')}
            fill="none"
            stroke="rgb(20, 184, 166)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* KPI Heatmap */}
      <div className="grid grid-cols-2 gap-2">
        {kpiData.map((kpi, index) => (
          <div
            key={index}
            className={`p-2 rounded ${getStatusColor(kpi.status)} text-center`}
          >
            <div className="text-xs text-white font-medium">{kpi.name}</div>
            <div className="text-xs text-white/90">{kpi.value}</div>
          </div>
        ))}
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full">
          <h4 className="text-xl font-semibold text-white mb-4">Extended Scenario Analysis</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300">
              Larger 12-month charts with interactive legends and full historical KPI heatmap would appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioKPIsWidget;
