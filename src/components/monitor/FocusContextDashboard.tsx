
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
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
  component: React.ComponentType<any>;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: number; y: number }; // percentage
  weight: number;
  props?: any;
}

const FocusContextDashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null);
  const [fullscreenWidget, setFullscreenWidget] = useState<string | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Define all widgets with their configurations
  const widgets: WidgetConfig[] = [
    // Weight 5 (Highest Priority)
    {
      id: 'dei-stability',
      component: DEIStabilityWidget,
      defaultSize: { width: 300, height: 300 },
      defaultPosition: { x: 40, y: 30 },
      weight: 5
    },
    {
      id: 'system-alerts',
      component: SystemAlertsWidget,
      defaultSize: { width: 300, height: 200 },
      defaultPosition: { x: 75, y: 35 },
      weight: 5
    },
    // Weight 4
    {
      id: 'scenario-kpis',
      component: ScenarioKPIsWidget,
      defaultSize: { width: 300, height: 200 },
      defaultPosition: { x: 75, y: 20 },
      weight: 4
    },
    {
      id: 'system-trends',
      component: SystemTrendsWidget,
      defaultSize: { width: 240, height: 120 },
      defaultPosition: { x: 55, y: 15 },
      weight: 4
    },
    {
      id: 'zone-entropy',
      component: ZoneEntropyWidget,
      defaultSize: { width: 300, height: 120 },
      defaultPosition: { x: 70, y: 65 },
      weight: 4
    },
    // Weight 3
    {
      id: 'bundle-infra',
      component: BundleSuccessWidget,
      defaultSize: { width: 180, height: 120 },
      defaultPosition: { x: 55, y: 25 },
      weight: 3,
      props: { bundleName: 'Infra Dev', success: 72, roi: 15, time: '8 mo' }
    },
    {
      id: 'bundle-climate',
      component: BundleSuccessWidget,
      defaultSize: { width: 180, height: 120 },
      defaultPosition: { x: 25, y: 25 },
      weight: 3,
      props: { bundleName: 'Climate Resilience', success: 85, roi: 20, time: '5 mo' }
    },
    {
      id: 'bundle-education',
      component: BundleSuccessWidget,
      defaultSize: { width: 180, height: 120 },
      defaultPosition: { x: 55, y: 45 },
      weight: 3,
      props: { bundleName: 'Education Reform', success: 60, roi: 8, time: '10 mo' }
    },
    {
      id: 'bundle-mobility',
      component: BundleSuccessWidget,
      defaultSize: { width: 180, height: 120 },
      defaultPosition: { x: 25, y: 45 },
      weight: 3,
      props: { bundleName: 'Smart Mobility', success: 90, roi: 25, time: '6 mo' }
    },
    {
      id: 'claims',
      component: ClaimsWidget,
      defaultSize: { width: 240, height: 120 },
      defaultPosition: { x: 20, y: 65 },
      weight: 3
    },
    {
      id: 'handoff-queue',
      component: HandoffQueueWidget,
      defaultSize: { width: 180, height: 100 },
      defaultPosition: { x: 35, y: 70 },
      weight: 3
    },
    {
      id: 'risk-matrix',
      component: RiskMatrixWidget,
      defaultSize: { width: 180, height: 120 },
      defaultPosition: { x: 40, y: 90 },
      weight: 3
    },
    // Weight 2 Indicators
    ...['Population Dev', 'Resource Stock', 'Renewal vs Consumption', 'Extraction Pressure', 
        'Price Deviation', 'Capacity Utilization', 'Employment Rate', 'Education Completion',
        'Health Status', 'Living Consumption', 'Household Revenue', 'Environmental Quality'].map((name, index) => ({
      id: `indicator-${index}`,
      component: IndicatorWidget,
      defaultSize: { width: 120, height: 120 },
      defaultPosition: { 
        x: 5 + (index % 4) * 25, 
        y: 80 + Math.floor(index / 4) * 15 
      },
      weight: 2,
      props: { name, value: Math.random() > 0.5 ? '0.85' : '+3%', status: 'green' }
    })),
    // Weight 1
    {
      id: 'kpi-summary',
      component: KPISummaryWidget,
      defaultSize: { width: 120, height: 120 },
      defaultPosition: { x: 5, y: 5 },
      weight: 1
    }
  ];

  // Update container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate actual pixel positions
  const getActualPosition = useCallback((widget: WidgetConfig) => {
    const scaleX = containerDimensions.width / 100;
    const scaleY = containerDimensions.height / 100;
    
    return {
      x: widget.defaultPosition.x * scaleX,
      y: widget.defaultPosition.y * scaleY
    };
  }, [containerDimensions]);

  // Check if widgets are neighbors (overlapping bounding boxes with 20px expansion)
  const areNeighbors = useCallback((widget1: WidgetConfig, widget2: WidgetConfig) => {
    const pos1 = getActualPosition(widget1);
    const pos2 = getActualPosition(widget2);
    
    const expandedBounds1 = {
      left: pos1.x - 20,
      right: pos1.x + widget1.defaultSize.width + 20,
      top: pos1.y - 20,
      bottom: pos1.y + widget1.defaultSize.height + 20
    };
    
    const bounds2 = {
      left: pos2.x,
      right: pos2.x + widget2.defaultSize.width,
      top: pos2.y,
      bottom: pos2.y + widget2.defaultSize.height
    };
    
    return !(expandedBounds1.right < bounds2.left || 
             expandedBounds1.left > bounds2.right || 
             expandedBounds1.bottom < bounds2.top || 
             expandedBounds1.top > bounds2.bottom);
  }, [getActualPosition]);

  // Handle widget hover
  const handleWidgetHover = useCallback((widgetId: string | null) => {
    if (isMobile) return;
    setHoveredWidget(widgetId);
  }, [isMobile]);

  // Handle fullscreen toggle
  const handleFullscreen = useCallback((widgetId: string | null) => {
    setFullscreenWidget(widgetId);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreenWidget(null);
        setHoveredWidget(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get widget transform styles
  const getWidgetTransform = useCallback((widget: WidgetConfig) => {
    if (fullscreenWidget) {
      if (widget.id === fullscreenWidget) {
        return {
          transform: 'translate(0, 0) scale(1)',
          zIndex: 1000,
          opacity: 1
        };
      } else {
        return {
          transform: 'scale(0.95)',
          zIndex: 1,
          opacity: 0.5
        };
      }
    }

    if (isMobile || !hoveredWidget) {
      return {
        transform: 'scale(1)',
        zIndex: widget.weight * 10,
        opacity: 1
      };
    }

    const isHovered = widget.id === hoveredWidget;
    const hoveredWidgetConfig = widgets.find(w => w.id === hoveredWidget);
    const isNeighbor = hoveredWidgetConfig && areNeighbors(widget, hoveredWidgetConfig);

    if (isHovered) {
      return {
        transform: 'scale(1.15)',
        zIndex: 1000,
        opacity: 1
      };
    } else if (isNeighbor) {
      const hoveredPos = hoveredWidgetConfig ? getActualPosition(hoveredWidgetConfig) : { x: 0, y: 0 };
      const currentPos = getActualPosition(widget);
      
      // Calculate push direction
      const dx = currentPos.x - hoveredPos.x;
      const dy = currentPos.y - hoveredPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const pushDistance = 15;
      
      const pushX = distance > 0 ? (dx / distance) * pushDistance : 0;
      const pushY = distance > 0 ? (dy / distance) * pushDistance : 0;
      
      return {
        transform: `translate(${pushX}px, ${pushY}px) scale(0.9)`,
        zIndex: widget.weight * 10,
        opacity: 0.8
      };
    } else {
      return {
        transform: 'scale(1)',
        zIndex: widget.weight * 10,
        opacity: 0.8
      };
    }
  }, [hoveredWidget, fullscreenWidget, isMobile, widgets, areNeighbors, getActualPosition]);

  if (isMobile) {
    // Mobile accordion layout
    return (
      <div className="w-full h-full overflow-y-auto p-4 space-y-4">
        {widgets.map((widget) => {
          const WidgetComponent = widget.component;
          return (
            <motion.div
              key={widget.id}
              className="w-full glass-panel-cinematic p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <WidgetComponent 
                onFullscreen={() => handleFullscreen(widget.id)}
                isFullscreen={fullscreenWidget === widget.id}
                onClose={() => handleFullscreen(null)}
                {...(widget.props || {})}
              />
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        background: 'rgba(10, 20, 40, 0.6)',
        backdropFilter: 'blur(24px)',
        borderRadius: '1rem',
        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.4)',
        padding: '24px'
      }}
      role="application"
      aria-label="Monitor Zone Focus Context Dashboard"
    >
      <AnimatePresence>
        {widgets.map((widget) => {
          const WidgetComponent = widget.component;
          const position = getActualPosition(widget);
          const transform = getWidgetTransform(widget);
          const isFullscreen = fullscreenWidget === widget.id;

          return (
            <motion.div
              key={widget.id}
              className="absolute cursor-pointer"
              style={{
                left: isFullscreen ? 0 : position.x,
                top: isFullscreen ? 0 : position.y,
                width: isFullscreen ? '100%' : widget.defaultSize.width,
                height: isFullscreen ? '100%' : widget.defaultSize.height,
                ...transform,
                transition: fullscreenWidget 
                  ? 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)' 
                  : 'all 400ms cubic-bezier(0.68, -0.55, 0.27, 1.55)'
              }}
              onMouseEnter={() => handleWidgetHover(widget.id)}
              onMouseLeave={() => handleWidgetHover(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (hoveredWidget === widget.id) {
                    handleFullscreen(widget.id);
                  } else {
                    handleWidgetHover(widget.id);
                  }
                }
              }}
              tabIndex={0}
              role="region"
              aria-label={`${widget.id} widget`}
              whileHover={!isMobile ? { 
                boxShadow: '0 0 30px rgba(20, 184, 166, 0.3)' 
              } : undefined}
            >
              <div className="w-full h-full glass-panel-cinematic p-4">
                <WidgetComponent 
                  onFullscreen={() => handleFullscreen(widget.id)}
                  isFullscreen={isFullscreen}
                  onClose={() => handleFullscreen(null)}
                  {...(widget.props || {})}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default FocusContextDashboard;
