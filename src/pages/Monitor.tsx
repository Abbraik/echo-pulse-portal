
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced cinematic background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
      </div>

      <AnimatedPage>
        {/* Primary Monitor Header Bar */}
        <motion.header 
          className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-900/20 border-b border-white/10 py-6 px-8 mb-8"
          role="banner"
          aria-labelledby="monitor-title"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.div 
                className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-400/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity size={32} className="text-teal-400" />
              </motion.div>
              <div className="text-left">
                <motion.h1 
                  id="monitor-title"
                  className="text-4xl font-bold bg-gradient-to-r from-white via-teal-200 to-blue-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  MONITOR ▮ : OPERATIONAL & STRATEGIC TRACKING
                </motion.h1>
                <motion.p 
                  className="text-lg text-slate-300 mt-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Real-time system health and performance insights
                </motion.p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200">
                <HelpCircle className="w-6 h-6" />
              </button>
              <button 
                className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
                disabled={!isExpanded}
              >
                <Maximize2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-8 pb-8 relative z-10 space-y-8">
          {/* View Toggle & Instrument Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="rounded-2xl backdrop-blur-md bg-slate-800/30 border border-white/10 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  {/* View Toggles */}
                  <div className="flex space-x-4" role="tablist">
                    {(['treemap', 'heatmap', 'radial', 'tile'] as ViewType[]).map((view) => (
                      <button
                        key={view}
                        role="tab"
                        aria-selected={activeView === view}
                        onClick={() => setActiveView(view)}
                        className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          activeView === view
                            ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                            : 'text-slate-300 hover:text-white hover:bg-white/5 border border-white/10'
                        }`}
                      >
                        {view === 'treemap' && 'Treemap View'}
                        {view === 'heatmap' && 'Heatmap + Table View'}
                        {view === 'radial' && 'Radial Hub & Spokes'}
                        {view === 'tile' && 'Tile Dashboard'}
                      </button>
                    ))}
                  </div>

                  {/* Instrument Panel */}
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
            </div>
          </motion.div>

          {/* Main Visualization Area */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="rounded-2xl backdrop-blur-md bg-slate-800/30 border border-white/10 overflow-hidden h-[60vh] flex flex-col">
              {/* Card Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white">
                  {viewTitles[activeView]}
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <span className="text-lg">⋮</span>
                  </button>
                  <button className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <span className="text-lg">—</span>
                  </button>
                  <button 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <span className="text-lg">⛶</span>
                  </button>
                </div>
              </div>

              {/* View Content */}
              <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
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
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[35vh]"
          >
            <div className="lg:col-span-2">
              <div className="h-full rounded-2xl backdrop-blur-md bg-slate-800/30 border border-white/10 overflow-hidden">
                <UniversalAlertHub />
              </div>
            </div>
            <div>
              <div className="h-full rounded-2xl backdrop-blur-md bg-slate-800/30 border border-white/10 overflow-hidden">
                <AnomalyDetector />
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedPage>
    </div>
  );
};

export default Monitor;
