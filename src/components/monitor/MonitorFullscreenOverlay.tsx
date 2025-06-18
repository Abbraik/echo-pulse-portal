
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InstrumentPanel from './InstrumentPanel';
import HeatmapTableView from './HeatmapTableView';
import RadialHubView from './RadialHubView';
import TileDashboardView from './TileDashboardView';
import SectorTreemap from './SectorTreemap';
import { mockSectors } from './SectorTreemap/mockData';

type ViewType = 'treemap' | 'heatmap' | 'radial' | 'tile';

interface MonitorFullscreenOverlayProps {
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  activeView: ViewType;
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  domainFilter: string;
  onDomainFilterChange: (value: string) => void;
  chartType: 'bar' | 'line';
  onChartTypeChange: (value: 'bar' | 'line') => void;
}

const MonitorFullscreenOverlay: React.FC<MonitorFullscreenOverlayProps> = ({
  isFullscreen,
  setIsFullscreen,
  activeView,
  timeRange,
  onTimeRangeChange,
  domainFilter,
  onDomainFilterChange,
  chartType,
  onChartTypeChange,
}) => {
  const viewTitles = {
    treemap: 'Sector Treemap: Comprehensive System View',
    heatmap: 'Heatmap + Table View',
    radial: 'Radial Hub & Spokes',
    tile: 'Tile Dashboard'
  };

  const renderCurrentView = () => {
    const viewProps = {
      timeRange,
      domainFilter,
      chartType
    };

    switch (activeView) {
      case 'treemap':
        return <SectorTreemap sectors={mockSectors} />;
      case 'heatmap':
        return <HeatmapTableView {...viewProps} />;
      case 'radial':
        return <RadialHubView {...viewProps} />;
      case 'tile':
        return <TileDashboardView {...viewProps} />;
      default:
        return <HeatmapTableView {...viewProps} />;
    }
  };

  return (
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={viewTitles[activeView]}
        >
          {/* Fullscreen content positioned below header */}
          <div className="absolute inset-0 top-[112px] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="h-full bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden relative"
            >
              {/* Fullscreen Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                <h2 className="text-3xl font-bold text-white">
                  {viewTitles[activeView]}
                </h2>
                <div className="flex items-center space-x-4">
                  <InstrumentPanel
                    timeRange={timeRange}
                    onTimeRangeChange={onTimeRangeChange}
                    domainFilter={domainFilter}
                    onDomainFilterChange={onDomainFilterChange}
                    chartType={chartType}
                    onChartTypeChange={onChartTypeChange}
                    activeView={activeView}
                  />
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Exit fullscreen"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Fullscreen Content */}
              <div className="flex-1 relative min-h-0 h-[calc(100%-88px)]">
                {renderCurrentView()}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MonitorFullscreenOverlay;
