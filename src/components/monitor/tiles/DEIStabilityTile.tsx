
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import SparklineChart from '@/components/think/components/SparklineChart';

interface DEIStabilityTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const DEIStabilityTile: React.FC<DEIStabilityTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const deiValue = 78;
  const inBandValue = 82;
  const sparklineData = [78, 79, 81, 83, 82, 82];

  // Calculate progress for the arc (82% of 360 degrees)
  const progress = (inBandValue / 100) * 360;
  const radius = isFullScreen ? 120 : 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 360) * circumference;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="DEI Stability"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="flex flex-col items-center justify-center h-full relative">
              {/* Radial Gauge */}
              <div className="relative mb-4">
                <svg width={radius * 2 + 16} height={radius * 2 + 16} className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx={radius + 8}
                    cy={radius + 8}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                  />
                  
                  {/* Progress arc */}
                  <motion.circle
                    cx={radius + 8}
                    cy={radius + 8}
                    r={radius}
                    fill="none"
                    stroke="#00FFC3"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    initial={{ strokeDashoffset: strokeDasharray }}
                    animate={{ strokeDashoffset }}
                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                    style={{ 
                      filter: 'drop-shadow(0 0 8px rgba(0, 255, 195, 0.6))'
                    }}
                  />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    className="text-2xl font-bold text-teal-400 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    DEI = {deiValue}%
                  </motion.div>
                  <motion.div
                    className="text-sm text-gray-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    {inBandValue}% in-band
                  </motion.div>
                </div>
              </div>

              {/* Sparkline */}
              <div className="w-full flex flex-col items-center">
                <div className="text-xs text-gray-400 mb-1">6-Month Trend</div>
                <SparklineChart 
                  data={sparklineData} 
                  width={isFullScreen ? 120 : 80} 
                  height={20} 
                  color="#00FFC3" 
                />
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-6 p-4 rounded-lg bg-teal-500/10 border border-teal-500/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-lg font-bold text-teal-400 mb-2">Recommendations</h4>
                  <p className="text-sm text-gray-300">
                    Consider adjusting policy parameters by +5% to optimize DEI stability within target range.
                  </p>
                </motion.div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        DEI: {deiValue}%, {inBandValue}% in target band
      </TooltipContent>
    </Tooltip>
  );
};
