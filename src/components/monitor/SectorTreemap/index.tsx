import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Sector } from './types';
import { IndicatorModal } from './IndicatorModal';
import { SearchAndFilters } from './SearchAndFilters';
import { StickyFooter } from './StickyFooter';
import { ControlsPanel } from './ControlsPanel';
import { BreadcrumbNav } from './BreadcrumbNav';
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
          width: Math.max(400, rect.width - 24), // Account for padding
          height: Math.max(300, rect.height - 24)
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
    }, 50),
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

  // S&P 500 style color mapping
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

  // Calculate opacity based on performance
  const getPerformanceOpacity = (value: number, target: number): number => {
    const performance = (value / target) * 100;
    if (performance >= 75) return 1.0;
    if (performance >= 50) return 0.8;
    return 0.6;
  };

  const formatPercentage = (value: number, target: number): string => {
    const percentage = ((value / target) * 100).toFixed(0);
    return `${percentage}%`;
  };

  // Generate mock sparkline data
  const generateSparklineData = (): number[] => {
    return Array.from({ length: 30 }, () => Math.random() * 100 + 50);
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
        x: Math.min(event.clientX - svgRect.left + 10, dimensions.width - 220),
        y: Math.max(event.clientY - svgRect.top - 10, 10)
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
    } else if (event.key === 'Escape') {
      if (currentLevel > 0) {
        handleBreadcrumbNavigate(currentLevel - 1);
      } else {
        setHoveredIndicatorId(null);
        setTooltip(null);
      }
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

  // Keyboard navigation setup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && controlsOpen) {
        setControlsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [controlsOpen]);

  // Group sectors for better layout
  const sectorGroups = useMemo(() => {
    const groups = new Map<string, TreemapNode[]>();
    positionedIndicators.forEach(node => {
      const sector = node.sector;
      if (!groups.has(sector)) {
        groups.set(sector, []);
      }
      groups.get(sector)!.push(node);
    });
    return groups;
  }, [positionedIndicators]);

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

      {/* S&P 500 Style Treemap Card */}
      <div className="sp500-treemap-card" id="treemap-content">
        {/* Header Strip */}
        <div className="sp500-header">
          <h2>Sector Treemap: Comprehensive System View</h2>
        </div>
        
        {/* SVG Container */}
        <div 
          ref={svgContainerRef}
          className="sp500-svg-container"
          style={{ minHeight: '500px', height: 'calc(100vh - 300px)' }}
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
            {/* Render treemap tiles */}
            {positionedIndicators.map((node) => {
              const isHovered = hoveredIndicatorId === node.id;
              const percentage = formatPercentage(node.value, node.target);
              const sectorColor = getSectorColor(node.sector);
              const opacity = getPerformanceOpacity(node.value, node.target);
              
              return (
                <g key={node.id}>
                  {/* Base tile */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    fill={sectorColor}
                    fillOpacity={opacity}
                    stroke={isHovered ? "#FFFFFF" : "rgba(255,255,255,0.2)"}
                    strokeWidth={isHovered ? "2" : "1"}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'stroke 150ms ease'
                    }}
                    tabIndex={0}
                    role="gridcell"
                    aria-label={`${node.name}: ${percentage}. Click to view details`}
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
                  
                  {/* Indicator name */}
                  {node.width > 50 && node.height > 30 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2 - 6}
                      className="sp500-tile-name"
                      textAnchor="middle"
                      pointerEvents="none"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="Noto Sans"
                    >
                      {node.name.length > 12 ? `${node.name.substring(0, 9)}...` : node.name}
                    </text>
                  )}
                  
                  {/* Percentage */}
                  {node.width > 50 && node.height > 30 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2 + 8}
                      className="sp500-tile-percentage"
                      textAnchor="middle"
                      pointerEvents="none"
                      fill="white"
                      fontSize="10"
                      fontWeight="400"
                      fontFamily="Noto Sans"
                    >
                      {percentage}
                    </text>
                  )}
                  
                  {/* Small tiles - abbreviated name only */}
                  {(node.width <= 50 || node.height <= 30) && node.width > 25 && node.height > 15 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2}
                      className="sp500-tile-small"
                      textAnchor="middle"
                      pointerEvents="none"
                      fill="white"
                      fontSize="8"
                      fontWeight="600"
                      fontFamily="Noto Sans"
                    >
                      {node.name.substring(0, 3)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Sector labels */}
            {Array.from(sectorGroups.entries()).map(([sector, nodes]) => {
              if (nodes.length === 0) return null;
              
              // Find the top-left position of the sector
              const minX = Math.min(...nodes.map(n => n.x));
              const minY = Math.min(...nodes.map(n => n.y));
              
              return (
                <text
                  key={`sector-${sector}`}
                  x={minX + 4}
                  y={minY + 12}
                  className="sp500-sector-label"
                  fill="white"
                  fontSize="10"
                  fontWeight="500"
                  fontFamily="Noto Sans"
                  pointerEvents="none"
                >
                  {sector}
                </text>
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
              <div className="sp500-tooltip-header">
                {tooltip.indicator.name}
              </div>
              <div className="sp500-tooltip-content">
                <div>Current: {tooltip.indicator.value} / Target: {tooltip.indicator.target} ({Math.round((tooltip.indicator.value / tooltip.indicator.target) * 100)}%)</div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ marginBottom: '4px', fontSize: '9px', opacity: 0.8 }}>Last 30 days:</div>
                  <SparklineChart 
                    data={generateSparklineData()} 
                    width={160} 
                    height={20} 
                    color="#00C080" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fixed Legend */}
          {showLegend && (
            <div className="sp500-legend">
              <div className="sp500-legend-title">Sectors</div>
              <div className="sp500-legend-items">
                {[
                  { sector: 'Systemic', color: '#0080FF' },
                  { sector: 'Population', color: '#00C080' },
                  { sector: 'Resource Market', color: '#FFC000' },
                  { sector: 'Goods & Services', color: '#8040FF' },
                  { sector: 'Social Outcomes', color: '#40C040' },
                  { sector: 'Governance', color: '#C04080' }
                ].map(({ sector, color }) => (
                  <div key={sector} className="sp500-legend-item">
                    <div 
                      className="sp500-legend-color"
                      style={{ backgroundColor: color }}
                    />
                    <span className="sp500-legend-label">{sector}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Results count */}
        <div className="sp500-results-info">
          <p className="text-sm text-gray-300">
            Showing {positionedIndicators.length} of {sectors.flatMap(s => s.indicators).length} indicators
            {currentLevel > 0 && ` (Level ${currentLevel})`}
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
        /* S&P 500 Style Treemap */
        .sp500-treemap-card {
          background: #0B122A;
          border-radius: 6px;
          position: relative;
          overflow: hidden;
          height: 100%;
          box-shadow: none;
          border: none;
        }

        .sp500-header {
          background: #081226;
          height: 32px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          border-radius: 6px 6px 0 0;
        }

        .sp500-header h2 {
          font-family: 'Noto Sans', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #FFFFFF;
          margin: 0;
        }

        .sp500-svg-container {
          position: relative;
          flex: 1;
          overflow: hidden;
          padding: 12px;
          width: 100%;
          height: 100%;
          background: #0B122A;
        }

        .sp500-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .sp500-sector-label {
          text-transform: uppercase;
        }

        /* S&P 500 Style Tooltip */
        .sp500-tooltip {
          background: rgba(0, 0, 0, 0.9);
          border-radius: 4px;
          min-width: 200px;
          max-width: 220px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sp500-tooltip-header {
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 600;
          font-family: 'Noto Sans', sans-serif;
        }

        .sp500-tooltip-content {
          padding: 8px 12px;
          color: #FFFFFF;
          font-size: 10px;
          line-height: 1.4;
          font-family: 'Noto Sans', sans-serif;
        }

        .sp500-tooltip-content div {
          margin: 2px 0;
        }

        /* Fixed Legend */
        .sp500-legend {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 4px;
          padding: 12px;
          min-width: 160px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sp500-legend-title {
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 600;
          margin: 0 0 8px 0;
          font-family: 'Noto Sans', sans-serif;
        }

        .sp500-legend-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sp500-legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sp500-legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .sp500-legend-label {
          color: #FFFFFF;
          font-size: 10px;
          font-family: 'Noto Sans', sans-serif;
        }

        .sp500-results-info {
          padding: 8px 12px;
          text-align: center;
          background: #081226;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .sp500-legend {
            position: relative;
            bottom: auto;
            left: auto;
            margin-top: 12px;
            margin-bottom: 12px;
          }
          
          .sp500-svg-container {
            padding: 8px;
          }
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

        .results-info {
          padding: 0.5rem 1rem;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default SectorTreemap;
