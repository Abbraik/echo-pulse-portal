
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePanelCompact } from '@/hooks/use-panel-compact';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Maximize2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CompactSummaryItem {
  id: string;
  title: string;
  priority?: 'high' | 'medium' | 'low';
  severity?: 'high' | 'medium' | 'low';
}

interface CompactSummary {
  title: string;
  items: CompactSummaryItem[];
  stats: Record<string, any>;
}

interface CompactPanelWrapperProps {
  children: React.ReactNode;
  panelId: string;
  className?: string;
  onHover?: (isHovered: boolean) => void;
  onFullscreen?: () => void;
  compactSummary: CompactSummary;
}

export const CompactPanelWrapper: React.FC<CompactPanelWrapperProps> = ({
  children,
  panelId,
  className = '',
  onHover,
  onFullscreen,
  compactSummary
}) => {
  const { isCompact, panelRef } = usePanelCompact({ compactThreshold: 25 });
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleViewMore = () => {
    setIsExpanded(true);
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = `${compactSummary.title} panel expanded`;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const panelClasses = `
    ${className} 
    ${isCompact ? 'panel--compact' : ''}
    relative h-full
  `;

  const panelStyle = {
    background: 'rgba(20, 30, 50, 0.6)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '24px',
    boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.1), 0 8px 16px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden'
  };

  if (isCompact && !isExpanded) {
    return (
      <TooltipProvider>
        <motion.div
          ref={panelRef}
          className={panelClasses}
          style={panelStyle}
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => onHover?.(false)}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          aria-expanded="false"
        >
          {/* Compact Header */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-teal-400">{compactSummary.title}</h3>
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onFullscreen}
                  className="text-gray-400 hover:text-teal-400 hover:bg-teal-400/10 h-6 w-6 p-0"
                >
                  <Maximize2 size={12} />
                </Button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(compactSummary.stats).slice(0, 2).map(([key, value]) => (
                <div key={key} className="bg-white/5 rounded p-2 text-center">
                  <div className="text-lg font-bold text-teal-400">{value}</div>
                  <div className="text-xs text-gray-400 capitalize">{key}</div>
                </div>
              ))}
            </div>

            {/* Top Items */}
            <div className="space-y-2 mb-4">
              {compactSummary.items.slice(0, 2).map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <div className="p-2 bg-white/5 rounded cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white truncate flex-1 mr-2">
                          {item.title}
                        </span>
                        <Badge 
                          className={`text-xs ${getPriorityColor(item.priority) || getSeverityColor(item.severity)}`}
                        >
                          {item.priority || item.severity}
                        </Badge>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click "View More" to see full details
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* View More Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={handleViewMore}
                className="w-full text-teal-400 hover:text-white hover:bg-teal-400/10 text-xs"
                aria-expanded="false"
                aria-controls={`${panelId}-content`}
              >
                View More <ArrowRight size={12} className="ml-1" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </TooltipProvider>
    );
  }

  return (
    <motion.div
      ref={panelRef}
      className={panelClasses}
      style={panelStyle}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      aria-expanded={isExpanded ? "true" : "false"}
    >
      <div className="relative h-full">
        {/* Fullscreen Button */}
        <div className="absolute top-6 right-6 z-10">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onFullscreen}
              className="text-gray-400 hover:text-teal-400 hover:bg-teal-400/10"
            >
              <Maximize2 size={16} />
            </Button>
          </motion.div>
        </div>

        {/* Collapse Button (only show if was expanded from compact) */}
        <AnimatePresence>
          {isExpanded && isCompact && (
            <motion.div
              className="absolute top-6 right-16 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-orange-400 hover:bg-orange-400/10"
                aria-expanded="true"
                aria-controls={`${panelId}-content`}
              >
                <ArrowRight size={16} className="rotate-180" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel Content */}
        <div 
          id={`${panelId}-content`}
          className="h-full"
          style={{ overflow: isCompact && !isExpanded ? 'hidden' : 'auto' }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
};
