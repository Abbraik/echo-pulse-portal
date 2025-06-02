
import React from 'react';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CapacityUtilizationTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const CapacityUtilizationTile: React.FC<CapacityUtilizationTileProps> = ({ onCollapse, onFullScreen, isFullScreen = false }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="w-full h-full">
        <BaseTile title="Capacity Utilization" onCollapse={onCollapse} onFullScreen={onFullScreen} isFullScreen={isFullScreen}>
          <div className="h-full flex flex-col justify-center items-center">
            <div className="text-sm font-bold text-green-400 mb-1">0.85</div>
            <div className="w-8 h-8 rounded-full border-4 border-gray-700 border-t-green-400 mb-2" />
            <div className="text-xs text-gray-300">Utilization</div>
          </div>
        </BaseTile>
      </div>
    </TooltipTrigger>
    <TooltipContent>Capacity Utilization: 85% (Good)</TooltipContent>
  </Tooltip>
);
