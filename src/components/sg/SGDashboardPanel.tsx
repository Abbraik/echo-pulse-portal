
import React, { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { FullscreenButton } from '@/components/ui/fullscreen-button';

interface SGDashboardPanelProps {
  title: string;
  children: ReactNode;
  panelId: string;
  isHovered: boolean;
  isExpanded: boolean;
  isFullscreen: boolean;
  onHover: (panelId: string | null) => void;
  onToggleFullscreen: (panelId: string) => void;
  className?: string;
}

const SGDashboardPanel: React.FC<SGDashboardPanelProps> = ({
  title,
  children,
  panelId,
  isHovered,
  isExpanded,
  isFullscreen,
  onHover,
  onToggleFullscreen,
  className = ""
}) => {
  const getScale = () => {
    if (isFullscreen) return 1;
    if (isExpanded) return 1.05;
    if (isHovered && !isExpanded) return 0.95;
    return 1;
  };

  const getOpacity = () => {
    if (isFullscreen) return 1;
    if (isExpanded) return 1;
    if (isHovered && !isExpanded) return 0.85;
    return 1;
  };

  const getZIndex = () => {
    if (isFullscreen) return 50;
    if (isExpanded) return 30;
    return 10;
  };

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when this panel is expanded or fullscreen
      if (!isExpanded && !isFullscreen) return;

      switch (event.key) {
        case 'f':
        case 'F':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onToggleFullscreen(panelId);
          }
          break;
        case 'Escape':
          if (isFullscreen) {
            event.preventDefault();
            onToggleFullscreen(panelId);
          }
          break;
        case 'Enter':
          if (event.shiftKey && isExpanded && !isFullscreen) {
            event.preventDefault();
            onToggleFullscreen(panelId);
          }
          break;
      }
    };

    if (isExpanded || isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isExpanded, isFullscreen, panelId, onToggleFullscreen]);

  return (
    <motion.div
      className={`relative group ${className}`}
      style={{ zIndex: getZIndex() }}
      animate={{
        scale: getScale(),
        opacity: getOpacity(),
      }}
      transition={{
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1], // Custom easing for smoother transitions
      }}
      onMouseEnter={() => onHover(panelId)}
      onMouseLeave={() => onHover(null)}
      whileHover={{
        boxShadow: isExpanded ? "0 25px 50px -12px rgba(0, 255, 255, 0.25)" : "0 10px 25px -5px rgba(0, 255, 255, 0.1)"
      }}
    >
      <GlassCard className="h-full flex flex-col overflow-hidden glass-panel-cinematic border border-white/20 hover:border-teal-400/40 transition-all duration-500 backdrop-blur-xl">
        {/* Enhanced Panel Header with Better Controls */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 backdrop-blur-sm bg-white/5">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-2 h-8 bg-gradient-to-b from-teal-400 to-blue-500 rounded-full"
              animate={{
                height: isExpanded ? 10 : 8,
                background: isExpanded 
                  ? "linear-gradient(to bottom, #14b8a6, #3b82f6, #8b5cf6)" 
                  : "linear-gradient(to bottom, #14b8a6, #3b82f6)"
              }}
              transition={{ duration: 0.3 }}
            />
            <div>
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 font-noto">
                {title}
              </h3>
              {isExpanded && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-gray-400 font-mono mt-1"
                >
                  {isFullscreen ? "ESC to exit • " : "Shift+Enter for fullscreen • "}Ctrl+F to toggle
                </motion.p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Panel Status Indicator */}
            <motion.div
              className={`w-2 h-2 rounded-full ${
                isFullscreen ? 'bg-purple-400' : isExpanded ? 'bg-teal-400' : 'bg-blue-400'
              }`}
              animate={{ scale: isExpanded ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            />
            
            <FullscreenButton
              isFullscreen={isFullscreen}
              onToggle={() => onToggleFullscreen(panelId)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-teal-400 hover:text-teal-300 hover:bg-teal-500/20 backdrop-blur-sm border border-teal-500/30 hover:border-teal-400/50"
            />
          </div>
        </div>

        {/* Enhanced Panel Content with Better Scrolling */}
        <motion.div 
          className="flex-1 overflow-auto custom-scrollbar"
          animate={{
            padding: isExpanded ? "1.5rem" : "1rem"
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{
              scale: isExpanded ? 1.02 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>

        {/* Enhanced Hover Effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 opacity-0 pointer-events-none"
          animate={{
            opacity: isExpanded ? 0.3 : 0
          }}
          transition={{ duration: 0.5 }}
        />
      </GlassCard>
    </motion.div>
  );
};

export default SGDashboardPanel;
