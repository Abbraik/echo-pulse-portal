
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TreemapSVGProps {
  filterMode: 'all' | 'strategic' | 'operational';
  hoveredRect: number | null;
  onRectHover: (index: number | null) => void;
}

interface IndicatorData {
  id: number;
  name: string;
  value: number;
  target: number;
  category: 'strategic' | 'operational';
  status: 'healthy' | 'warning' | 'critical';
  weight: number;
}

const indicators: IndicatorData[] = [
  { id: 1, name: 'DEI Composite', value: 78, target: 80, category: 'strategic', status: 'warning', weight: 25 },
  { id: 2, name: 'Resource Efficiency', value: 92, target: 85, category: 'strategic', status: 'healthy', weight: 20 },
  { id: 3, name: 'Social Trust', value: 65, target: 75, category: 'strategic', status: 'critical', weight: 18 },
  { id: 4, name: 'Population Health', value: 88, target: 80, category: 'strategic', status: 'healthy', weight: 15 },
  { id: 5, name: 'Open Claims', value: 12, target: 10, category: 'operational', status: 'warning', weight: 8 },
  { id: 6, name: 'Think→Act Queue', value: 5, target: 8, category: 'operational', status: 'healthy', weight: 6 },
  { id: 7, name: 'Act→Monitor Queue', value: 3, target: 5, category: 'operational', status: 'healthy', weight: 5 },
  { id: 8, name: 'System Errors', value: 2, target: 1, category: 'operational', status: 'critical', weight: 3 }
];

const TreemapSVG: React.FC<TreemapSVGProps> = ({ filterMode, hoveredRect, onRectHover }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: IndicatorData } | null>(null);

  const filteredIndicators = indicators.filter(indicator => {
    if (filterMode === 'all') return true;
    return indicator.category === filterMode;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'rgba(0,255,195,0.12)';
      case 'warning': return 'rgba(255,193,7,0.12)';
      case 'critical': return 'rgba(255,110,110,0.12)';
      default: return 'rgba(0,255,195,0.12)';
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

  // Simple treemap layout calculation
  const calculateLayout = (indicators: IndicatorData[], width: number, height: number) => {
    const totalWeight = indicators.reduce((sum, ind) => sum + ind.weight, 0);
    let currentX = 0;
    let currentY = 0;
    const layouts: any[] = [];

    indicators.forEach((indicator, index) => {
      const ratio = indicator.weight / totalWeight;
      const rectWidth = Math.sqrt(ratio) * width * 0.8;
      const rectHeight = Math.sqrt(ratio) * height * 0.8;

      // Arrange in a grid-like pattern
      if (currentX + rectWidth > width * 0.9) {
        currentX = 0;
        currentY += rectHeight + 10;
      }

      layouts.push({
        ...indicator,
        x: currentX,
        y: currentY,
        width: rectWidth,
        height: rectHeight
      });

      currentX += rectWidth + 10;
    });

    return layouts;
  };

  const handleMouseEnter = (event: React.MouseEvent, indicator: IndicatorData, index: number) => {
    onRectHover(index);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      data: indicator
    });
  };

  const handleMouseLeave = () => {
    onRectHover(null);
    setTooltip(null);
  };

  const layouts = calculateLayout(filteredIndicators, 800, 400);

  return (
    <div className="w-full h-full relative">
      <svg width="100%" height="100%" className="overflow-visible">
        {layouts.map((layout, index) => (
          <motion.g
            key={layout.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: hoveredRect !== null && hoveredRect !== index ? 0.8 : 1,
              scale: hoveredRect === index ? 1.15 : 1
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <rect
              x={layout.x}
              y={layout.y}
              width={layout.width}
              height={layout.height}
              fill={getStatusColor(layout.status)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              rx="8"
              style={{
                filter: hoveredRect === index 
                  ? `drop-shadow(0 0 16px ${getGlowColor(layout.status)})` 
                  : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => handleMouseEnter(e, layout, index)}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Label */}
            {layout.width >= 100 && layout.height >= 60 ? (
              <g>
                <text
                  x={layout.x + layout.width / 2}
                  y={layout.y + layout.height / 2 - 8}
                  textAnchor="middle"
                  fill="#00FFC3"
                  fontSize="14"
                  fontWeight="bold"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                >
                  {layout.name}
                </text>
                <text
                  x={layout.x + layout.width / 2}
                  y={layout.y + layout.height / 2 + 8}
                  textAnchor="middle"
                  fill="#E0E0E0"
                  fontSize="12"
                >
                  {layout.value}/{layout.target} ({Math.round((layout.value / layout.target) * 100)}%)
                </text>
              </g>
            ) : (
              <text
                x={layout.x + layout.width / 2}
                y={layout.y + layout.height / 2}
                textAnchor="middle"
                fill="#00FFC3"
                fontSize="16"
              >
                ℹ️
              </text>
            )}
          </motion.g>
        ))}
      </svg>

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
          <div className="font-semibold text-[#00FFC3]">{tooltip.data.name}</div>
          <div>Value: {tooltip.data.value}</div>
          <div>Target: {tooltip.data.target}</div>
          <div>Status: {tooltip.data.status}</div>
        </div>
      )}
    </div>
  );
};

export default TreemapSVG;
