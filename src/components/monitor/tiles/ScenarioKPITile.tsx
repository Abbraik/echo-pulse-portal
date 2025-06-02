
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import SparklineChart from '@/components/think/components/SparklineChart';

interface ScenarioKPITileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const ScenarioKPITile: React.FC<ScenarioKPITileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const scenarioData = [0.10, 0.08, 0.06, 0.04, 0.02, 0.00];
  const actualData = [0.12, 0.11, 0.14, 0.10, 0.09, 0.11];

  const kpis = [
    { name: 'Population Dev', value: 0.02, status: 'good' },
    { name: 'Resource Stock', value: 0.92, status: 'good' },
    { name: 'Social Cohesion', value: 0.71, status: 'good' },
    { name: 'Trust Index', value: 0.64, status: 'warning' },
    { name: 'Migration Flow', value: 10, status: 'warning' },
    { name: 'Market Stability', value: 0.68, status: 'good' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="Scenario & KPIs"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col">
              {/* Mini line chart - top half */}
              <div className="flex-1 flex flex-col justify-center mb-2">
                <div className="text-xs text-gray-400 mb-1">Scenario vs Actual</div>
                <div className="relative">
                  <SparklineChart 
                    data={scenarioData} 
                    width={isFullScreen ? 200 : 100} 
                    height={30} 
                    color="#00FFC3" 
                  />
                  <div className="absolute top-0 left-0">
                    <SparklineChart 
                      data={actualData} 
                      width={isFullScreen ? 200 : 100} 
                      height={30} 
                      color="#F97316" 
                    />
                  </div>
                </div>
              </div>

              {/* KPI Heatmap - bottom half */}
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">KPI Status</div>
                <div className="grid grid-cols-2 gap-1 h-full">
                  {kpis.slice(0, isFullScreen ? 6 : 4).map((kpi, index) => (
                    <motion.div
                      key={index}
                      className={`p-1 rounded text-center ${getStatusColor(kpi.status)}/20 border ${getStatusColor(kpi.status).replace('bg-', 'border-')}/30`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-xs font-medium text-white">{kpi.name}</div>
                      <div className="text-xs text-gray-300">{kpi.value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-4 grid grid-cols-3 gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {kpis.map((kpi, index) => (
                    <div key={index} className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs font-medium text-teal-400">{kpi.name}</div>
                      <div className="text-sm text-white">{kpi.value}</div>
                      <div className={`w-full h-1 rounded mt-1 ${getStatusColor(kpi.status)}`} />
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Click for detailed Scenario Validation
      </TooltipContent>
    </Tooltip>
  );
};
