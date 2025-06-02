
import React from 'react';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SparklineChart from '@/components/think/components/SparklineChart';

interface SystemTrendsWidgetProps {
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const SystemTrendsWidget: React.FC<SystemTrendsWidgetProps> = ({
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  const trends = {
    dei: { data: [78, 79, 81, 83, 82, 82], change: '+4%' },
    trust: { data: [60, 61, 62, 63, 64, 64], change: '+3%' },
    migration: { data: [12, 11, 10, 9, 10, 10], change: '-2%' }
  };

  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">System Trends Analysis</h2>
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
          <div className="grid grid-cols-3 gap-6">
            {Object.entries(trends).map(([key, trend]) => (
              <div key={key} className="bg-black/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 capitalize">{key}</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="text-teal-400" />
                    <span className="text-sm text-gray-300">Show {key}</span>
                  </label>
                  <SparklineChart 
                    data={trend.data} 
                    height={100} 
                    width={200}
                    color="#14b8a6"
                  />
                  <div className="text-center">
                    <span className={`text-lg font-bold ${trend.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {trend.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button className="bg-teal-600 hover:bg-teal-700">
              Export CSV ▶
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">System Trends</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-gray-400 hover:text-white"
        >
          <Maximize2 size={14} />
        </Button>
      </div>
      
      <div className="flex-1 space-y-2">
        {Object.entries(trends).map(([key, trend]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <span className="text-xs text-gray-300 capitalize w-12">{key}</span>
              <SparklineChart data={trend.data} height={15} width={60} color="#14b8a6" />
            </div>
            <span className={`text-xs font-medium ${trend.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {trend.change}
            </span>
          </div>
        ))}
        
        <div className="text-xs text-gray-400 mt-2">
          6-month comparison
        </div>
      </div>
    </div>
  );
};

export default SystemTrendsWidget;
