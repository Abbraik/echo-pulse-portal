
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/ui/motion';
import MonitorBackground from '@/components/monitor/MonitorBackground';
import MonitorHeader from '@/components/monitor/MonitorHeader';
import ViewTogglePanel from '@/components/monitor/ViewTogglePanel';
import MainVisualizationArea from '@/components/monitor/MainVisualizationArea';
import AlertsAnomalySection from '@/components/monitor/AlertsAnomalySection';
import MonitorFullscreenOverlay from '@/components/monitor/MonitorFullscreenOverlay';

type ViewType = 'treemap' | 'heatmap' | 'radial' | 'tile';

const Monitor: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('heatmap');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <MonitorBackground />

      <AnimatedPage>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col min-h-screen relative z-10"
        >
          <MonitorHeader />

          {/* Main Content Container */}
          <div className="flex-1 flex flex-col max-w-7xl mx-auto px-4 pb-4 relative z-10 w-full">
            <ViewTogglePanel
              activeView={activeView}
              setActiveView={setActiveView}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              domainFilter={domainFilter}
              onDomainFilterChange={setDomainFilter}
              chartType={chartType}
              onChartTypeChange={setChartType}
            />

            <MainVisualizationArea
              activeView={activeView}
              timeRange={timeRange}
              domainFilter={domainFilter}
              chartType={chartType}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
            />

            <AlertsAnomalySection />
          </div>
        </motion.div>
      </AnimatedPage>

      <MonitorFullscreenOverlay
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        activeView={activeView}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        domainFilter={domainFilter}
        onDomainFilterChange={setDomainFilter}
        chartType={chartType}
        onChartTypeChange={setChartType}
      />
    </div>
  );
};

export default Monitor;
