import React, { useState } from 'react';
import { RotateCw, Settings, Activity, Cpu, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ReflexEngineStatusProps {
  isActive?: boolean;
  onToggle?: () => void;
}

export const ReflexEngineStatus: React.FC<ReflexEngineStatusProps> = ({ 
  isActive = true, 
  onToggle 
}) => {
  const [showFlyout, setShowFlyout] = useState(false);

  const handleChipClick = () => {
    setShowFlyout(!showFlyout);
  };

  return (
    <div className="relative">
      {/* Status Chip */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleChipClick}
        className={`flex items-center space-x-2 text-xs px-3 py-1 rounded-full border transition-all duration-200 ${
          isActive 
            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30' 
            : 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30'
        }`}
        aria-label="Reflex Engine Status"
      >
        <motion.div
          animate={{ rotate: isActive ? 360 : 0 }}
          transition={{ 
            duration: 2, 
            repeat: isActive ? Infinity : 0, 
            ease: "linear" 
          }}
        >
          <RotateCw size={12} />
        </motion.div>
        <span className="font-medium">Reflex Engine: {isActive ? 'Active' : 'Inactive'}</span>
      </Button>

      {/* Global Flyout */}
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-80 glass-panel-deep p-4 z-50"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <RefreshCw size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Reflex Engine Control</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFlyout(false)}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </Button>
            </div>

            {/* Status Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-sm font-medium">{isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Processing Rate</span>
                <span className="text-sm font-medium">147 ops/sec</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Cycle</span>
                <span className="text-sm font-medium">2m ago</span>
              </div>
            </div>

            {/* Control Actions */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
              <Button
                variant={isActive ? "destructive" : "default"}
                size="sm"
                onClick={onToggle}
                className="w-full justify-start text-sm"
              >
                <Activity size={14} className="mr-2" />
                {isActive ? 'Pause Engine' : 'Start Engine'}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
              >
                <Settings size={14} className="mr-2" />
                Configure Parameters
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
              >
                <Cpu size={14} className="mr-2" />
                View Diagnostics
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};