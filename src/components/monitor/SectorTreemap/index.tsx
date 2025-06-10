import React, { useState, useMemo } from 'react';
import { Sector } from './types';
import { IndicatorModal } from './IndicatorModal';
import { SearchAndFilters } from './SearchAndFilters';
import { StickyFooter } from './StickyFooter';
import { usePanelCompact } from '@/hooks/use-panel-compact';

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
  const { isCompact, containerRef } = usePanelCompact({ compactThreshold: 30 });
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Modal state
  const [selectedIndicator, setSelectedIndicator] = useState<PositionedIndicator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Interaction state
  const [hoveredIndicatorId, setHoveredIndicatorId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const W = 800; // SVG width
  const H = 600; // SVG height
  
  // Filter indicators based on search and sector selection
  const filteredIndicators = useMemo(() => {
    let indicators = sectors.flatMap(s => s.indicators);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      indicators = indicators.filter(i => 
        i.name.toLowerCase().includes(query) ||
        i.sector.toLowerCase().includes(query)
      );
    }
    
    if (selectedSectors.length > 0) {
      indicators = indicators.filter(i => selectedSectors.includes(i.sector));
    }
    
    return indicators;
  }, [sectors, searchQuery, selectedSectors]);

  // Get available sectors for filter
  const availableSectors = useMemo(() => {
    return [...new Set(sectors.flatMap(s => s.indicators.map(i => i.sector)))];
  }, [sectors]);

  // Calculate positioned indicators
  const positionedIndicators = useMemo(() => {
    const totalWeight = filteredIndicators.reduce((sum, i) => sum + i.weight, 0);
    if (totalWeight === 0) return [];
    
    const svgArea = W * H;
    const indicatorsWithArea = filteredIndicators.map(i => ({
      ...i,
      area: (i.weight / totalWeight) * svgArea
    }));

    // Responsive grid configuration
    const getGridConfig = () => {
      const width = window.innerWidth;
      if (width >= 1024) return { cols: 4, rows: Math.ceil(indicatorsWithArea.length / 4) };
      if (width >= 768) return { cols: 2, rows: Math.ceil(indicatorsWithArea.length / 2) };
      return { cols: 1, rows: indicatorsWithArea.length };
    };

    const { cols, rows } = getGridConfig();
    const cellWidth = W / cols;
    const cellHeight = H / rows;
    
    const positioned: PositionedIndicator[] = [];
    
    indicatorsWithArea.forEach((indicator, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      positioned.push({
        id: indicator.id,
        name: indicator.name,
        sector: indicator.sector,
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight,
        weight: indicator.weight,
        value: indicator.value,
        target: indicator.target
      });
    });
    
    return positioned;
  }, [filteredIndicators, W, H]);

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

  const getTileClasses = (indicator: PositionedIndicator): string => {
    const classes = [];
    if (hoveredIndicatorId === indicator.id) {
      classes.push('tile-hovered');
    } else if (hoveredIndicatorId && hoveredIndicatorId !== indicator.id) {
      classes.push('tile-dimmed');
    }
    return classes.join(' ');
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

  const handleTileClick = (indicator: PositionedIndicator) => {
    setSelectedIndicator(indicator);
    setIsModalOpen(true);
  };

  const handleTileKeyDown = (event: React.KeyboardEvent, indicator: PositionedIndicator) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTileClick(indicator);
    } else if (event.key === 'Escape') {
      setHoveredIndicatorId(null);
      setTooltip(null);
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Editing indicator: ${id}`);
    setHasChanges(true);
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting indicator: ${id}`);
    setHasChanges(true);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedSectors([]);
  };

  const handleSaveChanges = () => {
    console.log('Saving all changes...');
    setHasChanges(false);
  };

  const handleCancelChanges = () => {
    console.log('Canceling all changes...');
    setHasChanges(false);
  };

  return (
    <div ref={containerRef} className="treemap-container" role="main">
      {/* Skip to content link */}
      <a href="#treemap-content" className="skip-link">
        Skip to content
      </a>

      {/* Search and Filters */}
      <div className={`filters-section ${isCompact ? 'compact' : ''}`}>
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSectors={selectedSectors}
          onSectorChange={setSelectedSectors}
          onReset={handleReset}
          availableSectors={availableSectors}
          isCompact={isCompact}
        />
      </div>

      {/* Glassmorphic Card Frame */}
      <div className="treemap-card" id="treemap-content">
        {/* Header Strip */}
        <div className="treemap-header">
          <h2>Sector Treemap: Comprehensive System View</h2>
        </div>
        
        {/* SVG Container */}
        <div className="treemap-svg-container">
          <svg 
            width={W} 
            height={H} 
            className="treemap-svg"
            role="grid"
            aria-label="Interactive sector treemap showing system indicators"
          >
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
                    className={`tile-base ${sectorClass} ${tileClasses} transition-transform duration-200 ease-in-out`}
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="1"
                    filter="url(#innerShadow)"
                    style={{ cursor: 'pointer' }}
                    tabIndex={0}
                    role="gridcell"
                    aria-label={`${indicator.name}: ${indicator.value}/${indicator.target} (${Math.round((indicator.value / indicator.target) * 100)}%)`}
                    onMouseEnter={(e) => handleTileMouseEnter(indicator, e)}
                    onMouseLeave={handleTileMouseLeave}
                    onClick={() => handleTileClick(indicator)}
                    onKeyDown={(e) => handleTileKeyDown(e, indicator)}
                    onFocus={() => setHoveredIndicatorId(indicator.id)}
                    onBlur={() => {
                      setHoveredIndicatorId(null);
                      setTooltip(null);
                    }}
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
            {Array.from(new Map<string, PositionedIndicator[]>(positionedIndicators.reduce((acc, indicator) => {
              const sectorName = indicator.sector;
              if (!acc.has(sectorName)) {
                acc.set(sectorName, []);
              }
              acc.get(sectorName)!.push(indicator);
              return acc;
            }, new Map<string, PositionedIndicator[]>()).entries())).map(([sectorName, indicators]) => {
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
              role="tooltip"
            >
              <strong>{tooltip.indicator.name}</strong><br/>
              {tooltip.indicator.value} / {tooltip.indicator.target} ({Math.round((tooltip.indicator.value / tooltip.indicator.target) * 100)}%)
            </div>
          )}
        </div>
        
        {/* Results count */}
        <div className="results-info">
          <p className="text-sm text-gray-300">
            Showing {positionedIndicators.length} of {sectors.flatMap(s => s.indicators).length} indicators
          </p>
        </div>
      </div>

      {/* Modal */}
      <IndicatorModal
        indicator={selectedIndicator}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Sticky Footer */}
      <StickyFooter
        hasChanges={hasChanges}
        onSave={handleSaveChanges}
        onCancel={handleCancelChanges}
      />

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
      

        /* New Interactive Styles */
        .treemap-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: rgba(0, 255, 195, 0.9);
          color: #000;
          padding: 8px;
          border-radius: 4px;
          text-decoration: none;
          z-index: 1000;
          transition: top 0.3s;
        }

        .skip-link:focus {
          top: 6px;
        }

        .filters-section {
          padding: 1rem;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .filters-section.compact {
          padding: 0.5rem;
        }

        .search-filters-panel {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .search-filters-panel.compact {
          gap: 0.5rem;
        }

        .search-container {
          position: relative;
        }

        .search-input {
          width: 100%;
          height: 48px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 0 48px 0 48px;
          color: #fff;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(0, 255, 195, 0.5);
          box-shadow: 0 0 0 3px rgba(0, 255, 195, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }

        .clear-search {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .clear-search:hover {
          color: #fff;
        }

        .input-error {
          color: #f87171;
          font-size: 14px;
          margin-top: 4px;
        }

        .filter-toggle {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .filter-toggle:hover {
          background: rgba(30, 41, 59, 1);
          border-color: rgba(0, 255, 195, 0.3);
        }

        .sector-filters {
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .filter-label {
          display: block;
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .sector-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .sector-pill {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #e2e8f0;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }

        .sector-pill:hover {
          background: rgba(30, 41, 59, 1);
          border-color: rgba(0, 255, 195, 0.3);
        }

        .sector-pill.selected {
          background: rgba(0, 255, 195, 0.2);
          border-color: rgba(0, 255, 195, 0.5);
          color: #00ffc3;
        }

        .reset-button {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .reset-button:hover {
          background: rgba(239, 68, 68, 0.3);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .treemap-svg-container {
          position: relative;
          flex: 1;
          overflow: hidden;
          padding: 1rem;
        }

        .treemap-svg {
          width: 100%;
          height: 100%;
          max-width: 800px;
          max-height: 600px;
          margin: 0 auto;
          display: block;
        }

        .tile-base {
          transition: transform 200ms ease-out, filter 200ms ease-out;
        }

        .tile-hovered {
          transform: scale(1.05);
          filter: url(#innerShadow) drop-shadow(0 0 12px rgba(0,255,195,0.5)) !important;
        }

        .tile-dimmed {
          opacity: 0.6;
        }

        .results-info {
          padding: 0.5rem 1rem;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Modal Styles */
        .modal-content {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0, 255, 195, 0.3);
          border-radius: 16px;
          color: #fff;
          max-width: 500px;
        }

        .indicator-stat {
          background: rgba(30, 41, 59, 0.5);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-button {
          background: rgba(0, 255, 195, 0.2);
          border: 1px solid rgba(0, 255, 195, 0.3);
          color: #00ffc3;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .glass-button:hover {
          background: rgba(0, 255, 195, 0.3);
          border-color: rgba(0, 255, 195, 0.5);
          transform: translateY(-1px);
        }

        .glass-button-danger {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .glass-button-danger:hover {
          background: rgba(239, 68, 68, 0.3);
          border-color: rgba(239, 68, 68, 0.5);
          transform: translateY(-1px);
        }

        .glass-button-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #e2e8f0;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .glass-button-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
        }

        /* Sticky Footer */
        .sticky-footer {
          position: sticky;
          bottom: 0;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem;
          z-index: 100;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-actions {
          display: flex;
          gap: 0.5rem;
        }

        .footer-links {
          display: flex;
          gap: 1rem;
        }

        .footer-link {
          color: #9ca3af;
          text-decoration: none;
          font-size: 14px;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: #00ffc3;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .search-filters-panel {
            flex-direction: column;
          }
          
          .footer-content {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .filters-section {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 200;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
          }
          
          .filters-section.open {
            transform: translateY(0);
          }
          
          .treemap-svg {
            max-height: 400px;
          }
          
          .sector-pills {
            justify-content: center;
          }
        }

        /* Focus styles for accessibility */
        .tile-base:focus {
          outline: 2px solid rgba(0, 255, 195, 0.8);
          outline-offset: 2px;
        }

        .search-input:focus,
        .sector-pill:focus,
        .glass-button:focus {
          outline: 2px solid rgba(0, 255, 195, 0.8);
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .tile-base {
            stroke-width: 2;
          }
          
          .sector-pill,
          .glass-button {
            border-width: 2px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .tile-base,
          .glass-button,
          .search-input,
          .sector-pill {
            transition: none;
          }
          
          .tile-hovered {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SectorTreemap;
