
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';

interface DEIStabilityTileProps {
  onFullScreen: (tileId: string | null) => void;
  onCollapse: (tileId: string, tileName: string, icon: string) => void;
}

export const DEIStabilityTile: React.FC<DEIStabilityTileProps> = ({
  onFullScreen,
  onCollapse
}) => {
  const deiValue = 78;
  const inBandValue = 82;
  const sparklineData = [78, 79, 81, 83, 82, 82];

  const sparklinePoints = sparklineData.map((value, index) => {
    const x = (index * 100) / (sparklineData.length - 1);
    const y = 100 - ((value - 75) / 10) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <BaseTile
      tileId="dei"
      title="DEI Stability"
      onFullScreen={onFullScreen}
      onCollapse={onCollapse}
      icon="⚖️"
    >
      <div className="h-full flex flex-col items-center justify-center">
        {/* Radial Gauge */}
        <div className="relative mb-4">
          <svg width="160" height="160" className="transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="8"
            />
            
            {/* Progress Arc */}
            <motion.circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="#00FFC3"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - inBandValue / 100)}`}
              initial={{ strokeDashoffset: `${2 * Math.PI * 60}` }}
              animate={{ strokeDashoffset: `${2 * Math.PI * 60 * (1 - inBandValue / 100)}` }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 195, 0.6))' }}
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="text-2xl font-bold mb-1"
              style={{ color: '#00FFC3' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              DEI = {deiValue}%
            </motion.div>
            <motion.div
              className="text-sm"
              style={{ color: '#E0E0E0' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              {inBandValue}% in-band
            </motion.div>
          </div>
        </div>

        {/* Sparkline */}
        <div className="w-full max-w-[120px]">
          <svg width="100%" height="40" viewBox="0 0 100 100" className="mb-2">
            <motion.polyline
              points={sparklinePoints}
              fill="none"
              stroke="#00FFC3"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
            />
          </svg>
          <div className="text-xs text-center" style={{ color: '#E0E0E0' }}>
            6-Month Trend
          </div>
        </div>
      </div>
    </BaseTile>
  );
};
