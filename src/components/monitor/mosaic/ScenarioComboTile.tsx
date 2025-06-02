
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';

interface ScenarioComboTileProps {
  onFullScreen: (tileId: string | null) => void;
  onCollapse: (tileId: string, tileName: string, icon: string) => void;
}

export const ScenarioComboTile: React.FC<ScenarioComboTileProps> = ({
  onFullScreen,
  onCollapse
}) => {
  const scenarioData = [0.10, 0.08, 0.06, 0.04, 0.02, 0.00];
  const actualData = [0.12, 0.11, 0.14, 0.10, 0.09, 0.11];

  const kpiData = [
    { name: 'Pop Dev', value: 0.02, status: 'good' },
    { name: 'Resource', value: 0.92, status: 'good' },
    { name: 'Social', value: 0.71, status: 'good' },
    { name: 'Trust', value: 0.64, status: 'good' },
    { name: 'Migration', value: 0.10, status: 'warning' },
    { name: 'Market', value: 0.68, status: 'good' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#4CAF50';
      case 'warning': return '#FFC107';
      case 'critical': return '#FF6E6E';
      default: return '#E0E0E0';
    }
  };

  return (
    <BaseTile
      tileId="scenario"
      title="Scenario vs Actual"
      onFullScreen={onFullScreen}
      onCollapse={onCollapse}
      icon="📈"
    >
      <div className="h-full flex flex-col">
        {/* Line Chart */}
        <div className="flex-1 mb-3">
          <svg width="100%" height="60" viewBox="0 0 100 60">
            {/* Scenario Line (Dashed) */}
            <motion.polyline
              points={scenarioData.map((value, index) => 
                `${(index * 100) / (scenarioData.length - 1)},${60 - (value * 300)}`
              ).join(' ')}
              fill="none"
              stroke="#00FFC3"
              strokeWidth="2"
              strokeDasharray="3,3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            />
            
            {/* Actual Line (Solid) */}
            <motion.polyline
              points={actualData.map((value, index) => 
                `${(index * 100) / (actualData.length - 1)},${60 - (value * 300)}`
              ).join(' ')}
              fill="none"
              stroke="#FF6E6E"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            />
          </svg>
        </div>

        {/* KPI Heatmap */}
        <div className="grid grid-cols-3 gap-1">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.name}
              className="p-1 rounded text-center text-xs"
              style={{ 
                backgroundColor: `${getStatusColor(kpi.status)}20`,
                borderLeft: `3px solid ${getStatusColor(kpi.status)}`
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
            >
              <div className="font-medium" style={{ color: '#E0E0E0' }}>
                {kpi.name}
              </div>
              <div className="text-xs" style={{ color: getStatusColor(kpi.status) }}>
                {typeof kpi.value === 'number' && kpi.value < 1 
                  ? kpi.value.toFixed(2) 
                  : kpi.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseTile>
  );
};
