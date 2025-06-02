
import React from 'react';
import { motion } from 'framer-motion';

interface ConnectorLinesProps {
  hoveredPod: string | null;
}

export const ConnectorLines: React.FC<ConnectorLinesProps> = ({ hoveredPod }) => {
  const centerX = 400;
  const centerY = 400;
  const hubRadius = 160;
  
  // Inner pod positions (radius 250px)
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
    if (!hoveredPod) return 0.3;
    return hoveredPod === podId || hoveredPod === 'hub' ? 1 : 0.1;
  };

  const getLineWidth = (podId: string) => {
    if (!hoveredPod) return 2;
    return hoveredPod === podId || hoveredPod === 'hub' ? 4 : 2;
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {/* Inner pod connectors */}
      {innerPods.map((pod) => {
        const angle = (pod.angle * Math.PI) / 180;
        const startX = centerX + hubRadius * Math.cos(angle);
        const startY = centerY + hubRadius * Math.sin(angle);
        const endX = centerX + 250 * Math.cos(angle);
        const endY = centerY + 250 * Math.sin(angle);

        return (
          <motion.line
            key={`inner-${pod.id}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="rgba(20, 184, 166, 1)"
            strokeWidth={getLineWidth(pod.id)}
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: getLineOpacity(pod.id),
              strokeWidth: getLineWidth(pod.id)
            }}
            transition={{ delay: 1, duration: 0.8 }}
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
            stroke="rgba(20, 184, 166, 0.6)"
            strokeWidth={getLineWidth(pod.id)}
            strokeDasharray="3,3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: getLineOpacity(pod.id) * 0.6,
              strokeWidth: getLineWidth(pod.id)
            }}
            transition={{ delay: 1.5, duration: 0.8 }}
          />
        );
      })}
    </svg>
  );
};
