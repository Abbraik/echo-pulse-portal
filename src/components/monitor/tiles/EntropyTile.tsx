
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import SparklineChart from '@/components/think/components/SparklineChart';

interface EntropyTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const EntropyTile: React.FC<EntropyTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const entropyData = {
    Think: { current: 0.24, trend: [0.20, 0.22, 0.24], direction: '↑' },
    Act: { current: 0.30, trend: [0.28, 0.30, 0.29], direction: '↓' },
    Monitor: { current: 0.27, trend: [0.25, 0.27, 0.27], direction: '→' },
    Learn: { current: 0.18, trend: [0.15, 0.17, 0.18], direction: '↑' },
    Innovate: { current: 0.22, trend: [0.20, 0.22, 0.21], direction: '↓' },
  };

  const colors = ['#00FFC3', '#3B82F6', '#F97316', '#10B981', '#F59E0B'];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="Zone Entropy"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col">
              <div className="space-y-2 flex-1">
                {Object.entries(entropyData).map(([zone, data], index) => (
                  <motion.div
                    key={zone}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-xs text-gray-300 w-8">{zone[0]}</span>
                    <div className="flex-1 mx-2">
                      <SparklineChart 
                        data={data.trend} 
                        width={isFullScreen ? 60 : 40} 
                        height={12} 
                        color={colors[index]} 
                      />
                    </div>
                    <span className="text-xs text-gray-300 w-12">
                      {data.current.toFixed(2)} {data.direction}
                    </span>
                  </motion.div>
                ))}
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-6 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {Object.entries(entropyData).map(([zone, data], index) => (
                    <div key={zone} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-teal-400">{zone} Zone</h4>
                        <span className="text-lg font-bold" style={{ color: colors[index] }}>
                          {data.current.toFixed(2)}
                        </span>
                      </div>
                      <SparklineChart 
                        data={data.trend} 
                        width={200} 
                        height={30} 
                        color={colors[index]} 
                      />
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Click for detailed entropy analysis
      </TooltipContent>
    </Tooltip>
  );
};
