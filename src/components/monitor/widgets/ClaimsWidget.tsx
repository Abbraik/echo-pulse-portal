
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ClaimsWidgetProps {
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const ClaimsWidget: React.FC<ClaimsWidgetProps> = ({ 
  isFullscreen, 
  isHovered 
}) => {
  const claimsData = {
    total: 12,
    oldest: '5 d',
    breakdown: [
      { zone: 'Think', count: 3 },
      { zone: 'Act', count: 4 },
      { zone: 'Learn', count: 2 },
      { zone: 'Innovate', count: 3 }
    ]
  };

  return (
    <div className="h-full w-full p-3">
      <div className="flex items-center mb-3">
        <AlertCircle className="h-4 w-4 text-amber-400 mr-2" />
        <h4 className="text-sm font-medium text-white">Claims</h4>
      </div>

      <div className="space-y-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{claimsData.total}</div>
          <div className="text-xs text-gray-400">Open Claims</div>
        </div>

        <div className="text-center">
          <div className="text-sm text-amber-400">Oldest: {claimsData.oldest}</div>
        </div>

        <div className="space-y-1">
          {claimsData.breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{item.zone}</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 bg-white/10 rounded-full h-1">
                  <div 
                    className="bg-amber-500 h-1 rounded-full"
                    style={{ width: `${(item.count / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-white w-4">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full">
          <h4 className="text-xl font-semibold text-white mb-4">Open Claims Management</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300 mb-4">
              Full scrollable claims table with filters would appear here.
            </p>
            <button className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
              Resolve All ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsWidget;
