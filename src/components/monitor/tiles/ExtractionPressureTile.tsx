
import React from 'react';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ExtractionPressureTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const ExtractionPressureTile: React.FC<ExtractionPressureTileProps> = ({ onCollapse, onFullScreen, isFullScreen = false }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="w-full h-full">
        <BaseTile title="Extraction Pressure" onCollapse={onCollapse} onFullScreen={onFullScreen} isFullScreen={isFullScreen}>
          <div className="h-full flex flex-col justify-center items-center">
            <div className="text-sm font-bold text-orange-400 mb-1">0.35</div>
            <div className="text-xs text-orange-400 mb-2">↗</div>
            <div className="text-xs text-gray-300">Pressure Index</div>
          </div>
        </BaseTile>
      </div>
    </TooltipTrigger>
    <TooltipContent>Extraction Pressure: 0.35 (Moderate)</TooltipContent>
  </Tooltip>
);
