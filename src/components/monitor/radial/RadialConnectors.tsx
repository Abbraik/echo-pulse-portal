
import React from 'react';
import { motion } from 'framer-motion';

interface RadialConnectorsProps {
  hoveredElement: string | null;
  isModalOpen: boolean;
}

export const RadialConnectors: React.FC<RadialConnectorsProps> = ({ 
  hoveredElement, 
  isModalOpen 
}) => {
  const centerX = 400;
  const centerY = 400;
  const hubRadius = 150;
  
  // Inner pod positions (radius 280px)
  const innerPods = [
    { id: 'bundle-success', angle: 30 },
    { id: 'trend-charts', angle: 150 },
    { id: 'scenario-validation', angle: 270 }
  ];

  // Outer pod positions (radius 360px)
  const outerPods = [
    { id: 'claims', angle: 0 },
    { id: 'handoff', angle: 60 },
    { id: 'think-entropy', angle: 120 },
    { id: 'act-entropy', angle: 180 },
    { id: 'monitor-entropy', angle: 240 },
    { id: 'alerts-risk', angle: 300 }
  ];

  const getLineOpacity = (podId: string) => {
    if (isModalOpen) return 0;
    if (!hoveredElement) return 0.5;
    return hoveredElement === podId || hoveredElement === 'hub' ? 1 : 0.2;
  };

  const getLineWidth = (podId: string) => {
    if (isModalOpen) return 2;
    if (!hoveredElement) return 2;
    return hoveredElement === podId || hoveredElement === 'hub' ? 4 : 2;
  };

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ zIndex: 1 }}
      width="800" 
      height="800"
    >
      {/* Inner pod connectors */}
      {innerPods.map((pod) => {
        const angle = (pod.angle * Math.PI) / 180;
        const startX = centerX + hubRadius * Math.cos(angle);
        const startY = centerY + hubRadius * Math.sin(angle);
        const endX = centerX + 280 * Math.cos(angle);
        const endY = centerY + 280 * Math.sin(angle);

        return (
          <motion.line
            key={`inner-${pod.id}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="#00FFC3"
            strokeWidth={getLineWidth(pod.id)}
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: getLineOpacity(pod.id),
              strokeWidth: getLineWidth(pod.id)
            }}
            transition={{ delay: 1.6, duration: 0.8 }}
          />
        );
      })}

      {/* Outer pod connectors */}
      {outerPods.map((pod) => {
        const angle = (pod.angle * Math.PI) / 180;
        const startX = centerX + hubRadius * Math.cos(angle);
        const startY = centerY + hubRadius * Math.sin(angle);
        const endX = centerX + 360 * Math.cos(angle);
        const endY = centerY + 360 * Math.sin(angle);

        return (
          <motion.line
            key={`outer-${pod.id}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="#00FFC3"
            strokeWidth={getLineWidth(pod.id)}
            strokeDasharray="3,3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: getLineOpacity(pod.id) * 0.6,
              strokeWidth: getLineWidth(pod.id)
            }}
            transition={{ delay: 2, duration: 0.8 }}
          />
        );
      })}
    </svg>
  );
};
