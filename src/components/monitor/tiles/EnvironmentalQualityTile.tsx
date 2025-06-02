
import React from 'react';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EnvironmentalQualityTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const EnvironmentalQualityTile: React.FC<EnvironmentalQualityTileProps> = ({ onCollapse, onFullScreen, isFullScreen = false }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="w-full h-full">
        <BaseTile title="Environmental Quality" onCollapse={onCollapse} onFullScreen={onFullScreen} isFullScreen={isFullScreen}>
          <div className="h-full flex flex-col justify-center items-center">
            <div className="text-sm font-bold text-green-400 mb-1">82%</div>
            <div className="w-8 h-8 rounded-full border-4 border-gray-700 border-t-green-400 mb-2" />
            <div className="text-xs text-gray-300">Env Quality</div>
          </div>
        </BaseTile>
      </div>
    </TooltipTrigger>
    <TooltipContent>Environmental Quality: 82% (Excellent)</TooltipContent>
  </Tooltip>
);
