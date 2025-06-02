
import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface SystemAlertsWidgetProps {
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const SystemAlertsWidget: React.FC<SystemAlertsWidgetProps> = ({ 
  isFullscreen, 
  isHovered 
}) => {
  const alerts = [
    {
      id: 1,
      severity: 'high',
      title: 'Data sync lag with Act Zone',
      timestamp: '05-30 10:12',
      description: 'Communication delay detected'
    },
    {
      id: 2,
      severity: 'medium',
      title: 'Loop inconsistency detected',
      timestamp: '05-30 09:48',
      description: 'Marriage rate loop underperforming'
    },
    {
      id: 3,
      severity: 'low',
      title: 'Minor UI glitch in Learn Canvas',
      timestamp: '05-30 09:30',
      description: 'Visual rendering issue'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return { bg: 'bg-red-500/20', text: 'text-red-400', icon: '🔴' };
      case 'medium': return { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: '🟠' };
      case 'low': return { bg: 'bg-green-500/20', text: 'text-green-400', icon: '🟢' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⚪' };
    }
  };

  return (
    <div className="h-full w-full p-3">
      <div className="flex items-center mb-3">
        <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
        <h4 className="text-sm font-medium text-white">System Alerts</h4>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1">
        {alerts.map((alert) => {
          const colors = getSeverityColor(alert.severity);
          return (
            <div key={alert.id} className={`p-2 rounded-lg ${colors.bg} border border-white/10`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-xs">{colors.icon}</span>
                    <span className={`text-xs font-medium ${colors.text}`}>
                      {alert.title}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {alert.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {alert.timestamp}
                  </div>
                </div>
                <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center">
                  Investigate
                  <ChevronRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 pt-2 border-t border-white/10">
        <button className="text-xs text-teal-400 hover:text-teal-300">
          View All Alerts ▶
        </button>
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full">
          <h4 className="text-xl font-semibold text-white mb-4">System Alerts Management</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300 mb-4">
              Full alert feed with filter dropdowns and search would appear here.
            </p>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded border border-red-500/30">
                Acknowledge All ▶
              </button>
              <input 
                type="text" 
                placeholder="Search alerts..."
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAlertsWidget;
