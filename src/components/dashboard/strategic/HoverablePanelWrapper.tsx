
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApprovalsIcon, HealthIcon, CoordinationIcon } from './PanelIcons';
import { Button } from '@/components/ui/button';
import { Maximize2, X } from 'lucide-react';

type PanelId = 'approvals' | 'health' | 'coordination';

interface HoverablePanelWrapperProps {
  panelId: PanelId;
  children: React.ReactNode;
  isCollapsed: boolean;
  isFullscreen: boolean;
  width: string;
  transform: string;
  onHover: (panelId: PanelId) => void;
  onLeave: () => void;
  onClick: (panelId: PanelId) => void;
  onFullscreen: (panelId: PanelId | null) => void;
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
  isFullscreen,
  width,
  transform,
  onHover,
  onLeave,
  onClick,
  onFullscreen,
}) => {
  const IconComponent = panelIcons[panelId];

  // Handle escape key for fullscreen
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        onFullscreen(null);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isFullscreen, onFullscreen]);

  // Fullscreen overlay
  if (isFullscreen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={panelTitles[panelId]}
        >
          <div className="h-full p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="h-full rounded-2xl overflow-hidden relative"
              style={{
                background: 'rgba(20, 30, 50, 0.95)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onFullscreen(null)}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white"
                aria-label="Close fullscreen"
              >
                <X size={16} />
              </Button>
              
              <div className="h-full overflow-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className={`${width} h-[45vh] min-h-[500px] relative origin-left`}
      onMouseEnter={() => onHover(panelId)}
      onMouseLeave={onLeave}
      onClick={() => onClick(panelId)}
      style={{
        transform,
        willChange: 'transform, opacity',
        zIndex: isCollapsed ? 10 : 20,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
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
        className="h-full overflow-hidden rounded-2xl relative"
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(20, 184, 166, 0.3)',
          boxShadow: isCollapsed 
            ? 'inset 0 0 20px rgba(20, 184, 166, 0.1), 0 8px 24px rgba(0, 0, 0, 0.3)'
            : 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Full-screen toggle button */}
        {!isCollapsed && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onFullscreen(panelId);
            }}
            className="absolute top-3 right-3 z-10 bg-white/10 hover:bg-white/20 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Open fullscreen"
          >
            <Maximize2 size={14} />
          </Button>
        )}

        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="collapsed"
              className="h-full w-full flex items-center justify-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <IconComponent className="w-6 h-6 text-teal-400" />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              className="h-full w-full group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
