
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HandoffTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const HandoffTile: React.FC<HandoffTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const handoffData = {
    thinkToAct: { count: 4, avgDays: 2 },
    actToMonitor: { count: 3, avgDays: 1 }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="Handoff"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col justify-center">
              <div className="space-y-3">
                <div className="text-center mb-3">
                  <div className="text-sm font-medium text-teal-400">Handoff Queue</div>
                </div>

                {/* Think → Act bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Think→Act</span>
                    <span className="text-teal-400">{handoffData.thinkToAct.count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-teal-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(handoffData.thinkToAct.count / 7) * 100}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  </div>
                </div>

                {/* Act → Monitor bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Act→Monitor</span>
                    <span className="text-orange-400">{handoffData.actToMonitor.count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-orange-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(handoffData.actToMonitor.count / 7) * 100}%` }}
                      transition={{ delay: 0.7, duration: 1 }}
                    />
                  </div>
                </div>
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-6 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-sm font-medium text-teal-400 mb-2">Think→Act</h4>
                      <div className="space-y-1">
                        {Array.from({ length: handoffData.thinkToAct.count }, (_, i) => (
                          <div key={i} className="text-xs text-gray-300">
                            Bundle {i + 1} | submitted 05-28
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-sm font-medium text-orange-400 mb-2">Act→Monitor</h4>
                      <div className="space-y-1">
                        {Array.from({ length: handoffData.actToMonitor.count }, (_, i) => (
                          <div key={i} className="text-xs text-gray-300">
                            Bundle {i + 5} | submitted 05-29
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Think→Act: {handoffData.thinkToAct.count} (avg {handoffData.thinkToAct.avgDays}d), 
        Act→Monitor: {handoffData.actToMonitor.count} (avg {handoffData.actToMonitor.avgDays}d)
      </TooltipContent>
    </Tooltip>
  );
};
