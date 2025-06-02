
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface AlertsTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  timestamp: string;
  description: string;
}

export const AlertsTile: React.FC<AlertsTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const alerts: Alert[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'Data sync lag with Act Zone',
      timestamp: '05-30 10:12',
      description: 'System experiencing delays in data synchronization'
    },
    {
      id: '2',
      severity: 'warning',
      title: 'Loop inconsistency detected',
      timestamp: '05-30 09:48',
      description: 'Minor discrepancy in loop calculations'
    },
    {
      id: '3',
      severity: 'info',
      title: 'Minor UI glitch in Learn Canvas',
      timestamp: '05-30 09:30',
      description: 'UI rendering issue in learning interface'
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'warning': return '🟠';
      case 'info': return '🟢';
      default: return '⚪';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/30 bg-red-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'info': return 'border-green-500/30 bg-green-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="System Alerts"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col">
              {/* Alert feed */}
              <div className="flex-1 space-y-2 overflow-auto">
                {alerts.slice(0, isFullScreen ? alerts.length : 2).map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)} hover:bg-white/5 transition-colors cursor-pointer`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm">{getSeverityIcon(alert.severity)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          {alert.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {alert.timestamp}
                        </div>
                        {isFullScreen && (
                          <div className="text-xs text-gray-300 mt-1">
                            {alert.description}
                          </div>
                        )}
                      </div>
                      {isFullScreen && (
                        <Button size="sm" variant="outline" className="text-xs">
                          Investigate ▶
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="text-center">
                  <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    View All Alerts ▶
                  </button>
                </div>
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-4 pt-4 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Acknowledge All ▶
                  </Button>
                </motion.div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {alerts.length} alerts: {alerts.filter(a => a.severity === 'critical').length} critical, {alerts.filter(a => a.severity === 'warning').length} warning, {alerts.filter(a => a.severity === 'info').length} info
      </TooltipContent>
    </Tooltip>
  );
};
