
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Sector } from './types';
import { IndicatorModal } from './IndicatorModal';
import SparklineChart from '@/components/think/components/SparklineChart';

interface SectorTreemapProps {
  sectors: Sector[];
}

interface TreemapTile {
  id: string;
  name: string;
  sector: string;
  value: number;
  target: number;
  weight: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TooltipState {
  tile: TreemapTile;
  x: number;
  y: number;
}

const SectorTreemap: React.FC<SectorTreemapProps> = ({ sectors }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<TreemapTile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update dimensions when container resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(400, rect.width - 32), // Account for padding
          height: Math.max(300, rect.height - 56) // Account for header and padding
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Sector colors mapping
  const sectorColors: Record<string, string> = {
    'Systemic': '#0080FF',
    'Population': '#00C080',
    'Resource Market': '#FFC000',
    'Goods & Services': '#8040FF',
    'Social Outcomes': '#40C040',
    'Governance': '#C04080'
  };

  // Calculate opacity based on performance
  const getPerformanceOpacity = (value: number, target: number): number => {
    const performance = (value / target) * 100;
    if (performance >= 75) return 1.0;
    if (performance >= 50) return 0.8;
    return 0.6;
  };

  // Simple treemap layout algorithm
  const calculateLayout = (): TreemapTile[] => {
    const allIndicators = sectors.flatMap(s => s.indicators);
    const totalWeight = allIndicators.reduce((sum, i) => sum + i.weight, 0);
    
    // Group by sector
    const sectorGroups = new Map<string, typeof allIndicators>();
    allIndicators.forEach(indicator => {
      if (!sectorGroups.has(indicator.sector)) {
        sectorGroups.set(indicator.sector, []);
      }
      sectorGroups.get(indicator.sector)!.push(indicator);
    });

    // Calculate sector areas
    const sectorAreas = new Map<string, number>();
    sectorGroups.forEach((indicators, sector) => {
      const sectorWeight = indicators.reduce((sum, i) => sum + i.weight, 0);
      sectorAreas.set(sector, (sectorWeight / totalWeight) * (dimensions.width * dimensions.height));
    });

    // Simple layout: arrange sectors in a 2x3 grid
    const sectorsArray = Array.from(sectorGroups.keys());
    const sectorRects = new Map<string, { x: number, y: number, width: number, height: number }>();
    
    const cols = 3;
    const rows = 2;
    sectorsArray.forEach((sector, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      sectorRects.set(sector, {
        x: (col * dimensions.width) / cols,
        y: (row * dimensions.height) / rows,
        width: dimensions.width / cols,
        height: dimensions.height / rows
      });
    });

    // Layout tiles within each sector
    const tiles: TreemapTile[] = [];
    sectorGroups.forEach((indicators, sector) => {
      const sectorRect = sectorRects.get(sector)!;
      const sectorWeight = indicators.reduce((sum, i) => sum + i.weight, 0);
      
      // Simple squarified layout within sector
      let currentX = sectorRect.x + 2; // 2px padding for borders
      let currentY = sectorRect.y + 12; // 12px for sector label
      let rowHeight = 0;
      const availableWidth = sectorRect.width - 4;
      const availableHeight = sectorRect.height - 14;
      
      indicators.forEach((indicator, index) => {
        const tileArea = (indicator.weight / sectorWeight) * (availableWidth * availableHeight);
        const tileWidth = Math.min(availableWidth / 4, Math.sqrt(tileArea * 1.5));
        const tileHeight = tileArea / tileWidth;
        
        // Check if we need to wrap to next row
        if (currentX + tileWidth > sectorRect.x + sectorRect.width - 2) {
          currentX = sectorRect.x + 2;
          currentY += rowHeight + 2;
          rowHeight = 0;
        }
        
        tiles.push({
          id: indicator.id,
          name: indicator.name,
          sector: indicator.sector,
          value: indicator.value,
          target: indicator.target,
          weight: indicator.weight,
          x: currentX,
          y: currentY,
          width: Math.max(40, tileWidth),
          height: Math.max(30, tileHeight)
        });
        
        currentX += tileWidth + 2;
        rowHeight = Math.max(rowHeight, tileHeight);
      });
    });

    return tiles;
  };

  const tiles = useMemo(calculateLayout, [sectors, dimensions]);

  const handleTileHover = (tile: TreemapTile, event: React.MouseEvent) => {
    setHoveredTile(tile.id);
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setTooltip({
        tile,
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top - 60
      });
    }
  };

  const handleTileLeave = () => {
    setHoveredTile(null);
    setTooltip(null);
  };

  const handleTileClick = (tile: TreemapTile) => {
    setSelectedIndicator(tile);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    console.log(`Editing indicator: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting indicator: ${id}`);
  };

  // Generate mock sparkline data
  const generateSparklineData = () => {
    return Array.from({ length: 30 }, () => Math.random() * 100 + 50);
  };

  // Calculate sector boundaries for borders
  const sectorBounds = useMemo(() => {
    const bounds = new Map<string, { minX: number, minY: number, maxX: number, maxY: number }>();
    
    tiles.forEach(tile => {
      if (!bounds.has(tile.sector)) {
        bounds.set(tile.sector, {
          minX: tile.x,
          minY: tile.y,
          maxX: tile.x + tile.width,
          maxY: tile.y + tile.height
        });
      } else {
        const current = bounds.get(tile.sector)!;
        bounds.set(tile.sector, {
          minX: Math.min(current.minX, tile.x),
          minY: Math.min(current.minY, tile.y),
          maxX: Math.max(current.maxX, tile.x + tile.width),
          maxY: Math.max(current.maxY, tile.y + tile.height)
        });
      }
    });
    
    return bounds;
  }, [tiles]);

