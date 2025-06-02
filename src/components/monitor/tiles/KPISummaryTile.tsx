
import React from 'react';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface KPISummaryTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const KPISummaryTile: React.FC<KPISummaryTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const kpiData = {
    dei: 78,
    trust: 64,
    migration: 10
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="KPI Summary"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col justify-center items-center space-y-1">
              <div className="text-xs text-teal-400">
                DEI {kpiData.dei}%
              </div>
              <div className="text-xs text-blue-400">
                Trust {kpiData.trust}%
              </div>
              <div className="text-xs text-orange-400">
                Migration +{kpiData.migration}%
              </div>

              {isFullScreen && (
                <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-sm font-medium text-teal-400 mb-2">Year-to-Date Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-300">DEI Stability:</span>
                      <span className="text-xs text-teal-400">{kpiData.dei}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-300">Trust Index:</span>
                      <span className="text-xs text-blue-400">{kpiData.trust}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-300">Migration Flow:</span>
                      <span className="text-xs text-orange-400">+{kpiData.migration}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Top 3 KPIs: DEI {kpiData.dei}%, Trust {kpiData.trust}%, Migration +{kpiData.migration}%
      </TooltipContent>
    </Tooltip>
  );
};
