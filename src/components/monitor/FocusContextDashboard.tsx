import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, X, Grip } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import DEIStabilityWidget from './widgets/DEIStabilityWidget';
import BundleSuccessWidget from './widgets/BundleSuccessWidget';
import ScenarioKPIsWidget from './widgets/ScenarioKPIsWidget';
import SystemTrendsWidget from './widgets/SystemTrendsWidget';
import ClaimsWidget from './widgets/ClaimsWidget';
import HandoffQueueWidget from './widgets/HandoffQueueWidget';
import ZoneEntropyWidget from './widgets/ZoneEntropyWidget';
import SystemAlertsWidget from './widgets/SystemAlertsWidget';
import RiskMatrixWidget from './widgets/RiskMatrixWidget';
import IndicatorWidget from './widgets/IndicatorWidget';
import KPISummaryWidget from './widgets/KPISummaryWidget';

interface WidgetConfig {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: string; y: string };
  weight: number;
  props?: any;
}

const FocusContextDashboard: React.FC = () => {
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null);
  const [fullscreenWidget, setFullscreenWidget] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const widgets: WidgetConfig[] = [
    {
      id: 'dei-stability',
      name: 'DEI Stability',
      component: DEIStabilityWidget,
      defaultSize: { width: 300, height: 300 },
      defaultPosition: { x: '40%', y: '30%' },
      weight: 5
    },
    {
      id: 'bundle-infra',
      name: 'Infrastructure Development',
      component: BundleSuccessWidget,
      defaultSize: { width: 180, height: 120 },
      defaultPosition: { x: '60%', y: '15%' },
      weight: 3,
      props: { bundleName: 'Infra Dev', success: 72, roi: 15, timeToComplete: '8 mo' }
    },
    {
      id: 'bundle-climate',
      name: 'Climate Resilience',
      component: BundleSuccessWidget,
      defaultSize: { width: 180, height: 120 },
      defaultPosition: { x: '20%', y: '15%' },
      weight: 3,
      props: { bundleName: 'Climate Resist.', success: 85, roi: 20, timeToComplete: '5 mo' }
    },
    {
      id: 'bundle-education',
      name: 'Education Reform',
      component: BundleSuccessWidget,
      defaultSize: { width: 180, height: 120 },
      defaultPosition: { x: '60%', y: '45%' },
      weight: 3,
      props: { bundleName: 'Edu Reform', success: 60, roi: 8, timeToComplete: '10 mo' }
    },
    {
      id: 'bundle-mobility',
      name: 'Smart Mobility',
      component: BundleSuccessWidget,
      defaultSize: { width: 180, height: 120 },
      defaultPosition: { x: '20%', y: '45%' },
      weight: 3,
      props: { bundleName: 'Smart Mob.', success: 90, roi: 25, timeToComplete: '6 mo' }
    },
    {
      id: 'scenario-kpis',
      name: 'Scenario & KPIs',
      component: ScenarioKPIsWidget,
      defaultSize: { width: 300, height: 200 },
      defaultPosition: { x: '75%', y: '20%' },
      weight: 4
    },
    {
      id: 'system-trends',
      name: 'System Trends',
      component: SystemTrendsWidget,
      defaultSize: { width: 240, height: 120 },
      defaultPosition: { x: '55%', y: '15%' },
      weight: 4
    },
    {
      id: 'claims',
      name: 'Claims',
      component: ClaimsWidget,
      defaultSize: { width: 240, height: 120 },
      defaultPosition: { x: '20%', y: '65%' },
      weight: 3
    },
    {
      id: 'handoff-queue',
      name: 'Handoff Queue',
      component: HandoffQueueWidget,
      defaultSize: { width: 180, height: 100 },
      defaultPosition: { x: '35%', y: '70%' },
      weight: 3
    },
    {
      id: 'zone-entropy',
      name: 'Zone Entropy',
      component: ZoneEntropyWidget,
      defaultSize: { width: 300, height: 120 },
      defaultPosition: { x: '70%', y: '65%' },
      weight: 4
    },
    {
      id: 'system-alerts',
      name: 'System Alerts',
      component: SystemAlertsWidget,
      defaultSize: { width: 300, height: 200 },
      defaultPosition: { x: '75%', y: '35%' },
      weight: 5
    },
    {
      id: 'risk-matrix',
      name: 'Risk Matrix',
      component: RiskMatrixWidget,
      defaultSize: { width: 180, height: 120 },
      defaultPosition: { x: '40%', y: '90%' },
      weight: 3
    },
    // Weight 2 indicators
    {
      id: 'population-deviation',
      name: 'Population Deviation',
      component: IndicatorWidget,
      defaultSize: { width: 120, height: 120 },
      defaultPosition: { x: '5%', y: '5%' },
      weight: 2,
      props: { title: 'Population Deviation', value: '0.02', status: 'good', unit: '' }
    },
    {
      id: 'resource-stock',
      name: 'Resource Stock vs Target',
      component: IndicatorWidget,
      defaultSize: { width: 120, height: 120 },
      defaultPosition: { x: '15%', y: '5%' },
      weight: 2,
      props: { title: 'Resource Stock', value: '0.92×', status: 'good', unit: '' }
    },
    {
      id: 'renewal-consumption',
      name: 'Renewal vs Consumption',
      component: IndicatorWidget,
      defaultSize: { width: 120, height: 120 },
      defaultPosition: { x: '85%', y: '5%' },
      weight: 2,
      props: { title: 'Renewal/Consumption', value: '1.05× / 1.00×', status: 'good', unit: '' }
    },
    {
      id: 'extraction-pressure',
      name: 'Extraction Pressure',
      component: IndicatorWidget,
      defaultSize: { width: 120, height: 120 },
      defaultPosition: { x: '5%', y: '85%' },
      weight: 2,
      props: { title: 'Extraction Pressure', value: '0.35', status: 'warning', unit: '' }
    },
    {
      id: 'employment-rate',
      name: 'Employment Rate',
      component: IndicatorWidget,
      defaultSize: { width: 120, height: 120 },
      defaultPosition: { x: '85%', y: '85%' },
      weight: 2,
      props: { title: 'Employment Rate', value: '72%', status: 'good', unit: '' }
    },
    {
      id: 'kpi-summary',
      name: 'High-Level KPI Summary',
      component: KPISummaryWidget,
      defaultSize: { width: 120, height: 120 },
      defaultPosition: { x: '5%', y: '35%' },
      weight: 1
    }
  ];

  const getNeighbors = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return [];

    // Calculate expanded bounding box (20px padding)
    const expandedBox = {
      left: parseFloat(widget.defaultPosition.x) - 2,
      right: parseFloat(widget.defaultPosition.x) + (widget.defaultSize.width / 10) + 2,
      top: parseFloat(widget.defaultPosition.y) - 2,
      bottom: parseFloat(widget.defaultPosition.y) + (widget.defaultSize.height / 10) + 2
    };

    return widgets.filter(w => {
      if (w.id === widgetId) return false;
      
      const otherBox = {
        left: parseFloat(w.defaultPosition.x),
        right: parseFloat(w.defaultPosition.x) + (w.defaultSize.width / 10),
        top: parseFloat(w.defaultPosition.y),
        bottom: parseFloat(w.defaultPosition.y) + (w.defaultSize.height / 10)
      };

      // Check if boxes intersect
      return !(expandedBox.right < otherBox.left || 
               expandedBox.left > otherBox.right || 
               expandedBox.bottom < otherBox.top || 
               expandedBox.top > otherBox.bottom);
    }).map(w => w.id);
  };

  const handleWidgetHover = (widgetId: string | null) => {
    setHoveredWidget(widgetId);
  };

  const handleFullscreen = (widgetId: string) => {
    setFullscreenWidget(widgetId);
  };

  const handleCloseFullscreen = () => {
    setFullscreenWidget(null);
  };

  const renderWidget = (widget: WidgetConfig) => {
    const isHovered = hoveredWidget === widget.id;
    const isNeighbor = hoveredWidget ? getNeighbors(hoveredWidget).includes(widget.id) : false;
    const isFullscreen = fullscreenWidget === widget.id;
    const isDimmed = fullscreenWidget && fullscreenWidget !== widget.id;

    const getScale = () => {
      if (isFullscreen) return 1;
      if (isHovered) return 1.15;
      if (isNeighbor) return 0.9;
      return 1;
    };

    const getOpacity = () => {
      if (isFullscreen) return 1;
      if (isDimmed) return 0.5;
      if (hoveredWidget && !isHovered) return 0.8;
      return 1;
    };

    const getTranslate = () => {
      if (isFullscreen) return { x: 0, y: 0 };
      if (isNeighbor && hoveredWidget) {
        // Simple outward push effect
        const dx = Math.random() * 20 - 10;
        const dy = Math.random() * 20 - 10;
        return { x: dx, y: dy };
      }
      return { x: 0, y: 0 };
    };

    const translate = getTranslate();
    const Component = widget.component;

    return (
      <motion.div
        key={widget.id}
        className={`absolute ${isFullscreen ? 'inset-0 z-50' : ''}`}
        style={
          isFullscreen
            ? {}
            : {
                left: widget.defaultPosition.x,
                top: widget.defaultPosition.y,
                width: widget.defaultSize.width,
                height: widget.defaultSize.height,
              }
        }
        animate={{
          scale: getScale(),
          opacity: getOpacity(),
          x: translate.x,
          y: translate.y,
          zIndex: isHovered ? 10 : isFullscreen ? 50 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: isFullscreen ? 0.4 : 0.2,
        }}
        onMouseEnter={() => !fullscreenWidget && handleWidgetHover(widget.id)}
        onMouseLeave={() => !fullscreenWidget && handleWidgetHover(null)}
        role="region"
        tabIndex={0}
        aria-label={`${widget.name}: Interactive widget`}
      >
        <GlassCard 
          className={`h-full w-full relative overflow-hidden transition-all duration-200 ${
            isHovered && !fullscreenWidget ? 'shadow-lg shadow-teal-500/20 border-teal-500/40' : ''
          }`}
        >
          {/* Widget Header */}
          <div className="absolute top-2 right-2 z-10 flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-gray-400 hover:text-teal-400"
              onClick={() => handleFullscreen(widget.id)}
              aria-label={`Full-screen ${widget.name}`}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            {isFullscreen && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                onClick={handleCloseFullscreen}
                aria-label="Close full-screen"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Widget Content */}
          <Component 
            {...(widget.props || {})} 
            isFullscreen={isFullscreen}
            isHovered={isHovered}
          />
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <div className="h-full w-full relative">
      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className="h-full w-full relative overflow-auto bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-2xl shadow-2xl p-6"
        role="application"
        aria-label="Monitor Zone Focus Context Dashboard"
      >
        {widgets.map(renderWidget)}
      </div>

      {/* Fullscreen Overlay Background */}
      {fullscreenWidget && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  );
};

export default FocusContextDashboard;
