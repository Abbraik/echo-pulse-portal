
import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggle: () => void;
  className?: string;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  isFullscreen,
  onToggle,
  className = ""
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className={`opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 ${className}`}
        aria-expanded={isFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen (Esc)" : "Enter fullscreen (Shift+Enter)"}
      >
        <motion.div
          animate={{ rotate: isFullscreen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </motion.div>
      </Button>
    </motion.div>
  );
};
