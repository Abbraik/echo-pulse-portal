
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import MonitorHeader from '@/components/monitor/MonitorHeader';
import ViewToggle from '@/components/monitor/ViewToggle';
import InstrumentPanel from '@/components/monitor/InstrumentPanel';
import TreemapView from '@/components/monitor/views/TreemapView';
import HeatmapTableView from '@/components/monitor/views/HeatmapTableView';
import RadialHubView from '@/components/monitor/views/RadialHubView';
import TileDashboardView from '@/components/monitor/views/TileDashboardView';
import UniversalAlertHub from '@/components/monitor/UniversalAlertHub';
import AnomalyDetector from '@/components/monitor/AnomalyDetector';

type ViewMode = 'treemap' | 'heatmap' | 'radial' | 'tile';

const Monitor: React.FC = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<ViewMode>('treemap');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [fullscreenCard, setFullscreenCard] = useState<string | null>(null);

  // Particle effect background
  const particles = Array.from({ length: 30 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-teal-400 rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        opacity: 0.03,
      }}
      animate={{
        y: [0, -100],
        opacity: [0.03, 0, 0.03],
      }}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 10,
      }}
    />
  ));

  const handleFullscreen = (cardId: string) => {
    setFullscreenCard(cardId);
  };

  const closeFullscreen = () => {
    setFullscreenCard(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCurrentView = () => {
    const viewProps = {
      timeRange,
      domainFilter,
      chartType,
      onFullscreen: handleFullscreen,
      isFullscreen: fullscreenCard === 'main-view',
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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #081226 0%, #04132A 100%)',
    }}>
      {/* Particle Effect Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles}
      </div>

      {/* Monitor Header */}
      <MonitorHeader />

      {/* View Toggle Bar */}
      <div className="px-8 mt-6">
        <ViewToggle activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Main Content Area */}
      <div className="px-8 mt-6 flex gap-6 relative">
        {/* Instrument Panel */}
        {!fullscreenCard && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-80 flex-shrink-0"
          >
            <InstrumentPanel
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              domainFilter={domainFilter}
              onDomainFilterChange={setDomainFilter}
              chartType={chartType}
              onChartTypeChange={setChartType}
              showChartType={activeView === 'heatmap' || activeView === 'radial'}
            />
          </motion.div>
        )}

        {/* Main Visualization Area */}
        <motion.div
          className={`flex-1 ${fullscreenCard === 'main-view' ? 'fixed inset-4 z-50' : ''}`}
          layout
          transition={{ duration: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Alerts & Anomaly Section */}
      {!fullscreenCard && (
        <div className="px-8 mt-6 pb-8">
          <div className="flex gap-6">
            {/* Universal Alert Hub */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-3/5"
            >
              <UniversalAlertHub onFullscreen={() => handleFullscreen('alerts')} />
            </motion.div>

            {/* Anomaly Detector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="w-2/5"
            >
              <AnomalyDetector onFullscreen={() => handleFullscreen('anomaly')} />
            </motion.div>
          </div>
        </div>
      )}

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {fullscreenCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closeFullscreen}
          />
        )}
      </AnimatePresence>

      {/* Back to Monitor Button for Fullscreen */}
      <AnimatePresence>
        {fullscreenCard && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={closeFullscreen}
            className="fixed top-6 right-6 z-50 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 500,
              fontSize: '14px',
              boxShadow: '0 4px 8px rgba(0, 184, 255, 0.4)',
            }}
          >
            Back to Monitor
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Monitor;
