
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, HelpCircle } from 'lucide-react';
import { AnimatedPage } from '@/components/ui/motion';
import { FullscreenButton } from '@/components/ui/fullscreen-button';
import { FullscreenOverlay } from '@/components/ui/fullscreen-overlay';
import TreemapView from '@/components/monitor/TreemapView';
import HeatmapTableView from '@/components/monitor/HeatmapTableView';
import RadialHubView from '@/components/monitor/RadialHubView';
import TileDashboardView from '@/components/monitor/TileDashboardView';
import UniversalAlertHub from '@/components/monitor/UniversalAlertHub';
import AnomalyDetector from '@/components/monitor/AnomalyDetector';
import InstrumentPanel from '@/components/monitor/InstrumentPanel';

type ViewType = 'treemap' | 'heatmap' | 'radial' | 'tile';

const Monitor: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('treemap');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewTitles = {
    treemap: 'Master Treemap: Key Monitor Indicators',
    heatmap: 'Heatmap + Table View',
    radial: 'Radial Hub & Spokes',
    tile: 'Tile Dashboard'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
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
        return <TreemapView {...viewProps} />;
      case 'heatmap':
        return <HeatmapTableView {...viewProps} />;
      case 'radial':
        return <RadialHubView {...viewProps} />;
      case 'tile':
        return <TileDashboardView {...viewProps} />;
      default:
        return <TreemapView {...viewProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced cinematic background */}
      <div className="fixed inset-0 z-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
        <motion.div 
          className="absolute inset-0 opacity-50" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <AnimatedPage>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col min-h-screen"
        >
          {/* Primary Monitor Header Bar - Always Visible */}
          <motion.header 
            variants={itemVariants}
            className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-900/30 border-b border-white/20 py-6 px-8"
            role="banner"
            aria-labelledby="monitor-title"
            whileHover={{ 
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(15, 23, 42, 0.4)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.div 
                  className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-400/30"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(20, 184, 166, 0.4)",
                    borderColor: "rgba(20, 184, 166, 0.6)"
                  }}
                  animate={{ 
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      "0 0 10px rgba(20, 184, 166, 0.2)",
                      "0 0 15px rgba(20, 184, 166, 0.3)",
                      "0 0 10px rgba(20, 184, 166, 0.2)"
                    ]
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity },
                    boxShadow: { duration: 3, repeat: Infinity }
                  }}
                >
                  <Activity size={32} className="text-teal-400" />
                </motion.div>
                <div className="text-left">
                  <motion.h1 
                    id="monitor-title"
                    className="text-4xl font-bold bg-gradient-to-r from-white via-teal-200 to-blue-400 bg-clip-text text-transparent"
                    whileHover={{ 
                      scale: 1.02,
                      textShadow: "0 0 20px rgba(20, 184, 166, 0.5)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    MONITOR ▮ : OPERATIONAL & STRATEGIC TRACKING
                  </motion.h1>
                  <motion.p 
                    className="text-lg text-slate-300 mt-2"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ 
                      opacity: 1,
                      color: "rgba(148, 163, 184, 1)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Real-time system health and performance insights
                  </motion.p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "rgba(20, 184, 166, 0.15)",
                    boxShadow: "0 0 15px rgba(20, 184, 166, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HelpCircle className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </motion.header>

          {/* Main Content Container */}
          <div className="flex-1 flex flex-col max-w-7xl mx-auto px-8 pb-8 relative z-10 w-full">
            {/* View Toggle & Instrument Panel */}
            <motion.div
              variants={itemVariants}
              className="mb-6"
              whileHover={{ 
                y: -2,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl backdrop-blur-xl bg-slate-800/40 border border-white/20 overflow-hidden shadow-2xl">
                <div className="p-6">
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
                          {view === 'treemap' && 'Treemap View'}
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
                        onTimeRangeChange={setTimeRange}
                        domainFilter={domainFilter}
                        onDomainFilterChange={setDomainFilter}
                        chartType={chartType}
                        onChartTypeChange={setChartType}
                        activeView={activeView}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Visualization Area */}
            <motion.div
              variants={itemVariants}
              className="flex-1 mb-6"
              whileHover={{ 
                y: -4,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl backdrop-blur-xl bg-slate-800/40 border border-white/20 overflow-hidden h-full min-h-[60vh] flex flex-col shadow-2xl group">
                {/* Card Header */}
                <motion.div 
                  className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0"
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

                {/* View Content */}
                <div className="flex-1 relative min-h-0">
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
                      className="absolute inset-0"
                    >
                      {renderCurrentView()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Alerts & Anomaly Section */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[35vh] flex-shrink-0"
            >
              <motion.div 
                className="lg:col-span-2"
                whileHover={{ 
                  y: -2,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)"
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-full rounded-2xl backdrop-blur-xl bg-slate-800/40 border border-white/20 overflow-hidden shadow-2xl">
                  <UniversalAlertHub />
                </div>
              </motion.div>
              <motion.div
                whileHover={{ 
                  y: -2,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)"
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-full rounded-2xl backdrop-blur-xl bg-slate-800/40 border border-white/20 overflow-hidden shadow-2xl">
                  <AnomalyDetector />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatedPage>

      {/* Fullscreen Overlay */}
      <FullscreenOverlay
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        title={viewTitles[activeView]}
      >
        <div className="h-full flex flex-col">
          {/* Fullscreen Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
            <h2 className="text-3xl font-bold text-white">
              {viewTitles[activeView]}
            </h2>
            <div className="flex items-center space-x-4">
              <InstrumentPanel
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                domainFilter={domainFilter}
                onDomainFilterChange={setDomainFilter}
                chartType={chartType}
                onChartTypeChange={setChartType}
                activeView={activeView}
              />
            </div>
          </div>
          
          {/* Fullscreen Content */}
          <div className="flex-1 relative min-h-0">
            {renderCurrentView()}
          </div>
        </div>
      </FullscreenOverlay>
    </div>
  );
};

export default Monitor;
