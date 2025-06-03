
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, TrendingUp } from 'lucide-react';

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
  weight: number;
  status: 'in-band' | 'warning' | 'critical';
  description: string;
  breakdown?: string[];
  lastTrend: string;
  actionHint: string;
}

interface DrillDownModalProps {
  data: TreemapData;
  isOpen: boolean;
  onClose: () => void;
  chartType: 'bar' | 'line';
}

const DrillDownModal: React.FC<DrillDownModalProps> = ({ data, isOpen, onClose, chartType }) => {
  const recentValues = [
    { date: '2025-06-01', value: data.value, remark: 'Current' },
    { date: '2025-05-31', value: data.value - 2, remark: 'Stable' },
    { date: '2025-05-30', value: data.value - 1, remark: 'Improving' },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[600px] h-[400px] rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(20,30,50,0.85)',
          backdropFilter: 'blur(32px)',
          boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
          color: '#E0E0E0',
          fontFamily: 'Noto Sans',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <X size={16} />
        </button>

        {/* Content */}
        <div className="p-6 h-full flex flex-col">
          <h3 
            className="text-lg font-bold mb-4"
            style={{ 
              color: data.category === 'strategic' ? '#00B8FF' : '#00FFC3',
              fontFamily: 'Noto Sans',
            }}
          >
            {data.name}
          </h3>

          {/* Trend Chart Area */}
          <div className="flex-1 bg-white/5 rounded-lg p-4 mb-4">
            <div className="text-sm text-slate-400 mb-2">90-Day Trend ({chartType})</div>
            <div className="h-32 flex items-end space-x-1">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${60 + Math.random() * 40}%`,
                    background: data.category === 'strategic' ? '#00B8FF' : '#00FFC3',
                    opacity: 0.6 + Math.random() * 0.4,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recent Values Table */}
          <div className="mb-4">
            <div className="text-sm text-slate-400 mb-2">Recent Values</div>
            <div className="space-y-1">
              {recentValues.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.date}</span>
                  <span>{item.value}</span>
                  <span className="text-slate-400">{item.remark}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            className="w-full py-2 rounded-lg font-medium text-sm transition-all duration-200"
            style={{
              background: '#00B8FF',
              color: '#081226',
              fontFamily: 'Noto Sans',
            }}
          >
            Go to Detailed View
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TreemapView: React.FC<TreemapViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [filter, setFilter] = useState<'all' | 'strategic' | 'operational'>('all');
  const [hoveredRect, setHoveredRect] = useState<string | null>(null);
  const [selectedRect, setSelectedRect] = useState<TreemapData | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: TreemapData } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const treemapData: TreemapData[] = [
    // Strategic indicators
    { 
      id: '1', 
      name: 'DEI Composite', 
      value: 78, 
      target: 80, 
      category: 'strategic', 
      weight: 5, 
      status: 'in-band',
      description: 'Overall "Demographic-Equilibrium Index" – a weighted blend of population, age-structure, fertility balance, and social cohesion metrics.',
      breakdown: [
        'Population Stability: 99%',
        'Age Structure Balance: 95%', 
        'Fertility Confidence: 96%',
        'Social Cohesion: 100%'
      ],
      lastTrend: '↑1.5% last month',
      actionHint: 'Hover to drill into full DEI report.'
    },
    { 
      id: '2', 
      name: 'Network Dev Index', 
      value: 64, 
      target: 100, 
      category: 'strategic', 
      weight: 4, 
      status: 'warning',
      description: 'Degree of causal network coverage in the Think zone: how many loops and CLD nodes have been robustly mapped vs. total recommended.',
      breakdown: [
        'Population → Resource loop (2/5 nodes missing)',
        'Migration → Economic loop (1/4 nodes missing)',
        'Environment Feedback loop (0/3 nodes missing)'
      ],
      lastTrend: '+4 loops mapped last week',
      actionHint: 'Click to view full CLD mapping status.'
    },
    { 
      id: '3', 
      name: 'Trust Recovery', 
      value: 89, 
      target: 95, 
      category: 'strategic', 
      weight: 4, 
      status: 'in-band',
      description: 'A composite gauge of stakeholder trust (public surveys, partner feedback, system transparency scores).',
      breakdown: [
        'Public Survey Score: 92/100',
        'Partner Feedback Score: 85/100',
        'Transparency Index: 90/100'
      ],
      lastTrend: '↑2% last 7 days',
      actionHint: 'Click to see detailed trust-building recommendations.'
    },
    { 
      id: '4', 
      name: 'Bundle Coherence', 
      value: 72, 
      target: 90, 
      category: 'strategic', 
      weight: 3, 
      status: 'warning',
      description: 'Average "loop coverage" across active strategic bundles (i.e., how many identified leverage points each bundle actually addresses).',
      breakdown: [
        'Missing "Resource Recycling" leverage point in Bundle Beta',
        '"Education Budget" loop underweighted in Bundle Gamma'
      ],
      lastTrend: '+7% this month',
      actionHint: 'Click to open strategy builder for coherence improvements.'
    },
    // Operational indicators
    { 
      id: '5', 
      name: 'Open Claims', 
      value: 12, 
      target: 0, 
      category: 'operational', 
      weight: 3, 
      status: 'critical',
      description: 'Number of workflow "claims" (roles/tasks) in any zone that remain unassigned or unresolved.',
      breakdown: [
        'Think: 4',
        'Act: 3',
        'Monitor: 2',
        'Learn: 2',
        'Innovate: 1'
      ],
      lastTrend: 'Oldest: 5 days',
      actionHint: 'Click to view claim queue and assign resources.'
    },
    { 
      id: '6', 
      name: 'Think→Act Queue', 
      value: 4, 
      target: 0, 
      category: 'operational', 
      weight: 2, 
      status: 'warning',
      description: 'How many analysis outputs (loop findings, simulations) are waiting for strategy translation in Act.',
      breakdown: [
        'DEI target adjustment proposal',
        '"Population Volatility vs. Resource Gap" report',
        '"Social Cohesion Feedback" network analysis',
        '"Economic Stability Loop" sensitivity results'
      ],
      lastTrend: 'Avg Wait: 2.3 days',
      actionHint: 'Click to forward to strategy builder or reassign to Act leads.'
    },
    { 
      id: '7', 
      name: 'Act→Monitor Queue', 
      value: 3, 
      target: 0, 
      category: 'operational', 
      weight: 2, 
      status: 'warning',
      description: 'Number of planned bundles/strategies sent to Monitor for validation that haven\'t yet been evaluated on real-world data.',
      breakdown: [
        'Bundle Delta (Population Incentives)',
        'Bundle Epsilon (Resource Quotas)',
        'Bundle Zeta (Social Cohesion Programs)'
      ],
      lastTrend: 'Avg Delay: 1.8 days',
      actionHint: 'Click to run new simulations or update real-world data feeds.'
    },
    { 
      id: '8', 
      name: 'System Errors', 
      value: 5, 
      target: 0, 
      category: 'operational', 
      weight: 1, 
      status: 'warning',
      description: 'Number of software/system-integrity warnings or errors in the portal over the last 24 hours.',
      breakdown: [
        '2 × API timeout (Act zone)',
        '1 × Database write failure (Monitor zone)',
        '2 × UI rendering glitch (Learn zone)'
      ],
      lastTrend: 'Most Recent: Data sync failure at 03:45 UTC',
      actionHint: 'Click to view full error logs and resolve issues.'
    },
  ];

  const filteredData = treemapData.filter(item => 
    filter === 'all' || item.category === filter
  );

  const getBaseColor = (category: string) => {
    return category === 'strategic' ? 'rgba(0,184,255,0.08)' : 'rgba(0,255,195,0.08)';
  };

  const getStatusOverlay = (status: string) => {
    switch (status) {
      case 'in-band': return 'rgba(0,255,195,0.12)';
      case 'warning': return 'rgba(255,193,7,0.12)';
      case 'critical': return 'rgba(255,110,110,0.12)';
      default: return 'rgba(0,255,195,0.12)';
    }
  };

  const getLabelColor = (category: string) => {
    return '#00FFC3'; // Always neon-teal for indicator names
  };

  const calculateLayout = (data: TreemapData[]) => {
    const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);
    const containerWidth = 100;
    const containerHeight = 100;

    let currentY = 0;
    let currentRowHeight = 0;
    let currentX = 0;

    return data.map((item) => {
      const weightPercentage = item.weight / totalWeight;
      const area = weightPercentage * containerWidth * containerHeight;
      const aspectRatio = 1.5;
      const width = Math.sqrt(area * aspectRatio);
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

  const handleRectClick = (item: TreemapData) => {
    setSelectedRect(item);
  };

  const canShowLabels = (width: number, height: number) => {
    return width >= 15 && height >= 8; // Adjusted for SVG viewBox scale
  };

  const getPercentage = (value: number, target: number) => {
    if (target === 0) return value === 0 ? 100 : 0;
    return Math.round((value / target) * 100);
  };

  const getStatusFromPercentage = (percentage: number, isInverted: boolean = false) => {
    if (isInverted) {
      // For operational metrics where lower is better (like error counts)
      if (percentage <= 25) return 'in-band';
      if (percentage <= 75) return 'warning';
      return 'critical';
    } else {
      // For strategic metrics where higher is better
      if (percentage >= 75) return 'in-band';
      if (percentage >= 50) return 'warning';
      return 'critical';
    }
  };

  return (
    <>
      <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-40 bg-black/40' : ''}`}>
        {isFullscreen && (
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
              style={{
                background: '#00B8FF',
                color: '#081226',
                fontFamily: 'Noto Sans',
              }}
            >
              Back to Monitor
            </button>
          </div>
        )}

        <div className={`${isFullscreen ? 'absolute inset-8 top-16' : 'h-full'} flex flex-col`}>
          {/* Filter Pills */}
          <div className="flex justify-center gap-3 py-3 px-4">
            {(['all', 'strategic', 'operational'] as const).map((filterOption) => (
              <motion.button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-6 py-2 rounded-full text-xs font-semibold transition-all duration-200`}
                style={{
                  fontFamily: 'Noto Sans',
                  ...(filter === filterOption
                    ? {
                        background: '#00FFC3',
                        color: '#081226',
                        boxShadow: '0 0 8px rgba(0,255,195,0.6)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.08)',
                        color: '#E0E0E0',
                        border: '1px solid rgba(255,255,255,0.10)',
                        backdropFilter: 'blur(8px)',
                      }
                  ),
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {filterOption === 'all' ? 'All' : 
                 filterOption === 'strategic' ? 'Strategic Only' : 'Operational Only'}
              </motion.button>
            ))}
          </div>

          {/* Legend (Full-screen only) */}
          {isFullscreen && (
            <div className="flex justify-center gap-6 py-2 px-4">
              {[
                { color: 'rgba(0,255,195,0.8)', label: 'In-Band' },
                { color: 'rgba(255,193,7,0.8)', label: 'Warning' },
                { color: 'rgba(255,110,110,0.8)', label: 'Critical' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span
                    className="text-xs"
                    style={{ fontFamily: 'Noto Sans', color: '#E0E0E0' }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* SVG Treemap */}
          <div className="flex-1 p-4 relative">
            <motion.div
              layout
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <filter id="innerShadow">
                    <feFlood floodColor="rgba(0,0,0,0.3)" />
                    <feComposite in="SourceGraphic" />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feOffset dx="0" dy="1" result="offset" />
                    <feFlood floodColor="rgba(0,0,0,0.3)" />
                    <feComposite in2="offset" operator="in" />
                  </filter>
                </defs>
                
                {layoutData.map((item, index) => {
                  const percentage = getPercentage(item.value, item.target);
                  const isOperational = item.category === 'operational';
                  const actualStatus = isOperational ? getStatusFromPercentage(percentage, true) : item.status;
                  
                  return (
                    <motion.g
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: hoveredRect && hoveredRect !== item.id ? 0.8 : 1,
                        scale: hoveredRect === item.id ? 1.15 : hoveredRect && hoveredRect !== item.id ? 0.92 : 1,
                      }}
                      transition={{ 
                        duration: hoveredRect ? 0.2 : 0.4,
                        ease: hoveredRect ? "easeOut" : [0.68, -0.6, 0.32, 1.6],
                        delay: hoveredRect ? 0 : index * 0.05 
                      }}
                      style={{ transformOrigin: `${item.x + item.width/2}% ${item.y + item.height/2}%` }}
                    >
                      <rect
                        x={item.x}
                        y={item.y}
                        width={item.width}
                        height={item.height}
                        fill={getBaseColor(item.category)}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="0.1"
                        rx="1"
                        filter="url(#innerShadow)"
                        style={{
                          cursor: 'pointer',
                          boxShadow: hoveredRect === item.id ? '0 0 16px rgba(0,255,195,0.5)' : 'none',
                        }}
                        onMouseEnter={(e) => handleMouseEnter(item, e)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleRectClick(item)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${item.name}: ${item.value}/${item.target} (${percentage}%) ${actualStatus}`}
                      />
                      
                      {/* Status Overlay */}
                      <rect
                        x={item.x}
                        y={item.y}
                        width={item.width}
                        height={item.height}
                        fill={getStatusOverlay(actualStatus)}
                        rx="1"
                        style={{ pointerEvents: 'none' }}
                      />

                      {canShowLabels(item.width, item.height) ? (
                        <>
                          <text
                            x={item.x + item.width/2}
                            y={item.y + item.height/2 - 1}
                            textAnchor="middle"
                            className="font-bold"
                            style={{ 
                              fontFamily: 'Noto Sans',
                              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                              pointerEvents: 'none',
                              fill: getLabelColor(item.category),
                            }}
                            fontSize="2"
                          >
                            {item.name}
                          </text>
                          <text
                            x={item.x + item.width/2}
                            y={item.y + item.height/2 + 2}
                            textAnchor="middle"
                            style={{ 
                              fontFamily: 'Noto Sans',
                              pointerEvents: 'none',
                              fill: '#E0E0E0',
                            }}
                            fontSize="1.5"
                          >
                            {item.value} / {item.target}
                          </text>
                        </>
                      ) : (
                        <text
                          x={item.x + item.width/2}
                          y={item.y + item.height/2}
                          textAnchor="middle"
                          fontSize="2"
                          fill={getLabelColor(item.category)}
                          style={{ pointerEvents: 'none' }}
                        >
                          ℹ️
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              </svg>
            </motion.div>

            {/* Fullscreen Toggle */}
            {!isFullscreen && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
              >
                <span className="text-lg">⛶</span>
              </button>
            )}

            {/* Enhanced Tooltip */}
            {tooltip && (
              <div
                className="fixed z-50 px-4 py-3 rounded-lg text-xs pointer-events-none"
                style={{
                  left: tooltip.x + 10,
                  top: tooltip.y - 10,
                  background: 'rgba(20,30,50,0.9)',
                  backdropFilter: 'blur(16px)',
                  color: '#E0E0E0',
                  fontFamily: 'Noto Sans',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  maxWidth: '300px',
                }}
              >
                <div className="font-bold mb-2" style={{ color: getLabelColor(tooltip.data.category) }}>
                  {tooltip.data.name}
                </div>
                <div className="mb-1">Current: {tooltip.data.value} / {tooltip.data.target}</div>
                <div className="mb-1">Progress: {getPercentage(tooltip.data.value, tooltip.data.target)}%</div>
                <div className="mb-2 text-xs text-slate-400">{tooltip.data.lastTrend}</div>
                
                {tooltip.data.breakdown && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold mb-1">Breakdown:</div>
                    {tooltip.data.breakdown.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs text-slate-300">• {item}</div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-slate-400 italic">
                  {tooltip.data.actionHint}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drill-Down Modal */}
      <AnimatePresence>
        {selectedRect && (
          <DrillDownModal
            data={selectedRect}
            isOpen={!!selectedRect}
            onClose={() => setSelectedRect(null)}
            chartType={chartType}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TreemapView;
