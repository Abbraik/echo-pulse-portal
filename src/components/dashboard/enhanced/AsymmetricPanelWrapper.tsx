
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

type PanelType = 'approvals' | 'health' | 'coordination';

interface AsymmetricPanelWrapperProps {
  panelId: PanelType;
  title: string;
  children: React.ReactNode;
  className?: string;
  isHero: boolean;
  isHovered: boolean;
  isTransitioning: boolean;
  onHover: (isHovered: boolean) => void;
  onDoubleClick?: () => void;
  compactSummary?: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      priority?: string;
      severity?: string;
    }>;
    stats?: Record<string, any>;
  };
}

export const AsymmetricPanelWrapper: React.FC<AsymmetricPanelWrapperProps> = ({
  panelId,
  title,
  children,
  className,
  isHero,
  isHovered,
  isTransitioning,
  onHover,
  onDoubleClick,
  compactSummary
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target === panelRef.current) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onHover(!isHovered);
        }
      }
    };

    if (panelRef.current) {
      panelRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (panelRef.current) {
        panelRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isHovered, onHover]);

  const getAccentColor = () => {
    switch (panelId) {
      case 'approvals': return 'from-blue-500/20 to-blue-600/10';
      case 'health': return 'from-teal-500/20 to-teal-600/10';
      case 'coordination': return 'from-purple-500/20 to-purple-600/10';
      default: return 'from-gray-500/20 to-gray-600/10';
    }
  };

  const getBorderColor = () => {
    switch (panelId) {
      case 'approvals': return 'border-blue-500/30';
      case 'health': return 'border-teal-500/30';
      case 'coordination': return 'border-purple-500/30';
      default: return 'border-gray-500/30';
    }
  };

  return (
    <motion.div
      ref={panelRef}
      className={cn(
        'relative flex flex-col h-[45vh] transition-all duration-300 ease-in-out overflow-hidden',
        className
      )}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration: isTransitioning ? 0.4 : 0.3,
          ease: 'easeInOut'
        }
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onDoubleClick={onDoubleClick}
      tabIndex={0}
      role="region"
      aria-expanded={isHero}
      aria-label={`${title} panel`}
      style={{
        background: 'rgba(20, 30, 50, 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '1rem',
        border: `1px solid ${isHero ? 'rgba(20, 184, 166, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: isHero 
          ? `inset 0 0 30px rgba(20, 184, 166, 0.15), 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(20, 184, 166, 0.3)`
          : 'inset 0 0 20px rgba(20, 184, 166, 0.1), 0 8px 24px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Gradient accent overlay */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50 rounded-2xl',
        getAccentColor()
      )} />
      
      {/* Header */}
      <div className="relative z-10 p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-white">
              {title}
            </h3>
            <AnimatePresence>
              {isHero && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge 
                    variant="outline" 
                    className="bg-teal-500/20 border-teal-400/50 text-teal-300 animate-pulse"
                  >
                    <Eye size={12} className="mr-1" />
                    Focused
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 px-6 pb-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {isHero ? (
            <motion.div
              key="full-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key="summary-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Summary Items */}
              {compactSummary?.items.slice(0, 2).map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium truncate">
                      {item.title}
                    </span>
                    {(item.priority || item.severity) && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'text-xs',
                          (item.priority === 'high' || item.severity === 'high') && 'border-red-500/50 text-red-400',
                          (item.priority === 'medium' || item.severity === 'medium') && 'border-yellow-500/50 text-yellow-400',
                          (item.priority === 'low' || item.severity === 'low') && 'border-green-500/50 text-green-400'
                        )}
                      >
                        {item.priority || item.severity}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {/* View More Link */}
              <button className="w-full text-sm text-teal-400 hover:text-teal-300 transition-colors duration-200 flex items-center justify-center space-x-2 py-2">
                <span>View More</span>
                <span>▶</span>
              </button>

              {/* Peek Preview Strip */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
