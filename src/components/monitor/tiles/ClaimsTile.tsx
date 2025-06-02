
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ClaimsTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const ClaimsTile: React.FC<ClaimsTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const claimsData = {
    total: 12,
    oldest: 5,
    breakdown: { Think: 3, Act: 4, Learn: 2, Innovate: 3 }
  };

  const colors = ['#00FFC3', '#3B82F6', '#10B981', '#F59E0B'];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="Claims"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col justify-center items-center text-center">
              <div className="mb-3">
                <div className="text-lg font-bold text-teal-400">
                  {claimsData.total} Open Claims
                </div>
                <div className="text-xs text-gray-300">
                  Oldest = {claimsData.oldest} days
                </div>
              </div>

              {/* Mini bar showing distribution */}
              <div className="w-full mb-2">
                <div className="flex h-2 rounded-full overflow-hidden bg-gray-700">
                  {Object.entries(claimsData.breakdown).map(([zone, count], index) => (
                    <motion.div
                      key={zone}
                      className="h-full"
                      style={{ 
                        backgroundColor: colors[index],
                        width: `${(count / claimsData.total) * 100}%`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / claimsData.total) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-4 w-full space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm font-medium text-teal-400 mb-2">Claims by Zone</h4>
                    {Object.entries(claimsData.breakdown).map(([zone, count], index) => (
                      <div key={zone} className="flex justify-between items-center py-1">
                        <span className="text-xs text-gray-300">{zone}</span>
                        <span className="text-xs text-teal-400">{count}</span>
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
        Think: 3, Act: 4, Learn: 2, Innovate: 3
      </TooltipContent>
    </Tooltip>
  );
};
