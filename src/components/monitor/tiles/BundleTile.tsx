
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface Bundle {
  id: string;
  name: string;
  success: number;
  roi: number;
  time: number;
}

interface BundleTileProps {
  bundle: Bundle;
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const BundleTile: React.FC<BundleTileProps> = ({
  bundle,
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const loopCoverage = [0.65, 0.72, 0.80];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title={bundle.name}
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                {/* Success percentage */}
                <div className="text-center">
                  <div className="text-lg font-medium text-teal-400">
                    {bundle.success}%
                  </div>
                  <div className="text-xs text-gray-400">Success</div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-teal-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${bundle.success}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </div>

                {/* ROI and Time */}
                <div className="text-xs text-gray-300 space-y-1">
                  <div>ROI +{bundle.roi}%</div>
                  <div>Time: {bundle.time} mo</div>
                </div>
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-6 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Sub-indicator table */}
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-sm font-medium text-teal-400 mb-2">Loop Coverage</h4>
                    <div className="space-y-2">
                      {loopCoverage.map((coverage, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-gray-300">Loop {index + 1}</span>
                          <span className="text-teal-400">{(coverage * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Promote to Learn ▶
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Refine Strategy ▶
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Loop Coverage: {loopCoverage.map(c => (c * 100).toFixed(0)).join('→')}%
      </TooltipContent>
    </Tooltip>
  );
};
