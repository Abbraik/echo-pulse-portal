
import React from 'react';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SparklineChart from '@/components/think/components/SparklineChart';

interface ZoneEntropyWidgetProps {
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const ZoneEntropyWidget: React.FC<ZoneEntropyWidgetProps> = ({
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  const zones = {
    Think: { current: 0.24, data: [0.20, 0.22, 0.24], trend: 'up' },
    Act: { current: 0.30, data: [0.28, 0.30, 0.29], trend: 'stable' },
    Monitor: { current: 0.27, data: [0.25, 0.27, 0.27], trend: 'stable' },
    Learn: { current: 0.18, data: [0.15, 0.17, 0.18], trend: 'up' },
    Innovate: { current: 0.22, data: [0.20, 0.22, 0.21], trend: 'stable' }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-yellow-400';
      case 'down': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">Zone Entropy Analysis</h2>
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
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(zones).map(([zone, data]) => (
              <div key={zone} className="bg-black/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">{zone}</h3>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-400">{data.current}</div>
                    <div className={`text-sm ${getTrendColor(data.trend)}`}>
                      {getTrendIcon(data.trend)}
                    </div>
                  </div>
                  <SparklineChart 
                    data={[...data.data, ...Array(9).fill(0).map(() => Math.random() * 0.1 + data.current - 0.05)]} 
                    height={60} 
                    width={120}
                    color="#14b8a6"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-black/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Stacked Entropy View</h3>
            <div className="h-48 relative">
              <svg width="100%" height="100%" viewBox="0 0 600 150">
                {Object.entries(zones).map(([zone, data], index) => (
                  <g key={zone}>
                    <polyline
                      points={data.data.map((value, i) => `${i * 200},${150 - (value * 500) - (index * 20)}`).join(' ')}
                      fill="none"
                      stroke={`hsl(${index * 72}, 70%, 60%)`}
                      strokeWidth="2"
                    />
                    <text x={data.data.length * 200 + 10} y={150 - (data.current * 500) - (index * 20)} 
                          className="text-xs fill-current text-gray-300">
                      {zone}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Investigate Loop Impact ▶
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Zone Entropy</h3>
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
        {Object.entries(zones).map(([zone, data]) => (
          <div key={zone} className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <span className="text-xs text-gray-300 w-12 truncate">{zone}</span>
              <SparklineChart data={data.data} height={12} width={40} color="#14b8a6" />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-white font-medium">{data.current}</span>
              <span className={`text-xs ${getTrendColor(data.trend)}`}>
                {getTrendIcon(data.trend)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZoneEntropyWidget;
