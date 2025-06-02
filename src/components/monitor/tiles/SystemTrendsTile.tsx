
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import SparklineChart from '@/components/think/components/SparklineChart';

interface SystemTrendsTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const SystemTrendsTile: React.FC<SystemTrendsTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const trendData = {
    dei: [78, 79, 80, 81, 81, 82],
    trust: [60, 61, 62, 63, 63, 64],
    migration: [12, 11.5, 11, 10.8, 10.5, 10],
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="System Trends"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col">
              {/* Mini charts */}
              <div className="flex-1 flex flex-col justify-center space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-400">DEI</span>
                  <SparklineChart data={trendData.dei} width={60} height={15} color="#00FFC3" />
                  <span className="text-xs text-gray-300">↑4%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-400">Trust</span>
                  <SparklineChart data={trendData.trust} width={60} height={15} color="#3B82F6" />
                  <span className="text-xs text-gray-300">↑3%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400">Migration</span>
                  <SparklineChart data={trendData.migration} width={60} height={15} color="#10B981" />
                  <span className="text-xs text-gray-300">↓2%</span>
                </div>
              </div>

              {/* Summary text */}
              <div className="mt-2 text-xs text-gray-300 text-center">
                Last 6 months
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-6 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(trendData).map(([key, data]) => (
                      <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="text-sm font-medium text-teal-400 mb-2 capitalize">{key}</h4>
                        <SparklineChart data={data} width={200} height={40} color="#00FFC3" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Click to expand full trend view
      </TooltipContent>
    </Tooltip>
  );
};
