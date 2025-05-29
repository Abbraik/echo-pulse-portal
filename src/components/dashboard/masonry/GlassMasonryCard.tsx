
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassMasonryCardProps {
  cardId: string;
  variant: 'large' | 'medium' | 'small';
  type: 'approvals' | 'health' | 'coordination';
  children: React.ReactNode;
  className?: string;
  onHover?: (isHovered: boolean, cardId: string) => void;
  onClick?: () => void;
  isExpanded?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}

export const GlassMasonryCard: React.FC<GlassMasonryCardProps> = ({
  cardId,
  variant,
  type,
  children,
  className,
  onHover,
  onClick,
  isExpanded = false,
  isMobile = false,
  isTablet = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeGradient = () => {
    switch (type) {
      case 'approvals':
        return 'from-blue-500/20 via-electric-blue-500/20 to-blue-600/20';
      case 'health':
        return 'from-teal-500/20 via-teal-400/20 to-teal-600/20';
      case 'coordination':
        return 'from-purple-500/20 via-purple-400/20 to-purple-600/20';
      default:
        return 'from-teal-500/20 via-teal-400/20 to-teal-600/20';
    }
  };

  const getGridSpan = () => {
    if (isMobile) {
      return { gridColumn: 'span 1', gridRow: variant === 'large' ? 'span 2' : 'span 1' };
    }
    
    if (isTablet) {
      switch (variant) {
        case 'large':
          return { gridColumn: 'span 2', gridRow: 'span 2' };
        case 'medium':
          return { gridColumn: 'span 1', gridRow: 'span 1' };
        case 'small':
          return { gridColumn: 'span 1', gridRow: 'span 2' };
      }
    }

    // Desktop
    switch (variant) {
      case 'large':
        return { gridColumn: 'span 2', gridRow: 'span 2' };
      case 'medium':
        return { gridColumn: 'span 1', gridRow: 'span 1' };
      case 'small':
        return { gridColumn: 'span 1', gridRow: 'span 2' };
    }
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
    onHover?.(true, cardId);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    onHover?.(false, cardId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isMobile || isTablet) {
        setIsHovered(!isHovered);
        onHover?.(!isHovered, cardId);
      } else {
        onClick?.();
      }
    }
  };

  return (
    <motion.div
      className={cn(
        'glass-masonry-card relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400',
        className
      )}
      style={{
        ...getGridSpan(),
        background: 'rgba(20, 30, 50, 0.6)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(20, 184, 166, 0.3)',
        borderRadius: '24px',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: isExpanded && !isMobile ? 1.2 : 1,
        zIndex: isExpanded ? 10 : 1
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      whileHover={!isMobile ? { 
        y: -8,
        boxShadow: `
          inset 0 0 30px rgba(20, 184, 166, 0.2), 
          0 20px 40px rgba(0, 0, 0, 0.3),
          0 0 40px rgba(20, 184, 166, 0.4)
        `
      } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="gridcell"
      aria-expanded={isExpanded}
      layout
    >
      {/* Gradient accent overlay */}
      <div 
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-30 rounded-2xl',
          getTypeGradient()
        )}
      />
      
      {/* Neon glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          boxShadow: isHovered || isExpanded 
            ? 'inset 0 0 20px rgba(20, 184, 166, 0.3)' 
            : 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full p-6">
        {children}
      </div>
    </motion.div>
  );
};
