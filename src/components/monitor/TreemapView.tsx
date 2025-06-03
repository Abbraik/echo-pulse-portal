
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TreemapViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
}

interface TreemapData {
  id: string;
  name: string;
  value: number;
  target: number;
  category: 'strategic' | 'operational';
  status: 'healthy' | 'warning' | 'critical';
}

const TreemapView: React.FC<TreemapViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [filter, setFilter] = useState<'all' | 'strategic' | 'operational'>('all');
  const [hoveredRect, setHoveredRect] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: TreemapData } | null>(null);

  const treemapData: TreemapData[] = [
    { id: '1', name: 'DEI Composite', value: 78, target: 80, category: 'strategic', status: 'warning' },
    { id: '2', name: 'Resource Efficiency', value: 92, target: 85, category: 'operational', status: 'healthy' },
    { id: '3', name: 'Social Cohesion', value: 85, target: 90, category: 'strategic', status: 'warning' },
    { id: '4', name: 'Workflow Health', value: 67, target: 75, category: 'operational', status: 'critical' },
    { id: '5', name: 'Population Growth', value: 88, target: 85, category: 'strategic', status: 'healthy' },
    { id: '6', name: 'Infrastructure Load', value: 45, target: 70, category: 'operational', status: 'critical' },
    { id: '7', name: 'Innovation Index', value: 91, target: 85, category: 'strategic', status: 'healthy' },
    { id: '8', name: 'System Stability', value: 82, target: 80, category: 'operational', status: 'healthy' },
  ];

  const filteredData = treemapData.filter(item => 
    filter === 'all' || item.category === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'rgba(0,255,195,0.12)';
      case 'warning': return 'rgba(255,193,7,0.12)';
      case 'critical': return 'rgba(255,110,110,0.12)';
      default: return 'rgba(0,255,195,0.12)';
    }
  };

  const calculateLayout = (data: TreemapData[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentY = 0;
    let currentRowHeight = 0;
    let currentX = 0;
    const containerWidth = 100;
    const containerHeight = 100;

    return data.map((item) => {
      const percentage = item.value / total;
      const area = percentage * containerWidth * containerHeight;
      const width = Math.sqrt(area * 1.5);
      const height = area / width;

      if (currentX + width > containerWidth) {
        currentY += currentRowHeight;
        currentX = 0;
        currentRowHeight = height;
      } else {
        currentRowHeight = Math.max(currentRowHeight, height);
      }

      const rect = {
        x: currentX,
        y: currentY,
        width: Math.min(width, containerWidth - currentX),
        height: height,
      };

      currentX += rect.width;
      return { ...item, ...rect };
    });
  };

  const layoutData = calculateLayout(filteredData);

  const handleMouseEnter = (item: TreemapData & { x: number; y: number; width: number; height: number }, event: React.MouseEvent) => {
    setHoveredRect(item.id);
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      data: item,
    });
  };

  const handleMouseLeave = () => {
    setHoveredRect(null);
    setTooltip(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Filter Pills */}
      <div className="flex justify-center gap-3 py-2 px-4">
        {(['all', 'strategic', 'operational'] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-6 py-2 rounded-full text-xs font-semibold transition-all duration-150 ${
              filter === filterOption
                ? 'text-[#081226]'
                : 'text-[#E0E0E0] hover:bg-[rgba(255,255,255,0.10)]'
            }`}
            style={{
              fontFamily: 'Noto Sans',
              ...(filter === filterOption
                ? {
                    background: '#00FFC3',
                    boxShadow: '0 0 8px rgba(0,255,195,0.6)',
                  }
                : {
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }
              ),
            }}
          >
            {filterOption === 'all' ? 'All' : filterOption === 'strategic' ? 'Strategic Only' : 'Operational Only'}
          </button>
        ))}
      </div>

      {/* SVG Treemap */}
      <div className="flex-1 p-4 relative">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="innerShadow">
              <feFlood floodColor="rgba(0,0,0,0.3)" />
              <feComposite in="SourceGraphic" />
              <feGaussianBlur stdDeviation="1" />
              <feOffset dx="0" dy="2" result="offset" />
              <feFlood floodColor="rgba(0,0,0,0.3)" />
              <feComposite in2="offset" operator="in" />
            </filter>
          </defs>
          
          {layoutData.map((item, index) => (
            <motion.g
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: hoveredRect && hoveredRect !== item.id ? 0.8 : 1,
                scale: hoveredRect === item.id ? 1.15 : 1,
              }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              style={{ transformOrigin: `${item.x + item.width/2}% ${item.y + item.height/2}%` }}
            >
              <rect
                x={item.x}
                y={item.y}
                width={item.width}
                height={item.height}
                fill={getStatusColor(item.status)}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="0.1"
                rx="1"
                filter="url(#innerShadow)"
                style={{
                  cursor: 'pointer',
                  boxShadow: hoveredRect === item.id ? '0 0 16px rgba(0,255,195,0.5)' : 'none',
                }}
                onMouseEnter={(e) => handleMouseEnter(item, e)}
                onMouseLeave={handleMouseLeave}
                role="button"
                aria-label={`${item.name}: ${item.value} of ${item.target}, ${Math.round((item.value/item.target)*100)}%`}
              />
              {item.width >= 15 && item.height >= 8 ? (
                <>
                  <text
                    x={item.x + item.width/2}
                    y={item.y + item.height/2 - 1}
                    textAnchor="middle"
                    className="font-bold text-[#00FFC3]"
                    style={{ 
                      fontFamily: 'Noto Sans',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      pointerEvents: 'none',
                    }}
                    fontSize="2"
                    fill="#00FFC3"
                  >
                    {item.name}
                  </text>
                  <text
                    x={item.x + item.width/2}
                    y={item.y + item.height/2 + 2}
                    textAnchor="middle"
                    className="text-[#E0E0E0]"
                    style={{ 
                      fontFamily: 'Noto Sans',
                      pointerEvents: 'none',
                    }}
                    fontSize="1.5"
                    fill="#E0E0E0"
                  >
                    {item.value}/{item.target}
                  </text>
                </>
              ) : (
                <text
                  x={item.x + item.width/2}
                  y={item.y + item.height/2}
                  textAnchor="middle"
                  className="text-[#00FFC3]"
                  fontSize="2"
                  fill="#00FFC3"
                  style={{ pointerEvents: 'none' }}
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
            className="fixed z-50 px-3 py-2 rounded-lg text-xs pointer-events-none"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
              background: 'rgba(20,30,50,0.6)',
              backdropFilter: 'blur(12px)',
              color: '#E0E0E0',
              fontFamily: 'Noto Sans',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            <div className="font-bold text-[#00FFC3]">{tooltip.data.name}</div>
            <div>Current: {tooltip.data.value}</div>
            <div>Target: {tooltip.data.target}</div>
            <div>Progress: {Math.round((tooltip.data.value/tooltip.data.target)*100)}%</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreemapView;
