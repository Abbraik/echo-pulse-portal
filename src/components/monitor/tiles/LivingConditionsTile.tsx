
import React from 'react';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LivingConditionsTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const LivingConditionsTile: React.FC<LivingConditionsTileProps> = ({ onCollapse, onFullScreen, isFullScreen = false }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="w-full h-full">
        <BaseTile title="Living Conditions" onCollapse={onCollapse} onFullScreen={onFullScreen} isFullScreen={isFullScreen}>
          <div className="h-full flex flex-col justify-center items-center">
            <div className="text-sm font-bold text-yellow-400 mb-1">30%</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '30%' }} />
            </div>
            <div className="text-xs text-gray-300">Consumption</div>
          </div>
        </BaseTile>
      </div>
    </TooltipTrigger>
    <TooltipContent>Living Conditions Consumption: 30%</TooltipContent>
  </Tooltip>
);
