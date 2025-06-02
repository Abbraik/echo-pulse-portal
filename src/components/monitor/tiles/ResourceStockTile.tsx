
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ResourceStockTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const ResourceStockTile: React.FC<ResourceStockTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const stockData = {
    ratio: 0.92,
    status: 'good'
  };

  const progress = stockData.ratio * 100;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="Resource Stock"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col justify-center items-center">
              <div className="relative mb-2">
                <svg width="70" height="70" className="transform -rotate-90">
                  <circle
                    cx="35"
                    cy="35"
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="35"
                    cy="35"
                    r={radius}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-400">
                    {stockData.ratio.toFixed(2)}×
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-gray-300 text-center">
                vs Target
              </div>
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Resource Stock: {stockData.ratio}× vs Target (Good)
      </TooltipContent>
    </Tooltip>
  );
};
