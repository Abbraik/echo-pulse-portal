
import React from 'react';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HouseholdRevenueTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const HouseholdRevenueTile: React.FC<HouseholdRevenueTileProps> = ({ onCollapse, onFullScreen, isFullScreen = false }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="w-full h-full">
        <BaseTile title="Household Revenue" onCollapse={onCollapse} onFullScreen={onFullScreen} isFullScreen={isFullScreen}>
          <div className="h-full flex flex-col justify-center items-center">
            <div className="text-sm font-bold text-green-400 mb-1">54k</div>
            <div className="text-xs text-green-400 mb-2">↑</div>
            <div className="text-xs text-gray-300">AED</div>
          </div>
        </BaseTile>
      </div>
    </TooltipTrigger>
    <TooltipContent>Household Revenue: 54k AED (Growing)</TooltipContent>
  </Tooltip>
);
