import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Sector } from './types';
import { IndicatorModal } from './IndicatorModal';
import { SearchAndFilters } from './SearchAndFilters';
import { StickyFooter } from './StickyFooter';
import { ControlsPanel } from './ControlsPanel';
import { BreadcrumbNav } from './BreadcrumbNav';
import { Legend } from './Legend';
import { TreemapLayoutEngine, TreemapNode } from './TreemapLayout';
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

  const W = 1000;
  const H = 600;

  // Debounce hover events
  const debouncedHover = useCallback(
    debounce((indicatorId: string | null) => {
      setHoveredIndicatorId(indicatorId);
    }, 200),
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
    
    return TreemapLayoutEngine.layout(groupedIndicators, W, H, groupBy);
  }, [groupedIndicators, W, H, groupBy]);

  // Helper function to get group value
  function getGroupValue(indicator: any, groupBy: string): string {
    switch (groupBy) {
      case 'sector':
        return indicator.sector;
      case 'type':
        return 'Standard'; // Could be extended with more types
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

  const getPerformanceClass = (value: number, target: number): string => {
    const performance = (value / target) * 100;
    if (performance >= 90) return 'performance-excellent';
    if (performance >= 75) return 'performance-good';
    return 'performance-poor';
  };

  const formatPercentage = (value: number, target: number): string => {
    const percentage = ((value / target) * 100).toFixed(1);
    const isPositive = value >= target;
    return `${isPositive ? '+' : ''}${percentage}%`;
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

  // Enhanced event handlers - convert TreemapNode to PositionedIndicator
  const handleTileMouseEnter = (node: TreemapNode, event: React.MouseEvent) => {
    const indicator: PositionedIndicator = { ...node, parentId: undefined };
    debouncedHover(indicator.id);
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
    debouncedHover(null);
    setTooltip(null);
  };

  const handleTileClick = (node: TreemapNode) => {
    const indicator: PositionedIndicator = { ...node, parentId: undefined };
    // Drill-down functionality
    if (currentLevel < hierarchyDepth - 1) {
      const newBreadcrumb = {
        id: indicator.id,
        name: indicator.name,
        level: currentLevel + 1
      };
      setBreadcrumbs(prev => [...prev, newBreadcrumb]);
      setCurrentLevel(prev => prev + 1);
      setDrillDownPath(prev => [...prev, indicator.id]);
    } else {
      // Open modal at max depth
      setSelectedIndicator(indicator);
      setIsModalOpen(true);
    }
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

  // New event handlers
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

      {/* Glassmorphic Card Frame */}
      <div className="treemap-card" id="treemap-content">
        {/* Header Strip */}
        <div className="treemap-header">
          <h2>Sector Performance Treemap</h2>
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
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Render treemap tiles */}
            {positionedIndicators.map((node) => {
              const sectorClass = getSectorClass(node.sector);
              const performanceClass = getPerformanceClass(node.value, node.target);
              const isHovered = hoveredIndicatorId === node.id;
              const percentage = formatPercentage(node.value, node.target);
              
              return (
                <g key={node.id}>
                  {/* Base tile */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    className={`treemap-tile ${sectorClass} ${performanceClass} ${isHovered ? 'tile-hovered' : ''}`}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                    style={{ cursor: 'pointer' }}
                    tabIndex={0}
                    role="gridcell"
                    aria-label={`${node.name}: ${percentage}. Click to ${currentLevel < hierarchyDepth - 1 ? 'drill down' : 'view details'}`}
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
                  
                  {/* Stock symbol (name) */}
                  {node.width > 60 && node.height > 40 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2 - 8}
                      className="tile-symbol"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {node.name.length > 8 ? node.name.substring(0, 8) : node.name}
                    </text>
                  )}
                  
                  {/* Percentage */}
                  {node.width > 60 && node.height > 40 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2 + 8}
                      className="tile-percentage"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {percentage}
                    </text>
                  )}
                  
                  {/* Small tiles - show abbreviated text */}
                  {(node.width <= 60 || node.height <= 40) && node.width > 30 && node.height > 20 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2}
                      className="tile-small"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {node.name.substring(0, 3)}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Sector dividers */}
            {Array.from(new Set(positionedIndicators.map(n => n.sector))).map(sector => {
              const sectorNodes = positionedIndicators.filter(n => n.sector === sector);
              if (sectorNodes.length === 0) return null;
              
              const minX = Math.min(...sectorNodes.map(n => n.x));
              const minY = Math.min(...sectorNodes.map(n => n.y));
              const maxX = Math.max(...sectorNodes.map(n => n.x + n.width));
              const maxY = Math.max(...sectorNodes.map(n => n.y + n.height));
              
              return (
                <g key={`sector-${sector}`}>
                  {/* Sector boundary */}
                  <rect
                    x={minX}
                    y={minY}
                    width={maxX - minX}
                    height={maxY - minY}
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                    pointerEvents="none"
                  />
                  
                  {/* Sector label */}
                  <text
                    x={minX + 8}
                    y={minY + 16}
                    className="sector-label-header"
                    pointerEvents="none"
                  >
                    {sector.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Enhanced Tooltip */}
          {tooltip && (
            <div 
              className="enhanced-tooltip"
              style={{
                position: 'absolute',
                left: tooltip.x,
                top: tooltip.y,
                pointerEvents: 'none',
                zIndex: 1000
              }}
              role="tooltip"
            >
              <div className="tooltip-header">
                <strong>{tooltip.indicator.name}</strong>
              </div>
              <div className="tooltip-content">
                <div>Value: {tooltip.indicator.value}</div>
                <div>Target: {tooltip.indicator.target}</div>
                <div>Performance: {Math.round((tooltip.indicator.value / tooltip.indicator.target) * 100)}%</div>
                <div>Weight: {tooltip.indicator.weight}</div>
              </div>
            </div>
          )}

          {/* Legend */}
          <Legend visible={showLegend} groupBy={groupBy} />
        </div>
        
        {/* Results count */}
        <div className="results-info">
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

        /* New Enhanced Styles */
        
        /* Controls Panel */
        .controls-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          height: 100vh;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(24px);
          border-left: 1px solid rgba(0, 255, 195, 0.3);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 100;
          overflow-y: auto;
        }

        .controls-panel.open {
          transform: translateX(0);
        }

        .controls-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .controls-header h3 {
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .controls-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .control-label {
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .control-input, .control-select {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px 12px;
          color: #fff;
          font-size: 14px;
        }

        .control-input:focus, .control-select:focus {
          outline: none;
          border-color: rgba(0, 255, 195, 0.5);
        }

        .control-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #00ffc3;
        }

        .depth-slider {
          margin: 8px 0;
        }

        /* Breadcrumb Navigation */
        .breadcrumb-nav {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .breadcrumb-list {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
        }

        .breadcrumb-button {
          color: #9ca3af;
          font-size: 14px;
          padding: 4px 8px;
          transition: color 0.2s ease;
        }

        .breadcrumb-button:hover {
          color: #00ffc3;
        }

        .breadcrumb-button[aria-current="page"] {
          color: #fff;
          font-weight: 500;
        }

        .breadcrumb-separator {
          width: 16px;
          height: 16px;
          color: #6b7280;
          margin: 0 4px;
        }

        /* Legend */
        .legend-panel {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 12px;
          min-width: 200px;
        }

        .legend-title {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .legend-items {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .legend-label {
          color: #e2e8f0;
          font-size: 12px;
        }

        /* Enhanced Tooltip */
        .enhanced-tooltip {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 255, 195, 0.3);
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          min-width: 200px;
        }

        .tooltip-header {
          background: rgba(0, 255, 195, 0.1);
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px 8px 0 0;
        }

        .tooltip-header strong {
          color: #00ffc3;
          font-size: 14px;
        }

        .tooltip-content {
          padding: 8px 12px;
          color: #e2e8f0;
          font-size: 12px;
          line-height: 1.4;
        }

        .tooltip-content div {
          margin: 2px 0;
        }

        /* Responsive Design for Controls */
        @media (max-width: 768px) {
          .controls-panel {
            width: 100%;
            height: auto;
            max-height: 60vh;
            top: auto;
            bottom: 0;
            transform: translateY(100%);
            border-left: none;
            border-top: 1px solid rgba(0, 255, 195, 0.3);
            border-radius: 16px 16px 0 0;
          }

          .controls-panel.open {
            transform: translateY(0);
          }

          .breadcrumb-nav {
            overflow-x: auto;
          }

          .breadcrumb-list {
            white-space: nowrap;
          }

          .legend-panel {
            position: relative;
            bottom: auto;
            left: auto;
            margin-top: 1rem;
          }
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

        /* Focus styles for accessibility */
        rect:focus {
          outline: 2px solid rgba(0,255,195,0.8);
          outline-offset: 2px;
        }

        /* Existing interactive styles */
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

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .tile-base,
          .glass-button,
          .search-input,
          .sector-pill,
          .controls-panel {
            transition: none;
          }
          
          .tile-hovered {
            transform: none;
          }
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

        /* Enhanced Treemap Styles */
        .treemap-tile {
          transition: all 0.2s ease;
        }

        .tile-hovered {
          stroke: rgba(255,255,255,0.8) !important;
          stroke-width: 3 !important;
          filter: url(#glow);
        }

        /* Sector-based colors (mimicking stock treemap) */
        .sector-systemic {
          fill: #dc2626; /* Red for negative/critical */
        }
        
        .sector-population {
          fill: #16a34a; /* Green for positive */
        }
        
        .sector-resources {
          fill: #ea580c; /* Orange */
        }
        
        .sector-goods {
          fill: #0891b2; /* Blue */
        }
        
        .sector-social {
          fill: #059669; /* Emerald */
        }
        
        .sector-governance {
          fill: #7c3aed; /* Purple */
        }

        /* Performance overlays */
        .performance-excellent {
          fill-opacity: 0.9;
        }
        
        .performance-good {
          fill-opacity: 0.7;
        }
        
        .performance-poor {
          fill-opacity: 0.5;
        }

        /* Text styling */
        .tile-symbol {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 12px;
          fill: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }

        .tile-percentage {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 10px;
          fill: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        }

        .tile-small {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 8px;
          fill: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        }

        .sector-label-header {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 11px;
          fill: rgba(255,255,255,0.9);
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .treemap-svg {
            width: 100%;
            height: auto;
            aspect-ratio: 5/3;
          }
          
          .tile-symbol {
            font-size: 10px;
          }
          
          .tile-percentage {
            font-size: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default SectorTreemap;
