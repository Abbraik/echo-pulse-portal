
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Minimize2, Maximize2, X } from 'lucide-react';

interface TreemapViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
  onFullscreen: (cardId: string) => void;
  isFullscreen: boolean;
}

const TreemapView: React.FC<TreemapViewProps> = ({ 
  timeRange, 
  domainFilter, 
  chartType, 
  onFullscreen, 
  isFullscreen 
}) => {
  const [filter, setFilter] = useState<'all' | 'strategic' | 'operational'>('all');
  const [selectedRect, setSelectedRect] = useState<string | null>(null);

  const indicators = [
    { name: 'DEI Composite', value: 78, target: 80, status: 'healthy', category: 'strategic', size: { width: 300, height: 200 } },
    { name: 'Resource Efficiency', value: 65, target: 75, status: 'warning', category: 'operational', size: { width: 200, height: 150 } },
    { name: 'Social Trust', value: 45, target: 70, status: 'critical', category: 'strategic', size: { width: 200, height: 150 } },
    { name: 'Network Development', value: 82, target: 80, status: 'healthy', category: 'strategic', size: { width: 150, height: 100 } },
    { name: 'Bundle Coherence', value: 72, target: 75, status: 'warning', category: 'operational', size: { width: 150, height: 100 } },
    { name: 'Workflow Efficiency', value: 88, target: 85, status: 'healthy', category: 'operational', size: { width: 150, height: 100 } },
    { name: 'Population Dynamics', value: 35, target: 60, status: 'critical', category: 'strategic', size: { width: 150, height: 100 } },
    { name: 'System Stability', value: 91, target: 90, status: 'healthy', category: 'operational', size: { width: 150, height: 100 } },
  ];

  const filteredIndicators = indicators.filter(indicator => {
    if (filter === 'all') return true;
    return indicator.category === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'rgba(0,255,195,0.12)';
      case 'warning': return 'rgba(255,193,7,0.12)';
      case 'critical': return 'rgba(255,110,110,0.12)';
      default: return 'rgba(0,255,195,0.12)';
    }
  };

  return (
    <div
      className="w-full h-full rounded-3xl relative overflow-hidden"
      style={{
        background: 'rgba(10, 20, 40, 0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 255, 195, 0.15)',
        borderRadius: '1.5rem',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
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
          Treemap View
        </h2>
        <div className="flex items-center space-x-2">
          <motion.button
            className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200"
            style={{ opacity: 0.6 }}
            whileHover={{ 
              opacity: 1,
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 195, 0.6))',
            }}
          >
            <MoreVertical size={16} />
          </motion.button>
          <motion.button
            className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200"
            style={{ opacity: 0.6 }}
            whileHover={{ 
              opacity: 1,
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 195, 0.6))',
            }}
          >
            <Minimize2 size={16} />
          </motion.button>
          <motion.button
            className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200"
            style={{ opacity: 0.6 }}
            whileHover={{ 
              opacity: 1,
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 195, 0.6))',
            }}
            onClick={() => onFullscreen('main-view')}
          >
            <Maximize2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex justify-center py-2">
        <div className="flex gap-3">
          {[
            { id: 'all', label: 'All' },
            { id: 'strategic', label: 'Strategic Only' },
            { id: 'operational', label: 'Operational Only' },
          ].map((option) => (
            <motion.button
              key={option.id}
              onClick={() => setFilter(option.id as any)}
              className="transition-all duration-150"
              style={{
                fontFamily: 'Noto Sans',
                fontWeight: 600,
                fontSize: '12px',
                width: '100px',
                height: '28px',
                borderRadius: '999px',
                ...(filter === option.id
                  ? {
                      background: '#00FFC3',
                      color: '#081226',
                      boxShadow: '0 0 8px rgba(0, 255, 195, 0.6)',
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      color: '#E0E0E0',
                    }),
              }}
              whileHover={
                filter !== option.id
                  ? { 
                      background: 'rgba(255, 255, 255, 0.10)',
                      transition: { duration: 0.15 }
                    }
                  : {}
              }
              whileTap={{ scale: 0.98 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Treemap SVG */}
      <div className="flex-1 p-4 relative">
        <svg width="100%" height="100%" className="overflow-visible">
          <defs>
            <filter id="innerShadow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
              <feOffset dx="0" dy="2" result="offset"/>
              <feFlood floodColor="rgba(0,0,0,0.3)"/>
              <feComposite in2="offset" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {filteredIndicators.map((indicator, index) => {
            const x = (index % 3) * (indicator.size.width + 20) + 20;
            const y = Math.floor(index / 3) * (indicator.size.height + 20) + 20;
            
            return (
              <motion.g
                key={indicator.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.15,
                  filter: 'drop-shadow(0 0 16px rgba(0,255,195,0.5))',
                }}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedRect(indicator.name)}
              >
                <rect
                  x={x}
                  y={y}
                  width={indicator.size.width}
                  height={indicator.size.height}
                  fill={getStatusColor(indicator.status)}
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="1"
                  rx="8"
                  filter="url(#innerShadow)"
                  role="button"
                  tabIndex={0}
                  aria-label={`${indicator.name}: ${indicator.value} of ${indicator.target}`}
                />
                {indicator.size.width >= 100 && indicator.size.height >= 60 && (
                  <>
                    <text
                      x={x + indicator.size.width / 2}
                      y={y + indicator.size.height / 2 - 10}
                      textAnchor="middle"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontWeight: 700,
                        fontSize: '14px',
                        fill: '#00FFC3',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      {indicator.name}
                    </text>
                    <text
                      x={x + indicator.size.width / 2}
                      y={y + indicator.size.height / 2 + 10}
                      textAnchor="middle"
                      style={{
                        fontFamily: 'Noto Sans',
                        fontWeight: 400,
                        fontSize: '12px',
                        fill: '#E0E0E0',
                      }}
                    >
                      {indicator.value}/{indicator.target}
                    </text>
                  </>
                )}
                {(indicator.size.width < 100 || indicator.size.height < 60) && (
                  <text
                    x={x + indicator.size.width / 2}
                    y={y + indicator.size.height / 2}
                    textAnchor="middle"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontWeight: 400,
                      fontSize: '20px',
                      fill: '#00FFC3',
                    }}
                  >
                    ℹ️
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Legend Strip (only visible in fullscreen) */}
      {isFullscreen && (
        <motion.div
          className="px-4 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="flex items-center justify-center space-x-6 p-2 rounded-lg"
            style={{
              background: 'rgba(20, 30, 50, 0.6)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ background: '#00FFC3' }} />
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  color: '#E0E0E0',
                }}
              >
                In-Band
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ background: '#FFC107' }} />
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  color: '#E0E0E0',
                }}
              >
                Warning
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ background: '#FF6E6E' }} />
              <span
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  color: '#E0E0E0',
                }}
              >
                Critical
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRect && (
          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRect(null)}
          >
            <motion.div
              className="rounded-2xl p-6"
              style={{
                width: '600px',
                height: '400px',
                background: 'rgba(20, 30, 50, 0.85)',
                backdropFilter: 'blur(32px)',
                borderRadius: '1rem',
                boxShadow: '0 16px 32px rgba(0, 0, 0, 0.6)',
                color: '#E0E0E0',
                fontFamily: 'Noto Sans',
                fontSize: '12px',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  style={{
                    fontFamily: 'Noto Sans',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: '#00FFC3',
                  }}
                >
                  {selectedRect}
                </h2>
                <motion.button
                  onClick={() => setSelectedRect(null)}
                  whileHover={{ scale: 1.1 }}
                  className="text-white"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <div className="h-48 bg-white/5 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Large trend chart placeholder</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreemapView;
