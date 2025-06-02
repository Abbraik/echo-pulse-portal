
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CentralHub } from './radial/CentralHub';
import { PillarQuadrants } from './radial/PillarQuadrants';
import { InnerStrategicPods } from './radial/InnerStrategicPods';
import { OuterOperationalPods } from './radial/OuterOperationalPods';
import { RadialConnectors } from './radial/RadialConnectors';

export const RadialDashboard: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isFullscreen]);

  const dashboardContent = (
    <div className="relative w-full h-[800px] overflow-hidden">
      {/* Radial Connectors */}
      <RadialConnectors 
        hoveredElement={hoveredElement}
        isModalOpen={isModalOpen}
      />

      {/* Central Hub (DEI Stability) */}
      <div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 30 }}
        onMouseEnter={() => setHoveredElement('hub')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        <CentralHub 
          onModalToggle={setIsModalOpen}
          onFullscreenToggle={toggleFullscreen}
        />
      </div>

      {/* Pillar Quadrant Ring */}
      <PillarQuadrants 
        onHover={setHoveredElement}
        onModalToggle={setIsModalOpen}
      />

      {/* Inner Strategic Pods Ring */}
      <InnerStrategicPods 
        onHover={setHoveredElement}
        onModalToggle={setIsModalOpen}
      />

      {/* Outer Operational Pods Ring */}
      <OuterOperationalPods 
        onHover={setHoveredElement}
        onModalToggle={setIsModalOpen}
      />

      {/* Full-Screen Toggle */}
      <div className="absolute top-4 right-4 z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="text-gray-400 hover:text-teal-400"
        >
          <Maximize2 size={20} />
        </Button>
      </div>

      {/* Data Refresh Indicator */}
      <div className="absolute top-4 left-4 z-40">
        <motion.div
          className="w-3 h-3 rounded-full bg-teal-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute inset-4 rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden"
          style={{
            background: 'rgba(10, 20, 40, 0.8)',
            boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="text-gray-400 hover:text-red-400"
            >
              <X size={20} />
            </Button>
          </div>
          
          <div className="w-full h-full flex items-center justify-center p-8">
            <div style={{ transform: 'scale(1.4)', transformOrigin: 'center' }}>
              {dashboardContent}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden p-6"
      style={{
        background: 'rgba(10, 20, 40, 0.6)',
        boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {dashboardContent}
    </motion.div>
  );
};
