
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HandoffQueueWidgetProps {
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const HandoffQueueWidget: React.FC<HandoffQueueWidgetProps> = ({ 
  isFullscreen, 
  isHovered 
}) => {
  const handoffs = [
    { from: 'Think', to: 'Act', count: 4, avgTime: '2 d' },
    { from: 'Act', to: 'Monitor', count: 3, avgTime: '1 d' }
  ];

  return (
    <div className="h-full w-full p-3">
      <div className="flex items-center mb-3">
        <ArrowRight className="h-4 w-4 text-blue-400 mr-2" />
        <h4 className="text-sm font-medium text-white">Handoff Queue</h4>
      </div>

      <div className="space-y-3">
        {handoffs.map((handoff, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {handoff.from}→{handoff.to}
              </span>
              <span className="text-sm font-semibold text-white">{handoff.count}</span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-teal-400 h-1.5 rounded-full"
                style={{ width: `${(handoff.count / 5) * 100}%` }}
              />
            </div>
            
            <div className="text-xs text-gray-500">avg {handoff.avgTime}</div>
          </div>
        ))}
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full">
          <h4 className="text-xl font-semibold text-white mb-4">Handoff Kanban</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300">
              Mini-Kanban with draggable cards would appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandoffQueueWidget;
