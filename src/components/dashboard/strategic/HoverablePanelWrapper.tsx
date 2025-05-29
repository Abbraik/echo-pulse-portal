
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApprovalsIcon, HealthIcon, CoordinationIcon } from './PanelIcons';
import { PanelHeader } from './PanelHeader';

type PanelId = 'approvals' | 'health' | 'coordination';

interface HoverablePanelWrapperProps {
  panelId: PanelId;
  children: React.ReactNode;
  isCollapsed: boolean;
  width: string;
  onHover: (panelId: PanelId) => void;
  onLeave: () => void;
  onClick: (panelId: PanelId) => void;
  onFullscreen: () => void;
}

const panelIcons = {
  approvals: ApprovalsIcon,
  health: HealthIcon,
  coordination: CoordinationIcon,
};

const panelTitles = {
  approvals: 'Approvals & Decisions',
  health: 'System Health & Alerts',
  coordination: 'Coordination & Triggers',
};

export const HoverablePanelWrapper: React.FC<HoverablePanelWrapperProps> = ({
  panelId,
  children,
  isCollapsed,
  width,
  onHover,
  onLeave,
  onClick,
  onFullscreen,
}) => {
  const IconComponent = panelIcons[panelId];

  return (
    <motion.div
      className={`${width} h-[75vh] min-h-[700px] relative`}
      onMouseEnter={() => onHover(panelId)}
      onMouseLeave={onLeave}
      onClick={() => onClick(panelId)}
      layout
      initial={false}
      animate={{
        width: width.includes('[80px]') ? '80px' : width.includes('[70%]') ? '70%' : '33.333%',
      }}
      transition={{ 
        duration: 0.25, 
        ease: [0.25, 0.46, 0.45, 0.94],
        layout: { duration: 0.25 }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={!isCollapsed}
      aria-label={panelTitles[panelId]}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(panelId);
        }
      }}
    >
      <div
        className="h-full overflow-hidden rounded-2xl transition-all duration-250 ease-out"
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(20, 184, 166, 0.3)',
          boxShadow: isCollapsed 
            ? 'inset 0 0 20px rgba(20, 184, 166, 0.1), 0 8px 24px rgba(0, 0, 0, 0.3)'
            : 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="collapsed"
              className="h-full w-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <IconComponent className="w-6 h-6 text-teal-400" />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              className="h-full w-full flex flex-col"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <PanelHeader
                title={panelTitles[panelId]}
                icon={<IconComponent className="w-5 h-5" />}
                onFullscreen={onFullscreen}
              />
              <div className="flex-1 overflow-hidden">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
