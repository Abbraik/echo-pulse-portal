
import React, { useState } from 'react';
import { MoreVertical, Minus, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DomainHeatmapProps {
  onCellClick: (domain: string, category: string) => void;
}

interface HeatmapCell {
  domain: string;
  category: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
}

const heatmapData: HeatmapCell[] = [
  { domain: 'Population', category: 'Strategic', value: 78, status: 'warning' },
  { domain: 'Resources', category: 'Strategic', value: 92, status: 'healthy' },
  { domain: 'Social', category: 'Strategic', value: 65, status: 'critical' },
  { domain: 'Workflow', category: 'Strategic', value: 88, status: 'healthy' },
  { domain: 'Population', category: 'Operational', value: 85, status: 'healthy' },
  { domain: 'Resources', category: 'Operational', value: 72, status: 'warning' },
  { domain: 'Social', category: 'Operational', value: 95, status: 'healthy' },
  { domain: 'Workflow', category: 'Operational', value: 45, status: 'critical' }
];

const DomainHeatmap: React.FC<DomainHeatmapProps> = ({ onCellClick }) => {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: HeatmapCell } | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'rgba(0,255,195,0.25)';
      case 'warning': return 'rgba(255,193,7,0.25)';
      case 'critical': return 'rgba(255,110,110,0.25)';
      default: return 'rgba(0,255,195,0.25)';
    }
  };

  const getGlowColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'rgba(0,255,195,0.5)';
      case 'warning': return 'rgba(255,193,7,0.5)';
      case 'critical': return 'rgba(255,110,110,0.5)';
      default: return 'rgba(0,255,195,0.5)';
    }
  };

  const handleCellClick = (cell: HeatmapCell) => {
    onCellClick(cell.domain, cell.category);
  };

  const handleMouseEnter = (event: React.MouseEvent, cell: HeatmapCell) => {
    const cellKey = `${cell.domain}-${cell.category}`;
    setHoveredCell(cellKey);
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      data: cell
    });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
    setTooltip(null);
  };

  const domains = ['Population', 'Resources', 'Social', 'Workflow'];
  const categories = ['Strategic', 'Operational'];

  return (
    <div 
      className="w-full h-full"
      style={{
        background: 'rgba(10,20,40,0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,255,195,0.15)',
        borderRadius: '1.5rem',
        boxShadow: '0 12px 24px rgba(0,0,0,0.6)'
      }}
    >
      {/* Inner Glass */}
      <div 
        className="w-full h-full relative"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(32px)',
          borderRadius: '1.25rem',
          margin: '2px'
        }}
      >
        {/* Header */}
        <div 
          className="h-10 flex items-center justify-between px-4"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
            borderRadius: '1.25rem 1.25rem 0 0'
          }}
        >
          <h3 
            className="text-white font-bold"
            style={{ 
              fontSize: '16px',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)'
            }}
          >
            Domain Heatmap
          </h3>
          <div className="flex items-center gap-2">
            <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
              <MoreVertical size={16} />
            </button>
            <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
              <Minus size={16} />
            </button>
            <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="p-6 h-[calc(100%-2.5rem)]">
          <div className="w-full h-full grid grid-cols-4 gap-4">
            {domains.map((domain) => (
              <div key={domain} className="flex flex-col gap-4">
                {categories.map((category) => {
                  const cell = heatmapData.find(d => d.domain === domain && d.category === category);
                  const cellKey = `${domain}-${category}`;
                  const isHovered = hoveredCell === cellKey;
                  
                  if (!cell) return null;

                  return (
                    <motion.div
                      key={cellKey}
                      className="relative cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      animate={{ 
                        opacity: hoveredCell && !isHovered ? 0.8 : 1,
                        filter: isHovered 
                          ? `drop-shadow(0 0 12px ${getGlowColor(cell.status)})` 
                          : 'none'
                      }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleCellClick(cell)}
                      onMouseEnter={(e) => handleMouseEnter(e, cell)}
                      onMouseLeave={handleMouseLeave}
                      role="button"
                      aria-label={`${domain} (${category}): ${cell.value}% ${cell.status}`}
                    >
                      <div 
                        className="w-full aspect-square flex flex-col items-center justify-center rounded-lg border"
                        style={{
                          background: getStatusColor(cell.status),
                          borderColor: 'rgba(255,255,255,0.1)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        <div className="text-center">
                          <div 
                            className="text-[#00FFC3] font-semibold text-sm mb-1"
                            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                          >
                            {domain}
                          </div>
                          <div className="text-[#E0E0E0] text-xs mb-1">{category}</div>
                          <div className="text-[#00FFC3] font-bold text-lg">{cell.value}%</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 text-xs text-[#E0E0E0] rounded-lg pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,255,195,0.3)'
          }}
        >
          <div className="font-semibold text-[#00FFC3]">
            {tooltip.data.domain} ({tooltip.data.category})
          </div>
          <div>{tooltip.data.value}% {tooltip.data.status}</div>
          <div className="text-xs opacity-75">Click to view details</div>
        </div>
      )}
    </div>
  );
};

export default DomainHeatmap;
