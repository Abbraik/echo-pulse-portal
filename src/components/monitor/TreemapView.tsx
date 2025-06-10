
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';

interface TreemapData {
  id: string;
  name: string;
  value: number;
  weight: number;
  status: 'healthy' | 'warning' | 'critical';
  sector: string;
  target: number;
  trend: number[];
  description: string;
}

interface TreemapViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
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
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  // Define indicators with revised weights for dynamic sizing
  const indicators: TreemapData[] = useMemo(() => [
    // Systemic
    { id: '1', name: 'DEI Composite', value: 63, weight: 120, status: 'warning', sector: 'Systemic', target: 80, trend: [68, 67, 65, 63, 62], description: 'Overall diversity, equity and inclusion composite metric.' },
    { id: '2', name: 'Trust Recovery', value: 54, weight: 90, status: 'critical', sector: 'Systemic', target: 75, trend: [65, 61, 58, 56, 54], description: 'Stakeholder confidence restoration metric.' },
    { id: '3', name: 'Network Dev Index', value: 52, weight: 80, status: 'critical', sector: 'Systemic', target: 100, trend: [58, 56, 54, 52, 50], description: 'Network development and infrastructure growth.' },
    { id: '4', name: 'Bundle Coherence', value: 59, weight: 70, status: 'critical', sector: 'Systemic', target: 100, trend: [65, 63, 61, 59, 57], description: 'System bundle integration coherence.' },

    // Population
    { id: '5', name: 'Population Stability', value: 71, weight: 85, status: 'warning', sector: 'Population', target: 85, trend: [79, 77, 74, 71, 69], description: 'Population growth and stability indicators.' },
    { id: '6', name: 'Age Structure Balance', value: 68, weight: 75, status: 'warning', sector: 'Population', target: 80, trend: [72, 70, 69, 68, 67], description: 'Age distribution balance across segments.' },
    { id: '7', name: 'Fertility Confidence', value: 58, weight: 65, status: 'critical', sector: 'Population', target: 75, trend: [64, 62, 60, 58, 56], description: 'Fertility rates and family planning confidence.' },
    { id: '8', name: 'Migration Flow', value: 73, weight: 55, status: 'warning', sector: 'Population', target: 85, trend: [76, 75, 74, 73, 72], description: 'Migration patterns and integration success.' },

    // Resource Market
    { id: '9', name: 'Resource Stock vs Target', value: 45, weight: 110, status: 'critical', sector: 'Resource Market', target: 70, trend: [50, 48, 47, 45, 43], description: 'Resource availability against targets.' },
    { id: '10', name: 'Renewal vs Consumption', value: 62, weight: 95, status: 'warning', sector: 'Resource Market', target: 80, trend: [66, 64, 63, 62, 61], description: 'Resource renewal vs consumption rates.' },
    { id: '11', name: 'Extraction Pressure', value: 41, weight: 85, status: 'critical', sector: 'Resource Market', target: 60, trend: [46, 44, 42, 41, 39], description: 'Environmental pressure from extraction.' },
    { id: '12', name: 'Resource Price Smoothed', value: 67, weight: 60, status: 'warning', sector: 'Resource Market', target: 75, trend: [70, 69, 68, 67, 66], description: 'Smoothed resource pricing trends.' },

    // Goods & Services
    { id: '13', name: 'Supply-Demand Gap', value: 74, weight: 100, status: 'warning', sector: 'Goods & Services', target: 85, trend: [77, 76, 75, 74, 73], description: 'Gap between supply and demand.' },
    { id: '14', name: 'Price Deviation', value: 69, weight: 80, status: 'warning', sector: 'Goods & Services', target: 80, trend: [72, 71, 70, 69, 68], description: 'Price deviation from optimal equilibrium.' },
    { id: '15', name: 'Capacity Utilization', value: 81, weight: 75, status: 'healthy', sector: 'Goods & Services', target: 85, trend: [78, 79, 80, 81, 82], description: 'Production capacity utilization rates.' },
    { id: '16', name: 'Market Stability', value: 76, weight: 65, status: 'healthy', sector: 'Goods & Services', target: 80, trend: [74, 75, 76, 77, 76], description: 'Overall market stability index.' },

    // Social Outcomes
    { id: '17', name: 'Social Cohesion', value: 69, weight: 90, status: 'warning', sector: 'Social Outcomes', target: 90, trend: [79, 76, 72, 69, 68], description: 'Social cohesion and integration.' },
    { id: '18', name: 'Education Completion', value: 82, weight: 80, status: 'healthy', sector: 'Social Outcomes', target: 90, trend: [80, 81, 82, 83, 82], description: 'Education completion rates.' },
    { id: '19', name: 'Health Status Index', value: 78, weight: 75, status: 'healthy', sector: 'Social Outcomes', target: 85, trend: [76, 77, 78, 79, 78], description: 'Population health indicators.' },
    { id: '20', name: 'Household Revenue', value: 71, weight: 70, status: 'warning', sector: 'Social Outcomes', target: 80, trend: [74, 73, 72, 71, 70], description: 'Average household income stability.' },

    // Governance
    { id: '21', name: 'Open Claims', value: 10, weight: 100, status: 'critical', sector: 'Governance', target: 5, trend: [12, 11, 10, 9, 10], description: 'Open facilitator claims requiring resolution.' },
    { id: '22', name: 'System Errors', value: 5, weight: 90, status: 'critical', sector: 'Governance', target: 1, trend: [6, 5, 5, 4, 5], description: 'Critical system errors requiring attention.' },
    { id: '23', name: 'Think→Act Queue', value: 4, weight: 60, status: 'warning', sector: 'Governance', target: 3, trend: [5, 4, 4, 3, 4], description: 'Queue length for think-to-act transitions.' },
    { id: '24', name: 'Act→Monitor Queue', value: 3, weight: 50, status: 'healthy', sector: 'Governance', target: 2, trend: [4, 3, 3, 2, 3], description: 'Queue length for act-to-monitor transitions.' }
  ], []);

  // Group indicators by sector
  const sectors = useMemo(() => [
    { name: 'Systemic', color: 'rgba(0,184,255,0.08)', indicators: indicators.filter(i => i.sector === 'Systemic') },
    { name: 'Population', color: 'rgba(0,255,195,0.08)', indicators: indicators.filter(i => i.sector === 'Population') },
    { name: 'Resource Market', color: 'rgba(255,193,7,0.08)', indicators: indicators.filter(i => i.sector === 'Resource Market') },
    { name: 'Goods & Services', color: 'rgba(123,104,238,0.08)', indicators: indicators.filter(i => i.sector === 'Goods & Services') },
    { name: 'Social Outcomes', color: 'rgba(60,179,113,0.08)', indicators: indicators.filter(i => i.sector === 'Social Outcomes') },
    { name: 'Governance', color: 'rgba(199,21,133,0.08)', indicators: indicators.filter(i => i.sector === 'Governance') }
  ], [indicators]);

  // Calculate treemap layout
  const createTreemapLayout = (width: number, height: number): TileRect[] => {
    const totalWeight = indicators.reduce((sum, ind) => sum + ind.weight, 0);
    const rects: TileRect[] = [];
    
    // Calculate sector areas
    const sectorAreas = sectors.map(sector => ({
      ...sector,
      area: sector.indicators.reduce((sum, ind) => sum + ind.weight, 0) / totalWeight * (width * height)
    }));

    // Layout sectors in 3x2 grid
    let currentY = 0;
    for (let row = 0; row < 2; row++) {
      let currentX = 0;
      const rowHeight = height / 2;
      
      for (let col = 0; col < 3; col++) {
        const sectorIndex = row * 3 + col;
        if (sectorIndex >= sectors.length) break;
        
        const sector = sectors[sectorIndex];
        const sectorWidth = width / 3;
        
        // Layout tiles within sector using simple row-based algorithm
        let tileY = currentY + 20; // Leave space for sector label
        let tileX = currentX;
        let rowMaxHeight = 0;
        
        sector.indicators.forEach(indicator => {
          const tileArea = (indicator.weight / totalWeight) * (width * height);
          const aspectRatio = 1.6; // Preferred aspect ratio
          let tileWidth = Math.sqrt(tileArea * aspectRatio);
          let tileHeight = tileArea / tileWidth;
          
          // Ensure minimum size
          tileWidth = Math.max(tileWidth, 80);
          tileHeight = Math.max(tileHeight, 50);
          
          // Check if tile fits in current row
          if (tileX + tileWidth > currentX + sectorWidth && tileX > currentX) {
            tileY += rowMaxHeight + 2;
            tileX = currentX;
            rowMaxHeight = 0;
          }
          
          // Ensure tile fits within sector bounds
          tileWidth = Math.min(tileWidth, currentX + sectorWidth - tileX);
          tileHeight = Math.min(tileHeight, currentY + rowHeight - tileY);
          
          rects.push({
            x: tileX,
            y: tileY,
            width: tileWidth,
            height: tileHeight,
            data: indicator
          });
          
          tileX += tileWidth + 2;
          rowMaxHeight = Math.max(rowMaxHeight, tileHeight);
        });
        
        currentX += sectorWidth;
      }
      currentY += rowHeight;
    }
    
    return rects;
  };

  const getStatusOverlay = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 0.75) return 'rgba(0,255,195,0.12)';
    if (ratio >= 0.5) return 'rgba(255,193,7,0.12)';
    return 'rgba(255,110,110,0.12)';
  };

  const getSectorColor = (sectorName: string) => {
    const sector = sectors.find(s => s.name === sectorName);
    return sector?.color || 'rgba(255,255,255,0.05)';
  };

  const tiles = createTreemapLayout(800, 500);

  return (
    <div className="h-full p-4">
      <div 
        className="w-full h-full rounded-2xl overflow-hidden relative"
        style={{
          background: 'rgba(10,20,40,0.45)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0,255,195,0.15)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          maxHeight: 'calc(100vh - 240px)',
          minHeight: '600px'
        }}
      >
        {/* Header Strip */}
        <div 
          className="h-10 flex items-center px-4"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
            borderRadius: '1rem 1rem 0 0'
          }}
        >
          <h3 
            className="text-white font-bold text-base"
            style={{ 
              fontFamily: 'Noto Sans',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)' 
            }}
          >
            Sector Treemap: Comprehensive System View
          </h3>
        </div>

        {/* SVG Container */}
        <div 
          className="absolute overflow-y-auto"
          style={{
            top: '40px',
            bottom: '16px',
            left: '16px',
            right: '16px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.20) transparent'
          }}
        >
          <style>{`
            .overflow-y-auto::-webkit-scrollbar {
              width: 6px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: rgba(255,255,255,0.20);
              border-radius: 3px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: transparent;
            }
          `}</style>
          
          <svg width="100%" height="100%" viewBox="0 0 800 500" className="w-full h-full">
            {/* Sector Labels */}
            {sectors.map((sector, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const x = col * (800 / 3) + 8;
              const y = row * (500 / 2) + 16;
              
              return (
                <text
                  key={`label-${sector.name}`}
                  x={x}
                  y={y}
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
            {tiles.map((tile) => {
              const canShowText = tile.width >= 100 && tile.height >= 60;
              const sectorColor = getSectorColor(tile.data.sector);
              const statusOverlay = getStatusOverlay(tile.data.value, tile.data.target);
              const isHovered = hoveredTile === tile.data.id;
              
              return (
                <g 
                  key={tile.data.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${tile.data.name}: ${tile.data.value}/${tile.data.target}`}
                  onMouseEnter={() => setHoveredTile(tile.data.id)}
                  onMouseLeave={() => setHoveredTile(null)}
                  onClick={() => setSelectedIndicator(tile.data)}
                  className="cursor-pointer"
                  style={{
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transformOrigin: `${tile.x + tile.width/2}px ${tile.y + tile.height/2}px`,
                    transition: 'transform 200ms ease-out'
                  }}
                >
                  {/* Base tile */}
                  <rect
                    x={tile.x}
                    y={tile.y}
                    width={tile.width}
                    height={tile.height}
                    fill={sectorColor}
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="1"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                      ...(isHovered && { 
                        boxShadow: '0 0 12px rgba(0,255,195,0.5)',
                        filter: 'drop-shadow(0 0 12px rgba(0,255,195,0.5))'
                      })
                    }}
                  />
                  
                  {/* Status overlay */}
                  <rect
                    x={tile.x}
                    y={tile.y}
                    width={tile.width}
                    height={tile.height}
                    fill={statusOverlay}
                    stroke="none"
                  />

                  {canShowText ? (
                    <>
                      {/* Title */}
                      <text
                        x={tile.x + tile.width / 2}
                        y={tile.y + 20}
                        textAnchor="middle"
                        className="text-xs font-bold"
                        fill="#00B8FF"
                        style={{ 
                          fontFamily: 'Noto Sans',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)' 
                        }}
                      >
                        {tile.data.name.length > 16 ? 
                          tile.data.name.substring(0, 16) + '...' : 
                          tile.data.name}
                      </text>
                      
                      {/* Value */}
                      <text
                        x={tile.x + tile.width / 2}
                        y={tile.y + tile.height - 8}
                        textAnchor="middle"
                        className="text-sm font-normal"
                        fill="#E0E0E0"
                        style={{ fontFamily: 'Noto Sans' }}
                      >
                        {tile.data.value}
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Info icon for small tiles */}
                      <circle
                        cx={tile.x + tile.width / 2}
                        cy={tile.y + tile.height / 2}
                        r="8"
                        fill="#00FFC3"
                      />
                      <text
                        x={tile.x + tile.width / 2}
                        y={tile.y + tile.height / 2 + 3}
                        textAnchor="middle"
                        className="text-xs font-bold fill-black"
                      >
                        ℹ
                      </text>
                    </>
                  )}
                </g>
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
              className="w-[600px] h-[400px] rounded-2xl overflow-hidden relative"
              style={{
                background: 'rgba(20,30,50,0.85)',
                backdropFilter: 'blur(32px)',
                border: '1px solid rgba(0,255,195,0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 
                  className="text-lg font-bold text-[#00FFC3]"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  {selectedIndicator.name}
                </h2>
                <button
                  onClick={() => setSelectedIndicator(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {/* Stats */}
                <div className="flex items-center space-x-8">
                  <div>
                    <span className="text-slate-400 text-sm">Current</span>
                    <div className="text-2xl font-bold text-[#00FFC3]">{selectedIndicator.value}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Target</span>
                    <div className="text-2xl font-bold text-blue-400">{selectedIndicator.target}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Performance</span>
                    <div className="text-2xl font-bold text-purple-400">
                      {((selectedIndicator.value / selectedIndicator.target) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm">{selectedIndicator.description}</p>

                {/* Trend Chart */}
                <div 
                  className="rounded-lg p-4"
                  style={{ 
                    background: 'rgba(10,15,25,0.5)',
                    height: '40%'
                  }}
                >
                  <h4 className="text-white font-bold mb-3 flex items-center">
                    <TrendingUp size={16} className="mr-2" />
                    90-Day Trend
                  </h4>
                  <svg width="100%" height="120" viewBox="0 0 400 120">
                    {chartType === 'line' ? (
                      <polyline
                        points={selectedIndicator.trend.map((value, i) => 
                          `${(i / (selectedIndicator.trend.length - 1)) * 380 + 10},${120 - (value / Math.max(...selectedIndicator.trend)) * 100 - 10}`
                        ).join(' ')}
                        fill="none"
                        stroke="#00FFC3"
                        strokeWidth="3"
                      />
                    ) : (
                      selectedIndicator.trend.map((value, i) => (
                        <rect
                          key={i}
                          x={i * 70 + 20}
                          y={120 - (value / Math.max(...selectedIndicator.trend)) * 100 - 10}
                          width="50"
                          height={(value / Math.max(...selectedIndicator.trend)) * 100}
                          fill="#00FFC3"
                          opacity="0.8"
                        />
                      ))
                    )}
                  </svg>
                </div>

                {/* Action Button */}
                <button
                  className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: '#00B8FF',
                    color: '#081226',
                    fontFamily: 'Noto Sans'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#00CCFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#00B8FF';
                  }}
                >
                  Goto Detailed View
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreemapView;
