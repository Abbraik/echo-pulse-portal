
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';

interface ClaimsTileProps {
  onFullScreen: (tileId: string | null) => void;
  onCollapse: (tileId: string, tileName: string, icon: string) => void;
}

export const ClaimsTile: React.FC<ClaimsTileProps> = ({
  onFullScreen,
  onCollapse
}) => {
  const claimsData = {
    total: 12,
    oldest: 5,
    breakdown: { Think: 3, Act: 4, Learn: 2, Innovate: 3 }
  };

  return (
    <BaseTile
      tileId="claims"
      title="Open Claims"
      onFullScreen={onFullScreen}
      onCollapse={onCollapse}
      icon="📋"
    >
      <div className="h-full flex flex-col justify-center items-center">
        <motion.div
          className="text-2xl font-bold mb-2"
          style={{ color: '#00FFC3' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {claimsData.total}
        </motion.div>
        
        <div className="text-sm mb-3" style={{ color: '#E0E0E0' }}>
          Oldest = {claimsData.oldest} d
        </div>

        {/* Age Distribution Bar */}
        <div className="w-full max-w-[80px] h-2 bg-white/20 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.6, duration: 1 }}
          />
        </div>

        <div className="text-xs text-center" style={{ color: '#E0E0E0' }}>
          T:{claimsData.breakdown.Think} A:{claimsData.breakdown.Act} L:{claimsData.breakdown.Learn} I:{claimsData.breakdown.Innovate}
        </div>
      </div>
    </BaseTile>
  );
};
