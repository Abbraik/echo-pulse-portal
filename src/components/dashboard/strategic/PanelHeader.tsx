
import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PanelHeaderProps {
  title: string;
  icon: React.ReactNode;
  onFullscreen: () => void;
  className?: string;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  icon,
  onFullscreen,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-between p-4 border-b border-white/10 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
          {title}
        </h2>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={onFullscreen}
          className="opacity-70 hover:opacity-100 transition-opacity duration-250 bg-white/10 hover:bg-white/20"
          aria-label="Enter fullscreen"
        >
          <Maximize2 size={14} />
        </Button>
      </motion.div>
    </div>
  );
};
