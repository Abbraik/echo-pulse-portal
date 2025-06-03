
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Minimize2, Maximize2, GripVertical, CornerDownRight, X } from 'lucide-react';

interface TileDashboardViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
  onFullscreen: (cardId: string) => void;
  isFullscreen: boolean;
}

interface Tile {
  id: string;
  name: string;
  current: number;
  target: number;
  status: 'healthy' | 'warning' | 'critical';
  size: '1x1' | '1x2' | '2x2';
  priority: 'high' | 'medium' | 'low';
  collapsed: boolean;
}

const TileDashboardView: React.FC<TileDashboardViewProps> = ({ 
  timeRange, 
  domainFilter, 
  chartType, 
  onFullscreen, 
  isFullscreen 
}) => {
  const [expandedTile, setExpandedTile] = useState<string | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([
    { id: '1', name: 'DEI Composite', current: 78, target: 80, status: 'healthy', size: '2x2', priority: 'high', collapsed: false },
    { id: '2', name: 'Resource Efficiency', current: 65, target: 75, status: 'warning', size: '1x2', priority: 'medium', collapsed: false },
    { id: '3', name: 'Social Trust', current: 45, target: 70, status: 'critical', size: '1x2', priority: 'medium', collapsed: false },
    { id: '4', name: 'Network Development', current: 82, target: 80, status: 'healthy', size: '1x1', priority: 'low', collapsed: false },
    { id: '5', name: 'Bundle Coherence', current: 72, target: 75, status: 'warning', size: '1x1', priority: 'low', collapsed: false },
    { id: '6', name: 'Workflow Efficiency', current: 88, target: 85, status: 'healthy', size: '1x1', priority: 'low', collapsed: false },
    { id: '7', name: 'Population Dynamics', current: 35, target: 60, status: 'critical', size: '1x1', priority: 'low', collapsed: false },
    { id: '8', name: 'System Stability', current: 91, target: 90, status: 'healthy', size: '1x1', priority: 'low', collapsed: false },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#00FFC3';
      case 'warning': return '#FFC107';
      case 'critical': return '#FF6E6E';
      default: return '#00FFC3';
    }
  };

  const getTileSize = (size: string) => {
    switch (size) {
      case '2x2': return { width: 'col-span-2 row-span-2', height: 'h-48' };
      case '1x2': return { width: 'col-span-1 row-span-2', height: 'h-48' };
      case '1x1': return { width: 'col-span-1 row-span-1', height: 'h-24' };
      default: return { width: 'col-span-1 row-span-1', height: 'h-24' };
    }
  };

  const collapseTile = (tileId: string) => {
    setTiles(prev => prev.map(tile => 
      tile.id === tileId ? { ...tile, collapsed: true } : tile
    ));
  };

  const expandTile = (tileId: string) => {
    setExpandedTile(tileId);
  };

  const activeTiles = tiles.filter(tile => !tile.collapsed);
  const collapsedTiles = tiles.filter(tile => tile.collapsed);

  return (
    <div
      className="w-full h-full rounded-3xl relative overflow-hidden"
      style={{
        background: 'rgba(10, 20, 40, 0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 255, 195, 0.15)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
        minHeight: isFullscreen ? '80vh' : '500px',
      }}
    >
      {/* Header Strip */}
      <div
        className="h-10 flex items-center justify-between px-4"
        style={{
          background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
        }}
      >
        <h2
          style={{
            fontFamily: 'Noto Sans',
            fontWeight: 700,
            fontSize: '16px',
            color: '#FFFFFF',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)',
          }}
        >
          Tile Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <motion.button
            className="text-white opacity-50 hover:opacity-100"
            whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
          >
            <MoreVertical size={16} />
          </motion.button>
          <motion.button
            className="text-white opacity-50 hover:opacity-100"
            whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
          >
            <Minimize2 size={16} />
          </motion.button>
          <motion.button
            className="text-white opacity-50 hover:opacity-100"
            whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
            onClick={() => onFullscreen('main-view')}
          >
            <Maximize2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="p-4 h-full overflow-auto">
        <div className="grid grid-cols-4 gap-4 auto-rows-max">
          {activeTiles.map((tile) => {
            const sizeClasses = getTileSize(tile.size);
            
            return (
              <motion.div
                key={tile.id}
                className={`${sizeClasses.width} ${sizeClasses.height} p-3 rounded-xl relative`}
                style={{
                  background: 'rgba(20, 30, 50, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 255, 195, 0.10)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
                }}
                whileHover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 0 12px rgba(0,255,195,0.4)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                layout
              >
                {/* Tile Header */}
                <div className="flex items-start justify-between mb-2">
                  <motion.button
                    className="text-white opacity-50 hover:opacity-100"
                    whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
                  >
                    <GripVertical size={12} />
                  </motion.button>
                  <div className="flex space-x-1">
                    <motion.button
                      className="text-white opacity-50 hover:opacity-100"
                      whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
                      onClick={() => collapseTile(tile.id)}
                    >
                      <Minimize2 size={12} />
                    </motion.button>
                    <motion.button
                      className="text-white opacity-50 hover:opacity-100"
                      whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
                      onClick={() => expandTile(tile.id)}
                    >
                      <Maximize2 size={12} />
                    </motion.button>
                  </div>
                </div>

                {/* Tile Content */}
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3
                      className="mb-1"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#00FFC3',
                      }}
                    >
                      {tile.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'Noto Sans',
                        fontSize: '12px',
                        color: '#E0E0E0',
                      }}
                    >
                      {tile.current}/{tile.target}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    {/* Mini Sparkline */}
                    <div className="w-20 h-10 bg-white/5 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">
                        {chartType === 'bar' ? '▂▃▅▃▄' : '⟋⟍⟋⟍'}
                      </span>
                    </div>

                    {/* Status Dot */}
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: getStatusColor(tile.status) }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Collapsed Tiles Strip */}
        {collapsedTiles.length > 0 && (
          <motion.div
            className="mt-6 pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h4
              className="mb-3"
              style={{
                fontFamily: 'Noto Sans',
                fontWeight: 600,
                fontSize: '12px',
                color: '#E0E0E0',
              }}
            >
              Collapsed Tiles
            </h4>
            <div className="flex gap-2 flex-wrap">
              {collapsedTiles.map((tile) => (
                <motion.button
                  key={tile.id}
                  className="w-15 h-15 rounded-lg flex items-center justify-center"
                  style={{
                    background: getStatusColor(tile.status),
                    color: '#081226',
                  }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setTiles(prev => prev.map(t => 
                    t.id === tile.id ? { ...t, collapsed: false } : t
                  ))}
                >
                  <span className="text-xs font-semibold">
                    {tile.name.split(' ').map(w => w[0]).join('')}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Expanded Tile Modal */}
      <AnimatePresence>
        {expandedTile && (
          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center p-8 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedTile(null)}
          >
            <motion.div
              className="w-full max-w-4xl h-full max-h-3xl rounded-2xl p-6"
              style={{
                background: 'rgba(20, 30, 50, 0.85)',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(0, 255, 195, 0.15)',
                boxShadow: '0 16px 32px rgba(0, 0, 0, 0.6)',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  style={{
                    fontFamily: 'Noto Sans',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: '#00FFC3',
                  }}
                >
                  {tiles.find(t => t.id === expandedTile)?.name} - Detailed View
                </h3>
                <motion.button
                  onClick={() => setExpandedTile(null)}
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Expanded Content */}
              <div className="grid grid-cols-2 gap-6 h-full">
                <div>
                  <h4 className="text-sm font-semibold text-teal-400 mb-3">
                    Trend Analysis ({chartType} chart)
                  </h4>
                  <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Large {chartType} chart placeholder</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-teal-400 mb-3">
                    Sub-Metrics
                  </h4>
                  <div className="space-y-3">
                    {['Component A', 'Component B', 'Component C', 'Component D'].map((component, index) => (
                      <div key={component} className="flex justify-between items-center p-3 bg-white/5 rounded">
                        <span className="text-sm text-gray-300">{component}</span>
                        <span className="text-sm font-semibold text-teal-400">
                          {Math.floor(Math.random() * 40) + 60}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TileDashboardView;