  return (
    <div className="treemap-container" ref={containerRef}>
      {/* Header */}
      <div className="treemap-header">
        <h2>Sector Treemap: Comprehensive System View</h2>
      </div>
      
      {/* SVG Treemap */}
      <div className="treemap-svg-container">
        <svg 
          className="treemap-svg"
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Sector boundaries and labels */}
          {Array.from(sectorBounds.entries()).map(([sector, bounds]) => (
            <g key={sector}>
              {/* Sector boundary */}
              <rect
                x={bounds.minX - 2}
                y={bounds.minY - 12}
                width={bounds.maxX - bounds.minX + 4}
                height={bounds.maxY - bounds.minY + 14}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.3"
              />
              
              {/* Sector label */}
              <text
                x={bounds.minX}
                y={bounds.minY - 2}
                className="sector-label"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="700"
                fontFamily="Noto Sans, sans-serif"
              >
                {sector.toUpperCase()}
              </text>
            </g>
          ))}
          
          {/* Tiles */}
          {tiles.map(tile => {
            const isHovered = hoveredTile === tile.id;
            const performance = (tile.value / tile.target) * 100;
            const opacity = getPerformanceOpacity(tile.value, tile.target);
            const color = sectorColors[tile.sector] || '#0080FF';
            
            return (
              <g key={tile.id}>
                {/* Tile rectangle */}
                <rect
                  x={tile.x}
                  y={tile.y}
                  width={tile.width}
                  height={tile.height}
                  fill={color}
                  opacity={opacity}
                  stroke={isHovered ? "#FFFFFF" : "transparent"}
                  strokeWidth={isHovered ? "2" : "0"}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => handleTileHover(tile, e)}
                  onMouseLeave={handleTileLeave}
                  onClick={() => handleTileClick(tile)}
                />
                
                {/* Tile name */}
                {tile.width > 60 && tile.height > 30 && (
                  <text
                    x={tile.x + tile.width / 2}
                    y={tile.y + tile.height / 2 - 4}
                    className="tile-text"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="700"
                    fontFamily="Noto Sans, sans-serif"
                    pointerEvents="none"
                  >
                    {tile.name.length > 12 ? `${tile.name.substring(0, 12)}...` : tile.name}
                  </text>
                )}
                
                {/* Performance percentage */}
                {tile.width > 60 && tile.height > 30 && (
                  <text
                    x={tile.x + tile.width / 2}
                    y={tile.y + tile.height / 2 + 10}
                    className="tile-subtext"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontFamily="Noto Sans, sans-serif"
                    pointerEvents="none"
                  >
                    {Math.round(performance)}%
                  </text>
                )}
                
                {/* Small tiles - abbreviated text */}
                {(tile.width <= 60 || tile.height <= 30) && tile.width > 30 && tile.height > 20 && (
                  <text
                    x={tile.x + tile.width / 2}
                    y={tile.y + tile.height / 2 + 2}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="8"
                    fontWeight="600"
                    fontFamily="Noto Sans, sans-serif"
                    pointerEvents="none"
                  >
                    {tile.name.substring(0, 3)}
                  </text>
                )}
              </g>
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
            <div>{tooltip.tile.name}</div>
            <div>Current: {tooltip.tile.value} / Target: {tooltip.tile.target} ({Math.round((tooltip.tile.value / tooltip.tile.target) * 100)}%)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Last 30 days: 
              <SparklineChart 
                data={generateSparklineData()} 
                width={40} 
                height={12} 
                color="#FFFFFF" 
              />
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="legend">
          {Object.entries(sectorColors).map(([sector, color]) => (
            <div key={sector} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: color }}
              />
              <span>{sector}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <IndicatorModal
        indicator={selectedIndicator}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <style>{`
        .treemap-container {
          background: #0B122A;
          border-radius: 8px;
          padding: 16px;
          position: relative;
          overflow: hidden;
          height: 100%;
          min-height: 500px;
        }

        .treemap-header {
          background: #081226;
          color: #FFFFFF;
          font: 16px "Noto Sans", sans-serif;
          font-weight: 700;
          padding: 0 12px;
          line-height: 40px;
          border-radius: 8px 8px 0 0;
          margin: -16px -16px 0 -16px;
          height: 40px;
        }

        .treemap-svg-container {
          position: relative;
          width: 100%;
          height: calc(100% - 40px);
          min-height: 400px;
          margin-top: 0;
        }

        .treemap-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .sector-label {
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .tile-text {
          font: 12px "Noto Sans", sans-serif;
          font-weight: 700;
          fill: #FFFFFF;
          pointer-events: none;
        }

        .tile-subtext {
          font: 10px "Noto Sans", sans-serif;
          fill: #FFFFFF;
          text-anchor: middle;
          pointer-events: none;
        }

        .tooltip {
          background: rgba(0,0,0,0.7);
          color: #FFFFFF;
          font: 10px "Noto Sans", sans-serif;
          padding: 6px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
          white-space: nowrap;
          line-height: 1.3;
        }

        .legend {
          position: absolute;
          bottom: 16px;
          left: 16px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          font: 10px "Noto Sans", sans-serif;
          color: #FFFFFF;
          z-index: 10;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .legend {
            position: relative;
            bottom: auto;
            left: auto;
            margin-top: 12px;
            justify-content: center;
          }

          .treemap-container {
            min-height: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default SectorTreemap;
