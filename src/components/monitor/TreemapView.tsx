
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Minus, Maximize2 } from 'lucide-react';
import UniversalAlertHub from './UniversalAlertHub';
import AnomalyDetector from './AnomalyDetector';

interface TreemapData {
  id: string;
  name: string;
  value: number;
  target: number;
  category: 'strategic' | 'operational' | 'all';
  status: 'healthy' | 'warning' | 'critical';
}

const TreemapView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'strategic' | 'operational'>('all');
  const [isExpanded, setIsExpanded] = useState(false);

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

    return data.map((item, index) => {
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

  return (
    <div className="space-y-6">
      {/* Master Treemap Card */}
      <motion.div
        className={`relative rounded-3xl border transition-all duration-400 ${
          isExpanded ? 'fixed inset-4 z-50' : 'h-[65vh]'
        }`}
        style={{
          background: 'rgba(10,20,40,0.45)',
          backdropFilter: 'blur(24px)',
          borderColor: 'rgba(0,255,195,0.15)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.6)',
        }}
        layout
      >
        {/* Inner Glass Layer */}
        <div 
          className="absolute inset-0.5 rounded-[1.25rem] p-4"
          style={{
            background: 'rgba(20,30,50,0.6)',
            backdropFilter: 'blur(32px)',
          }}
        >
          {/* Header Strip */}
          <div 
            className="h-10 flex items-center justify-between px-4 rounded-lg mb-4"
            style={{
              background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
            }}
          >
            <h3 
              className="font-noto-bold text-white text-base"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              Master Treemap: Key Monitor Indicators
            </h3>
            <div className="flex items-center space-x-2">
              <button className="w-6 h-6 text-white/50 hover:text-[#00FFC3] transition-colors">
                <MoreVertical className="w-full h-full" />
              </button>
              <button className="w-6 h-6 text-white/50 hover:text-[#00FFC3] transition-colors">
                <Minus className="w-full h-full" />
              </button>
              <button 
                className="w-6 h-6 text-white/50 hover:text-[#00FFC3] transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Maximize2 className="w-full h-full" />
              </button>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex space-x-2 mb-4">
            {(['all', 'strategic', 'operational'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-noto-medium text-xs transition-all duration-150 ${
                  filter === filterOption
                    ? 'bg-[#00FFC3] text-[#081226]'
                    : 'bg-transparent border border-white/10 text-[#E0E0E0] hover:bg-white/10'
                }`}
                style={
                  filter === filterOption
                    ? { boxShadow: '0 0 8px rgba(0,255,195,0.6)' }
                    : {}
                }
              >
                {filterOption === 'all' ? 'All' : filterOption === 'strategic' ? 'Strategic Only' : 'Operational Only'}
              </button>
            ))}
          </div>

          {/* Legend (only visible when expanded) */}
          {isExpanded && (
            <div className="flex items-center space-x-6 mb-4 px-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ background: 'rgba(0,255,195,0.4)' }} />
                <span className="font-noto-regular text-[#E0E0E0] text-xs">In-Band</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ background: 'rgba(255,193,7,0.4)' }} />
                <span className="font-noto-regular text-[#E0E0E0] text-xs">Warning</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ background: 'rgba(255,110,110,0.4)' }} />
                <span className="font-noto-regular text-[#E0E0E0] text-xs">Critical</span>
              </div>
            </div>
          )}

          {/* SVG Treemap */}
          <div className="flex-1 relative">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
              {layoutData.map((item, index) => (
                <motion.g
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.15 }}
                  style={{ transformOrigin: `${item.x + item.width/2}% ${item.y + item.height/2}%` }}
                >
                  <rect
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    fill={getStatusColor(item.status)}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.1"
                    rx="1"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                      cursor: 'pointer',
                    }}
                    role="button"
                    aria-label={`${item.name}: ${item.value} of ${item.target}, ${Math.round((item.value/item.target)*100)}%`}
                  />
                  {item.width >= 15 && item.height >= 8 && (
                    <>
                      <text
                        x={item.x + item.width/2}
                        y={item.y + item.height/2 - 1}
                        textAnchor="middle"
                        className="font-noto-bold text-[#00FFC3] text-xs"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                        fontSize="2"
                        fill="#00FFC3"
                      >
                        {item.name}
                      </text>
                      <text
                        x={item.x + item.width/2}
                        y={item.y + item.height/2 + 2}
                        textAnchor="middle"
                        className="font-noto-regular text-[#E0E0E0]"
                        fontSize="1.5"
                        fill="#E0E0E0"
                      >
                        {item.value}/{item.target}
                      </text>
                    </>
                  )}
                </motion.g>
              ))}
            </svg>
          </div>

          {/* Back Button (only when expanded) */}
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 px-4 py-2 rounded-lg font-noto-medium text-sm text-white transition-all duration-200 hover:scale-105"
              style={{
                background: '#00B8FF',
                boxShadow: '0 4px 8px rgba(0,184,255,0.4)',
              }}
            >
              Back to Monitor
            </button>
          )}
        </div>
      </motion.div>

      {/* Bottom Row: Alerts & Anomalies */}
      {!isExpanded && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[35vh]">
          <div className="lg:col-span-3">
            <UniversalAlertHub />
          </div>
          <div className="lg:col-span-2">
            <AnomalyDetector />
          </div>
        </div>
      )}

      {/* Overlay when expanded */}
      {isExpanded && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default TreemapView;
