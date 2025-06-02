
import React from 'react';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

interface SystemTrendsWidgetProps {
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const SystemTrendsWidget: React.FC<SystemTrendsWidgetProps> = ({ 
  isFullscreen, 
  isHovered 
}) => {
  const trends = [
    { name: 'DEI', data: [78, 79, 81, 83, 82, 82], change: '+4%', color: 'rgb(20, 184, 166)' },
    { name: 'Trust', data: [60, 61, 62, 63, 64, 64], change: '+3%', color: 'rgb(59, 130, 246)' },
    { name: 'Migration', data: [12, 11, 10, 9, 10, 10], change: '-2%', color: 'rgb(168, 85, 247)' }
  ];

  return (
    <div className="h-full w-full p-3">
      <div className="flex items-center mb-3">
        <TrendingUp className="h-4 w-4 text-teal-400 mr-2" />
        <h4 className="text-sm font-medium text-white">System Trends</h4>
      </div>

      <div className="space-y-2">
        {trends.map((trend, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 w-12">{trend.name}</span>
              <svg width="60" height="16">
                <polyline
                  points={trend.data.map((value, i) => `${i * 10},${16 - (value - Math.min(...trend.data)) / (Math.max(...trend.data) - Math.min(...trend.data)) * 12}`).join(' ')}
                  fill="none"
                  stroke={trend.color}
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className={`text-xs flex items-center ${trend.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {trend.change}
              {trend.change.startsWith('+') ? 
                <ArrowUp className="h-3 w-3 ml-1" /> : 
                <ArrowDown className="h-3 w-3 ml-1" />
              }
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        DEI +4%, Trust +3%, Migration −2% (6mo)
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full">
          <h4 className="text-xl font-semibold text-white mb-4">12-Month Trend Comparison</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300 mb-4">
              Interactive 12-month charts with metric checkboxes would appear here.
            </p>
            <button className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded border border-teal-500/30">
              Export CSV ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemTrendsWidget;
