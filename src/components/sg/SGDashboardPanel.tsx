
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

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
    if (isExpanded) return 1.1;
    if (isHovered && !isExpanded) return 0.9;
    return 1;
  };

  const getOpacity = () => {
    if (isFullscreen) return 1;
    if (isExpanded) return 1;
    if (isHovered && !isExpanded) return 0.8;
    return 1;
  };

  return (
    <motion.div
      className={`relative group ${className}`}
      animate={{
        scale: getScale(),
        opacity: getOpacity(),
      }}
      transition={{
        duration: 0.2,
        ease: 'easeOut'
      }}
      onMouseEnter={() => onHover(panelId)}
      onMouseLeave={() => onHover(null)}
    >
      <GlassCard className="h-full flex flex-col overflow-hidden">
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white/90 font-noto">
            {title}
          </h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleFullscreen(panelId)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-teal-400 hover:text-teal-300"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 p-4 overflow-auto">
          {children}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default SGDashboardPanel;
