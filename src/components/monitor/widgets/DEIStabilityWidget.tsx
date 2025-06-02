
import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

interface DEIStabilityWidgetProps {
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const DEIStabilityWidget: React.FC<DEIStabilityWidgetProps> = ({ 
  isFullscreen, 
  isHovered 
}) => {
  const deiValue = 78;
  const inBandPercentage = 82;
  const sparklineData = [78, 79, 81, 83, 82, 82];

  return (
    <div className="h-full w-full p-4 flex flex-col items-center justify-center">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">DEI Stability</h3>
        
        {/* Radial Gauge */}
        <div className="relative mb-4">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            {/* Progress arc */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgb(20, 184, 166)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(deiValue / 100) * 314} 314`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{deiValue}%</span>
            <span className="text-xs text-gray-400">DEI</span>
          </div>
        </div>

        <div className="text-sm text-teal-400 mb-4">
          {inBandPercentage}% in-band
        </div>

        {/* 6-month sparkline */}
        <div className="flex items-center justify-center space-x-1">
          <span className="text-xs text-gray-400 mr-2">6mo:</span>
          <svg width="80" height="20">
            <polyline
              points={sparklineData.map((value, i) => `${i * 13},${20 - (value - 75) * 2}`).join(' ')}
              fill="none"
              stroke="rgb(20, 184, 166)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <TrendingUp className="h-3 w-3 text-green-400 ml-1" />
        </div>
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full max-w-4xl">
          <h4 className="text-xl font-semibold text-white mb-4">12-Month DEI Analysis</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300">
              Interactive 12-month chart with Trust and Migration toggles would appear here.
            </p>
            <div className="mt-4 flex space-x-4">
              <button className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded border border-teal-500/30">
                Apply Changes ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DEIStabilityWidget;
