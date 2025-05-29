
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MasonryGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: number;
  gap?: number;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  className,
  columns = 3,
  gap = 16
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 600);
      setIsTablet(window.innerWidth >= 600 && window.innerWidth < 1024);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const getGridColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return columns;
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile 
      ? '1fr' 
      : isTablet 
        ? '1fr 1.2fr' 
        : '1fr 1.2fr 0.8fr',
    gap: `${gap}px`,
    gridAutoRows: 'minmax(200px, auto)',
    alignItems: 'start'
  };

  return (
    <div className="page-container mb-8">
      <motion.div
        className={cn('masonry-grid', className)}
        style={gridStyle}
        role="grid"
        aria-label="Dashboard panels"
        layout
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;
          
          return React.cloneElement(child, {
            ...child.props,
            onHover: (isHovered: boolean, cardId: string) => {
              setHoveredCard(isHovered ? cardId : null);
              child.props.onHover?.(isHovered, cardId);
            },
            isExpanded: hoveredCard === child.props.cardId,
            isMobile,
            isTablet
          });
        })}
      </motion.div>
    </div>
  );
};
