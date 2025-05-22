
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FabButtonProps {
  onClick: () => void;
  tooltip: string;
  icon: React.ReactNode;
}

export const FabButton: React.FC<FabButtonProps> = ({ onClick, tooltip, icon }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-all duration-300 animate-float-subtle"
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
