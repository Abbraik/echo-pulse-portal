
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';

interface HandoffTileProps {
  onFullScreen: (tileId: string | null) => void;
  onCollapse: (tileId: string, tileName: string, icon: string) => void;
}

export const HandoffTile: React.FC<HandoffTileProps> = ({
  onFullScreen,
  onCollapse
}) => {
  const handoffData = {
    thinkToAct: 4,
    actToMonitor: 3
  };

  return (
    <BaseTile
      tileId="handoff"
      title="Handoff Queue"
      onFullScreen={onFullScreen}
      onCollapse={onCollapse}
      icon="🔄"
    >
      <div className="h-full flex flex-col justify-center">
        {/* Think → Act */}
        <div className="mb-4">
          <div className="text-xs mb-1" style={{ color: '#E0E0E0' }}>
            Think → Act: {handoffData.thinkToAct}
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#00FFC3', width: `${(handoffData.thinkToAct / 7) * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${(handoffData.thinkToAct / 7) * 100}%` }}
              transition={{ delay: 0.3, duration: 1 }}
            />
          </div>
        </div>

        {/* Act → Monitor */}
        <div>
          <div className="text-xs mb-1" style={{ color: '#E0E0E0' }}>
            Act → Monitor: {handoffData.actToMonitor}
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#FF6E6E', width: `${(handoffData.actToMonitor / 7) * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${(handoffData.actToMonitor / 7) * 100}%` }}
              transition={{ delay: 0.6, duration: 1 }}
            />
          </div>
        </div>
      </div>
    </BaseTile>
  );
};
