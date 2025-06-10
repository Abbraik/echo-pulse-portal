
import React, { useState } from 'react';
import { Sector } from './types';

interface SectorTreemapProps {
  sectors: Sector[];
}

interface PositionedIndicator {
  id: string;
  name: string;
  sector: string;
  x: number;
  y: number;
  width: number;
  height: number;
  weight: number;
  value: number;
  target: number;
}

interface TooltipState {
  indicator: PositionedIndicator;
  x: number;
  y: number;
}

const SectorTreemap: React.FC<SectorTreemapProps> = ({ sectors }) => {
  const W = 800; // SVG width
  const H = 600; // SVG height
  
  // State for interactions
  const [hoveredIndicatorId, setHoveredIndicatorId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  
  // Step 1: Flatten data and compute areas
  const indicators = sectors.flatMap(s => s.indicators);
  const totalWeight = indicators.reduce((sum, i) => sum + i.weight, 0);
  const svgArea = W * H;
  
  const indicatorsWithArea = indicators.map(i => ({
    ...i,
    area: (i.weight / totalWeight) * svgArea
  }));

  // Step 2: Basic row-by-row packing
  const numberOfRows = Math.ceil(indicators.length / 6);
  const rowHeight = H / numberOfRows;
  
  const positionedIndicators: PositionedIndicator[] = [];
  let currentRow = 0;
  let currentX = 0;
  let indicatorsInCurrentRow = 0;
  const maxIndicatorsPerRow = 6;

  indicatorsWithArea.forEach((indicator, index) => {
    const width = indicator.area / rowHeight;
    
    // Check if we need to start a new row
    if (indicatorsInCurrentRow >= maxIndicatorsPerRow || currentX + width > W) {
      currentRow++;
      currentX = 0;
      indicatorsInCurrentRow = 0;
    }
    
    const y = currentRow * rowHeight;
    
    positionedIndicators.push({
      id: indicator.id,
      name: indicator.name,
      sector: indicator.sector,
      x: currentX,
      y: y,
      width: width,
      height: rowHeight,
      weight: indicator.weight,
      value: indicator.value,
      target: indicator.target
    });
    
    // Log computed values for verification
    console.log(`Indicator ${indicator.name}: x=${currentX.toFixed(2)}, y=${y.toFixed(2)}, width=${width.toFixed(2)}, height=${rowHeight.toFixed(2)}, weight=${indicator.weight}`);
    
    currentX += width;
    indicatorsInCurrentRow++;
  });

  // Step 4: Group indicators by sector for labels
  const sectorGroups = new Map<string, PositionedIndicator[]>();
  positionedIndicators.forEach(indicator => {
    if (!sectorGroups.has(indicator.sector)) {
      sectorGroups.set(indicator.sector, []);
    }
    sectorGroups.get(indicator.sector)!.push(indicator);
  });

  // Helper functions for styling
  const getSectorClass = (sector: string): string => {
    const sectorMap: Record<string, string> = {
      'Systemic': 'sector-systemic',
      'Population': 'sector-population', 
      'ResourceMarket': 'sector-resources',
      'GoodsServices': 'sector-goods',
      'SocialOutcomes': 'sector-social',
      'Governance': 'sector-governance'
    };
    return sectorMap[sector] || 'sector-systemic';
  };

  const getStatusClass = (value: number, target: number): string => {
    const performance = value / target;
    if (performance >= 0.9) return 'status-inband';
    if (performance >= 0.75) return 'status-warning';
    return 'status-critical';
  };

  // Event handlers
  const handleTileMouseEnter = (indicator: PositionedIndicator, event: React.MouseEvent) => {
    setHoveredIndicatorId(indicator.id);
    const rect = event.currentTarget.getBoundingClientRect();
    const svgRect = event.currentTarget.closest('svg')?.getBoundingClientRect();
    if (svgRect) {
      setTooltip({
        indicator,
        x: event.clientX - svgRect.left + 10,
        y: event.clientY - svgRect.top - 10
      });
    }
  };

  const handleTileMouseLeave = () => {
    setHoveredIndicatorId(null);
    setTooltip(null);
  };

  const handleTileClick = (indicatorId: string) => {
    console.log(`Clicked indicator: ${indicatorId}`);
  };

  const handleTileKeyDown = (event: React.KeyboardEvent, indicator: PositionedIndicator) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTileClick(indicator.id);
    }
  };

  const handleTileFocus = (indicator: PositionedIndicator) => {
    setHoveredIndicatorId(indicator.id);
  };

  const handleTileBlur = () => {
    setHoveredIndicatorId(null);
    setTooltip(null);
  };

  const getTileClasses = (indicator: PositionedIndicator): string => {
    const classes = [];
    if (hoveredIndicatorId === indicator.id) {
      classes.push('tile-hovered');
    } else if (hoveredIndicatorId && hoveredIndicatorId !== indicator.id) {
      classes.push('tile-dimmed');
    }
    return classes.join(' ');
  };

  return (
    <div className="h-full w-full p-4">
      {/* Glassmorphic Card Frame */}
      <div className="treemap-card">
        {/* Header Strip */}
        <div className="treemap-header">
          <h2>Sector Treemap: Comprehensive System View</h2>
        </div>
        
        {/* SVG Container */}
        <div className="p-4 relative">
          <svg width={W} height={H} className="w-full">
            {/* Define filters and effects */}
            <defs>
              <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.3)" floodOpacity="1"/>
              </filter>
            </defs>
            
            {/* Render rectangles for each indicator */}
            {positionedIndicators.map((indicator) => {
              const sectorClass = getSectorClass(indicator.sector);
              const statusClass = getStatusClass(indicator.value, indicator.target);
              const tileClasses = getTileClasses(indicator);
              
              return (
                <g key={indicator.id}>
                  {/* Base sector tint */}
                  <rect
                    x={indicator.x}
                    y={indicator.y}
                    width={indicator.width}
                    height={indicator.height}
                    className={`${sectorClass} ${tileClasses}`}
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="1"
                    filter="url(#innerShadow)"
                    style={{ cursor: 'pointer' }}
                    tabIndex={0}
                    onMouseEnter={(e) => handleTileMouseEnter(indicator, e)}
                    onMouseLeave={handleTileMouseLeave}
                    onClick={() => handleTileClick(indicator.id)}
                    onKeyDown={(e) => handleTileKeyDown(e, indicator)}
                    onFocus={() => handleTileFocus(indicator)}
                    onBlur={handleTileBlur}
                  />
                  {/* Status overlay */}
                  <rect
                    x={indicator.x}
                    y={indicator.y}
                    width={indicator.width}
                    height={indicator.height}
                    className={statusClass}
                    stroke="none"
                    pointerEvents="none"
                  />
                </g>
              );
            })}
            
            {/* Render sector labels */}
            {Array.from(sectorGroups.entries()).map(([sectorName, indicators]) => {
              // Find the first (leftmost) indicator in this sector
              const firstIndicator = indicators.reduce((leftmost, current) => 
                current.x < leftmost.x ? current : leftmost
              );
              
              return (
                <text
                  key={sectorName}
                  x={firstIndicator.x + 4}
                  y={firstIndicator.y + 12}
                  className="sector-label"
                >
                  {sectorName}
                </text>
              );
            })}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div 
              className="tooltip"
              style={{
                position: 'absolute',
                left: tooltip.x,
                top: tooltip.y,
                pointerEvents: 'none',
                zIndex: 1000
              }}
            >
              <strong>{tooltip.indicator.name}</strong><br/>
              {tooltip.indicator.value} / {tooltip.indicator.target} ({Math.round((tooltip.indicator.value / tooltip.indicator.target) * 100)}%)
            </div>
          )}
        </div>
        
        {/* Debug info */}
        <div className="mt-4 px-4 pb-4 text-sm text-gray-300">
          <p>Total Indicators: {indicators.length}</p>
          <p>Total Weight: {totalWeight.toFixed(2)}</p>
          <p>SVG Dimensions: {W} x {H}</p>
          <p>Row Height: {rowHeight.toFixed(2)}</p>
          {hoveredIndicatorId && <p>Hovered: {hoveredIndicatorId}</p>}
        </div>
      </div>

      <style>{`
        .treemap-card {
          background: rgba(10,20,40,0.45);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0,255,195,0.15);
          border-radius: 1.5rem;
          box-shadow: 0 12px 32px rgba(0,0,0,0.6);
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .treemap-header {
          background: linear-gradient(90deg,#00FFC3 0%,#00B8FF 100%);
          height: 40px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          border-radius: 1.5rem 1.5rem 0 0;
        }

        .treemap-header h2 {
          font-family: 'Noto Sans', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #FFFFFF;
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
          margin: 0;
        }

        /* Sector Tinting - 20% opacity tints */
        .sector-systemic {
          fill: rgba(0,184,255,0.08);
        }
        
        .sector-population {
          fill: rgba(0,255,195,0.08);
        }
        
        .sector-resources {
          fill: rgba(255,193,7,0.08);
        }
        
        .sector-goods {
          fill: rgba(123,104,238,0.08);
        }
        
        .sector-social {
          fill: rgba(60,179,113,0.08);
        }
        
        .sector-governance {
          fill: rgba(199,21,133,0.08);
        }

        /* Status Overlays */
        .status-inband {
          fill: rgba(0,255,195,0.12);
        }
        
        .status-warning {
          fill: rgba(255,193,7,0.12);
        }
        
        .status-critical {
          fill: rgba(255,110,110,0.12);
        }

        /* Hover Effects */
        .tile-hovered {
          transform: scale(1.05);
          filter: url(#innerShadow) drop-shadow(0 0 12px rgba(0,255,195,0.5));
          transition: transform 200ms ease-out, filter 200ms ease-out;
        }

        .tile-dimmed {
          opacity: 0.8;
          transition: opacity 200ms ease-out;
        }

        /* Sector Labels */
        .sector-label {
          font-family: 'Noto Sans', sans-serif;
          font-weight: 700;
          font-size: 10px;
          fill: #E0E0E0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        /* Tooltip */
        .tooltip {
          background: rgba(20,30,50,0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0,255,195,0.3);
          border-radius: 8px;
          padding: 8px 12px;
          color: #E0E0E0;
          font: 12px 'Noto Sans', sans-serif;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          white-space: nowrap;
        }

        /* Focus styles for accessibility */
        rect:focus {
          outline: 2px solid rgba(0,255,195,0.8);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default SectorTreemap;
