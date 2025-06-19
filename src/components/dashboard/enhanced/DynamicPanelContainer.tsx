
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';
import EnhancedApprovalsPanel from './EnhancedApprovalsPanel';
import EnhancedCoordinationPanel from './EnhancedCoordinationPanel';

interface DynamicPanelContainerProps {
  dashboardData: any;
  viewMode: 'full' | 'approvals' | 'health';
  onViewModeChange: (mode: 'full' | 'approvals' | 'health') => void;
  onToggleFullscreen: (panel: string) => void;
}

type PanelType = 'approvals' | 'coordination' | null;

const DynamicPanelContainer: React.FC<DynamicPanelContainerProps> = ({
  dashboardData,
  viewMode,
  onViewModeChange,
  onToggleFullscreen
}) => {
  const [hoveredPanel, setHoveredPanel] = useState<PanelType>(null);

  const handlePanelHover = (panelType: PanelType) => {
    setHoveredPanel(panelType);
  };

  const handlePanelLeave = () => {
    setHoveredPanel(null);
  };

  const handleReset = () => {
    setHoveredPanel(null);
  };

  const getPanelWidth = (panelType: PanelType) => {
    if (!hoveredPanel) return '50%';
    return hoveredPanel === panelType ? '70%' : '30%';
  };

  const getPanelOpacity = (panelType: PanelType) => {
    if (!hoveredPanel) return 0.8;
    return hoveredPanel === panelType ? 1 : 0.8;
  };

  const isExpanded = (panelType: PanelType) => hoveredPanel === panelType;
  const isContracted = (panelType: PanelType) => hoveredPanel !== null && hoveredPanel !== panelType;

  const panelVariants = {
    default: {
      scale: 1,
      boxShadow: '0 0 20px rgba(20, 184, 166, 0.1)'
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 0 30px rgba(20, 184, 166, 0.3), 0 0 60px rgba(20, 184, 166, 0.1)'
    }
  };

  const getThemeBackground = (isHovered: boolean) => {
    return {
      background: 'rgba(10, 20, 40, 0.5)',
      backdropFilter: 'blur(20px)',
      border: isHovered 
        ? '2px solid rgba(20, 184, 166, 0.8)' 
        : '1px solid rgba(20, 184, 166, 0.3)',
      borderRadius: '2rem'
    };
  };

  return (
    <div className="w-full space-y-6">
      {/* Reset Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {hoveredPanel && (
            <Badge 
              variant="outline" 
              className="bg-teal-500/20 text-teal-400 border-teal-500/50"
            >
              {hoveredPanel.charAt(0).toUpperCase() + hoveredPanel.slice(1)} Expanded
            </Badge>
          )}
        </div>
        {hoveredPanel && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="border-teal-500/50 text-teal-400 hover:bg-teal-500/20"
          >
            <RotateCcw size={14} className="mr-2" />
            Reset View
          </Button>
        )}
      </div>

      {/* Dynamic Panels Container */}
      <div 
        className="flex gap-4 h-[65vh] min-h-[700px] w-full"
        onDoubleClick={handleReset}
      >
        {/* Approvals Panel */}
        <motion.div
          className="relative overflow-hidden"
          animate={{
            width: getPanelWidth('approvals'),
            opacity: getPanelOpacity('approvals')
          }}
          transition={{
            width: { duration: 0.3, ease: 'easeInOut' },
            opacity: { duration: 0.2, ease: 'easeInOut' }
          }}
          variants={panelVariants}
          initial="default"
          whileHover="hover"
          onMouseEnter={() => handlePanelHover('approvals')}
          onMouseLeave={handlePanelLeave}
        >
          <div
            className="h-full cursor-pointer flex flex-col"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePanelHover('approvals');
              }
              if (e.key === 'Escape') {
                handleReset();
              }
            }}
            onFocus={() => handlePanelHover('approvals')}
            onBlur={handlePanelLeave}
            tabIndex={0}
            role="button"
            aria-expanded={hoveredPanel === 'approvals'}
            aria-controls="approvals-content"
            style={getThemeBackground(hoveredPanel === 'approvals')}
          >
            <div className="flex-1 min-h-0 w-full">
              <EnhancedApprovalsPanel
                data={dashboardData?.approvals}
                onViewModeChange={onViewModeChange}
                currentMode={viewMode}
                onToggleFullscreen={() => onToggleFullscreen('approvals')}
                isExpanded={isExpanded('approvals')}
                isContracted={isContracted('approvals')}
              />
            </div>
          </div>
        </motion.div>

        {/* Coordination Panel */}
        <motion.div
          className="relative overflow-hidden"
          animate={{
            width: getPanelWidth('coordination'),
            opacity: getPanelOpacity('coordination')
          }}
          transition={{
            width: { duration: 0.3, ease: 'easeInOut' },
            opacity: { duration: 0.2, ease: 'easeInOut' }
          }}
          variants={panelVariants}
          initial="default"
          whileHover="hover"
          onMouseEnter={() => handlePanelHover('coordination')}
          onMouseLeave={handlePanelLeave}
        >
          <div
            className="h-full cursor-pointer flex flex-col"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePanelHover('coordination');
              }
              if (e.key === 'Escape') {
                handleReset();
              }
            }}
            onFocus={() => handlePanelHover('coordination')}
            onBlur={handlePanelLeave}
            tabIndex={0}
            role="button"
            aria-expanded={hoveredPanel === 'coordination'}
            aria-controls="coordination-content"
            style={getThemeBackground(hoveredPanel === 'coordination')}
          >
            <div className="flex-1 min-h-0 w-full">
              <EnhancedCoordinationPanel
                data={dashboardData?.coordination}
                onToggleFullscreen={() => onToggleFullscreen('coordination')}
                isExpanded={isExpanded('coordination')}
                isContracted={isContracted('coordination')}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DynamicPanelContainer;
