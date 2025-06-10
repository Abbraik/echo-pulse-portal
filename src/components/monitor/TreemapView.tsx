
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { X, TrendingUp, Maximize2, Minimize2, Info } from 'lucide-react';

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
  tint: string;
  indicators: TreemapData[];
}

interface TileRect {
  x: number;
  y: number;
  width: number;
  height: number;
  data: TreemapData;
  sectorIndex: number;
}

const TreemapView: React.FC<TreemapViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [selectedIndicator, setSelectedIndicator] = useState<TreemapData | null>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusedTileIndex, setFocusedTileIndex] = useState<number>(0);

  // Sample indicators with proper weights
  const allIndicators: TreemapData[] = useMemo(() => [
    // Systemic (4 indicators)
    { id: '1', name: 'DEI Composite', value: 63, weight: 120, status: 'warning', category: 'Strategic', sector: 'Systemic', target: 80, trend: [68, 67, 65, 63, 62], lastUpdated: '2025-01-10', owner: 'Strategy Team', description: 'Overall diversity, equity and inclusion composite metric.' },
    { id: '2', name: 'Trust Recovery Index', value: 54, weight: 90, status: 'critical', category: 'Strategic', sector: 'Systemic', target: 75, trend: [65, 61, 58, 56, 54], lastUpdated: '2025-01-10', owner: 'Executive Leadership', description: 'Stakeholder confidence restoration metric.' },
    { id: '3', name: 'Network Dev Index', value: 52, weight: 80, status: 'critical', category: 'Strategic', sector: 'Systemic', target: 100, trend: [58, 56, 54, 52, 50], lastUpdated: '2025-01-10', owner: 'Network Team', description: 'Network development and infrastructure growth index.' },
    { id: '4', name: 'Bundle Coherence', value: 59, weight: 70, status: 'critical', category: 'Strategic', sector: 'Systemic', target: 100, trend: [65, 63, 61, 59, 57], lastUpdated: '2025-01-10', owner: 'Integration Team', description: 'System bundle integration and coherence measurement.' },

    // Population (6 indicators)
    { id: '5', name: 'Population Stability', value: 71, weight: 60, status: 'warning', category: 'Community', sector: 'Population', target: 85, trend: [79, 77, 74, 71, 69], lastUpdated: '2025-01-10', owner: 'Demographics Team', description: 'Population growth and stability indicators.' },
    { id: '6', name: 'Age Structure Balance', value: 68, weight: 50, status: 'warning', category: 'Community', sector: 'Population', target: 80, trend: [72, 70, 69, 68, 67], lastUpdated: '2025-01-10', owner: 'Demographics Team', description: 'Age distribution balance across population segments.' },
    { id: '7', name: 'Fertility Confidence', value: 58, weight: 45, status: 'critical', category: 'Community', sector: 'Population', target: 75, trend: [64, 62, 60, 58, 56], lastUpdated: '2025-01-10', owner: 'Social Policy', description: 'Fertility rates and family planning confidence metrics.' },
    { id: '8', name: 'Migration Flow', value: 73, weight: 40, status: 'warning', category: 'Community', sector: 'Population', target: 85, trend: [76, 75, 74, 73, 72], lastUpdated: '2025-01-10', owner: 'Immigration Services', description: 'Migration patterns and integration success rates.' },

    // Resource Market (6 indicators)
    { id: '9', name: 'Resource Stock vs Target', value: 45, weight: 85, status: 'critical', category: 'Operational', sector: 'Resource Market', target: 70, trend: [50, 48, 47, 45, 43], lastUpdated: '2025-01-10', owner: 'Resource Management', description: 'Resource availability against strategic targets.' },
    { id: '10', name: 'Renewal vs Consumption', value: 62, weight: 65, status: 'warning', category: 'Sustainability', sector: 'Resource Market', target: 80, trend: [66, 64, 63, 62, 61], lastUpdated: '2025-01-10', owner: 'Sustainability Team', description: 'Resource renewal rates compared to consumption.' },

    // Goods & Services (4 indicators)
    { id: '13', name: 'Supply-Demand Gap', value: 74, weight: 75, status: 'warning', category: 'Operational', sector: 'Goods & Services', target: 85, trend: [77, 76, 75, 74, 73], lastUpdated: '2025-01-10', owner: 'Market Analysis', description: 'Gap between supply and demand in key markets.' },
    { id: '14', name: 'Price Deviation', value: 69, weight: 55, status: 'warning', category: 'Financial', sector: 'Goods & Services', target: 80, trend: [72, 71, 70, 69, 68], lastUpdated: '2025-01-10', owner: 'Pricing Team', description: 'Price deviation from optimal market equilibrium.' },

    // Social Outcomes (4 indicators)
    { id: '17', name: 'Social Cohesion', value: 69, weight: 80, status: 'warning', category: 'Community', sector: 'Social Outcomes', target: 90, trend: [79, 76, 72, 69, 68], lastUpdated: '2025-01-10', owner: 'Community Relations', description: 'Social cohesion and community integration measures.' },
    { id: '18', name: 'Education Completion', value: 82, weight: 60, status: 'healthy', category: 'Learning', sector: 'Social Outcomes', target: 90, trend: [80, 81, 82, 83, 82], lastUpdated: '2025-01-10', owner: 'Education Ministry', description: 'Education completion rates across all levels.' },

    // Governance (4 indicators)
    { id: '21', name: 'Open Claims', value: 35, weight: 100, status: 'critical', category: 'Operational', sector: 'Governance', target: 5, trend: [12, 11, 10, 9, 10], lastUpdated: '2025-01-10', owner: 'Claims Processing', description: 'Number of open facilitator claims requiring resolution.' },
    { id: '22', name: 'System Error Count', value: 25, weight: 90, status: 'critical', category: 'Technical', sector: 'Governance', target: 1, trend: [6, 5, 5, 4, 5], lastUpdated: '2025-01-10', owner: 'System Administration', description: 'Critical system errors requiring immediate attention.' }
  ], []);

  // Define sectors with their colors and tints
  const sectors: Sector[] = useMemo(() => {
    const sectorConfig = [
      { name: 'Systemic', color: '#00B8FF', tint: 'rgba(0,184,255,0.08)' },
      { name: 'Population', color: '#00FFC3', tint: 'rgba(0,255,195,0.08)' },
      { name: 'Resource Market', color: '#FFC107', tint: 'rgba(255,193,7,0.08)' },
      { name: 'Goods & Services', color: '#7B68EE', tint: 'rgba(123,104,238,0.08)' },
      { name: 'Social Outcomes', color: '#3CB371', tint: 'rgba(60,179,113,0.08)' },
      { name: 'Governance', color: '#C71585', tint: 'rgba(199,21,133,0.08)' }
    ];

    return sectorConfig.map(config => ({
      ...config,
      indicators: allIndicators.filter(ind => ind.sector === config.name)
    })).filter(sector => sector.indicators.length > 0);
  }, [allIndicators]);

  // Simple treemap layout algorithm
  const createSectorTreemap = useCallback((sectors: Sector[], containerWidth: number, containerHeight: number): TileRect[] => {
    const rects: TileRect[] = [];
    const padding = 8;
    const headerHeight = 24;
    
    // Arrange sectors in a 3x2 grid
    const cols = 3;
    const rows = 2;
    const sectorWidth = (containerWidth - padding * (cols + 1)) / cols;
    const sectorHeight = (containerHeight - padding * (rows + 1)) / rows;

    sectors.forEach((sector, sectorIndex) => {
      const sectorRow = Math.floor(sectorIndex / cols);
      const sectorCol = sectorIndex % cols;
      const sectorX = padding + sectorCol * (sectorWidth + padding);
      const sectorY = padding + sectorRow * (sectorHeight + padding);
      
      const sectorAvailableHeight = sectorHeight - headerHeight - padding;
      
      // Simple grid layout within sector
      let currentY = sectorY + headerHeight + padding;
      let currentX = sectorX + padding;
      let rowHeight = 0;
      const availableWidth = sectorWidth - padding * 2;
      const tilesPerRow = Math.ceil(Math.sqrt(sector.indicators.length));
      const tileWidth = Math.max(80, (availableWidth - padding * (tilesPerRow - 1)) / tilesPerRow);
      const tileHeight = Math.max(60, sectorAvailableHeight / Math.ceil(sector.indicators.length / tilesPerRow));
      
      sector.indicators.forEach((indicator, index) => {
        // Check if tile fits in current row
        if (currentX + tileWidth > sectorX + sectorWidth - padding) {
          currentY += rowHeight + padding;
          currentX = sectorX + padding;
          rowHeight = 0;
        }
        
        // Ensure tile fits within sector bounds
        if (currentY + tileHeight <= sectorY + sectorHeight - padding) {
          rects.push({
            x: currentX,
            y: currentY,
            width: tileWidth,
            height: tileHeight,
            data: indicator,
            sectorIndex
          });
        }
        
        currentX += tileWidth + padding;
        rowHeight = Math.max(rowHeight, tileHeight);
      });
    });
    
    return rects;
  }, []);

  // Status color calculation
  const getStatusColor = useCallback((value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 75) return 'rgba(0,255,195,0.12)';
    if (percentage >= 50) return 'rgba(255,193,7,0.12)';
    return 'rgba(255,110,110,0.12)';
  }, []);

  // Generate tile rectangles
  const tileRects = useMemo(() => createSectorTreemap(sectors, 800, 400), [sectors, createSectorTreemap]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (selectedIndicator && event.key === 'Escape') {
      setSelectedIndicator(null);
      return;
    }

    if (event.key === 'Enter' && focusedTileIndex < tileRects.length) {
      setSelectedIndicator(tileRects[focusedTileIndex].data);
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      setFocusedTileIndex(prev => Math.min(prev + 1, tileRects.length - 1));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      setFocusedTileIndex(prev => Math.max(prev - 1, 0));
    }
  }, [selectedIndicator, focusedTileIndex, tileRects]);

  console.log('TreemapView rendering with', sectors.length, 'sectors and', tileRects.length, 'tiles');

  return (
    <div className="h-full w-full p-4">
      <div 
        className="treemap-card w-full h-full relative overflow-hidden"
        style={{
          background: 'rgba(10,20,40,0.45)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0,255,195,0.15)',
          borderRadius: '1.5rem',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          minHeight: '500px'
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Header Strip */}
        <div 
          className="treemap-header absolute top-0 left-0 right-0 h-10 flex items-center px-4"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
            borderRadius: '1.5rem 1.5rem 0 0'
          }}
        >
          <h2 
            className="text-white font-bold text-base"
            style={{ 
              fontFamily: 'Noto Sans',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)'
            }}
          >
            Sector Treemap: Comprehensive System View
          </h2>
          <div className="ml-auto">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white hover:text-gray-200 p-1 rounded transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>

        {/* SVG Content */}
        <div 
          className="treemap-svg absolute"
          style={{
            top: '40px',
            left: '16px',
            right: '16px',
            bottom: '16px'
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 800 400" className="w-full h-full">
            {/* Sector Headers */}
            {sectors.map((sector, sectorIndex) => {
              const cols = 3;
              const sectorRow = Math.floor(sectorIndex / cols);
              const sectorCol = sectorIndex % cols;
              const sectorWidth = (800 - 8 * (cols + 1)) / cols;
              const sectorHeight = (400 - 8 * 3) / 2;
              const sectorX = 8 + sectorCol * (sectorWidth + 8);
              const sectorY = 8 + sectorRow * (sectorHeight + 8);
              
              return (
                <text
                  key={`header-${sector.name}`}
                  className="sector-label"
                  x={sectorX + 8}
                  y={sectorY + 16}
                  style={{ 
                    fontFamily: 'Noto Sans',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fill: '#E0E0E0',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)' 
                  }}
                >
                  {sector.name}
                </text>
              );
            })}

            {/* Tiles */}
            {tileRects.map((rect, index) => {
              const canShowText = rect.width >= 80 && rect.height >= 50;
              const sector = sectors[rect.sectorIndex];
              const statusColor = getStatusColor(rect.data.value, rect.data.target);
              const isHovered = hoveredTile === rect.data.id;
              const isFocused = focusedTileIndex === index;
              
              return (
                <g
                  key={rect.data.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${rect.data.name}: ${rect.data.value}%`}
                  onMouseEnter={() => setHoveredTile(rect.data.id)}
                  onMouseLeave={() => setHoveredTile(null)}
                  onClick={() => setSelectedIndicator(rect.data)}
                  onFocus={() => setFocusedTileIndex(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Base sector tint */}
                  <rect
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={sector.tint}
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="1"
                  />
                  
                  {/* Status overlay */}
                  <rect
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={statusColor}
                    stroke="none"
                  />

                  {/* Hover glow */}
                  {isHovered && (
                    <rect
                      x={rect.x - 1}
                      y={rect.y - 1}
                      width={rect.width + 2}
                      height={rect.height + 2}
                      fill="none"
                      stroke="rgba(0,255,195,0.5)"
                      strokeWidth="2"
                    />
                  )}

                  {/* Focus indicator */}
                  {isFocused && (
                    <rect
                      x={rect.x - 2}
                      y={rect.y - 2}
                      width={rect.width + 4}
                      height={rect.height + 4}
                      fill="none"
                      stroke="#00FFC3"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  )}

                  {canShowText ? (
                    <>
                      {/* Tile name */}
                      <text
                        x={rect.x + rect.width / 2}
                        y={rect.y + 16}
                        textAnchor="middle"
                        style={{ 
                          fontFamily: 'Noto Sans',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          fill: sector.color
                        }}
                      >
                        {rect.data.name.length > 14 ? rect.data.name.substring(0, 14) + '...' : rect.data.name}
                      </text>
                      
                      {/* Value percentage */}
                      <text
                        x={rect.x + rect.width / 2}
                        y={rect.y + rect.height - 8}
                        textAnchor="middle"
                        style={{ 
                          fontFamily: 'Noto Sans',
                          fontSize: '9px',
                          fill: '#E0E0E0'
                        }}
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
                      />
                      <Info
                        size={12}
                        x={rect.x + rect.width / 2 - 6}
                        y={rect.y + rect.height / 2 - 6}
                        style={{ fill: '#000' }}
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setSelectedIndicator(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-96 flex flex-col"
              style={{
                background: 'rgba(20,30,50,0.85)',
                backdropFilter: 'blur(32px)',
                borderRadius: '1rem',
                boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
                color: '#E0E0E0',
                fontFamily: 'Noto Sans',
                fontSize: '12px',
                padding: '24px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-xl font-bold"
                  style={{ color: '#00FFC3', fontFamily: 'Noto Sans', fontSize: '18px' }}
                >
                  {selectedIndicator.name}
                </h2>
                <button
                  onClick={() => setSelectedIndicator(null)}
                  className="text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  style={{ fontSize: '24px' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="rounded-lg p-4 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-xl font-bold text-teal-400">{selectedIndicator.value}%</div>
                    <div className="text-xs text-slate-300">Current</div>
                  </div>
                  <div className="rounded-lg p-4 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-xl font-bold text-blue-400">{selectedIndicator.target}%</div>
                    <div className="text-xs text-slate-300">Target</div>
                  </div>
                  <div className="rounded-lg p-4 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-xl font-bold text-purple-400">{selectedIndicator.weight}</div>
                    <div className="text-xs text-slate-300">Weight</div>
                  </div>
                </div>

                {/* 90-day Chart */}
                <div className="rounded-lg p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <h4 className="text-md font-bold text-white mb-3 flex items-center">
                    <TrendingUp size={16} className="mr-2" />
                    90-Day Trend
                  </h4>
                  <div className="h-32">
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

                {/* Action Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    className="px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200"
                    style={{
                      background: '#00B8FF',
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      fontWeight: 'medium',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,184,255,0.4)'
                    }}
                    onClick={() => {
                      setSelectedIndicator(null);
                    }}
                  >
                    Go to Detailed View ▶
                  </button>
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
