
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import SparklineChart from '@/components/think/components/SparklineChart';

interface PopulationDeviationTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const PopulationDeviationTile: React.FC<PopulationDeviationTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const popData = {
    deviation: 0.02,
    trend: 'up',
    yearData: [0.01, 0.015, 0.018, 0.019, 0.02, 0.02]
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="Population Deviation"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col justify-center items-center">
              <motion.div
                className="text-lg font-bold text-green-400 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {popData.deviation.toFixed(2)}
              </motion.div>
              
              <div className="text-xs text-green-400 mb-2">
                {popData.trend === 'up' ? '↑' : popData.trend === 'down' ? '↓' : '→'}
              </div>

              {!isFullScreen && (
                <div className="w-full px-2">
                  <SparklineChart 
                    data={popData.yearData} 
                    width={60} 
                    height={15} 
                    color="#10B981" 
                  />
                </div>
              )}

              {isFullScreen && (
                <motion.div
                  className="mt-4 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm font-medium text-teal-400 mb-2">12-Month Trend</h4>
                    <SparklineChart 
                      data={popData.yearData} 
                      width={200} 
                      height={60} 
                      color="#10B981" 
                    />
                    <div className="mt-2 text-xs text-gray-300">
                      Steady positive deviation indicating controlled growth
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Population Deviation: {popData.deviation.toFixed(2)} (positive growth)
      </TooltipContent>
    </Tooltip>
  );
};
