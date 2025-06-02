
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface KPISummaryWidgetProps {
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const KPISummaryWidget: React.FC<KPISummaryWidgetProps> = ({ 
  isFullscreen, 
  isHovered 
}) => {
  const kpis = [
    { name: 'DEI', value: '78%', color: 'text-teal-400' },
    { name: 'Trust', value: '64%', color: 'text-blue-400' },
    { name: 'Migration', value: '+10%', color: 'text-purple-400' }
  ];

  return (
    <div className="h-full w-full p-3 flex flex-col justify-center">
      <div className="flex items-center mb-2">
        <BarChart3 className="h-3 w-3 text-gray-400 mr-1" />
        <h5 className="text-xs text-gray-400">KPI Summary</h5>
      </div>
      
      <div className="space-y-1">
        {kpis.map((kpi, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{kpi.name}</span>
            <span className={`text-xs font-medium ${kpi.color}`}>{kpi.value}</span>
          </div>
        ))}
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full">
          <h4 className="text-xl font-semibold text-white mb-4">High-Level KPI Summary</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300">
              Year-to-date summary with top-3 metrics in mini-charts would appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPISummaryWidget;
