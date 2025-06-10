import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { X, TrendingUp, Maximize2, Minimize2 } from 'lucide-react';

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
  sectorIndex: number;
}

const TreemapView: React.FC<TreemapViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [selectedIndicator, setSelectedIndicator] = useState<TreemapData | null>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusedTileIndex, setFocusedTileIndex] = useState<number>(0);

  // Comprehensive indicator data with updated weights
  const allIndicators: TreemapData[] = useMemo(() => [
    { id: '1', name: 'DEI Composite', value: 63, weight: 120, status: 'warning', category: 'Strategic', sector: 'Systemic', target: 80, trend: [68, 67, 65, 63, 62], lastUpdated: '2025-01-10', owner: 'Strategy Team', description: 'Overall diversity, equity and inclusion composite metric.' },
    { id: '2', name: 'Trust Recovery Index', value: 54, weight: 90, status: 'critical', category: 'Strategic', sector: 'Systemic', target: 75, trend: [65, 61, 58, 56, 54], lastUpdated: '2025-01-10', owner: 'Executive Leadership', description: 'Stakeholder confidence restoration metric.' },
    { id: '3', name: 'Network Dev Index', value: 52, weight: 80, status: 'critical', category: 'Strategic', sector: 'Systemic', target: 100, trend: [58, 56, 54, 52, 50], lastUpdated: '2025-01-10', owner: 'Network Team', description: 'Network development and infrastructure growth index.' },
    { id: '4', name: 'Bundle Coherence', value: 59, weight: 70, status: 'critical', category: 'Strategic', sector: 'Systemic', target: 100, trend: [65, 63, 61, 59, 57], lastUpdated: '2025-01-10', owner: 'Integration Team', description: 'System bundle integration and coherence measurement.' },
    { id: '5', name: 'Population Stability', value: 71, weight: 60, status: 'warning', category: 'Community', sector: 'Population', target: 85, trend: [79, 77, 74, 71, 69], lastUpdated: '2025-01-10', owner: 'Demographics Team', description: 'Population growth and stability indicators.' },
    { id: '6', name: 'Age Structure Balance', value: 68, weight: 50, status: 'warning', category: 'Community', sector: 'Population', target: 80, trend: [72, 70, 69, 68, 67], lastUpdated: '2025-01-10', owner: 'Demographics Team', description: 'Age distribution balance across population segments.' },
    { id: '7', name: 'Fertility Confidence', value: 58, weight: 45, status: 'critical', category: 'Community', sector: 'Population', target: 75, trend: [64, 62, 60, 58, 56], lastUpdated: '2025-01-10', owner: 'Social Policy', description: 'Fertility rates and family planning confidence metrics.' },
    { id: '8', name: 'Migration Flow', value: 73, weight: 40, status: 'warning', category: 'Community', sector: 'Population', target: 85, trend: [76, 75, 74, 73, 72], lastUpdated: '2025-01-10', owner: 'Immigration Services', description: 'Migration patterns and integration success rates.' },
    { id: '9', name: 'Resource Stock vs Target', value: 45, weight: 85, status: 'critical', category: 'Operational', sector: 'Resource Market', target: 70, trend: [50, 48, 47, 45, 43], lastUpdated: '2025-01-10', owner: 'Resource Management', description: 'Resource availability against strategic targets.' },
    { id: '10', name: 'Renewal vs Consumption', value: 62, weight: 65, status: 'warning', category: 'Sustainability', sector: 'Resource Market', target: 80, trend: [66, 64, 63, 62, 61], lastUpdated: '2025-01-10', owner: 'Sustainability Team', description: 'Resource renewal rates compared to consumption.' },
    { id: '11', name: 'Extraction Pressure', value: 41, weight: 55, status: 'critical', category: 'Environmental', sector: 'Resource Market', target: 60, trend: [46, 44, 42, 41, 39], lastUpdated: '2025-01-10', owner: 'Environmental Team', description: 'Environmental pressure from resource extraction activities.' },
    { id: '12', name: 'Resource Price Smoothed', value: 67, weight: 35, status: 'warning', category: 'Financial', sector: 'Resource Market', target: 75, trend: [70, 69, 68, 67, 66], lastUpdated: '2025-01-10', owner: 'Finance Team', description: 'Smoothed resource pricing trends and volatility.' },
    { id: '13', name: 'Supply-Demand Gap', value: 74, weight: 75, status: 'warning', category: 'Operational', sector: 'Goods & Services', target: 85, trend: [77, 76, 75, 74, 73], lastUpdated: '2025-01-10', owner: 'Market Analysis', description: 'Gap between supply and demand in key markets.' },
    { id: '14', name: 'Price Deviation', value: 69, weight: 55, status: 'warning', category: 'Financial', sector: 'Goods & Services', target: 80, trend: [72, 71, 70, 69, 68], lastUpdated: '2025-01-10', owner: 'Pricing Team', description: 'Price deviation from optimal market equilibrium.' },
    { id: '15', name: 'Capacity Utilization', value: 81, weight: 45, status: 'healthy', category: 'Operational', sector: 'Goods & Services', target: 85, trend: [78, 79, 80, 81, 82], lastUpdated: '2025-01-10', owner: 'Operations', description: 'Production and service capacity utilization rates.' },
    { id: '16', name: 'Market Stability', value: 76, weight: 35, status: 'healthy', category: 'Strategic', sector: 'Goods & Services', target: 80, trend: [74, 75, 76, 77, 76], lastUpdated: '2025-01-10', owner: 'Market Strategy', description: 'Overall market stability and predictability index.' },
    { id: '17', name: 'Social Cohesion', value: 69, weight: 80, status: 'warning', category: 'Community', sector: 'Social Outcomes', target: 90, trend: [79, 76, 72, 69, 68], lastUpdated: '2025-01-10', owner: 'Community Relations', description: 'Social cohesion and community integration measures.' },
    { id: '18', name: 'Education Completion', value: 82, weight: 60, status: 'healthy', category: 'Learning', sector: 'Social Outcomes', target: 90, trend: [80, 81, 82, 83, 82], lastUpdated: '2025-01-10', owner: 'Education Ministry', description: 'Education completion rates across all levels.' },
    { id: '19', name: 'Health Status Index', value: 78, weight: 50, status: 'healthy', category: 'Community', sector: 'Social Outcomes', target: 85, trend: [76, 77, 78, 79, 78], lastUpdated: '2025-01-10', owner: 'Health Ministry', description: 'Population health indicators and healthcare access.' },
    { id: '20', name: 'Household Revenue', value: 71, weight: 40, status: 'warning', category: 'Financial', sector: 'Social Outcomes', target: 80, trend: [74, 73, 72, 71, 70], lastUpdated: '2025-01-10', owner: 'Economic Policy', description: 'Average household income and financial stability.' },
    { id: '21', name: 'Open Claims', value: 35, weight: 100, status: 'critical', category: 'Operational', sector: 'Governance', target: 5, trend: [12, 11, 10, 9, 10], lastUpdated: '2025-01-10', owner: 'Claims Processing', description: 'Number of open facilitator claims requiring resolution.' },
    { id: '22', name: 'System Error Count', value: 25, weight: 90, status: 'critical', category: 'Technical', sector: 'Governance', target: 1, trend: [6, 5, 5, 4, 5], lastUpdated: '2025-01-10', owner: 'System Administration', description: 'Critical system errors requiring immediate attention.' },
    { id: '23', name: 'Think→Act Queue', value: 65, weight: 60, status: 'warning', category: 'Operational', sector: 'Governance', target: 3, trend: [5, 4, 4, 3, 4], lastUpdated: '2025-01-10', owner: 'Process Management', description: 'Queue length for think-to-act transitions.' },
    { id: '24', name: 'Act→Monitor Queue', value: 85, weight: 40, status: 'healthy', category: 'Operational', sector: 'Governance', target: 2, trend: [4, 3, 3, 2, 3], lastUpdated: '2025-01-10', owner: 'Process Management', description: 'Queue length for act-to-monitor transitions.' }
  ], []);

  // Group indicators by sector
  const sectors: Sector[] = useMemo(() => {
    const sectorConfig = [
      { name: 'Systemic', color: '#00B8FF' },
      { name: 'Population', color: '#00FFC3' },
      { name: 'Resource Market', color: '#FFC107' },
      { name: 'Goods & Services', color: '#7B68EE' },
      { name: 'Social Outcomes', color: '#3CB371' },
      { name: 'Governance', color: '#C71585' }
    ];

    return sectorConfig.map(config => ({
      ...config,
      indicators: allIndicators.filter(ind => ind.sector === config.name)
    })).filter(sector => sector.indicators.length > 0);
  }, [allIndicators]);

  // Advanced treemap layout algorithm with sector grouping
  const createSectorTreemap = useCallback((sectors: Sector[], containerWidth: number, containerHeight: number): TileRect[] => {
    const rects: TileRect[] = [];
    const padding = 3;
    const headerHeight = 20;
    
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
      
      const availableHeight = sectorHeight - headerHeight - padding;
      const sectorTotalWeight = sector.indicators.reduce((sum, ind) => sum + ind.weight, 0);
      const sectorArea = sectorWidth * availableHeight;
      
      // Sort indicators by weight (largest first)
      const sortedIndicators = [...sector.indicators].sort((a, b) => b.weight - a.weight);
      
      // Simple row-based layout within sector
      let currentY = sectorY + headerHeight + padding;
      let currentX = sectorX + padding;
      let rowHeight = 0;
      
      sortedIndicators.forEach((indicator) => {
        const area = (indicator.weight / sectorTotalWeight) * sectorArea;
        const aspectRatio = 1.6; // Preferred aspect ratio
        
        let tileWidth = Math.sqrt(area * aspectRatio);
        let tileHeight = area / tileWidth;
        
        // Ensure minimum size for readability
        tileWidth = Math.max(tileWidth, 60);
        tileHeight = Math.max(tileHeight, 40);
        
        // Check if tile fits in current row
        if (currentX + tileWidth > sectorX + sectorWidth - padding) {
          currentY += rowHeight + padding;
          currentX = sectorX + padding;
          rowHeight = 0;
        }
        
        // Ensure tile fits within sector bounds
        const finalWidth = Math.min(tileWidth, sectorX + sectorWidth - currentX - padding);
        const finalHeight = Math.min(tileHeight, sectorY + sectorHeight - currentY - padding);
        
        if (finalHeight > 20) { // Only add if there's sufficient space
          rects.push({
            x: currentX,
            y: currentY,
            width: finalWidth,
            height: finalHeight,
            data: indicator,
            sectorIndex
          });
        }
        
        currentX += finalWidth + padding;
        rowHeight = Math.max(rowHeight, finalHeight);
      });
    });
    
    return rects;
  }, []);

  const getStatusColor = useCallback((status: string, value: number, target: number) => {
    const percentage = (value / target) * 100;
    
    if (percentage >= 75) return '#00FFC3'; // Neon teal
    if (percentage >= 50) return '#FFC107'; // Amber
    return '#FF6E6E'; // Coral
  }, []);

  const getSectorTint = useCallback((sectorName: string) => {
    const colorMap: Record<string, string> = {
      'Systemic': 'rgba(0,184,255,0.20)',
      'Population': 'rgba(0,255,195,0.20)',
      'Resource Market': 'rgba(255,193,7,0.20)',
      'Goods & Services': 'rgba(123,104,238,0.20)',
      'Social Outcomes': 'rgba(60,179,113,0.20)',
      'Governance': 'rgba(199,21,133,0.20)'
    };
    return colorMap[sectorName] || 'rgba(255,255,255,0.05)';
  }, []);

  const tileRects = useMemo(() => createSectorTreemap(sectors, 800, 600), [sectors, createSectorTreemap]);

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

  return (
    <div 
      className={`h-full ${isFullscreen ? 'fixed inset-0 z-50 p-4' : ''}`}
      style={{ maxHeight: 'calc(100vh - 200px)' }}
    >
      <div 
        className="w-full h-full rounded-2xl relative overflow-hidden"
        style={{
          background: 'rgba(10,20,40,0.45)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0,255,195,0.15)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          padding: '16px'
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Header Strip */}
        <div 
          className="h-10 flex items-center justify-between px-4 rounded-t-2xl"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
          }}
        >
          <h3 className="text-white font-bold text-base" style={{ fontFamily: 'Noto Sans' }}>
            Sector Treemap: Comprehensive System View
          </h3>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-white hover:text-gray-200 p-1 rounded transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        {/* Legend Bar (only in fullscreen) */}
        {isFullscreen && (
          <div className="flex items-center justify-center space-x-6 py-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-teal-400"></div>
              <span className="text-white">In-Band (≥75%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-white">Warning (50-75%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-white">Critical (<50%)</span>
            </div>
          </div>
        )}

        {/* SVG Content */}
        <div 
          className="absolute overflow-y-auto"
          style={{
            top: isFullscreen ? '96px' : '56px',
            bottom: '16px',
            left: '16px',
            right: '16px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.20) transparent'
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 800 600" className="w-full h-full">
            {/* Sector Headers */}
            {sectors.map((sector, sectorIndex) => {
              const sectorRow = Math.floor(sectorIndex / 2);
              const sectorCol = sectorIndex % 2;
              const sectorX = 3 + sectorCol * 399;
              const sectorY = 3 + sectorRow * 199;
              
              return (
                <text
                  key={`header-${sector.name}`}
                  x={sectorX + 8}
                  y={sectorY + 16}
                  className="text-xs font-bold fill-gray-300"
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
            {tileRects.map((rect, index) => {
              const canShowText = rect.width >= 100 && rect.height >= 60;
              const sectorTint = getSectorTint(rect.data.sector);
              const statusColor = getStatusColor(rect.data.status, rect.data.value, rect.data.target);
              const isHovered = hoveredTile === rect.data.id;
              const isFocused = focusedTileIndex === index;
              const isAdjacent = hoveredTile && hoveredTile !== rect.data.id;
              
              return (
                <motion.g
                  key={rect.data.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${rect.data.name}: ${rect.data.value}%`}
                  animate={{
                    scale: isHovered ? 1.1 : isAdjacent ? 0.9 : 1,
                    opacity: isAdjacent ? 0.8 : 1,
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredTile(rect.data.id)}
                  onMouseLeave={() => setHoveredTile(null)}
                  onClick={() => setSelectedIndicator(rect.data)}
                  onFocus={() => setFocusedTileIndex(index)}
                  className="cursor-pointer"
                >
                  <rect
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={sectorTint}
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="1"
                    style={{
                      filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.3)) ${
                        isHovered ? `drop-shadow(0 0 12px rgba(0,255,195,0.5))` : ''
                      }`,
                    }}
                  />
                  
                  {/* Status overlay */}
                  <rect
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={statusColor}
                    opacity="0.12"
                  />

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
                      strokeDasharray="4 4"
                    />
                  )}
                  
                  {/* Status indicator dot */}
                  <circle
                    cx={rect.x + rect.width - 8}
                    cy={rect.y + 8}
                    r="3"
                    fill={statusColor}
                    style={{
                      filter: `drop-shadow(0 0 4px ${statusColor})`
                    }}
                  />

                  {canShowText ? (
                    <>
                      {/* Title */}
                      <text
                        x={rect.x + rect.width / 2}
                        y={rect.y + 20}
                        textAnchor="middle"
                        className="text-xs font-bold cursor-pointer"
                        fill={sectors[rect.sectorIndex]?.color || '#FFF'}
                        style={{ 
                          fontFamily: 'Noto Sans',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}
                      >
                        {rect.data.name.length > 16 ? rect.data.name.substring(0, 16) + '...' : rect.data.name}
                      </text>
                      
                      {/* Value */}
                      <text
                        x={rect.x + rect.width / 2}
                        y={rect.y + rect.height - 12}
                        textAnchor="middle"
                        className="text-sm font-normal cursor-pointer"
                        fill="#E0E0E0"
                        style={{ fontFamily: 'Noto Sans' }}
                      >
                        {rect.data.value}%
                      </text>
                    </>
                  ) : (
                    // Info icon for small tiles
                    <>
                      <circle
                        cx={rect.x + rect.width / 2}
                        cy={rect.y + rect.height / 2}
                        r="10"
                        fill="#00FFC3"
                        style={{
                          filter: 'drop-shadow(0 0 6px rgba(0,255,195,0.5))'
                        }}
                      />
                      <text
                        x={rect.x + rect.width / 2}
                        y={rect.y + rect.height / 2 + 4}
                        textAnchor="middle"
                        className="text-sm font-bold fill-black cursor-pointer"
                        style={{ fontFamily: 'Noto Sans' }}
                      >
                        i
                      </text>
                    </>
                  )}
                </motion.g>
              );
            })}
          </svg>
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
              className="w-full max-w-2xl h-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{
                background: 'rgba(20,30,50,0.85)',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.20)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: getStatusColor(selectedIndicator.status, selectedIndicator.value, selectedIndicator.target),
                      filter: `drop-shadow(0 0 6px ${getStatusColor(selectedIndicator.status, selectedIndicator.value, selectedIndicator.target)})`
                    }}
                  />
                  <div>
                    <h2 
                      className="text-xl font-bold"
                      style={{ 
                        color: '#00FFC3',
                        fontFamily: 'Noto Sans',
                        textShadow: '0 0 10px rgba(0,255,195,0.3)'
                      }}
                    >
                      {selectedIndicator.name}
                    </h2>
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

                {/* 90-Day Trend Chart */}
                <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
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
                <div className="flex justify-end">
                  <button
                    className="px-6 py-2 rounded-lg font-medium transition-all duration-200"
                    style={{
                      background: 'linear-gradient(90deg, #00B8FF 0%, #0080FF 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(0,184,255,0.3)'
                    }}
                    onClick={() => {
                      // Navigate to detailed view
                      console.log('Navigate to detailed view for:', selectedIndicator.id);
                    }}
                  >
                    Go to Details
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
