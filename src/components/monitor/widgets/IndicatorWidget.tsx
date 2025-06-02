
import React from 'react';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SparklineChart from '@/components/think/components/SparklineChart';

interface IndicatorWidgetProps {
  name: string;
  value: string;
  status: 'green' | 'amber' | 'red';
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const IndicatorWidget: React.FC<IndicatorWidgetProps> = ({
  name,
  value,
  status,
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'text-green-400';
      case 'amber': return 'text-yellow-400';
      case 'red': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const generateMockData = () => {
    return Array.from({ length: 12 }, () => Math.random() * 100 + 50);
  };

  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">{name} Analysis</h2>
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
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Current Value</h3>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getStatusColor(status)}`}>
                  {value}
                </div>
                <div className="text-sm text-gray-400 mt-2">Status: {status.toUpperCase()}</div>
              </div>
            </div>
            
            <div className="bg-black/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">12-Month Trend</h3>
              <SparklineChart 
                data={generateMockData()} 
                height={150} 
                width={300}
                color="#14b8a6"
              />
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Historical Data</h3>
            <div className="grid grid-cols-4 gap-4">
              {['3M', '6M', '9M', '12M'].map((period, index) => (
                <div key={period} className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {(parseFloat(value.replace(/[^0-9.]/g, '')) + (Math.random() - 0.5) * 10).toFixed(2)}
                    {value.includes('%') ? '%' : ''}
                  </div>
                  <div className="text-sm text-gray-400">{period} ago</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-white truncate">{name}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-gray-400 hover:text-white flex-shrink-0"
        >
          <Maximize2 size={12} />
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className={`text-lg font-bold ${getStatusColor(status)} mb-2`}>
          {value}
        </div>
        <div className="w-full">
          <SparklineChart data={generateMockData().slice(0, 6)} height={20} width={80} color="#14b8a6" />
        </div>
      </div>
    </div>
  );
};

export default IndicatorWidget;
