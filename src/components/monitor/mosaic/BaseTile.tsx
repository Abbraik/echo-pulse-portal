
import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Minimize2, Maximize2, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface BaseTileProps {
  tileId: string;
  title: string;
  children: React.ReactNode;
  onFullScreen: (tileId: string | null) => void;
  onCollapse: (tileId: string, tileName: string, icon: string) => void;
  className?: string;
  isFullScreen?: boolean;
  icon?: string;
}

export const BaseTile: React.FC<BaseTileProps> = ({
  tileId,
  title,
  children,
  onFullScreen,
  onCollapse,
  className = '',
  isFullScreen = false,
  icon = '📊'
}) => {
  const handleFullScreen = () => {
    onFullScreen(isFullScreen ? null : tileId);
  };

  const handleCollapse = () => {
    onCollapse(tileId, title, icon);
  };

  return (
    <motion.div
      className={`h-full w-full rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden ${className}`}
      style={{
        background: 'rgba(20, 30, 50, 0.6)',
        boxShadow: 'inset 0 0 20px rgba(0, 255, 195, 0.1), 0 8px 16px rgba(0, 0, 0, 0.3)'
      }}
      whileHover={{ 
        y: -4,
        boxShadow: '0 8px 16px rgba(0, 255, 195, 0.4), inset 0 0 20px rgba(0, 255, 195, 0.2)'
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Header Bar */}
      <div 
        className="h-8 flex items-center justify-between px-3 border-b border-white/10"
        style={{ background: 'rgba(10, 20, 40, 0.8)' }}
      >
        <h3 className="text-sm font-bold" style={{ color: '#00FFC3' }}>
          {title}
        </h3>
        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className="p-1 rounded hover:bg-white/10 transition-colors drag-handle"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <GripVertical size={12} className="text-gray-400" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Drag to move</p>
            </TooltipContent>
          </Tooltip>

          {!isFullScreen && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={handleCollapse}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minimize2 size={12} className="text-gray-400" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Collapse tile</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                onClick={handleFullScreen}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isFullScreen ? (
                  <X size={12} className="text-gray-400" />
                ) : (
                  <Maximize2 size={12} className="text-gray-400" />
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullScreen ? 'Exit full screen' : 'Full screen'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Content Area */}
      <div className="h-[calc(100%-2rem)] p-3 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};
