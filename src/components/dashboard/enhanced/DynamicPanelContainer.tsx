
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';
import EnhancedApprovalsPanel from './EnhancedApprovalsPanel';
import EnhancedSystemHealthPanel from './EnhancedSystemHealthPanel';
import EnhancedCoordinationPanel from './EnhancedCoordinationPanel';

interface DynamicPanelContainerProps {
  dashboardData: any;
  viewMode: 'full' | 'approvals' | 'health';
  onViewModeChange: (mode: 'full' | 'approvals' | 'health') => void;
  onToggleFullscreen: (panel: string) => void;
}

type PanelType = 'approvals' | 'health' | 'coordination' | null;

const DynamicPanelContainer: React.FC<DynamicPanelContainerProps> = ({
  dashboardData,
  viewMode,
  onViewModeChange,
  onToggleFullscreen
}) => {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const handlePanelClick = (panelType: PanelType) => {
    setActivePanel(activePanel === panelType ? null : panelType);
  };

  const handleReset = () => {
    setActivePanel(null);
  };

  const getPanelWidth = (panelType: PanelType) => {
    if (!activePanel) return '33.333%';
    return activePanel === panelType ? '60%' : '20%';
  };

  const getPanelOpacity = (panelType: PanelType) => {
    if (!activePanel) return 1;
    return activePanel === panelType ? 1 : 0.7;
  };

  const panelVariants = {
    default: {
      scale: 1,
      boxShadow: '0 0 20px rgba(20, 184, 166, 0.1)'
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 0 30px rgba(20, 184, 166, 0.2)'
    },
    active: {
      boxShadow: '0 0 40px rgba(20, 184, 166, 0.4), inset 0 0 20px rgba(20, 184, 166, 0.1)'
    }
  };

  return (
    <div className="space-y-6">
      {/* Reset Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {activePanel && (
            <Badge 
              variant="outline" 
              className="bg-teal-500/20 text-teal-400 border-teal-500/50"
            >
              {activePanel.charAt(0).toUpperCase() + activePanel.slice(1)} Expanded
            </Badge>
          )}
        </div>
        {activePanel && (
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
        className="flex gap-6 min-h-[320px]"
        onDoubleClick={handleReset}
      >
        {/* Approvals Panel */}
        <motion.div
          className="relative"
          style={{ 
            width: getPanelWidth('approvals'),
            opacity: getPanelOpacity('approvals')
          }}
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
          animate={activePanel === 'approvals' ? 'active' : 'default'}
        >
          <div
            className="h-full cursor-pointer"
            onClick={() => handlePanelClick('approvals')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePanelClick('approvals');
              }
            }}
            tabIndex={0}
            role="button"
            aria-expanded={activePanel === 'approvals'}
            aria-controls="approvals-content"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(20px)',
              border: activePanel === 'approvals' 
                ? '2px solid rgba(20, 184, 166, 0.8)' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '2rem'
            }}
          >
            <EnhancedApprovalsPanel
              data={dashboardData?.approvals}
              onViewModeChange={onViewModeChange}
              currentMode={viewMode}
              onToggleFullscreen={() => onToggleFullscreen('approvals')}
              isCompact={activePanel !== null && activePanel !== 'approvals'}
            />
          </div>
        </motion.div>

        {/* Health Panel */}
        <motion.div
          className="relative"
          style={{ 
            width: getPanelWidth('health'),
            opacity: getPanelOpacity('health')
          }}
          animate={{
            width: getPanelWidth('health'),
            opacity: getPanelOpacity('health')
          }}
          transition={{
            width: { duration: 0.3, ease: 'easeInOut' },
            opacity: { duration: 0.2, ease: 'easeInOut' }
          }}
          variants={panelVariants}
          initial="default"
          whileHover="hover"
          animate={activePanel === 'health' ? 'active' : 'default'}
        >
          <div
            className="h-full cursor-pointer"
            onClick={() => handlePanelClick('health')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePanelClick('health');
              }
            }}
            tabIndex={0}
            role="button"
            aria-expanded={activePanel === 'health'}
            aria-controls="health-content"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(20px)',
              border: activePanel === 'health' 
                ? '2px solid rgba(20, 184, 166, 0.8)' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '2rem'
            }}
          >
            <EnhancedSystemHealthPanel
              data={dashboardData?.systemHealth}
              onViewModeChange={onViewModeChange}
              currentMode={viewMode}
              onToggleFullscreen={() => onToggleFullscreen('health')}
              isCompact={activePanel !== null && activePanel !== 'health'}
            />
          </div>
        </motion.div>

        {/* Coordination Panel */}
        <motion.div
          className="relative"
          style={{ 
            width: getPanelWidth('coordination'),
            opacity: getPanelOpacity('coordination')
          }}
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
          animate={activePanel === 'coordination' ? 'active' : 'default'}
        >
          <div
            className="h-full cursor-pointer"
            onClick={() => handlePanelClick('coordination')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePanelClick('coordination');
              }
            }}
            tabIndex={0}
            role="button"
            aria-expanded={activePanel === 'coordination'}
            aria-controls="coordination-content"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(20px)',
              border: activePanel === 'coordination' 
                ? '2px solid rgba(20, 184, 166, 0.8)' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '2rem'
            }}
          >
            <EnhancedCoordinationPanel
              data={dashboardData?.coordination}
              onToggleFullscreen={() => onToggleFullscreen('coordination')}
              isCompact={activePanel !== null && activePanel !== 'coordination'}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DynamicPanelContainer;
