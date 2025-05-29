
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ArrowRight } from 'lucide-react';
import { PanelId, PanelState } from '@/hooks/use-focal-panels';

interface FocalPanelWrapperProps {
  panelId: PanelId;
  panelState: PanelState;
  width: string;
  animationDuration: number;
  title: string;
  accentColor: string;
  onHover: (panelId: PanelId | null) => void;
  onFocus: (panelId: PanelId) => void;
  onReset: () => void;
  children: React.ReactNode;
  compactSummary?: {
    items: Array<{ id: string; title: string; priority?: string; severity?: string }>;
    stats: Record<string, any>;
  };
  className?: string;
}

export const FocalPanelWrapper: React.FC<FocalPanelWrapperProps> = ({
  panelId,
  panelState,
  width,
  animationDuration,
  title,
  accentColor,
  onHover,
  onFocus,
  onReset,
  children,
  compactSummary,
  className = '',
}) => {
  const isHero = panelState === 'hero';
  const isContracted = panelState === 'contracted';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFocus(panelId);
    }
  };

  const getAccentStyles = () => {
    const baseColor = accentColor === 'blue' ? '#3B82F6' : 
                     accentColor === 'teal' ? '#14B8A6' : '#8B5CF6';
    
    if (isHero) {
      return {
        borderColor: `${baseColor}80`,
        boxShadow: `
          inset 0 0 30px ${baseColor}20,
          0 16px 32px rgba(0, 0, 0, 0.4),
          0 0 20px ${baseColor}30
        `,
      };
    }
    
    return {
      borderColor: `${baseColor}40`,
      boxShadow: `
        inset 0 0 20px ${baseColor}10,
        0 8px 24px rgba(0, 0, 0, 0.3)
      `,
    };
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl transition-all ${className}`}
      style={{
        background: 'rgba(20, 30, 50, 0.6)',
        backdropFilter: 'blur(24px)',
        border: '1px solid',
        ...getAccentStyles(),
      }}
      initial={false}
      animate={{
        width,
        scale: isHero ? 1.02 : 1,
      }}
      transition={{
        duration: animationDuration / 1000,
        ease: [0.4, 0, 0.2, 1],
      }}
      onMouseEnter={() => onHover(panelId)}
      onMouseLeave={() => onHover(null)}
      onDoubleClick={onReset}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-expanded={isHero}
      aria-label={`${title} panel`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className={`font-bold ${
            accentColor === 'blue' ? 'text-blue-400' :
            accentColor === 'teal' ? 'text-teal-400' : 'text-purple-400'
          } ${isContracted ? 'text-sm' : 'text-lg'}`}>
            {title}
          </h3>
          {isHero && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Badge 
                className={`animate-pulse ${
                  accentColor === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  accentColor === 'teal' ? 'bg-teal-500/20 text-teal-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}
              >
                <Eye size={12} className="mr-1" />
                Focused
              </Badge>
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            accentColor === 'blue' ? 'bg-blue-400' :
            accentColor === 'teal' ? 'bg-teal-400' : 'bg-purple-400'
          }`}></div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full">
        {isContracted && compactSummary ? (
          <motion.div
            className="p-4 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Compact Summary */}
            <div className="space-y-2">
              {compactSummary.items.slice(0, 2).map((item) => (
                <div key={item.id} className="p-2 bg-white/5 rounded text-xs">
                  <div className="font-medium text-white truncate mb-1">
                    {item.title}
                  </div>
                  {(item.priority || item.severity) && (
                    <Badge 
                      className={`text-xs ${
                        (item.priority === 'high' || item.severity === 'high') ? 'bg-red-500/20 text-red-400' :
                        (item.priority === 'medium' || item.severity === 'medium') ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {item.priority || item.severity}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Stats Summary */}
            {Object.keys(compactSummary.stats).length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(compactSummary.stats).slice(0, 2).map(([key, value]) => (
                  <div key={key} className="bg-white/5 rounded p-2 text-center">
                    <div className={`font-bold text-sm ${
                      accentColor === 'blue' ? 'text-blue-400' :
                      accentColor === 'teal' ? 'text-teal-400' : 'text-purple-400'
                    }`}>
                      {value}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            )}

            {/* View More Button */}
            <Button
              size="sm"
              variant="ghost"
              className={`w-full text-xs mt-3 ${
                accentColor === 'blue' ? 'text-blue-400 hover:bg-blue-500/10' :
                accentColor === 'teal' ? 'text-teal-400 hover:bg-teal-500/10' :
                'text-purple-400 hover:bg-purple-500/10'
              }`}
              onClick={() => onFocus(panelId)}
            >
              View More <ArrowRight size={12} className="ml-1" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
