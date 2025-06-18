
import React from 'react';
import { motion } from 'framer-motion';
import InstrumentPanel from './InstrumentPanel';

type ViewType = 'treemap' | 'heatmap' | 'radial' | 'tile';

interface ViewTogglePanelProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  domainFilter: string;
  onDomainFilterChange: (value: string) => void;
  chartType: 'bar' | 'line';
  onChartTypeChange: (value: 'bar' | 'line') => void;
}

const ViewTogglePanel: React.FC<ViewTogglePanelProps> = ({
  activeView,
  setActiveView,
  timeRange,
  onTimeRangeChange,
  domainFilter,
  onDomainFilterChange,
  chartType,
  onChartTypeChange,
}) => {
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

  return (
    <motion.div
      variants={itemVariants}
      className="mb-4"
      whileHover={{ 
        y: -2,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-2xl backdrop-blur-xl bg-slate-800/40 border border-white/20 overflow-hidden shadow-2xl">
        <div className="p-4">
          <div className="flex items-center justify-between">
            {/* View Toggles */}
            <div className="flex space-x-4" role="tablist">
              {(['treemap', 'heatmap', 'radial', 'tile'] as ViewType[]).map((view) => (
                <motion.button
                  key={view}
                  role="tab"
                  aria-selected={activeView === view}
                  onClick={() => setActiveView(view)}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeView === view
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-white/10'
                  }`}
                  whileHover={activeView !== view ? { 
                    scale: 1.02,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(20, 184, 166, 0.3)"
                  } : {
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(20, 184, 166, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {view === 'treemap' && 'Sector Treemap'}
                  {view === 'heatmap' && 'Heatmap + Table View'}
                  {view === 'radial' && 'Radial Hub & Spokes'}
                  {view === 'tile' && 'Tile Dashboard'}
                </motion.button>
              ))}
            </div>

            {/* Instrument Panel */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <InstrumentPanel
                timeRange={timeRange}
                onTimeRangeChange={onTimeRangeChange}
                domainFilter={domainFilter}
                onDomainFilterChange={onDomainFilterChange}
                chartType={chartType}
                onChartTypeChange={onChartTypeChange}
                activeView={activeView}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewTogglePanel;
