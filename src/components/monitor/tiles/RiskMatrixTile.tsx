
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RiskMatrixTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

interface RiskPin {
  id: string;
  name: string;
  likelihood: number;
  impact: number;
}

export const RiskMatrixTile: React.FC<RiskMatrixTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const riskPins: RiskPin[] = [
    { id: '1', name: 'Population Surge', likelihood: 0.7, impact: 0.8 },
    { id: '2', name: 'Extraction Over-Quota', likelihood: 0.5, impact: 0.4 },
    { id: '3', name: 'Loop Drift', likelihood: 0.3, impact: 0.6 },
  ];

  const getQuadrantColor = (row: number, col: number) => {
    if (row === 0 && col === 0) return 'bg-green-500/20 border-green-500/30'; // Low L, Low I
    if (row === 0 && col === 1) return 'bg-yellow-500/20 border-yellow-500/30'; // Low L, High I
    if (row === 1 && col === 0) return 'bg-orange-500/20 border-orange-500/30'; // High L, Low I
    if (row === 1 && col === 1) return 'bg-red-500/20 border-red-500/30'; // High L, High I
    return 'bg-gray-500/20 border-gray-500/30';
  };

  const matrixSize = isFullScreen ? 200 : 56;
  const cellSize = matrixSize / 2;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="Risk Matrix"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col items-center justify-center">
              <div className="relative" style={{ width: matrixSize, height: matrixSize }}>
                {/* 2x2 Grid */}
                <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1">
                  {Array.from({ length: 4 }, (_, index) => {
                    const row = Math.floor(index / 2);
                    const col = index % 2;
                    return (
                      <motion.div
                        key={index}
                        className={`rounded border ${getQuadrantColor(row, col)}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      />
                    );
                  })}
                </div>

                {/* Risk pins */}
                {riskPins.map((pin, index) => (
                  <Tooltip key={pin.id}>
                    <TooltipTrigger asChild>
                      <motion.div
                        className="absolute w-3 h-3 bg-teal-400 rounded-full border-2 border-white cursor-pointer z-10"
                        style={{
                          left: `${pin.likelihood * matrixSize - 6}px`,
                          top: `${(1 - pin.impact) * matrixSize - 6}px`,
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ 
                          scale: 1.5,
                          boxShadow: '0 0 10px rgba(20, 184, 166, 0.8)'
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {pin.name}: L {pin.likelihood.toFixed(1)}, I {pin.impact.toFixed(1)}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-6 w-full space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="grid grid-cols-1 gap-2">
                    {riskPins.map((pin) => (
                      <div key={pin.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-teal-400">{pin.name}</span>
                          <span className="text-xs text-gray-300">
                            L: {pin.likelihood.toFixed(1)} | I: {pin.impact.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full p-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm transition-colors">
                    Reassess Risk ▶
                  </button>
                </motion.div>
              )}

              {!isFullScreen && (
                <div className="mt-2 text-xs text-gray-400 text-center">
                  {riskPins.length} risk factors
                </div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {riskPins.length} risk factors plotted
      </TooltipContent>
    </Tooltip>
  );
};
