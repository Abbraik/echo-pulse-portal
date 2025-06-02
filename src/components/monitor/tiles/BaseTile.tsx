
import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Minus, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface BaseTileProps {
  title: string;
  children: React.ReactNode;
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
  className?: string;
}

export const BaseTile: React.FC<BaseTileProps> = ({
  title,
  children,
  onCollapse,
  onFullScreen,
  isFullScreen = false,
  className = '',
}) => {
  return (
    <motion.div
      className={`w-full h-full rounded-2xl border overflow-hidden ${className}`}
      style={{
        background: 'rgba(20, 30, 50, 0.6)',
        backdropFilter: 'blur(24px)',
        borderColor: 'rgba(20, 184, 166, 0.3)',
        boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15)'
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 8px 16px rgba(0, 255, 195, 0.4), inset 0 0 30px rgba(20, 184, 166, 0.15)'
      }}
      transition={{ duration: 0.2 }}
      layout={!isFullScreen}
    >
      {/* Header */}
      <div 
        className="h-8 px-3 flex items-center justify-between relative z-10"
        style={{ background: 'rgba(10, 20, 40, 0.8)' }}
      >
        <h3 className="text-sm font-bold text-teal-400 font-noto-bold truncate">
          {title}
        </h3>
        
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-teal-500/20 text-teal-400"
                style={{ cursor: 'grab' }}
              >
                <GripVertical size={12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Drag to move</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-teal-500/20 text-teal-400"
                onClick={onCollapse}
              >
                <Minus size={12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Collapse</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-teal-500/20 text-teal-400"
                onClick={onFullScreen}
              >
                <Maximize2 size={12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Full screen</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 h-[calc(100%-32px)] overflow-auto">
        {children}
      </div>
    </motion.div>
  );
};
