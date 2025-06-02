
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import MonitorHeader from '@/components/monitor/MonitorHeader';
import ViewToggle from '@/components/monitor/ViewToggle';
import TreemapView from '@/components/monitor/TreemapView';
import HeatmapTableView from '@/components/monitor/HeatmapTableView';

const Monitor: React.FC = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'treemap' | 'heatmap'>('treemap');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#081226] to-[#04132A] -z-10" />
      
      {/* Particle Field */}
      <div className="fixed inset-0 opacity-20 -z-5">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-teal-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Monitor Header */}
        <MonitorHeader />
        
        {/* View Toggle */}
        <div className="px-8 mb-6">
          <ViewToggle activeView={activeView} onViewChange={setActiveView} />
        </div>
        
        {/* Content Area */}
        <div className="px-8 pb-8">
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
    </div>
  );
};

export default Monitor;
