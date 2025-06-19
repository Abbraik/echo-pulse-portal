
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StrategicCommandPanel from './panels/StrategicCommandPanel';
import ApprovalsDirectivesPanel from './panels/ApprovalsDirectivesPanel';
import CoordinationHubPanel from './panels/CoordinationHubPanel';
import SystemHealthRiskPanel from './panels/SystemHealthRiskPanel';
import ExecutiveSummaryPanel from './panels/ExecutiveSummaryPanel';
import AdditionalInsightsPanel from './panels/AdditionalInsightsPanel';

interface DynamicPanelGridProps {
  fullscreenPanel: string | null;
  onToggleFullscreen: (panelId: string) => void;
  onExitFullscreen: () => void;
}

const panels = [
  { id: 'strategic', component: StrategicCommandPanel, size: 'large' },
  { id: 'approvals', component: ApprovalsDirectivesPanel, size: 'medium' },
  { id: 'coordination', component: CoordinationHubPanel, size: 'medium' },
  { id: 'health', component: SystemHealthRiskPanel, size: 'small' },
  { id: 'executive', component: ExecutiveSummaryPanel, size: 'small' },
  { id: 'insights', component: AdditionalInsightsPanel, size: 'small' }
];

const DynamicPanelGrid: React.FC<DynamicPanelGridProps> = ({
  fullscreenPanel,
  onToggleFullscreen,
  onExitFullscreen
}) => {
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  const getPanelClasses = (panelId: string, size: string) => {
    const baseClasses = "relative overflow-hidden rounded-2xl transition-all duration-200 ease-out";
    
    if (fullscreenPanel === panelId) {
      return `${baseClasses} fixed inset-4 z-40`;
    }
    
    if (fullscreenPanel && fullscreenPanel !== panelId) {
      return `${baseClasses} opacity-50 pointer-events-none`;
    }

    let sizeClasses = '';
    if (size === 'large') sizeClasses = 'col-span-2 row-span-2';
    else if (size === 'medium') sizeClasses = 'col-span-1 row-span-2';
    else sizeClasses = 'col-span-1 row-span-1';

    const scaleClasses = hoveredPanel === panelId 
      ? 'scale-110 z-10' 
      : hoveredPanel && hoveredPanel !== panelId 
        ? 'scale-90 opacity-80' 
        : 'scale-100';

    return `${baseClasses} ${sizeClasses} ${scaleClasses}`;
  };

  const getPanelStyle = (panelId: string) => {
    const isHovered = hoveredPanel === panelId;
    return {
      background: 'rgba(20, 30, 50, 0.6)',
      backdropFilter: 'blur(24px)',
      border: isHovered 
        ? '2px solid rgba(20, 184, 166, 0.8)' 
        : '1px solid rgba(20, 184, 166, 0.3)',
      boxShadow: isHovered
        ? '0 0 30px rgba(20, 184, 166, 0.3), 0 0 60px rgba(20, 184, 166, 0.1)'
        : '0 0 20px rgba(20, 184, 166, 0.1)'
    };
  };

  return (
    <div className="h-full relative">
      {/* Grid Layout */}
      <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
        {panels.map(({ id, component: Component, size }) => (
          <motion.div
            key={id}
            className={getPanelClasses(id, size)}
            style={getPanelStyle(id)}
            onMouseEnter={() => !fullscreenPanel && setHoveredPanel(id)}
            onMouseLeave={() => !fullscreenPanel && setHoveredPanel(null)}
            layout
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Fullscreen Exit Button */}
            {fullscreenPanel === id && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onExitFullscreen}
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
              >
                <X size={16} />
              </Button>
            )}

            <Component
              isFullscreen={fullscreenPanel === id}
              onToggleFullscreen={() => onToggleFullscreen(id)}
              isHovered={hoveredPanel === id}
            />
          </motion.div>
        ))}
      </div>

      {/* Keyboard Navigation Hint */}
      {fullscreenPanel && (
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-black/70 backdrop-blur-lg rounded-lg px-4 py-2 text-sm text-white">
            Press <kbd className="bg-white/20 px-2 py-1 rounded">ESC</kbd> to exit fullscreen
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DynamicPanelGrid;
