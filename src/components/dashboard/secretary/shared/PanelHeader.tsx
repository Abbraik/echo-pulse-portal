
import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  subtitle,
  onToggleFullscreen,
  isFullscreen
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div>
        <h3 className="font-bold text-white">{title}</h3>
        {subtitle && (
          <p className="text-xs text-gray-400">{subtitle}</p>
        )}
      </div>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleFullscreen}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/10 hover:bg-white/20 text-white h-8 w-8 p-0"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </Button>
      </motion.div>
    </div>
  );
};

export default PanelHeader;
