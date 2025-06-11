import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Sector } from './types';
import { IndicatorModal } from './IndicatorModal';
import { SearchAndFilters } from './SearchAndFilters';
import { StickyFooter } from './StickyFooter';
import { ControlsPanel } from './ControlsPanel';
import { BreadcrumbNav } from './BreadcrumbNav';
import { Legend } from './Legend';
import { TreemapLayoutEngine, TreemapNode } from './TreemapLayout';
import { usePanelCompact } from '@/hooks/use-panel-compact';
import SparklineChart from '@/components/think/components/SparklineChart';

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
  level: number;
  parentId?: string;
}

interface TooltipState {
  indicator: PositionedIndicator;
  x: number;
  y: number;
}

interface BreadcrumbItem {
  id: string;
  name: string;
  level: number;
}

const SectorTreemap: React.FC<SectorTreemapProps> = ({ sectors }) => {
  const { isCompact, containerRef } = usePanelCompact({ compactThreshold: 30 });
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Existing state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<PositionedIndicator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredIndicatorId, setHoveredIndicatorId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // New state for enhanced features
  const [controlsOpen, setControlsOpen] = useState(false);
  const [hierarchyDepth, setHierarchyDepth] = useState(3);
  const [groupBy, setGroupBy] = useState('sector');
  const [controlsSearchQuery, setControlsSearchQuery] = useState('');
  const [showLegend, setShowLegend] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'All Indicators', level: 0 }
  ]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [drillDownPath, setDrillDownPath] = useState<string[]>([]);

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (svgContainerRef.current) {
        const rect = svgContainerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(400, rect.width),
          height: Math.max(300, rect.height - 40) // Account for header
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Debounce hover events
  const debouncedHover = useCallback(
    debounce((indicatorId: string | null) => {
      setHoveredIndicatorId(indicatorId);
    }, 100),
    []
  );

  // Filter indicators based on search and sector selection
  const filteredIndicators = useMemo(() => {
    let indicators = sectors.flatMap(s => s.indicators);
    
    // Apply existing filters
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

    // Apply controls search
    if (controlsSearchQuery.trim()) {
      const query = controlsSearchQuery.toLowerCase();
      indicators = indicators.filter(i => 
        i.name.toLowerCase().includes(query) ||
        i.sector.toLowerCase().includes(query)
      );
    }

    // Apply hierarchy depth filter
    indicators = indicators.filter((_, index) => {
      const level = Math.floor(index / Math.max(1, indicators.length / hierarchyDepth));
      return level < hierarchyDepth;
    });
    
    return indicators;
  }, [sectors, searchQuery, selectedSectors, controlsSearchQuery, hierarchyDepth]);

  // Get available sectors for filter
  const availableSectors = useMemo(() => {
    return [...new Set(sectors.flatMap(s => s.indicators.map(i => i.sector)))];
  }, [sectors]);

  // Group indicators based on groupBy selection
  const groupedIndicators = useMemo(() => {
    return filteredIndicators.map((indicator, index) => ({
      ...indicator,
      level: currentLevel,
      groupValue: getGroupValue(indicator, groupBy)
    }));
  }, [filteredIndicators, groupBy, currentLevel]);

  // Calculate positioned indicators using new layout engine
  const positionedIndicators = useMemo(() => {
    if (groupedIndicators.length === 0) return [];
    
    return TreemapLayoutEngine.layout(groupedIndicators, dimensions.width, dimensions.height, groupBy);
  }, [groupedIndicators, dimensions.width, dimensions.height, groupBy]);

  // Helper function to get group value
  function getGroupValue(indicator: any, groupBy: string): string {
    switch (groupBy) {
      case 'sector':
        return indicator.sector;
      case 'type':
        return 'Standard';
      case 'performance':
        const performance = (indicator.value / indicator.target) * 100;
        if (performance >= 90) return 'excellent';
        if (performance >= 75) return 'good';
        return 'needs-attention';
      case 'weight':
        if (indicator.weight >= 8) return 'high';
        if (indicator.weight >= 5) return 'medium';
        return 'low';
      default:
        return indicator.sector;
    }
  }

  // Helper function for debouncing
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // S&P 500 sector color mapping
  const getSectorColor = (sector: string): string => {
    const colorMap: Record<string, string> = {
      'Systemic': '#0080FF',
      'Population': '#00C080', 
      'Resource Market': '#FFC000',
      'Goods & Services': '#8040FF',
      'Social Outcomes': '#40C040',
      'Governance': '#C04080'
    };
    return colorMap[sector] || '#0080FF';
  };

  // Performance-based opacity
  const getPerformanceOpacity = (value: number, target: number): number => {
    const performance = (value / target) * 100;
    if (performance >= 75) return 1.0;
    if (performance >= 50) return 0.8;
    return 0.6;
  };

  const formatPercentage = (value: number, target: number): string => {
    const percentage = ((value / target) * 100).toFixed(1);
    return `${percentage}%`;
  };

  // Enhanced event handlers
  const handleTileMouseEnter = (node: TreemapNode, event: React.MouseEvent) => {
    const indicator: PositionedIndicator = { ...node, parentId: undefined };
    debouncedHover(indicator.id);
    
    const rect = event.currentTarget.getBoundingClientRect();
    const svgRect = event.currentTarget.closest('svg')?.getBoundingClientRect();
    if (svgRect) {
      setTooltip({
        indicator,
        x: event.clientX - svgRect.left + 10,
        y: event.clientY - svgRect.top - 60
      });
    }
  };

  const handleTileMouseLeave = () => {
    debouncedHover(null);
    setTooltip(null);
  };

  const handleTileClick = (node: TreemapNode) => {
    const indicator: PositionedIndicator = { ...node, parentId: undefined };
    setSelectedIndicator(indicator);
    setIsModalOpen(true);
  };

  const handleTileKeyDown = (event: React.KeyboardEvent, node: TreemapNode) => {
    const indicator: PositionedIndicator = { ...node, parentId: undefined };
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTileClick(node);
    }
  };

  const handleBreadcrumbNavigate = (level: number) => {
    setCurrentLevel(level);
    setBreadcrumbs(prev => prev.slice(0, level + 1));
    setDrillDownPath(prev => prev.slice(0, level));
  };

  const handleControlsReset = () => {
    setHierarchyDepth(3);
    setGroupBy('sector');
    setControlsSearchQuery('');
    setCurrentLevel(0);
    setBreadcrumbs([{ id: 'root', name: 'All Indicators', level: 0 }]);
    setDrillDownPath([]);
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

  // Generate mock sparkline data
  const generateSparklineData = () => {
    return Array.from({ length: 30 }, () => Math.random() * 100 + 50);
  };

  // Group indicators by sector for sector boundaries
  const sectorGroups = useMemo(() => {
    const groups = new Map<string, TreemapNode[]>();
    positionedIndicators.forEach(node => {
      if (!groups.has(node.sector)) {
        groups.set(node.sector, []);
      }
      groups.get(node.sector)!.push(node);
    });
    return groups;
  }, [positionedIndicators]);

  // Calculate sector boundaries
  const sectorBounds = useMemo(() => {
    const bounds = new Map<string, { minX: number, minY: number, maxX: number, maxY: number }>();
    
    sectorGroups.forEach((nodes, sector) => {
      if (nodes.length === 0) return;
      
      const minX = Math.min(...nodes.map(n => n.x));
      const minY = Math.min(...nodes.map(n => n.y));
      const maxX = Math.max(...nodes.map(n => n.x + n.width));
      const maxY = Math.max(...nodes.map(n => n.y + n.height));
      
      bounds.set(sector, { minX, minY, maxX, maxY });
    });
    
    return bounds;
  }, [sectorGroups]);

  return (
    <div ref={containerRef} className="treemap-container" role="main">
      {/* Skip to content link */}
      <a href="#treemap-content" className="skip-link">
        Skip to content
      </a>

      {/* Breadcrumb Navigation */}
      <BreadcrumbNav
        breadcrumbs={breadcrumbs}
        onNavigate={handleBreadcrumbNavigate}
      />

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

      {/* Controls Panel */}
      <ControlsPanel
        isOpen={controlsOpen}
        onToggle={() => setControlsOpen(!controlsOpen)}
        depth={hierarchyDepth}
        onDepthChange={setHierarchyDepth}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        searchQuery={controlsSearchQuery}
        onSearchChange={setControlsSearchQuery}
        onReset={handleControlsReset}
        showLegend={showLegend}
        onLegendToggle={() => setShowLegend(!showLegend)}
      />

      {/* S&P 500 Style Container */}
      <div className="sp500-treemap-container" id="treemap-content">
        {/* Header Strip */}
        <div className="sp500-header">
          <h2>Sector Treemap: Comprehensive System View</h2>
        </div>
        
        {/* SVG Container */}
        <div 
          ref={svgContainerRef}
          className="sp500-svg-container"
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="sp500-svg"
            role="grid"
            aria-label="S&P 500 style sector treemap"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Sector boundary lines */}
            {Array.from(sectorBounds.entries()).map(([sector, bounds]) => (
              <g key={`sector-${sector}`}>
                {/* Sector boundary rectangle */}
                <rect
                  x={bounds.minX}
                  y={bounds.minY}
                  width={bounds.maxX - bounds.minX}
                  height={bounds.maxY - bounds.minY}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  opacity="0.3"
                />
                
                {/* Sector label */}
                <text
                  x={bounds.minX + 4}
                  y={bounds.minY + 14}
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
            
            {/* Render treemap tiles */}
            {positionedIndicators.map((node) => {
              const isHovered = hoveredIndicatorId === node.id;
              const percentage = formatPercentage(node.value, node.target);
              const tileColor = getSectorColor(node.sector);
              const opacity = getPerformanceOpacity(node.value, node.target);
              
              return (
                <g key={node.id}>
                  {/* Base tile */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    fill={tileColor}
                    opacity={opacity}
                    stroke={isHovered ? "#FFFFFF" : "transparent"}
                    strokeWidth={isHovered ? "2" : "0"}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'stroke 150ms ease'
                    }}
                    tabIndex={0}
                    role="gridcell"
                    aria-label={`${node.name}: ${percentage}. Click for details`}
                    onMouseEnter={(e) => handleTileMouseEnter(node, e)}
                    onMouseLeave={handleTileMouseLeave}
                    onClick={() => handleTileClick(node)}
                    onKeyDown={(e) => handleTileKeyDown(e, node)}
                    onFocus={() => setHoveredIndicatorId(node.id)}
                    onBlur={() => {
                      setHoveredIndicatorId(null);
                      setTooltip(null);
                    }}
                  />
                  
                  {/* Tile name */}
                  {node.width > 60 && node.height > 30 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2 - 4}
                      className="tile-text"
                      textAnchor="middle"
                      pointerEvents="none"
                      fill="#FFFFFF"
                      fontSize="12"
                      fontWeight="700"
                      fontFamily="Noto Sans, sans-serif"
                    >
                      {node.name.length > 12 ? `${node.name.substring(0, 12)}...` : node.name}
                    </text>
                  )}
                  
                  {/* Percentage */}
                  {node.width > 60 && node.height > 30 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2 + 10}
                      className="tile-subtext"
                      textAnchor="middle"
                      pointerEvents="none"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontFamily="Noto Sans, sans-serif"
                    >
                      {percentage}
                    </text>
                  )}
                  
                  {/* Small tiles - abbreviated text */}
                  {(node.width <= 60 || node.height <= 30) && node.width > 30 && node.height > 20 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2 + 2}
                      className="tile-small"
                      textAnchor="middle"
                      pointerEvents="none"
                      fill="#FFFFFF"
                      fontSize="8"
                      fontWeight="600"
                      fontFamily="Noto Sans, sans-serif"
                    >
                      {node.name.substring(0, 3)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* S&P 500 Style Tooltip */}
          {tooltip && (
            <div 
              className="sp500-tooltip"
              style={{
                position: 'absolute',
                left: tooltip.x,
                top: tooltip.y,
                pointerEvents: 'none',
                zIndex: 1000
              }}
              role="tooltip"
            >
              <div>{tooltip.indicator.name}</div>
              <div>Current: {tooltip.indicator.value} / Target: {tooltip.indicator.target} ({Math.round((tooltip.indicator.value / tooltip.indicator.target) * 100)}%)</div>
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

          {/* S&P 500 Style Legend */}
          {showLegend && (
            <div className="sp500-legend">
              {[
                { sector: 'Systemic', color: '#0080FF' },
                { sector: 'Population', color: '#00C080' },
                { sector: 'Resource Market', color: '#FFC000' },
                { sector: 'Goods & Services', color: '#8040FF' },
                { sector: 'Social Outcomes', color: '#40C040' },
                { sector: 'Governance', color: '#C04080' }
              ].map(({ sector, color }) => (
                <div key={sector} className="legend-item">
                  <div 
                    className="legend-color"
                    style={{ backgroundColor: color }}
                  />
                  <span>{sector}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Results count */}
        <div className="results-info">
          <p>
            Showing {positionedIndicators.length} of {sectors.flatMap(s => s.indicators).length} indicators
            {currentLevel > 0 && ` (Level ${currentLevel})`}
          </p>
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

      {/* Sticky Footer */}
      <StickyFooter
        hasChanges={hasChanges}
        onSave={handleSaveChanges}
        onCancel={handleCancelChanges}
      />

      <style>{`
        /* S&P 500 Style Container */
        .sp500-treemap-container {
          background: #0B122A;
          border-radius: 8px;
          padding: 16px;
          position: relative;
          overflow: hidden;
          height: 100%;
          min-height: 500px;
        }

        .sp500-header {
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

        .sp500-svg-container {
          position: relative;
          width: 100%;
          height: calc(100% - 40px);
          min-height: 400px;
          margin-top: 0;
        }

        .sp500-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* S&P 500 Style Tooltip */
        .sp500-tooltip {
          background: rgba(0,0,0,0.7);
          color: #FFFFFF;
          font: 10px "Noto Sans", sans-serif;
          padding: 6px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
          white-space: nowrap;
          line-height: 1.3;
        }

        /* S&P 500 Style Legend */
        .sp500-legend {
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

        /* Sector Labels */
        .sector-label {
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        /* Results Info */
        .results-info {
          position: absolute;
          bottom: 16px;
          right: 16px;
          font: 10px "Noto Sans", sans-serif;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Existing styles for other components */
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

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .sp500-legend {
            position: relative;
            bottom: auto;
            left: auto;
            margin-top: 12px;
            justify-content: center;
          }

          .results-info {
            position: relative;
            bottom: auto;
            right: auto;
            text-align: center;
            margin-top: 8px;
          }

          .sp500-treemap-container {
            min-height: 400px;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .sp500-svg rect {
            stroke-width: 2px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .sp500-svg rect {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SectorTreemap;
