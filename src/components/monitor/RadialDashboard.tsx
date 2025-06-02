
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubWidget } from './radial/HubWidget';
import { InnerSpoke } from './radial/InnerSpoke';
import { OuterSpoke } from './radial/OuterSpoke';

export const RadialDashboard: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Calculate positions for spokes
  const innerRadius = 280;
  const outerRadius = 420;
  const centerX = 400;
  const centerY = 400;

  // Inner spokes positions (4 spokes)
  const innerSpokes = [
    { angle: 0, x: centerX + innerRadius, y: centerY, type: 'bundle' },
    { angle: 90, x: centerX, y: centerY - innerRadius, type: 'resource' },
    { angle: 180, x: centerX - innerRadius, y: centerY, type: 'scenario' },
    { angle: 270, x: centerX, y: centerY + innerRadius, type: 'trust' }
  ];

  // Outer spokes positions (6 spokes)
  const outerSpokes = [
    { angle: 30, x: centerX + outerRadius * Math.cos(Math.PI/6), y: centerY - outerRadius * Math.sin(Math.PI/6), type: 'claims' },
    { angle: 90, x: centerX, y: centerY - outerRadius, type: 'handoff' },
    { angle: 150, x: centerX - outerRadius * Math.cos(Math.PI/6), y: centerY - outerRadius * Math.sin(Math.PI/6), type: 'entropy-think' },
    { angle: 210, x: centerX - outerRadius * Math.cos(Math.PI/6), y: centerY + outerRadius * Math.sin(Math.PI/6), type: 'entropy-act' },
    { angle: 270, x: centerX, y: centerY + outerRadius, type: 'alerts' },
    { angle: 330, x: centerX + outerRadius * Math.cos(Math.PI/6), y: centerY + outerRadius * Math.sin(Math.PI/6), type: 'risk' }
  ];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isFullscreen]);

  const dashboardContent = (
    <div className="relative w-full h-[800px]">
      {/* SVG for connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {/* Connect hub to inner spokes */}
        {innerSpokes.map((spoke, index) => (
          <motion.line
            key={`inner-${index}`}
            x1={centerX}
            y1={centerY}
            x2={spoke.x}
            y2={spoke.y}
            stroke="rgba(20, 184, 166, 0.3)"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
          />
        ))}
        
        {/* Connect hub to outer spokes */}
        {outerSpokes.map((spoke, index) => (
          <motion.line
            key={`outer-${index}`}
            x1={centerX}
            y1={centerY}
            x2={spoke.x}
            y2={spoke.y}
            stroke="rgba(20, 184, 166, 0.2)"
            strokeWidth="1"
            strokeDasharray="3,3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ delay: 1.5 + index * 0.1, duration: 0.8 }}
          />
        ))}
      </svg>

      {/* Center Hub Widget */}
      <div 
        className="absolute"
        style={{
          left: centerX - 100,
          top: centerY - 100,
          zIndex: 10
        }}
      >
        <HubWidget />
      </div>

      {/* Inner Ring Spokes */}
      {innerSpokes.map((spoke, index) => (
        <div
          key={`inner-spoke-${index}`}
          className="absolute"
          style={{
            left: spoke.x - 60,
            top: spoke.y - 60,
            zIndex: 5
          }}
        >
          <InnerSpoke type={spoke.type} index={index} />
        </div>
      ))}

      {/* Outer Ring Spokes */}
      {outerSpokes.map((spoke, index) => (
        <div
          key={`outer-spoke-${index}`}
          className="absolute"
          style={{
            left: spoke.x - 50,
            top: spoke.y - 50,
            zIndex: 5
          }}
        >
          <OuterSpoke type={spoke.type} index={index} />
        </div>
      ))}

      {/* Full-Screen Toggle */}
      <div className="absolute top-4 right-4 z-20">
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
      <div className="absolute top-4 left-4 z-20">
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
          <div className="absolute top-4 right-4 z-30">
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
            <div style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}>
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
