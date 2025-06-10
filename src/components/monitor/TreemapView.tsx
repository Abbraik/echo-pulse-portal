
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { X, TrendingUp } from 'lucide-react';

interface TreemapData {
  id: string;
  name: string;
  value: number;
  weight: number;
  status: 'healthy' | 'warning' | 'critical';
  category: string;
  sector: string;
  target: number;
  trend: number[];
  lastUpdated: string;
  owner: string;
  description: string;
}

interface TreemapViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
}

interface Sector {
  name: string;
  color: string;
  indicators: TreemapData[];
}

interface TileRect {
  x: number;
  y: number;
  width: number;
  height: number;
  data: TreemapData;
}

const TreemapView: React.FC<TreemapViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [selectedIndicator, setSelectedIndicator] = useState<TreemapData | null>(null);
  const [filter, setFilter] = useState<'all' | 'strategic' | 'operational'>('all');

  // Define comprehensive indicator data with sectors
  const allIndicators: TreemapData[] = useMemo(() => [
    // Systemic Indicators
    { id: '1', name: 'DEI Composite', value: 63, weight: 15, status: 'warning', category: 'Strategic', sector: 'Systemic', target: 80, trend: [68, 67, 65, 63, 62], lastUpdated: '2025-01-10', owner: 'Strategy Team', description: 'Overall diversity, equity and inclusion composite metric.' },
    { id: '2', name: 'Trust Recovery Index', value: 54, weight: 12, status: 'critical', category: 'Strategic', sector: 'Systemic', target: 75, trend: [65, 61, 58, 56, 54], lastUpdated: '2025-01-10', owner: 'Executive Leadership', description: 'Stakeholder confidence restoration metric.' },
    { id: '3', name: 'Network Dev Index', value: 52, weight: 10, status: 'critical', category: 'Strategic', sector: 'Systemic', target: 100, trend: [58, 56, 54, 52, 50], lastUpdated: '2025-01-10', owner: 'Network Team', description: 'Network development and infrastructure growth index.' },
    { id: '4', name: 'Bundle Coherence', value: 59, weight: 8, status: 'critical', category: 'Strategic', sector: 'Systemic', target: 100, trend: [65, 63, 61, 59, 57], lastUpdated: '2025-01-10', owner: 'Integration Team', description: 'System bundle integration and coherence measurement.' },

    // Population
    { id: '5', name: 'Population Stability', value: 71, weight: 9, status: 'warning', category: 'Community', sector: 'Population', target: 85, trend: [79, 77, 74, 71, 69], lastUpdated: '2025-01-10', owner: 'Demographics Team', description: 'Population growth and stability indicators.' },
    { id: '6', name: 'Age Structure Balance', value: 68, weight: 7, status: 'warning', category: 'Community', sector: 'Population', target: 80, trend: [72, 70, 69, 68, 67], lastUpdated: '2025-01-10', owner: 'Demographics Team', description: 'Age distribution balance across population segments.' },
    { id: '7', name: 'Fertility Confidence', value: 58, weight: 6, status: 'critical', category: 'Community', sector: 'Population', target: 75, trend: [64, 62, 60, 58, 56], lastUpdated: '2025-01-10', owner: 'Social Policy', description: 'Fertility rates and family planning confidence metrics.' },
    { id: '8', name: 'Migration Flow', value: 73, weight: 5, status: 'warning', category: 'Community', sector: 'Population', target: 85, trend: [76, 75, 74, 73, 72], lastUpdated: '2025-01-10', owner: 'Immigration Services', description: 'Migration patterns and integration success rates.' },

    // Resource Market
    { id: '9', name: 'Resource Stock vs Target', value: 45, weight: 11, status: 'critical', category: 'Operational', sector: 'Resource Market', target: 70, trend: [50, 48, 47, 45, 43], lastUpdated: '2025-01-10', owner: 'Resource Management', description: 'Resource availability against strategic targets.' },
    { id: '10', name: 'Renewal vs Consumption', value: 62, weight: 9, status: 'warning', category: 'Sustainability', sector: 'Resource Market', target: 80, trend: [66, 64, 63, 62, 61], lastUpdated: '2025-01-10', owner: 'Sustainability Team', description: 'Resource renewal rates compared to consumption.' },
    { id: '11', name: 'Extraction Pressure', value: 41, weight: 8, status: 'critical', category: 'Environmental', sector: 'Resource Market', target: 60, trend: [46, 44, 42, 41, 39], lastUpdated: '2025-01-10', owner: 'Environmental Team', description: 'Environmental pressure from resource extraction activities.' },
    { id: '12', name: 'Resource Price Smoothed', value: 67, weight: 6, status: 'warning', category: 'Financial', sector: 'Resource Market', target: 75, trend: [70, 69, 68, 67, 66], lastUpdated: '2025-01-10', owner: 'Finance Team', description: 'Smoothed resource pricing trends and volatility.' },

    // Goods & Services Market
    { id: '13', name: 'Supply-Demand Gap', value: 74, weight: 10, status: 'warning', category: 'Operational', sector: 'Goods & Services', target: 85, trend: [77, 76, 75, 74, 73], lastUpdated: '2025-01-10', owner: 'Market Analysis', description: 'Gap between supply and demand in key markets.' },
    { id: '14', name: 'Price Deviation', value: 69, weight: 8, status: 'warning', category: 'Financial', sector: 'Goods & Services', target: 80, trend: [72, 71, 70, 69, 68], lastUpdated: '2025-01-10', owner: 'Pricing Team', description: 'Price deviation from optimal market equilibrium.' },
    { id: '15', name: 'Capacity Utilization', value: 81, weight: 7, status: 'healthy', category: 'Operational', sector: 'Goods & Services', target: 85, trend: [78, 79, 80, 81, 82], lastUpdated: '2025-01-10', owner: 'Operations', description: 'Production and service capacity utilization rates.' },
    { id: '16', name: 'Market Stability', value: 76, weight: 6, status: 'healthy', category: 'Strategic', sector: 'Goods & Services', target: 80, trend: [74, 75, 76, 77, 76], lastUpdated: '2025-01-10', owner: 'Market Strategy', description: 'Overall market stability and predictability index.' },

    // Social Outcomes
    { id: '17', name: 'Social Cohesion', value: 69, weight: 9, status: 'warning', category: 'Community', sector: 'Social Outcomes', target: 90, trend: [79, 76, 72, 69, 68], lastUpdated: '2025-01-10', owner: 'Community Relations', description: 'Social cohesion and community integration measures.' },
    { id: '18', name: 'Education Completion', value: 82, weight: 8, status: 'healthy', category: 'Learning', sector: 'Social Outcomes', target: 90, trend: [80, 81, 82, 83, 82], lastUpdated: '2025-01-10', owner: 'Education Ministry', description: 'Education completion rates across all levels.' },
    { id: '19', name: 'Health Status Index', value: 78, weight: 7, status: 'healthy', category: 'Community', sector: 'Social Outcomes', target: 85, trend: [76, 77, 78, 79, 78], lastUpdated: '2025-01-10', owner: 'Health Ministry', description: 'Population health indicators and healthcare access.' },
    { id: '20', name: 'Household Revenue', value: 71, weight: 6, status: 'warning', category: 'Financial', sector: 'Social Outcomes', target: 80, trend: [74, 73, 72, 71, 70], lastUpdated: '2025-01-10', owner: 'Economic Policy', description: 'Average household income and financial stability.' },

    // Governance
    { id: '21', name: 'Open Claims', value: 10, weight: 5, status: 'critical', category: 'Operational', sector: 'Governance', target: 5, trend: [12, 11, 10, 9, 10], lastUpdated: '2025-01-10', owner: 'Claims Processing', description: 'Number of open facilitator claims requiring resolution.' },
    { id: '22', name: 'Think→Act Queue', value: 4, weight: 4, status: 'warning', category: 'Operational', sector: 'Governance', target: 3, trend: [5, 4, 4, 3, 4], lastUpdated: '2025-01-10', owner: 'Process Management', description: 'Queue length for think-to-act transitions.' },
    { id: '23', name: 'Act→Monitor Queue', value: 3, weight: 3, status: 'healthy', category: 'Operational', sector: 'Governance', target: 2, trend: [4, 3, 3, 2, 3], lastUpdated: '2025-01-10', owner: 'Process Management', description: 'Queue length for act-to-monitor transitions.' },
    { id: '24', name: 'System Error Count', value: 5, weight: 3, status: 'critical', category: 'Technical', sector: 'Governance', target: 1, trend: [6, 5, 5, 4, 5], lastUpdated: '2025-01-10', owner: 'System Administration', description: 'Critical system errors requiring immediate attention.' }
  ], []);

  // Filter indicators based on current filter
  const filteredIndicators = useMemo(() => {
    if (filter === 'all') return allIndicators;
    if (filter === 'strategic') return allIndicators.filter(ind => ind.category === 'Strategic');
    if (filter === 'operational') return allIndicators.filter(ind => ind.category === 'Operational');
    return allIndicators;
  }, [allIndicators, filter]);

  // Group indicators by sector
  const sectors: Sector[] = useMemo(() => {
    const sectorNames = ['Systemic', 'Population', 'Resource Market', 'Goods & Services', 'Social Outcomes', 'Governance'];
    const sectorColors = [
      'rgba(0,184,255,0.08)', // Blue for Systemic
      'rgba(0,255,195,0.08)', // Teal for Population  
      'rgba(255,193,7,0.08)', // Yellow for Resource Market
      'rgba(156,39,176,0.08)', // Purple for Goods & Services
      'rgba(76,175,80,0.08)', // Green for Social Outcomes
      'rgba(255,87,34,0.08)'  // Orange for Governance
    ];

    return sectorNames.map((name, index) => ({
      name,
      color: sectorColors[index],
      indicators: filteredIndicators.filter(ind => ind.sector === name)
    })).filter(sector => sector.indicators.length > 0);
  }, [filteredIndicators]);

  // Simple sector-based treemap layout
  const createSectorTreemap = (sectors: Sector[], containerWidth: number, containerHeight: number): TileRect[] => {
    const rects: TileRect[] = [];
    const headerHeight = 24;
    const padding = 4;
    
    // Arrange sectors in a 2x3 grid
    const cols = 2;
    const rows = 3;
    const sectorWidth = (containerWidth - padding * (cols + 1)) / cols;
    const sectorHeight = (containerHeight - padding * (rows + 1)) / rows;

    sectors.forEach((sector, sectorIndex) => {
      const sectorRow = Math.floor(sectorIndex / cols);
      const sectorCol = sectorIndex % cols;
      const sectorX = padding + sectorCol * (sectorWidth + padding);
      const sectorY = padding + sectorRow * (sectorHeight + padding);
      
      // Calculate available space for tiles (excluding header)
      const availableHeight = sectorHeight - headerHeight;
      const sectorTotalWeight = sector.indicators.reduce((sum, ind) => sum + ind.weight, 0);
      
      // Simple layout within sector
      let currentY = sectorY + headerHeight;
      let currentX = sectorX;
      let rowHeight = 0;
      
      sector.indicators.forEach((indicator) => {
        const area = (indicator.weight / sectorTotalWeight) * (sectorWidth * availableHeight);
        const tileWidth = Math.max(60, Math.min(sectorWidth - (currentX - sectorX), Math.sqrt(area * 1.5)));
        const tileHeight = Math.max(40, area / tileWidth);
        
        // Check if tile fits in current row
        if (currentX + tileWidth > sectorX + sectorWidth) {
          currentY += rowHeight + 2;
          currentX = sectorX;
          rowHeight = 0;
        }
        
        rects.push({
          x: currentX,
          y: currentY,
          width: Math.min(tileWidth, sectorX + sectorWidth - currentX),
          height: Math.min(tileHeight, sectorY + sectorHeight - currentY),
          data: indicator
        });
        
        currentX += tileWidth + 2;
        rowHeight = Math.max(rowHeight, tileHeight);
      });
    });
    
    return rects;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#00FFC3';
      case 'warning': return '#FFC107';
      case 'critical': return '#FF6E6E';
      default: return '#00FFC3';
    }
  };

  const getSectorColor = (sectorName: string) => {
    const colorMap: Record<string, string> = {
      'Systemic': 'rgba(0,184,255,0.08)',
      'Population': 'rgba(0,255,195,0.08)',
      'Resource Market': 'rgba(255,193,7,0.08)',
      'Goods & Services': 'rgba(156,39,176,0.08)',
      'Social Outcomes': 'rgba(76,175,80,0.08)',
      'Governance': 'rgba(255,87,34,0.08)'
    };
    return colorMap[sectorName] || 'rgba(255,255,255,0.05)';
  };

  const tileRects = createSectorTreemap(sectors, 800, 500);

  return (
    <div className="h-full flex flex-col p-4">
      {/* Filter Pills */}
      <div className="flex space-x-2 mb-4">
        {(['all', 'strategic', 'operational'] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === filterOption
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            {filterOption === 'all' ? 'All Indicators' : 
             filterOption === 'strategic' ? 'Strategic Only' : 'Operational Only'}
          </button>
        ))}
      </div>

      {/* Treemap Container */}
      <div className="flex-1">
        <div 
          className="w-full h-full rounded-2xl border border-teal-400/15 overflow-hidden relative"
          style={{
            background: 'rgba(10,20,40,0.45)',
            backdropFilter: 'blur(24px)',
            minHeight: '500px'
          }}
        >
          {/* Header Strip */}
          <div 
            className="h-10 flex items-center px-4"
            style={{
              background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
            }}
          >
            <h3 className="text-white font-bold text-sm" style={{ fontFamily: 'Noto Sans' }}>
              Sector Treemap
            </h3>
          </div>

          {/* SVG Content */}
          <div className="absolute inset-x-4 bottom-4 top-14">
            <svg width="100%" height="100%" viewBox="0 0 800 500" className="w-full h-full">
              {/* Sector Headers */}
              {sectors.map((sector, sectorIndex) => {
                const sectorRow = Math.floor(sectorIndex / 2);
                const sectorCol = sectorIndex % 2;
                const sectorX = 4 + sectorCol * 398;
                const sectorY = 4 + sectorRow * 164;
                
                return (
                  <text
                    key={`header-${sector.name}`}
                    x={sectorX + 8}
                    y={sectorY + 16}
                    className="text-xs font-bold fill-slate-300"
                    style={{ 
                      fontFamily: 'Noto Sans',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)' 
                    }}
                  >
                    {sector.name}
                  </text>
                );
              })}

              {/* Tiles */}
              {tileRects.map((rect) => {
                const canShowText = rect.width > 80 && rect.height > 50;
                const sectorColor = getSectorColor(rect.data.sector);
                const statusColor = getStatusColor(rect.data.status);
                
                return (
                  <g key={rect.data.id}>
                    <rect
                      x={rect.x}
                      y={rect.y}
                      width={rect.width}
                      height={rect.height}
                      fill={sectorColor}
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth="1"
                      className="cursor-pointer hover:opacity-80 transition-all duration-200"
                      onClick={() => setSelectedIndicator(rect.data)}
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      }}
                    />
                    
                    {/* Status indicator dot */}
                    <circle
                      cx={rect.x + rect.width - 8}
                      cy={rect.y + 8}
                      r="3"
                      fill={statusColor}
                      className="cursor-pointer"
                      onClick={() => setSelectedIndicator(rect.data)}
                    />

                    {canShowText ? (
                      <>
                        {/* Title */}
                        <text
                          x={rect.x + rect.width / 2}
                          y={rect.y + 16}
                          textAnchor="middle"
                          className="text-xs font-bold fill-white cursor-pointer"
                          onClick={() => setSelectedIndicator(rect.data)}
                          style={{ fontFamily: 'Noto Sans' }}
                        >
                          {rect.data.name.length > 14 ? rect.data.name.substring(0, 14) + '...' : rect.data.name}
                        </text>
                        
                        {/* Value */}
                        <text
                          x={rect.x + rect.width / 2}
                          y={rect.y + rect.height - 8}
                          textAnchor="middle"
                          className="text-sm font-bold cursor-pointer"
                          fill={statusColor}
                          onClick={() => setSelectedIndicator(rect.data)}
                          style={{ fontFamily: 'Noto Sans' }}
                        >
                          {rect.data.value}%
                        </text>
                      </>
                    ) : (
                      <>
                        {/* Info icon for small tiles */}
                        <circle
                          cx={rect.x + rect.width / 2}
                          cy={rect.y + rect.height / 2}
                          r="8"
                          fill="#00FFC3"
                          className="cursor-pointer"
                          onClick={() => setSelectedIndicator(rect.data)}
                        />
                        <text
                          x={rect.x + rect.width / 2}
                          y={rect.y + rect.height / 2 + 3}
                          textAnchor="middle"
                          className="text-xs font-bold fill-black cursor-pointer"
                          onClick={() => setSelectedIndicator(rect.data)}
                        >
                          i
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedIndicator(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl max-h-[600px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getStatusColor(selectedIndicator.status) }}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedIndicator.name}</h2>
                    <p className="text-slate-300">{selectedIndicator.sector} • {selectedIndicator.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIndicator(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-teal-400">{selectedIndicator.value}%</div>
                    <div className="text-xs text-slate-300">Current</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-blue-400">{selectedIndicator.target}%</div>
                    <div className="text-xs text-slate-300">Target</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-purple-400">{selectedIndicator.weight}</div>
                    <div className="text-xs text-slate-300">Weight</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">Description</h3>
                  <p className="text-slate-300 text-sm">{selectedIndicator.description}</p>
                </div>

                {/* Trend Chart */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-md font-bold text-white mb-3 flex items-center">
                    <TrendingUp size={16} className="mr-2" />
                    5-Period Trend
                  </h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'line' ? (
                        <LineChart data={selectedIndicator.trend.map((value, index) => ({ period: index + 1, value }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="period" stroke="#94A3B8" />
                          <YAxis stroke="#94A3B8" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#00FFC3" 
                            strokeWidth={2}
                            dot={{ fill: '#00FFC3', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={selectedIndicator.trend.map((value, index) => ({ period: index + 1, value }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="period" stroke="#94A3B8" />
                          <YAxis stroke="#94A3B8" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="value" fill="#00FFC3" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
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

export default TreemapView;
