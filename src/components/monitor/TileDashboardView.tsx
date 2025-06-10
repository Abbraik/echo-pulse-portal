import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TileDashboardViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
}

interface TileData {
  id: string;
  title: string;
  subtitle: string;
  value: number;
  target: number;
  status: 'healthy' | 'warning' | 'critical';
  size: '1x1' | '1x2' | '2x1' | '2x2';
  trend: number[];
}

const TileDashboardView: React.FC<TileDashboardViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [tiles, setTiles] = useState<TileData[]>([
    { id: '1', title: 'DEI Composite', subtitle: 'Strategic Indicator', value: 63, target: 80, status: 'warning', size: '2x1', trend: [68, 67, 65, 63, 62] },
    { id: '2', title: 'Resource Efficiency', subtitle: 'Operational', value: 75, target: 85, status: 'healthy', size: '1x1', trend: [77, 78, 77, 75, 76] },
    { id: '3', title: 'Social Cohesion', subtitle: 'Community Health', value: 69, target: 90, status: 'warning', size: '1x1', trend: [79, 77, 73, 69, 68] },
    { id: '4', title: 'Workflow Health', subtitle: 'Process Efficiency', value: 54, target: 75, status: 'critical', size: '1x2', trend: [65, 61, 58, 55, 54] },
    { id: '5', title: 'Population Growth', subtitle: 'Demographic Trends', value: 71, target: 85, status: 'healthy', size: '1x1', trend: [75, 76, 77, 78, 71] },
    { id: '6', title: 'Infrastructure Load', subtitle: 'System Capacity', value: 37, target: 70, status: 'critical', size: '2x1', trend: [50, 47, 43, 41, 37] },
    { id: '7', title: 'Innovation Index', subtitle: 'R&D Performance', value: 74, target: 85, status: 'healthy', size: '1x1', trend: [77, 78, 80, 81, 74] },
    { id: '8', title: 'System Stability', subtitle: 'Platform Health', value: 67, target: 80, status: 'warning', size: '1x1', trend: [71, 72, 73, 73, 67] },
    { id: '9', title: 'Security Posture', subtitle: 'Cyber Defense', value: 79, target: 90, status: 'healthy', size: '1x1', trend: [77, 77, 78, 79, 80] },
    { id: '10', title: 'Learning Velocity', subtitle: 'Knowledge Growth', value: 70, target: 85, status: 'healthy', size: '1x1', trend: [68, 68, 69, 70, 71] },
    { id: '11', title: 'Trust Recovery', subtitle: 'Stakeholder Confidence', value: 54, target: 75, status: 'critical', size: '2x1', trend: [65, 61, 59, 56, 54] },
    { id: '12', title: 'Communication Flow', subtitle: 'Information Exchange', value: 66, target: 80, status: 'warning', size: '1x1', trend: [68, 67, 66, 65, 66] },
  ]);

  const [draggedTile, setDraggedTile] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#00FFC3';
      case 'warning': return '#FFC107';
      case 'critical': return '#FF6E6E';
      default: return '#00FFC3';
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case '2x2': return 'col-span-2 row-span-2';
      case '2x1': return 'col-span-2 row-span-1';
      case '1x2': return 'col-span-1 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  const handleTileResize = (tileId: string, newSize: '1x1' | '1x2' | '2x1' | '2x2') => {
    setTiles(tiles.map(tile => 
      tile.id === tileId ? { ...tile, size: newSize } : tile
    ));
  };

  return (
    <div className="h-full p-4">
      <div 
        className="h-full grid gap-3 overflow-auto"
        style={{
          gridTemplateColumns: 'repeat(6, minmax(80px, 1fr))',
          gridAutoRows: 'minmax(80px, 120px)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.20) transparent',
        }}
      >
        <style>{`
          .h-full::-webkit-scrollbar {
            width: 6px;
          }
          .h-full::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.20);
            border-radius: 3px;
          }
          .h-full::-webkit-scrollbar-track {
            background: transparent;
          }
        `}</style>
        
        {tiles.map((tile, index) => (
          <motion.div
            key={tile.id}
            className={`${getSizeClass(tile.size)} rounded-2xl p-3 cursor-pointer relative group`}
            style={{
              background: 'rgba(20,30,50,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              minWidth: '80px',
              minHeight: '80px',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ 
              y: -4,
              boxShadow: '0 0 16px rgba(0,255,195,0.5)',
            }}
            layout
          >
            {/* Drag Handle */}
            <div 
              className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move"
              style={{ background: 'rgba(255,255,255,0.10)' }}
              onMouseDown={() => setDraggedTile(tile.id)}
            >
              <span className="text-white text-xs">⋮⋮</span>
            </div>

            {/* Resize Handle */}
            <div 
              className="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-nw-resize"
              style={{ background: 'rgba(255,255,255,0.10)' }}
            >
              <span className="text-white text-xs">⋰</span>
            </div>

            {/* Status Indicator */}
            <div 
              className="absolute top-3 right-3 w-3 h-3 rounded-full"
              style={{
                background: getStatusColor(tile.status),
                boxShadow: `0 0 8px ${getStatusColor(tile.status)}40`,
              }}
            />

            {/* Content */}
            <div className="h-full flex flex-col justify-between">
              <div>
                <h4 
                  className="font-bold text-[#00FFC3] text-sm mb-1 leading-tight"
                  style={{ 
                    fontFamily: 'Noto Sans',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)' 
                  }}
                >
                  {tile.title}
                </h4>
                <p 
                  className="text-[#E0E0E0] text-xs mb-2 leading-tight"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  {tile.subtitle}
                </p>
                <div className="flex items-baseline gap-2">
                  <span 
                    className="text-xl font-bold text-[#00FFC3]"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {tile.value}
                  </span>
                  <span 
                    className="text-xs text-[#E0E0E0]"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    / {tile.target}
                  </span>
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="mt-2">
                <svg width="100%" height="32" viewBox="0 0 100 32" className="w-full">
                  {chartType === 'line' ? (
                    <polyline
                      points={tile.trend.map((value, i) => `${i * 25},${32 - (value / Math.max(...tile.trend)) * 24}`).join(' ')}
                      fill="none"
                      stroke="#00FFC3"
                      strokeWidth="2"
                    />
                  ) : (
                    tile.trend.map((value, i) => (
                      <rect
                        key={i}
                        x={i * 20}
                        y={32 - (value / Math.max(...tile.trend)) * 24}
                        width="15"
                        height={(value / Math.max(...tile.trend)) * 24}
                        fill="#00FFC3"
                        opacity="0.8"
                      />
                    ))
                  )}
                </svg>
              </div>
            </div>

            {/* Size Controls (show on hover) */}
            <div className="absolute top-8 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
              {(['1x1', '1x2', '2x1', '2x2'] as const).map((size) => (
                <button
                  key={size}
                  className={`w-6 h-4 text-xs rounded transition-colors duration-150 ${
                    tile.size === size 
                      ? 'bg-[#00FFC3] text-[#081226]' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  onClick={() => handleTileResize(tile.id, size)}
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  {size}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TileDashboardView;
