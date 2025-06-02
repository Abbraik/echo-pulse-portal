
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';

interface EntropyTileProps {
  onFullScreen: (tileId: string | null) => void;
  onCollapse: (tileId: string, tileName: string, icon: string) => void;
}

export const EntropyTile: React.FC<EntropyTileProps> = ({
  onFullScreen,
  onCollapse
}) => {
  const entropyData = [
    { zone: 'T', value: 0.24, trend: [0.20, 0.22, 0.24], direction: '↑' },
    { zone: 'A', value: 0.30, trend: [0.28, 0.30, 0.29], direction: '↓' },
    { zone: 'M', value: 0.27, trend: [0.25, 0.27, 0.27], direction: '→' },
    { zone: 'L', value: 0.18, trend: [0.15, 0.17, 0.18], direction: '↑' },
    { zone: 'I', value: 0.22, trend: [0.20, 0.22, 0.21], direction: '↓' }
  ];

  return (
    <BaseTile
      tileId="entropy"
      title="Zone Entropy"
      onFullScreen={onFullScreen}
      onCollapse={onCollapse}
      icon="📊"
    >
      <div className="h-full">
        <div className="grid grid-cols-5 gap-2 h-full">
          {entropyData.map((zone, index) => (
            <div key={zone.zone} className="flex flex-col justify-between">
              {/* Zone Label */}
              <div className="text-xs font-bold text-center mb-1" style={{ color: '#00FFC3' }}>
                {zone.zone}
              </div>

              {/* Sparkline */}
              <div className="flex-1 flex items-center">
                <svg width="100%" height="20" viewBox="0 0 30 20">
                  <motion.polyline
                    points={zone.trend.map((value, i) => 
                      `${(i * 30) / (zone.trend.length - 1)},${20 - (value * 50)}`
                    ).join(' ')}
                    fill="none"
                    stroke="#00FFC3"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                  />
                </svg>
              </div>

              {/* Current Value */}
              <div className="text-center">
                <div className="text-xs font-medium" style={{ color: '#E0E0E0' }}>
                  {zone.value.toFixed(2)}
                </div>
                <div className="text-xs" style={{ color: '#00FFC3' }}>
                  {zone.direction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseTile>
  );
};
