
import React from 'react';
import { Activity } from 'lucide-react';

interface ZoneEntropyWidgetProps {
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const ZoneEntropyWidget: React.FC<ZoneEntropyWidgetProps> = ({ 
  isFullscreen, 
  isHovered 
}) => {
  const zones = [
    { name: 'Think', current: 0.24, trend: [0.20, 0.22, 0.24], color: 'rgb(168, 85, 247)' },
    { name: 'Act', current: 0.30, trend: [0.28, 0.30, 0.29], color: 'rgb(34, 197, 94)' },
    { name: 'Monitor', current: 0.27, trend: [0.25, 0.27, 0.27], color: 'rgb(59, 130, 246)' },
    { name: 'Learn', current: 0.18, trend: [0.15, 0.17, 0.18], color: 'rgb(249, 115, 22)' },
    { name: 'Innovate', current: 0.22, trend: [0.20, 0.22, 0.21], color: 'rgb(236, 72, 153)' }
  ];

  return (
    <div className="h-full w-full p-3">
      <div className="flex items-center mb-3">
        <Activity className="h-4 w-4 text-purple-400 mr-2" />
        <h4 className="text-sm font-medium text-white">Zone Entropy</h4>
      </div>

      <div className="space-y-2">
        {zones.map((zone, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 w-16">{zone.name}</span>
              <svg width="40" height="12">
                <polyline
                  points={zone.trend.map((value, i) => `${i * 15},${12 - value * 40}`).join(' ')}
                  fill="none"
                  stroke={zone.color}
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="text-xs text-white font-medium">
              {zone.current.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full">
          <h4 className="text-xl font-semibold text-white mb-4">Zone Entropy Analysis</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300 mb-4">
              Larger stacked line charts for all zones would appear here.
            </p>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
              Investigate Loop Impact ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneEntropyWidget;
