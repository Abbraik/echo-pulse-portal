
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, HelpCircle, Maximize2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="relative z-10">
        {/* Primary Monitor Header Bar */}
        <header 
          className="w-full backdrop-blur-[24px] py-4 px-8"
          style={{
            background: 'rgba(20, 30, 50, 0.6)',
            borderBottom: '1px solid rgba(20, 184, 166, 0.3)',
            boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
          }}
          role="banner"
          aria-labelledby="monitor-title"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="p-3 rounded-2xl bg-teal-500/20 text-teal-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity size={28} />
              </motion.div>
              <div>
                <motion.h1 
                  id="monitor-title"
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500 font-noto-bold"
                  style={{ letterSpacing: '0.05em' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  MONITOR ▮ : OPERATIONAL & STRATEGIC TRACKING
                </motion.h1>
                <motion.p 
                  className="text-base text-gray-300 font-noto-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Real-time system health and performance insights
                </motion.p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                className="w-11 h-11 rounded-full flex items-center justify-center text-white/60 hover:text-teal-400 transition-all duration-200 hover:bg-teal-500/10"
                aria-label="Help"
              >
                <HelpCircle className="w-6 h-6" />
              </button>
              <button
                className="w-11 h-11 rounded-full flex items-center justify-center text-white/60 hover:text-teal-400 transition-all duration-200 hover:bg-teal-500/10"
                aria-label="Full Screen"
                disabled={!isExpanded}
              >
                <Maximize2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* View Toggle & Instrument Panel */}
        <div className="px-8 mt-6">
          <div 
            className="w-full h-12 flex items-center justify-between px-4 rounded-2xl backdrop-blur-[20px]"
            style={{
              background: 'rgba(8,14,25,0.55)',
              border: '1px solid rgba(0,255,195,0.15)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            {/* View Toggles */}
            <div className="flex space-x-3" role="tablist">
              {(['treemap', 'heatmap', 'radial', 'tile'] as ViewType[]).map((view) => (
                <button
                  key={view}
                  role="tab"
                  aria-selected={activeView === view}
                  onClick={() => setActiveView(view)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                    activeView === view
                      ? 'text-[#081226]'
                      : 'text-[#E0E0E0] hover:bg-[rgba(255,255,255,0.10)]'
                  }`}
                  style={{
                    fontFamily: 'Noto Sans',
                    ...(activeView === view
                      ? {
                          background: '#00FFC3',
                          boxShadow: '0 0 12px rgba(0,255,195,0.6), 0 2px 4px rgba(0,0,0,0.3)',
                        }
                      : {
                          background: 'transparent',
                          border: '1px solid rgba(255,255,255,0.12)',
                        }
                    ),
                  }}
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

        {/* Main Visualization Area */}
        <div className="px-8 mt-6">
          <div 
            className="rounded-3xl border relative backdrop-blur-[24px]"
            style={{
              background: 'rgba(10,20,40,0.45)',
              borderColor: 'rgba(0,255,195,0.15)',
              borderRadius: '1.5rem',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
              height: '60vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Card Header */}
            <div 
              className="h-10 flex items-center justify-between px-4 flex-shrink-0"
              style={{
                background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
              }}
            >
              <h3 
                className="font-bold text-white text-base"
                style={{ 
                  fontFamily: 'Noto Sans',
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)' 
                }}
              >
                {viewTitles[activeView]}
              </h3>
              <div className="flex items-center space-x-2">
                <button className="w-11 h-11 rounded-full flex items-center justify-center text-white/60 hover:text-[#00FFC3] transition-all duration-200">
                  <span className="text-lg">⋮</span>
                </button>
                <button className="w-11 h-11 rounded-full flex items-center justify-center text-white/60 hover:text-[#00FFC3] transition-all duration-200">
                  <span className="text-lg">—</span>
                </button>
                <button 
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white/60 hover:text-[#00FFC3] transition-all duration-200"
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
        </div>

        {/* Alerts & Anomaly Section */}
        <div className="px-8 mt-6 pb-8">
          <div className="flex gap-6 h-[35vh]">
            <div className="flex-[3]">
              <UniversalAlertHub />
            </div>
            <div className="flex-[2]">
              <AnomalyDetector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;
