
import React from 'react';
import { Search, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ControlsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  depth: number;
  onDepthChange: (depth: number) => void;
  groupBy: string;
  onGroupByChange: (groupBy: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReset: () => void;
  showLegend: boolean;
  onLegendToggle: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  isOpen,
  onToggle,
  depth,
  onDepthChange,
  groupBy,
  onGroupByChange,
  searchQuery,
  onSearchChange,
  onReset,
  showLegend,
  onLegendToggle
}) => {
  return (
    <>
      {/* Controls Toggle Button */}
      <Button
        onClick={onToggle}
        className="fixed top-20 right-4 z-50 glass-button"
        aria-label="Toggle controls panel"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {/* Controls Panel */}
      <div 
        className={`controls-panel ${isOpen ? 'open' : 'closed'}`}
        role="region"
        aria-label="Treemap controls"
      >
        <div className="controls-header">
          <h3>Treemap Controls</h3>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            aria-label="Close controls"
          >
            ×
          </Button>
        </div>

        <div className="controls-content">
          {/* Search Field */}
          <div className="control-group">
            <label htmlFor="treemap-search" className="control-label">
              Search Indicators
            </label>
            <div className="search-container">
              <Search className="search-icon" />
              <input
                id="treemap-search"
                type="text"
                placeholder="Search by name or metadata..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="control-input"
              />
            </div>
          </div>

          {/* Depth Slider */}
          <div className="control-group">
            <label htmlFor="depth-slider" className="control-label">
              Hierarchy Depth: {depth}
            </label>
            <Slider
              id="depth-slider"
              value={[depth]}
              onValueChange={(values) => onDepthChange(values[0])}
              min={1}
              max={5}
              step={1}
              className="depth-slider"
            />
          </div>

          {/* Grouping Dropdown */}
          <div className="control-group">
            <label className="control-label">Group By</label>
            <Select value={groupBy} onValueChange={onGroupByChange}>
              <SelectTrigger className="control-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sector">Sector</SelectItem>
                <SelectItem value="type">Indicator Type</SelectItem>
                <SelectItem value="performance">Performance Level</SelectItem>
                <SelectItem value="weight">Weight Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Legend Toggle */}
          <div className="control-group">
            <label className="control-label">
              <input
                type="checkbox"
                checked={showLegend}
                onChange={(e) => onLegendToggle()}
                className="control-checkbox"
              />
              Show Legend
            </label>
          </div>

          {/* Reset Button */}
          <div className="control-group">
            <Button
              onClick={onReset}
              className="glass-button-outline w-full"
              aria-label="Reset all controls"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
