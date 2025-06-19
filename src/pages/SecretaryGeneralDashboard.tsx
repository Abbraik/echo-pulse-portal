
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/ui/motion';
import RoleBanner from '@/components/dashboard/secretary/RoleBanner';
import LoopRibbon from '@/components/dashboard/secretary/LoopRibbon';
import DynamicPanelGrid from '@/components/dashboard/secretary/DynamicPanelGrid';

const SecretaryGeneralDashboard: React.FC = () => {
  const [fullscreenPanel, setFullscreenPanel] = useState<string | null>(null);

  const handleToggleFullscreen = (panelId: string) => {
    setFullscreenPanel(fullscreenPanel === panelId ? null : panelId);
  };

  const handleExitFullscreen = () => {
    setFullscreenPanel(null);
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Role Banner - 10% Height */}
        <motion.div 
          className="h-[10vh] relative z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <RoleBanner />
        </motion.div>

        {/* Loop Ribbon */}
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <LoopRibbon />
        </motion.div>

        {/* Dynamic Panel Grid - 90% Height */}
        <motion.div 
          className="h-[85vh] p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <DynamicPanelGrid
            fullscreenPanel={fullscreenPanel}
            onToggleFullscreen={handleToggleFullscreen}
            onExitFullscreen={handleExitFullscreen}
          />
        </motion.div>

        {/* Fullscreen Overlay */}
        {fullscreenPanel && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleExitFullscreen}
          />
        )}
      </div>
    </AnimatedPage>
  );
};

export default SecretaryGeneralDashboard;
