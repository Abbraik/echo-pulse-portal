
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
        // Account for padding (24px * 2) and header (56px) and legend margin (60px)
        setDimensions({
          width: Math.max(400, rect.width - 48),
          height: Math.max(300, rect.height - 140)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Sector colors with glassmorphic tints
  const sectorColors: Record<string, { base: string; tint: string }> = {
    'Systemic': { base: '#0080FF', tint: 'rgba(0,184,255,0.08)' },
    'Population': { base: '#00C080', tint: 'rgba(0,255,195,0.08)' },
    'Resource Market': { base: '#FFC000', tint: 'rgba(255,193,7,0.08)' },
    'Goods & Services': { base: '#8040FF', tint: 'rgba(123,104,238,0.08)' },
    'Social Outcomes': { base: '#40C040', tint: 'rgba(60,179,113,0.08)' },
    'Governance': { base: '#C04080', tint: 'rgba(199,21,133,0.08)' }
  };

  // Calculate performance-based opacity and status overlay
  const getPerformanceData = (value: number, target: number) => {
    const performance = (value / target) * 100;
    let opacity = 1.0;
    let statusOverlay = '';
    
    if (performance >= 75) {
      opacity = 1.0;
      statusOverlay = 'rgba(60,179,113,0.12)'; // green glow
    } else if (performance >= 50) {
      opacity = 0.8;
      statusOverlay = 'rgba(255,193,7,0.12)'; // amber glow
    } else {
      opacity = 0.6;
      statusOverlay = 'rgba(255,110,110,0.12)'; // coral glow
    }
    
    return { opacity, statusOverlay, performance };
  };

  // Simple treemap layout algorithm with proper spacing
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

    // Layout sectors in a 2x3 grid with 4px gutters
    const sectorsArray = Array.from(sectorGroups.keys());
    const cols = 3;
    const rows = 2;
    const gutterSize = 4;
    
    const sectorWidth = (dimensions.width - (cols - 1) * gutterSize) / cols;
    const sectorHeight = (dimensions.height - (rows - 1) * gutterSize) / rows;
    
    const sectorRects = new Map<string, { x: number, y: number, width: number, height: number }>();
    
    sectorsArray.forEach((sector, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      sectorRects.set(sector, {
        x: col * (sectorWidth + gutterSize),
        y: row * (sectorHeight + gutterSize),
        width: sectorWidth,
        height: sectorHeight
      });
    });

    // Layout tiles within each sector
    const tiles: TreemapTile[] = [];
    sectorGroups.forEach((indicators, sector) => {
      const sectorRect = sectorRects.get(sector)!;
      const sectorWeight = indicators.reduce((sum, i) => sum + i.weight, 0);
      
      // Simple grid layout within sector with 2px tile gutters
      let currentX = sectorRect.x + 8; // 8px sector label margin
      let currentY = sectorRect.y + 20; // 20px for sector label
      let rowHeight = 0;
      const tileGutter = 2;
      const availableWidth = sectorRect.width - 16;
      const availableHeight = sectorRect.height - 28;
      
      indicators.forEach((indicator, index) => {
        const tileArea = (indicator.weight / sectorWeight) * (availableWidth * availableHeight);
        let tileWidth = Math.max(60, Math.min(availableWidth / 3, Math.sqrt(tileArea * 1.5)));
        let tileHeight = Math.max(40, Math.min(tileArea / tileWidth, availableHeight / 2));
        
        // Check if we need to wrap to next row
        if (currentX + tileWidth > sectorRect.x + sectorRect.width - 8) {
          currentX = sectorRect.x + 8;
          currentY += rowHeight + tileGutter;
          rowHeight = 0;
        }
        
        // Ensure we don't exceed sector bounds
        if (currentY + tileHeight > sectorRect.y + sectorRect.height - 8) {
          tileHeight = Math.max(40, sectorRect.y + sectorRect.height - 8 - currentY);
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
          width: tileWidth,
          height: tileHeight
        });
        
        currentX += tileWidth + tileGutter;
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

  // Calculate sector boundaries for labels
  const sectorBounds = useMemo(() => {
    const bounds = new Map<string, { minX: number, minY: number, maxX: number, maxY: number }>();
    
    tiles.forEach(tile => {
      if (!bounds.has(tile.sector)) {
        bounds.set(tile.sector, {
          minX: tile.x - 8,
          minY: tile.y - 20,
          maxX: tile.x + tile.width + 8,
          maxY: tile.y + tile.height + 8
        });
      } else {
        const current = bounds.get(tile.sector)!;
        bounds.set(tile.sector, {
          minX: Math.min(current.minX, tile.x - 8),
          minY: Math.min(current.minY, tile.y - 20),
          maxX: Math.max(current.maxX, tile.x + tile.width + 8),
          maxY: Math.max(current.maxY, tile.y + tile.height + 8)
        });
      }
    });
    
    return bounds;
  }, [tiles]);

  return (
    <div className="treemap-card" ref={containerRef}>
      {/* Glassmorphic Header */}
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
          {/* Define filters for inner shadow */}
          <defs>
            <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>
          
          {/* Sector backgrounds with glassmorphic tints */}
          {Array.from(sectorBounds.entries()).map(([sector, bounds]) => (
            <g key={`sector-bg-${sector}`}>
              <rect
                x={bounds.minX}
                y={bounds.minY}
                width={bounds.maxX - bounds.minX}
                height={bounds.maxY - bounds.minY}
                fill={sectorColors[sector]?.tint || 'rgba(255,255,255,0.05)'}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="1"
                rx="8"
              />
            </g>
          ))}
          
          {/* Sector labels */}
          {Array.from(sectorBounds.entries()).map(([sector, bounds]) => (
            <text
              key={`sector-label-${sector}`}
              x={bounds.minX + 8}
              y={bounds.minY + 16}
              className="sector-label"
              fill="#E0E0E0"
              fontSize="10"
              fontWeight="700"
              fontFamily="Noto Sans, sans-serif"
            >
              {sector.toUpperCase()}
            </text>
          ))}
          
          {/* Tiles */}
          {tiles.map(tile => {
            const isHovered = hoveredTile === tile.id;
            const { opacity, statusOverlay, performance } = getPerformanceData(tile.value, tile.target);
            const color = sectorColors[tile.sector]?.base || '#0080FF';
            
            return (
              <g key={tile.id}>
                {/* Base tile */}
                <rect
                  x={tile.x}
                  y={tile.y}
                  width={tile.width}
                  height={tile.height}
                  fill={color}
                  opacity={opacity}
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="1"
                  filter="url(#innerShadow)"
                  rx="4"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => handleTileHover(tile, e)}
                  onMouseLeave={handleTileLeave}
                  onClick={() => handleTileClick(tile)}
                />
                
                {/* Status overlay */}
                <rect
                  x={tile.x}
                  y={tile.y}
                  width={tile.width}
                  height={tile.height}
                  fill={statusOverlay}
                  rx="4"
                  pointerEvents="none"
                />
                
                {/* Hover stroke */}
                {isHovered && (
                  <rect
                    x={tile.x}
                    y={tile.y}
                    width={tile.width}
                    height={tile.height}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    rx="4"
                    pointerEvents="none"
                  />
                )}
                
                {/* Tile name - show if sufficient space */}
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
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
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
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
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
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
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

        {/* Glassmorphic Legend */}
        <div className="legend">
          {Object.entries(sectorColors).map(([sector, { base }]) => (
            <div key={sector} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: base }}
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
        .treemap-card {
          background: rgba(10,20,40,0.45);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0,255,195,0.15);
          border-radius: 1.5rem;
          box-shadow: 0 12px 32px rgba(0,0,0,0.6);
          padding: 16px;
          position: relative;
          overflow: hidden;
          height: 100%;
          min-height: 500px;
        }

        .treemap-header {
          background: linear-gradient(90deg,#00FFC3 0%,#00B8FF 100%);
          height: 40px;
          line-height: 40px;
          padding: 0 16px;
          border-radius: 1.5rem 1.5rem 0 0;
          font: 16px "Noto Sans", sans-serif;
          color: #FFFFFF;
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
          margin: -16px -16px 0 -16px;
          font-weight: 700;
        }

        .treemap-header h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
        }

        .treemap-svg-container {
          position: relative;
          width: 100%;
          height: calc(100% - 40px);
          min-height: 400px;
          margin-top: 16px;
          padding: 24px;
        }

        .treemap-svg {
          width: 100%;
          height: calc(100% - 60px); /* Reserve 60px for legend */
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
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .legend {
          position: absolute;
          bottom: 24px;
          left: 24px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          font: 10px "Noto Sans", sans-serif;
          color: #FFFFFF;
          background: rgba(10,20,40,0.6);
          backdrop-filter: blur(16px);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
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
          border: 1px solid rgba(255,255,255,0.2);
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .treemap-card {
            min-height: 400px;
            border-radius: 1rem;
          }
          
          .treemap-header {
            border-radius: 1rem 1rem 0 0;
          }

          .treemap-svg-container {
            padding: 16px;
          }

          .legend {
            position: relative;
            bottom: auto;
            left: auto;
            margin-top: 12px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SectorTreemap;
