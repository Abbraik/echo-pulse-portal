
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, HelpCircle, Maximize2 } from 'lucide-react';
import { AnimatedPage } from '@/components/ui/motion';
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
  const [isExpanded, setIsExpanded] = useState(false);

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
        >
          {/* Primary Monitor Header Bar */}
          <motion.header 
            variants={itemVariants}
            className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-900/30 border-b border-white/20 py-6 px-8 mb-8"
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
                <motion.button 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
                  disabled={!isExpanded}
                  whileHover={!isExpanded ? {} : { 
                    scale: 1.1,
                    backgroundColor: "rgba(20, 184, 166, 0.15)",
                    boxShadow: "0 0 15px rgba(20, 184, 166, 0.3)"
                  }}
                  whileTap={!isExpanded ? {} : { scale: 0.95 }}
                >
                  <Maximize2 className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </motion.header>

          {/* Main Content Container */}
          <div className="max-w-7xl mx-auto px-8 pb-8 relative z-10 space-y-8">
            {/* View Toggle & Instrument Panel */}
            <motion.div
              variants={itemVariants}
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
              whileHover={{ 
                y: -4,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl backdrop-blur-xl bg-slate-800/40 border border-white/20 overflow-hidden h-[60vh] flex flex-col shadow-2xl">
                {/* Card Header */}
                <motion.div 
                  className="flex items-center justify-between p-6 border-b border-white/10"
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
                    {['⋮', '—', '⛶'].map((symbol, index) => (
                      <motion.button 
                        key={symbol}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                        onClick={symbol === '⛶' ? () => setIsExpanded(!isExpanded) : undefined}
                        whileHover={{ 
                          scale: 1.1,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          color: "rgba(255, 255, 255, 1)"
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                      >
                        <span className="text-lg">{symbol}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* View Content */}
                <div className="flex-1 relative">
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
                      {activeView === 'treemap' && (
                        <TreemapView 
                          timeRange={timeRange}
                          domainFilter={domainFilter}
                          chartType={chartType}
                        />
                      )}
                      {activeView === 'heatmap' && (
                        <HeatmapTableView 
                          timeRange={timeRange}
                          domainFilter={domainFilter}
                          chartType={chartType}
                        />
                      )}
                      {activeView === 'radial' && (
                        <RadialHubView 
                          timeRange={timeRange}
                          domainFilter={domainFilter}
                          chartType={chartType}
                        />
                      )}
                      {activeView === 'tile' && (
                        <TileDashboardView 
                          timeRange={timeRange}
                          domainFilter={domainFilter}
                          chartType={chartType}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Alerts & Anomaly Section */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[35vh]"
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
    </div>
  );
};

export default Monitor;
