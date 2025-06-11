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
          width: Math.max(400, rect.width - 40), // Account for padding
          height: Math.max(300, rect.height - 40)
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
    
    return TreemapLayoutEngine.layout(groupedIndicators, dimensions.width, dimensions.height, groupBy);
  }, [groupedIndicators, dimensions.width, dimensions.height, groupBy]);

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

  // Color mapping functions that match the legend
  const getSectorColor = (sector: string): string => {
    const colorMap: Record<string, string> = {
      'Systemic': 'rgba(0,184,255,0.7)',
      'Population': 'rgba(0,255,195,0.7)', 
      'Resource Market': 'rgba(255,193,7,0.7)',
      'Goods & Services': 'rgba(123,104,238,0.7)',
      'Social Outcomes': 'rgba(60,179,113,0.7)',
      'Governance': 'rgba(199,21,133,0.7)'
    };
    return colorMap[sector] || 'rgba(0,184,255,0.7)';
  };

  const getPerformanceColor = (value: number, target: number): string => {
    const performance = (value / target) * 100;
    if (performance >= 90) return 'rgba(0,255,195,0.7)'; // Excellent - Green
    if (performance >= 75) return 'rgba(255,193,7,0.7)'; // Good - Yellow
    return 'rgba(255,110,110,0.7)'; // Needs Attention - Red
  };

  const getWeightColor = (weight: number): string => {
    if (weight >= 8) return 'rgba(255,255,255,0.8)'; // High Weight
    if (weight >= 5) return 'rgba(255,255,255,0.5)'; // Medium Weight
    return 'rgba(255,255,255,0.3)'; // Low Weight
  };

  const getTileColor = (node: TreemapNode): string => {
    switch (groupBy) {
      case 'sector':
        return getSectorColor(node.sector);
      case 'performance':
        return getPerformanceColor(node.value, node.target);
      case 'weight':
        return getWeightColor(node.weight);
      default:
        return getSectorColor(node.sector);
    }
  };

  const formatPercentage = (value: number, target: number): string => {
    const percentage = ((value / target) * 100).toFixed(1);
    const isPositive = value >= target;
    return `${isPositive ? '+' : ''}${percentage}%`;
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
        <div 
          ref={svgContainerRef}
          className="treemap-svg-container"
          style={{ minHeight: '500px', height: 'calc(100vh - 300px)' }}
        >
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="treemap-svg"
            role="grid"
            aria-label="Interactive sector treemap showing system indicators"
            preserveAspectRatio="xMidYMid meet"
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
              <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="1" dy="1" result="offset"/>
                <feFlood floodColor="#000000" floodOpacity="0.8"/>
                <feComposite in2="offset" operator="in"/>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Render treemap tiles */}
            {positionedIndicators.map((node) => {
              const isHovered = hoveredIndicatorId === node.id;
              const percentage = formatPercentage(node.value, node.target);
              const tileColor = getTileColor(node);
              
              return (
                <g key={node.id}>
                  {/* Base tile */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    fill={tileColor}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={isHovered ? "2" : "1"}
                    style={{ 
                      cursor: 'pointer',
                      filter: isHovered ? 'url(#glow)' : 'none',
                      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                      transformOrigin: 'center',
                      transition: 'all 0.2s ease'
                    }}
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
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      filter="url(#textShadow)"
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
                      fill="white"
                      fontSize="10"
                      fontWeight="500"
                      filter="url(#textShadow)"
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
                      fill="white"
                      fontSize="8"
                      fontWeight="600"
                      filter="url(#textShadow)"
                    >
                      {node.name.substring(0, 3)}
                    </text>
                  )}
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

        .treemap-svg-container {
          position: relative;
          flex: 1;
          overflow: hidden;
          padding: 1rem;
          width: 100%;
          height: 100%;
        }

        .treemap-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

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
