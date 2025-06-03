
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Minimize2, Maximize2 } from 'lucide-react';

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

  const indicators = [
    { name: 'DEI Composite', value: 78, target: 80, status: 'healthy', category: 'strategic', size: 'large' },
    { name: 'Resource Efficiency', value: 65, target: 75, status: 'warning', category: 'operational', size: 'medium' },
    { name: 'Social Trust', value: 45, target: 70, status: 'critical', category: 'strategic', size: 'medium' },
    { name: 'Network Development', value: 82, target: 80, status: 'healthy', category: 'strategic', size: 'medium' },
    { name: 'Bundle Coherence', value: 72, target: 75, status: 'warning', category: 'operational', size: 'small' },
    { name: 'Workflow Efficiency', value: 88, target: 85, status: 'healthy', category: 'operational', size: 'small' },
    { name: 'Population Dynamics', value: 35, target: 60, status: 'critical', category: 'strategic', size: 'small' },
    { name: 'System Stability', value: 91, target: 90, status: 'healthy', category: 'operational', size: 'small' },
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

  const getSize = (size: string) => {
    switch (size) {
      case 'large': return { width: 300, height: 200 };
      case 'medium': return { width: 200, height: 150 };
      case 'small': return { width: 150, height: 100 };
      default: return { width: 150, height: 100 };
    }
  };

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
          Master Treemap: Key Monitor Indicators
        </h2>
        <div className="flex items-center space-x-2">
          <motion.button
            className="text-white opacity-50 hover:opacity-100"
            whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
            transition={{ duration: 0.2 }}
          >
            <MoreVertical size={16} />
          </motion.button>
          <motion.button
            className="text-white opacity-50 hover:opacity-100"
            whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
            transition={{ duration: 0.2 }}
          >
            <Minimize2 size={16} />
          </motion.button>
          <motion.button
            className="text-white opacity-50 hover:opacity-100"
            whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
            transition={{ duration: 0.2 }}
            onClick={() => onFullscreen('main-view')}
          >
            <Maximize2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-center p-4">
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'strategic', label: 'Strategic Only' },
            { id: 'operational', label: 'Operational Only' },
          ].map((option) => (
            <motion.button
              key={option.id}
              onClick={() => setFilter(option.id as any)}
              className={`px-4 py-2 rounded-lg transition-all duration-150`}
              style={{
                fontFamily: 'Noto Sans',
                fontWeight: 600,
                fontSize: '12px',
                width: '100px',
                height: '28px',
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
                  ? { backgroundColor: 'rgba(255, 255, 255, 0.10)' }
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
      <div className="flex-1 p-4">
        <div className="w-full h-full relative">
          <svg width="100%" height="100%" className="overflow-visible">
            {filteredIndicators.map((indicator, index) => {
              const size = getSize(indicator.size);
              const x = (index % 3) * (size.width + 20) + 20;
              const y = Math.floor(index / 3) * (size.height + 20) + 20;
              
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
                >
                  <rect
                    x={x}
                    y={y}
                    width={size.width}
                    height={size.height}
                    fill={getStatusColor(indicator.status)}
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="1"
                    rx="8"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${indicator.name}: ${indicator.value} of ${indicator.target}`}
                  />
                  {size.width >= 100 && size.height >= 60 && (
                    <>
                      <text
                        x={x + size.width / 2}
                        y={y + size.height / 2 - 10}
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
                        x={x + size.width / 2}
                        y={y + size.height / 2 + 10}
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
                </motion.g>
              );
            })}
          </svg>
        </div>
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
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 rounded-full mr-2 bg-teal-400" />
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
              <div className="w-2.5 h-2.5 rounded-full mr-2 bg-amber-400" />
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
              <div className="w-2.5 h-2.5 rounded-full mr-2 bg-red-400" />
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
    </div>
  );
};

export default TreemapView;
