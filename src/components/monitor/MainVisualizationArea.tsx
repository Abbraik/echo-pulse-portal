
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FullscreenButton } from '@/components/ui/fullscreen-button';
import HeatmapTableView from './HeatmapTableView';
import RadialHubView from './RadialHubView';
import TileDashboardView from './TileDashboardView';
import SectorTreemap from './SectorTreemap';
import { mockSectors } from './SectorTreemap/mockData';

type ViewType = 'treemap' | 'heatmap' | 'radial' | 'tile';

interface MainVisualizationAreaProps {
  activeView: ViewType;
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

const MainVisualizationArea: React.FC<MainVisualizationAreaProps> = ({
  activeView,
  timeRange,
  domainFilter,
  chartType,
  isFullscreen,
  setIsFullscreen,
}) => {
  const viewTitles = {
    treemap: 'Sector Treemap: Comprehensive System View',
    heatmap: 'Heatmap + Table View',
    radial: 'Radial Hub & Spokes',
    tile: 'Tile Dashboard'
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
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
    <motion.div
      variants={itemVariants}
      className="flex-1 mb-4"
      whileHover={{ 
        y: -4,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)"
      }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="rounded-2xl backdrop-blur-xl bg-slate-800/40 border border-white/20 overflow-hidden flex flex-col shadow-2xl group"
        style={{ 
          maxHeight: 'calc(100vh - 200px)',
          minHeight: '600px'
        }}
      >
        {/* Card Header */}
        <motion.div 
          className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0"
          initial={{ opacity: 0.9 }}
          whileHover={{ 
            opacity: 1,
            backgroundColor: "rgba(15, 23, 42, 0.1)"
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.h3 
            className="text-2xl font-bold text-white"
            whileHover={{ 
              scale: 1.02,
              textShadow: "0 0 10px rgba(255, 255, 255, 0.3)"
            }}
            transition={{ duration: 0.2 }}
          >
            {viewTitles[activeView]}
          </motion.h3>
          <div className="flex items-center space-x-3">
            <FullscreenButton
              isFullscreen={isFullscreen}
              onToggle={() => setIsFullscreen(!isFullscreen)}
            />
          </div>
        </motion.div>

        {/* View Content - Scrollable */}
        <div 
          className="flex-1 relative min-h-0 overflow-y-auto view-card-body"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.20) transparent'
          }}
        >
          <style>{`
            .view-card-body::-webkit-scrollbar {
              width: 6px;
            }
            .view-card-body::-webkit-scrollbar-thumb {
              background: rgba(255,255,255,0.20);
              border-radius: 3px;
            }
            .view-card-body::-webkit-scrollbar-track {
              background: transparent;
            }
          `}</style>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                duration: 0.4,
                ease: "easeInOut"
              }}
              className="h-full"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MainVisualizationArea;
