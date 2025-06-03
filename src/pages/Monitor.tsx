
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, HelpCircle, Maximize2 } from 'lucide-react';
import TreemapView from '@/components/monitor/TreemapView';
import HeatmapTableView from '@/components/monitor/HeatmapTableView';

const Monitor: React.FC = () => {
  const [activeView, setActiveView] = useState<'treemap' | 'heatmap'>('treemap');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#081226] to-[#04132A] relative overflow-hidden">
      {/* Particle Field Background */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00FFC3] rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Global Header */}
      <div 
        className="w-full h-20 flex items-center justify-between px-8"
        style={{
          background: 'rgba(10,20,40,0.6)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
        }}
        role="banner"
        aria-labelledby="monitor-title"
      >
        <div className="flex items-center space-x-4">
          <Activity className="w-8 h-8 text-[#00FFC3]" />
          <div>
            <h1 
              id="monitor-title"
              className="font-noto-bold text-[#00FFC3] text-xl leading-tight"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              MONITOR ▮ : OPERATIONAL & STRATEGIC TRACKING
            </h1>
            <p className="font-noto-regular text-[#E0E0E0] text-sm">
              Real-time system health and performance insights
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            className="w-8 h-8 text-white/50 hover:text-[#00FFC3] transition-colors duration-200"
            aria-label="Help"
          >
            <HelpCircle className="w-full h-full" />
          </button>
          <button
            className="w-8 h-8 text-white/50 hover:text-[#00FFC3] transition-colors duration-200"
            aria-label="Full Screen"
            disabled
          >
            <Maximize2 className="w-full h-full" />
          </button>
        </div>
      </div>

      {/* View Toggle Bar */}
      <div className="px-8 mt-4">
        <div 
          className="w-full h-12 flex items-center px-6 rounded-2xl border"
          style={{
            background: 'rgba(10,20,40,0.5)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(0,255,195,0.15)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
          }}
        >
          <div className="flex space-x-2" role="tablist">
            <button
              role="tab"
              aria-selected={activeView === 'treemap'}
              onClick={() => setActiveView('treemap')}
              className={`px-6 py-2 rounded-lg font-noto-medium text-sm transition-all duration-150 ${
                activeView === 'treemap'
                  ? 'bg-[#00FFC3] text-[#081226] shadow-lg'
                  : 'bg-transparent border border-white/10 text-[#E0E0E0] hover:bg-white/10'
              }`}
              style={
                activeView === 'treemap'
                  ? { boxShadow: '0 0 8px rgba(0,255,195,0.6)' }
                  : {}
              }
            >
              Treemap View
            </button>
            <button
              role="tab"
              aria-selected={activeView === 'heatmap'}
              onClick={() => setActiveView('heatmap')}
              className={`px-6 py-2 rounded-lg font-noto-medium text-sm transition-all duration-150 ${
                activeView === 'heatmap'
                  ? 'bg-[#00FFC3] text-[#081226] shadow-lg'
                  : 'bg-transparent border border-white/10 text-[#E0E0E0] hover:bg-white/10'
              }`}
              style={
                activeView === 'heatmap'
                  ? { boxShadow: '0 0 8px rgba(0,255,195,0.6)' }
                  : {}
              }
            >
              Heatmap + Table View
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-8 mt-6 pb-8">
        <AnimatePresence mode="wait">
          {activeView === 'treemap' ? (
            <motion.div
              key="treemap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TreemapView />
            </motion.div>
          ) : (
            <motion.div
              key="heatmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeatmapTableView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Monitor;
