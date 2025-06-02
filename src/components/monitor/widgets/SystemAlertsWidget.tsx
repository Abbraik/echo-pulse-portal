
import React from 'react';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SystemAlertsWidgetProps {
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const SystemAlertsWidget: React.FC<SystemAlertsWidgetProps> = ({
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  const alerts = [
    { id: 1, level: 'red', message: 'Data sync lag with Act Zone', time: '05-30 10:12' },
    { id: 2, level: 'amber', message: 'Loop inconsistency detected', time: '05-30 09:48' },
    { id: 3, level: 'green', message: 'Minor UI glitch in Learn Canvas', time: '05-30 09:30' }
  ];

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'red': return '🔴';
      case 'amber': return '🟠';
      case 'green': return '🟢';
      default: return '⚪';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'red': return 'border-red-500 bg-red-500/10';
      case 'amber': return 'border-yellow-500 bg-yellow-500/10';
      case 'green': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">System Alerts Center</h2>
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
          <div className="flex space-x-4 mb-4">
            <input 
              type="text" 
              placeholder="Search alerts..." 
              className="flex-1 bg-black/20 border border-gray-600 rounded px-3 py-2 text-white"
            />
            <select className="bg-black/20 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Levels</option>
              <option>Critical</option>
              <option>Warning</option>
              <option>Info</option>
            </select>
            <select className="bg-black/20 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Zones</option>
              <option>Think</option>
              <option>Act</option>
              <option>Monitor</option>
              <option>Learn</option>
              <option>Innovate</option>
            </select>
          </div>
          
          <div className="flex-1 space-y-3 max-h-96 overflow-y-auto">
            {Array.from({ length: 15 }, (_, i) => {
              const alert = alerts[i % alerts.length];
              return (
                <div 
                  key={i}
                  className={`p-4 rounded-lg border ${getAlertColor(alert.level)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getAlertIcon(alert.level)}</span>
                      <div>
                        <div className="text-white font-medium">{alert.message}</div>
                        <div className="text-sm text-gray-400 mt-1">Zone: Act • Component: DataSync</div>
                        <div className="text-xs text-gray-500 mt-1">{alert.time}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      Acknowledge
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button className="bg-red-600 hover:bg-red-700">
              Acknowledge All ▶
            </Button>
            <Button variant="outline">
              Export Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">System Alerts</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-gray-400 hover:text-white"
        >
          <Maximize2 size={14} />
        </Button>
      </div>
      
      <div className="flex-1 space-y-2 max-h-32 overflow-y-auto">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-2 rounded border ${getAlertColor(alert.level)}`}
          >
            <div className="flex items-start space-x-2">
              <span className="text-sm">{getAlertIcon(alert.level)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white font-medium truncate">
                  {alert.message}
                </div>
                <div className="text-xs text-gray-400">
                  {alert.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-700">
        <Button variant="ghost" size="sm" className="w-full text-xs text-teal-400 hover:text-teal-300">
          View All Alerts ▶
        </Button>
      </div>
    </div>
  );
};

export default SystemAlertsWidget;
