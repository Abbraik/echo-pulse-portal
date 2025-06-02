
import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CollapsedTile {
  id: string;
  name: string;
  icon: string;
  originalLayout: any;
}

interface CollapsedTilesStripProps {
  collapsedTiles: CollapsedTile[];
  onRestore: (tile: CollapsedTile) => void;
}

export const CollapsedTilesStrip: React.FC<CollapsedTilesStripProps> = ({
  collapsedTiles,
  onRestore
}) => {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-[24px] border-t border-white/20 p-3"
      style={{
        background: 'rgba(10, 20, 40, 0.8)',
        zIndex: 40
      }}
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3 h-full overflow-x-auto">
        <div className="text-sm font-medium whitespace-nowrap" style={{ color: '#00FFC3' }}>
          Collapsed:
        </div>
        
        {collapsedTiles.map((tile, index) => (
          <Tooltip key={tile.id}>
            <TooltipTrigger asChild>
              <motion.button
                className="w-14 h-14 rounded-xl backdrop-blur-[16px] border border-white/20 flex flex-col items-center justify-center hover:border-white/40 transition-colors"
                style={{
                  background: 'rgba(20, 30, 50, 0.6)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                }}
                onClick={() => onRestore(tile)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-lg mb-1">{tile.icon}</div>
                <RotateCcw size={8} className="text-gray-400" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Restore {tile.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </motion.div>
  );
};
