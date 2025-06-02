
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';

interface BundleTileProps {
  bundleId: string;
  bundleName: string;
  success: number;
  roi: number;
  timeToDeployMonths: number;
  onFullScreen: (tileId: string | null) => void;
  onCollapse: (tileId: string, tileName: string, icon: string) => void;
}

export const BundleTile: React.FC<BundleTileProps> = ({
  bundleId,
  bundleName,
  success,
  roi,
  timeToDeployMonths,
  onFullScreen,
  onCollapse
}) => {
  return (
    <BaseTile
      tileId={bundleId}
      title={bundleName}
      onFullScreen={onFullScreen}
      onCollapse={onCollapse}
      icon="📦"
    >
      <div className="h-full flex flex-col justify-between">
        {/* Success Percentage */}
        <div className="text-center mb-3">
          <div className="text-lg font-medium mb-1" style={{ color: '#00FFC3' }}>
            {success}% Success
          </div>
          <div className="text-xs" style={{ color: '#E0E0E0' }}>
            Avg ROI +{roi}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#00FFC3' }}
              initial={{ width: 0 }}
              animate={{ width: `${success}%` }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </div>
        </div>

        {/* Time to Deploy */}
        <div className="text-center">
          <div className="text-xs" style={{ color: '#E0E0E0' }}>
            Time to Deploy: {timeToDeployMonths} mo
          </div>
        </div>
      </div>
    </BaseTile>
  );
};
