
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activeView, setActiveView] = useState<ViewMode>('treemap');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [fullscreenCard, setFullscreenCard] = useState<string | null>(null);

  // Particle background effect
  const particles = Array.from({ length: 40 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 rounded-full"
      style={{
        background: '#00FFC3',
        left: `${Math.random() * 100}%`,
        opacity: 0.02,
        filter: 'blur(0.5px)',
      }}
      animate={{
        y: [0, -window.innerHeight],
        opacity: [0.02, 0, 0.02],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: Math.random() * 20 + 15,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 20,
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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #041225 0%, #0B122A 100%)',
      }}
    >
      {/* Parallax Blur Layers */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(8, 17, 42, 0.3)',
          backdropFilter: 'blur(16px)',
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(4, 18, 37, 0.6)',
          backdropFilter: 'blur(32px)',
        }}
      />

      {/* Particle Effect Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles}
      </div>

      {/* Monitor Header */}
      <MonitorHeader />

      {/* View Toggle & Instrument Panel Wrapper */}
      <div className="px-8 mt-6">
        <div 
          className="flex items-center"
          style={{
            background: 'rgba(8, 14, 25, 0.55)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 255, 195, 0.15)',
            borderRadius: '1rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            padding: '0 16px',
            height: '48px',
          }}
        >
          <div className="flex-1">
            <ViewToggle activeView={activeView} onViewChange={setActiveView} />
          </div>
          <div className="flex-none">
            <InstrumentPanel
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              domainFilter={domainFilter}
              onDomainFilterChange={setDomainFilter}
              chartType={chartType}
              onChartTypeChange={setChartType}
              showChartType={activeView === 'heatmap' || activeView === 'radial'}
            />
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="px-8 mt-6">
        <motion.div
          className={`${fullscreenCard === 'main-view' ? 'fixed inset-4 z-50' : ''}`}
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
              style={{ height: fullscreenCard === 'main-view' ? '100%' : '60vh' }}
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Alerts & Anomaly Section */}
      {!fullscreenCard && (
        <div className="px-8 mt-6 pb-8">
          <div 
            className="flex gap-6"
            style={{ height: 'calc(35vh - 24px)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex-1"
              style={{ flex: '1.5' }}
            >
              <UniversalAlertHub onFullscreen={() => handleFullscreen('alerts')} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex-1"
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
            className="fixed top-6 right-6 z-50"
            style={{
              background: '#00B8FF',
              color: '#081226',
              padding: '8px 12px',
              borderRadius: '8px',
              fontFamily: 'Noto Sans',
              fontWeight: 500,
              fontSize: '14px',
              boxShadow: '0 4px 8px rgba(0, 184, 255, 0.4)',
              transition: 'all 150ms ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1EC8FF';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 184, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#00B8FF';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 184, 255, 0.4)';
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
