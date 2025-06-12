import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Sector } from './types';
import { TreemapEngine, TreemapSector, TreemapTile } from './TreemapEngine';
import { DetailModal } from './DetailModal';
import SparklineChart from '@/components/think/components/SparklineChart';

interface SectorTreemapProps {
  sectors: Sector[];
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
  const [selectedTile, setSelectedTile] = useState<TreemapTile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update dimensions when container resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Account for card padding (24px on each side) and header height (40px)
        setDimensions({
          width: Math.max(400, rect.width - 48), // 24px padding on each side
          height: Math.max(300, rect.height - 88) // 40px header + 24px top/bottom padding
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Sector colors mapping
  const sectorColors: Record<string, { base: string; tint: string }> = {
    'Systemic': { base: '#00B8FF', tint: 'rgba(0,184,255,0.08)' },
    'Population': { base: '#00FFC3', tint: 'rgba(0,255,195,0.08)' },
    'ResourceMarket': { base: '#FFC107', tint: 'rgba(255,193,7,0.08)' },
    'GoodsServices': { base: '#7B68EE', tint: 'rgba(123,104,238,0.08)' },
    'SocialOutcomes': { base: '#3CB371', tint: 'rgba(60,179,113,0.08)' },
    'Governance': { base: '#C71585', tint: 'rgba(199,21,133,0.08)' }
  };

  // Get performance data
  const getPerformanceData = (value: number, target: number) => {
    const performance = (value / target) * 100;
    let statusColor = '';
    
    if (performance >= 75) {
      statusColor = 'rgba(0,255,195,0.12)'; // neon-teal
    } else if (performance >= 50) {
      statusColor = 'rgba(255,193,7,0.12)'; // amber
    } else {
      statusColor = 'rgba(255,110,110,0.12)'; // coral
    }
    
    return { performance, statusColor };
  };

  // Generate treemap layout
  const sectorLayouts = useMemo(() => {
    const allIndicators = sectors.flatMap(s => s.indicators);
    return TreemapEngine.generateLayout(allIndicators, dimensions.width, dimensions.height);
  }, [sectors, dimensions]);

  // Handle tile interactions
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
    setSelectedTile(tile);
    setIsModalOpen(true);
  };

  // Generate mock sparkline data
  const generateSparklineData = () => {
    return Array.from({ length: 30 }, () => Math.random() * 100 + 50);
  };

  // Mobile button click
  const handleMobileClick = () => {
    setShowMobileModal(true);
  };

  if (isMobile) {
    return (
      <>
        <div className="mobile-treemap-button" onClick={handleMobileClick}>
          <span>Treemap ▶</span>
        </div>
        
        {showMobileModal && (
          <div className="mobile-modal-overlay" onClick={() => setShowMobileModal(false)}>
            <div className="mobile-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-modal-header">
                <h3>Sector Treemap</h3>
                <button onClick={() => setShowMobileModal(false)}>×</button>
              </div>
              <div className="mobile-treemap-container">
                {/* Render full treemap in mobile modal */}
                <SectorTreemapContent
                  sectorLayouts={sectorLayouts}
                  sectorColors={sectorColors}
                  hoveredTile={hoveredTile}
                  tooltip={tooltip}
                  onTileHover={handleTileHover}
                  onTileLeave={handleTileLeave}
                  onTileClick={handleTileClick}
                  getPerformanceData={getPerformanceData}
                  generateSparklineData={generateSparklineData}
                  containerRef={containerRef}
                />
              </div>
            </div>
          </div>
        )}
        
        <DetailModal
          tile={selectedTile}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        
        <style>{`
          .mobile-treemap-button {
            background: rgba(10,20,40,0.45);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(0,255,195,0.15);
            border-radius: 1rem;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .mobile-treemap-button:hover {
            background: rgba(10,20,40,0.6);
            border-color: rgba(0,255,195,0.3);
          }

          .mobile-treemap-button span {
            font: 16px "Noto Sans", sans-serif;
            font-weight: 700;
            color: #FFFFFF;
          }

          .mobile-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(8px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .mobile-modal-content {
            background: rgba(10,20,40,0.95);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(0,255,195,0.2);
            border-radius: 1rem;
            width: 100%;
            height: 100%;
            max-width: 100vw;
            max-height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .mobile-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }

          .mobile-modal-header h3 {
            font: 18px "Noto Sans", sans-serif;
            font-weight: 700;
            color: #FFFFFF;
            margin: 0;
          }

          .mobile-modal-header button {
            background: none;
            border: none;
            color: #FFFFFF;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-treemap-container {
            flex: 1;
            overflow: auto;
            padding: 20px;
          }
        `}</style>
      </>
    );
  }

  return (
    <div className="treemap-card" ref={containerRef}>
      <SectorTreemapContent
        sectorLayouts={sectorLayouts}
        sectorColors={sectorColors}
        hoveredTile={hoveredTile}
        tooltip={tooltip}
        onTileHover={handleTileHover}
        onTileLeave={handleTileLeave}
        onTileClick={handleTileClick}
        getPerformanceData={getPerformanceData}
        generateSparklineData={generateSparklineData}
        containerRef={containerRef}
      />
      
      <DetailModal
        tile={selectedTile}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// Separate component for the treemap content
interface SectorTreemapContentProps {
  sectorLayouts: TreemapSector[];
  sectorColors: Record<string, { base: string; tint: string }>;
  hoveredTile: string | null;
  tooltip: TooltipState | null;
  onTileHover: (tile: TreemapTile, event: React.MouseEvent) => void;
  onTileLeave: () => void;
  onTileClick: (tile: TreemapTile) => void;
  getPerformanceData: (value: number, target: number) => { performance: number; statusColor: string };
  generateSparklineData: () => number[];
  containerRef: React.RefObject<HTMLDivElement>;
}

const SectorTreemapContent: React.FC<SectorTreemapContentProps> = ({
  sectorLayouts,
  sectorColors,
  hoveredTile,
  tooltip,
  onTileHover,
  onTileLeave,
  onTileClick,
  getPerformanceData,
  generateSparklineData,
  containerRef
}) => {
  return (
    <>
      {/* Header */}
      <div className="treemap-header">
        <h2>Sector Treemap: Comprehensive System View</h2>
      </div>

      {/* SVG Container */}
      <div className="treemap-svg-container">
        <svg 
          className="treemap-svg"
          width="100%" 
          height="100%" 
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Filters */}
          <defs>
            <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>
          
          {/* Sector backgrounds and tiles */}
          {sectorLayouts.map((sector) => (
            <g key={`sector-${sector.name}`}>
              {/* Sector background */}
              <rect
                x={sector.x}
                y={sector.y}
                width={sector.width}
                height={sector.height}
                fill={sectorColors[sector.name]?.tint || 'rgba(255,255,255,0.05)'}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="1"
                rx="8"
              />
              
              {/* Sector label */}
              <text
                x={sector.x + 8}
                y={sector.y + 16}
                className="sector-label"
                fill="#E0E0E0"
                fontSize="10"
                fontWeight="700"
                fontFamily="Noto Sans, sans-serif"
              >
                {sector.name.toUpperCase()}
              </text>
              
              {/* Tiles */}
              {sector.tiles.map(tile => {
                const isHovered = hoveredTile === tile.id;
                const { performance, statusColor } = getPerformanceData(tile.value, tile.target);
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
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth="1"
                      filter="url(#innerShadow)"
                      rx="4"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => onTileHover(tile, e)}
                      onMouseLeave={onTileLeave}
                      onClick={() => onTileClick(tile)}
                    />
                    
                    {/* Performance overlay */}
                    <rect
                      x={tile.x}
                      y={tile.y}
                      width={tile.width}
                      height={tile.height}
                      fill={statusColor}
                      rx="4"
                      pointerEvents="none"
                    />
                    
                    {/* Hover effect - double glass overlay */}
                    {isHovered && (
                      <>
                        {/* Additional neon-teal highlight for double-glass effect */}
                        <rect
                          x={tile.x}
                          y={tile.y}
                          width={tile.width}
                          height={tile.height}
                          fill="rgba(0,255,195,0.20)"
                          rx="4"
                          pointerEvents="none"
                        />
                        {/* Neon-white stroke */}
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
                      </>
                    )}
                    
                    {/* Tile text */}
                    {tile.width > 60 && tile.height > 30 && (
                      <>
                        <text
                          x={tile.x + tile.width / 2}
                          y={tile.y + tile.height / 2 - 4}
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
                        <text
                          x={tile.x + tile.width / 2}
                          y={tile.y + tile.height / 2 + 10}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="10"
                          fontFamily="Noto Sans, sans-serif"
                          pointerEvents="none"
                          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                        >
                          {Math.round(performance)}%
                        </text>
                      </>
                    )}
                    
                    {/* Small tiles - abbreviated */}
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
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div 
            className="treemap-tooltip"
            style={{
              position: 'absolute',
              left: tooltip.x,
              top: tooltip.y,
              pointerEvents: 'none',
              zIndex: 1000
            }}
          >
            <div className="tooltip-content">
              <div className="tooltip-title">{tooltip.tile.name}</div>
              <div className="tooltip-metrics">
                <span>Current: {tooltip.tile.value}</span>
                <span>Target: {tooltip.tile.target}</span>
                <span>Performance: {Math.round((tooltip.tile.value / tooltip.tile.target) * 100)}%</span>
              </div>
              <div className="tooltip-sparkline">
                <span>Last 30 days:</span>
                <SparklineChart 
                  data={generateSparklineData()} 
                  width={60} 
                  height={16} 
                  color="#00FFC3" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Legend Panel - positioned outside the SVG container */}
        <div className="treemap-legend">
          {Object.entries(sectorColors).map(([sector, { base }]) => (
            <div key={sector} className="legend-item">
              <div 
                className="legend-swatch"
                style={{ backgroundColor: base }}
              />
              <span>{sector}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        :root {
          --container-padding: 24px;
          --sector-gutter: 4px;
          --tile-gutter: 2px;
        }

        .treemap-card {
          background: rgba(10,20,40,0.45);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0,255,195,0.15);
          border-radius: 1.5rem;
          box-shadow: 0 12px 32px rgba(0,0,0,0.6);
          padding: var(--container-padding);
          position: relative;
          overflow: hidden;
          height: 100%;
          min-height: 500px;
          display: grid;
          grid-template-rows: 40px 1fr;
        }

        .treemap-header {
          background: linear-gradient(90deg,#00FFC3 0%,#00B8FF 100%);
          height: 40px;
          line-height: 40px;
          padding: 0 16px;
          border-radius: 1.5rem 1.5rem 0 0;
          font: 16px "Noto Sans", sans-serif;
          font-weight: 700;
          color: #FFFFFF;
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
          margin: calc(-1 * var(--container-padding)) calc(-1 * var(--container-padding)) 0 calc(-1 * var(--container-padding));
          grid-row: 1;
        }

        .treemap-header h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
        }

        .treemap-svg-container {
          position: relative;
          width: 100%;
          height: 100%;
          grid-row: 2;
          overflow: hidden;
        }

        .treemap-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .sector-label {
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .treemap-tooltip {
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0,255,195,0.3);
          border-radius: 8px;
          padding: 12px;
          max-width: 250px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        .tooltip-content {
          color: #FFFFFF;
          font: 12px "Noto Sans", sans-serif;
        }

        .tooltip-title {
          font-weight: 700;
          color: #00FFC3;
          margin-bottom: 8px;
        }

        .tooltip-metrics {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 8px;
        }

        .tooltip-sparkline {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: #B0B0B0;
        }

        .treemap-legend {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(10,20,40,0.6);
          backdrop-filter: blur(16px);
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          gap: 12px;
          align-items: center;
          font: 10px "Noto Sans", sans-serif;
          color: #FFFFFF;
          border: 1px solid rgba(255,255,255,0.1);
          z-index: 10;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .legend-swatch {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        @media (max-width: 768px) {
          .treemap-card {
            min-height: 400px;
            border-radius: 1rem;
          }
          
          .treemap-header {
            border-radius: 1rem 1rem 0 0;
          }

          .treemap-legend {
            position: relative;
            bottom: auto;
            left: auto;
            margin-top: 12px;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default SectorTreemap;
