
import React from 'react';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EmploymentRateTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const EmploymentRateTile: React.FC<EmploymentRateTileProps> = ({ onCollapse, onFullScreen, isFullScreen = false }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="w-full h-full">
        <BaseTile title="Employment Rate" onCollapse={onCollapse} onFullScreen={onFullScreen} isFullScreen={isFullScreen}>
          <div className="h-full flex flex-col justify-center items-center">
            <div className="text-sm font-bold text-green-400 mb-1">72%</div>
            <div className="text-xs text-green-400 mb-2">↑</div>
            <div className="text-xs text-gray-300">Employment</div>
          </div>
        </BaseTile>
      </div>
    </TooltipTrigger>
    <TooltipContent>Employment Rate: 72% (Increasing)</TooltipContent>
  </Tooltip>
);
