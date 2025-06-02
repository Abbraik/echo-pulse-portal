
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';

interface RiskMatrixTileProps {
  onFullScreen: (tileId: string | null) => void;
  onCollapse: (tileId: string, tileName: string, icon: string) => void;
}

export const RiskMatrixTile: React.FC<RiskMatrixTileProps> = ({
  onFullScreen,
  onCollapse
}) => {
  const riskPins = [
    { name: 'Population Surge', x: 75, y: 75, color: '#FF6E6E' },
    { name: 'Extraction Over-Quota', x: 75, y: 25, color: '#FFC107' },
    { name: 'Loop Drift', x: 25, y: 75, color: '#FFC107' }
  ];

  const quadrants = [
    { color: '#4CAF50', opacity: 0.3 }, // Low L/Low I
    { color: '#FFC107', opacity: 0.3 }, // Low L/High I
    { color: '#FFC107', opacity: 0.3 }, // High L/Low I
    { color: '#FF6E6E', opacity: 0.3 }  // High L/High I
  ];

  return (
    <BaseTile
      tileId="risk"
      title="Risk Matrix"
      onFullScreen={onFullScreen}
      onCollapse={onCollapse}
      icon="⚠️"
    >
      <div className="h-full flex flex-col">
        {/* Risk Matrix Grid */}
        <div className="flex-1 relative">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            {/* Quadrant backgrounds */}
            <rect x="0" y="0" width="50" height="50" fill={quadrants[0].color} fillOpacity={quadrants[0].opacity} />
            <rect x="50" y="0" width="50" height="50" fill={quadrants[1].color} fillOpacity={quadrants[1].opacity} />
            <rect x="0" y="50" width="50" height="50" fill={quadrants[2].color} fillOpacity={quadrants[2].opacity} />
            <rect x="50" y="50" width="50" height="50" fill={quadrants[3].color} fillOpacity={quadrants[3].opacity} />
            
            {/* Grid lines */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            
            {/* Risk pins */}
            {riskPins.map((pin, index) => (
              <motion.circle
                key={pin.name}
                cx={pin.x}
                cy={pin.y}
                r="3"
                fill={pin.color}
                stroke="#00FFC3"
                strokeWidth="1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.3 }}
                style={{ filter: 'drop-shadow(0 0 4px rgba(0, 255, 195, 0.6))' }}
              />
            ))}
          </svg>
        </div>

        {/* Labels */}
        <div className="text-xs text-center space-y-1">
          <div className="flex justify-between" style={{ color: '#E0E0E0' }}>
            <span>Low Impact</span>
            <span>High Impact</span>
          </div>
          <div className="text-center opacity-75" style={{ color: '#E0E0E0' }}>
            Likelihood →
          </div>
        </div>
      </div>
    </BaseTile>
  );
};
