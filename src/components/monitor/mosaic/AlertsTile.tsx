
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Info } from 'lucide-react';
import { BaseTile } from './BaseTile';

interface AlertsTileProps {
  onFullScreen: (tileId: string | null) => void;
  onCollapse: (tileId: string, tileName: string, icon: string) => void;
}

export const AlertsTile: React.FC<AlertsTileProps> = ({
  onFullScreen,
  onCollapse
}) => {
  const alerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'Data sync lag with Act Zone',
      timestamp: '05-30 10:12',
      icon: AlertTriangle,
      color: '#FF6E6E'
    },
    {
      id: 2,
      severity: 'warning',
      title: 'Loop Inconsistency detected',
      timestamp: '05-30 09:48',
      icon: Clock,
      color: '#FFC107'
    },
    {
      id: 3,
      severity: 'info',
      title: 'Minor UI glitch in Learn Canvas',
      timestamp: '05-30 09:30',
      icon: Info,
      color: '#4CAF50'
    }
  ];

  return (
    <BaseTile
      tileId="alerts"
      title="System Alerts"
      onFullScreen={onFullScreen}
      onCollapse={onCollapse}
      icon="🚨"
    >
      <div className="h-full flex flex-col">
        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-3">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              className="p-2 rounded-lg backdrop-blur-[16px] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              style={{ background: 'rgba(20, 30, 50, 0.4)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: alert.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: '#E0E0E0' }}>
                    {alert.title}
                  </div>
                  <div className="text-xs opacity-75" style={{ color: '#E0E0E0' }}>
                    {alert.timestamp}
                  </div>
                </div>
                <motion.button
                  className="text-xs px-2 py-0.5 rounded border"
                  style={{ 
                    color: '#00FFC3', 
                    borderColor: '#00FFC3',
                    backgroundColor: 'rgba(0, 255, 195, 0.1)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ▶
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.button
          className="text-xs text-center py-2 border-t border-white/10"
          style={{ color: '#00FFC3' }}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          View All Alerts ▶
        </motion.button>
      </div>
    </BaseTile>
  );
};
