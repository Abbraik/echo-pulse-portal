
import React from 'react';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RenewalConsumptionTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const RenewalConsumptionTile: React.FC<RenewalConsumptionTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="Renewal vs Consumption"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col justify-center items-center">
              <div className="text-sm font-bold text-teal-400 mb-1">1.05× / 1.00×</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div className="bg-teal-400 h-2 rounded-full" style={{ width: '52%' }} />
              </div>
              <div className="text-xs text-gray-300">Renewal / Consumption</div>
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>Renewal 1.05× vs Consumption 1.00×</TooltipContent>
    </Tooltip>
  );
};
