
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
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isModalOpen) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isModalOpen]);

  return (
    <motion.div
      className="w-full h-[800px] rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden p-6"
      style={{
        background: 'rgba(10, 20, 40, 0.6)',
        boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative w-full h-full overflow-hidden">
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
          />
        </div>

        {/* First Concentric Ring: Pillar Quadrants */}
        <PillarQuadrants 
          onHover={setHoveredElement}
          onModalToggle={setIsModalOpen}
        />

        {/* Second Concentric Ring: Inner Strategic Pods */}
        <InnerStrategicPods 
          onHover={setHoveredElement}
          onModalToggle={setIsModalOpen}
        />

        {/* Second Concentric Ring: Outer Operational Pods */}
        <OuterOperationalPods 
          onHover={setHoveredElement}
          onModalToggle={setIsModalOpen}
        />

        {/* Data Refresh Indicator */}
        <div className="absolute top-4 left-4 z-40">
          <motion.div
            className="w-3 h-3 rounded-full bg-teal-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
};
