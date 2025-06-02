
import React from 'react';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SparklineChart from '@/components/think/components/SparklineChart';

interface KPISummaryWidgetProps {
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const KPISummaryWidget: React.FC<KPISummaryWidgetProps> = ({
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  const kpis = [
    { name: 'DEI', value: '78%', data: [75, 76, 77, 78, 78, 78] },
    { name: 'Trust', value: '64%', data: [60, 61, 62, 63, 64, 64] },
    { name: 'Migration', value: '+10%', data: [12, 11, 10, 9, 10, 10] }
  ];

  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">High-Level KPI Summary</h2>
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
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-black/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{kpi.name}</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-400 mb-2">{kpi.value}</div>
                  <div className="text-sm text-gray-400">Current Value</div>
                </div>
                <div>
                  <SparklineChart 
                    data={[...kpi.data, ...Array(6).fill(0).map(() => Math.random() * 10 + 70)]} 
                    height={80} 
                    width={200}
                    color="#14b8a6"
                  />
                  <div className="text-xs text-gray-400 mt-2">12-month trend</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-white">KPI Summary</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-gray-400 hover:text-white"
        >
          <Maximize2 size={12} />
        </Button>
      </div>
      
      <div className="flex-1 space-y-2">
        {kpis.map((kpi, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-xs text-gray-300">{kpi.name}</span>
            <span className="text-xs text-teal-400 font-medium">{kpi.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPISummaryWidget;
