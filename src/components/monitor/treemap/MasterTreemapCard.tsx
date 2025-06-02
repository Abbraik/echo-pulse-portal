
import React, { useState } from 'react';
import { MoreVertical, Minus, Maximize2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TreemapSVG from './TreemapSVG';

interface MasterTreemapCardProps {
  filterMode: 'all' | 'strategic' | 'operational';
  onFilterChange: (mode: 'all' | 'strategic' | 'operational') => void;
  isExpanded: boolean;
  onExpandToggle: (expanded: boolean) => void;
}

const MasterTreemapCard: React.FC<MasterTreemapCardProps> = ({
  filterMode,
  onFilterChange,
  isExpanded,
  onExpandToggle
}) => {
  const [hoveredRect, setHoveredRect] = useState<number | null>(null);

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'strategic', label: 'Strategic Only' },
    { key: 'operational', label: 'Operational Only' }
  ];

  return (
    <motion.div 
      className="w-full h-full relative"
      animate={isExpanded ? { 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50
      } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* Overlay when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => onExpandToggle(false)}
          />
        )}
      </AnimatePresence>

      {/* Outer Glass Frame */}
      <div 
        className="w-full h-full relative z-50"
        style={{
          background: 'rgba(10,20,40,0.45)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0,255,195,0.15)',
          borderRadius: '1.5rem',
          boxShadow: '0 12px 24px rgba(0,0,0,0.6)'
        }}
      >
        {/* Inner Glass Fill */}
        <div 
          className="w-full h-full relative"
          style={{
            background: 'rgba(20,30,50,0.6)',
            backdropFilter: 'blur(32px)',
            borderRadius: '1.25rem',
            margin: '2px'
          }}
        >
          {/* Header Strip */}
          <div 
            className="h-10 flex items-center justify-between px-4 relative"
            style={{
              background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
              borderRadius: '1.25rem 1.25rem 0 0'
            }}
          >
            <div className="flex items-center gap-4">
              {isExpanded && (
                <button
                  onClick={() => onExpandToggle(false)}
                  className="text-white hover:text-[#081226] transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <h3 
                className="text-white font-bold"
                style={{ 
                  fontSize: '16px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                }}
              >
                Master Treemap: Key Monitor Indicators
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {isExpanded && (
                <button
                  className="px-3 py-1 bg-[#00B8FF] text-white text-sm font-medium rounded"
                  onClick={() => onExpandToggle(false)}
                >
                  Back to Monitor
                </button>
              )}
              <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
                <MoreVertical size={16} />
              </button>
              <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
                <Minus size={16} />
              </button>
              <button 
                className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all"
                onClick={() => onExpandToggle(!isExpanded)}
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="h-8 flex items-center px-4 gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => onFilterChange(option.key as any)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-300 ${
                  filterMode === option.key
                    ? 'bg-[#00FFC3] text-[#081226] shadow-[0_0_8px_rgba(0,255,195,0.6)]'
                    : 'bg-transparent border border-[rgba(255,255,255,0.10)] text-[#E0E0E0] hover:bg-[rgba(255,255,255,0.10)]'
                }`}
                style={{ width: '100px', height: '28px' }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Legend (only when expanded) */}
          {isExpanded && (
            <div className="h-6 flex items-center px-4 gap-4 text-xs text-[#E0E0E0]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: 'rgba(0,255,195,0.12)' }} />
                <span>In-Band</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: 'rgba(255,193,7,0.12)' }} />
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: 'rgba(255,110,110,0.12)' }} />
                <span>Critical</span>
              </div>
            </div>
          )}

          {/* SVG Drawing Area */}
          <div 
            className="absolute"
            style={{
              top: isExpanded ? '88px' : '72px',
              left: '16px',
              right: '16px',
              bottom: '16px'
            }}
          >
            <TreemapSVG 
              filterMode={filterMode}
              hoveredRect={hoveredRect}
              onRectHover={setHoveredRect}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MasterTreemapCard;
