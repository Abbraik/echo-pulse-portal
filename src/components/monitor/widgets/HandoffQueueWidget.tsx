
import React from 'react';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HandoffQueueWidgetProps {
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const HandoffQueueWidget: React.FC<HandoffQueueWidgetProps> = ({
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  const handoffs = {
    thinkToAct: { count: 4, avgTime: '2d' },
    actToMonitor: { count: 3, avgTime: '1d' }
  };

  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">Handoff Queue Management</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Think → Act</h3>
            <div className="space-y-2">
              {Array.from({ length: handoffs.thinkToAct.count }, (_, i) => (
                <div 
                  key={i}
                  className="bg-black/20 rounded-lg p-3 border border-gray-600 cursor-move"
                  draggable
                >
                  <div className="text-sm font-medium text-white">Strategy Item #{i + 1}</div>
                  <div className="text-xs text-gray-400">Priority: High</div>
                  <div className="text-xs text-gray-400">Age: {Math.floor(Math.random() * 3) + 1}d</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Act → Monitor</h3>
            <div className="space-y-2">
              {Array.from({ length: handoffs.actToMonitor.count }, (_, i) => (
                <div 
                  key={i}
                  className="bg-black/20 rounded-lg p-3 border border-gray-600 cursor-move"
                  draggable
                >
                  <div className="text-sm font-medium text-white">Bundle Item #{i + 1}</div>
                  <div className="text-xs text-gray-400">Priority: Medium</div>
                  <div className="text-xs text-gray-400">Age: {Math.floor(Math.random() * 2) + 1}d</div>
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Handoff Queue</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-gray-400 hover:text-white"
        >
          <Maximize2 size={14} />
        </Button>
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="space-y-2">
          <div className="bg-black/20 rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-300">Think→Act</span>
              <span className="text-xs text-teal-400">{handoffs.thinkToAct.count}</span>
            </div>
            <div className="text-xs text-gray-400">avg {handoffs.thinkToAct.avgTime}</div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
              <div 
                className="bg-teal-500 h-1.5 rounded-full" 
                style={{ width: `${(handoffs.thinkToAct.count / 10) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-black/20 rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-300">Act→Monitor</span>
              <span className="text-xs text-blue-400">{handoffs.actToMonitor.count}</span>
            </div>
            <div className="text-xs text-gray-400">avg {handoffs.actToMonitor.avgTime}</div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
              <div 
                className="bg-blue-500 h-1.5 rounded-full" 
                style={{ width: `${(handoffs.actToMonitor.count / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandoffQueueWidget;
