
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

interface OptimizedPanelWrapperProps {
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
  animationDelay?: number;
}

export const OptimizedPanelWrapper = memo<OptimizedPanelWrapperProps>(({
  children,
  isVisible,
  className = "",
  animationDelay = 0
}) => {
  const animationVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: animationDelay,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  }), [animationDelay]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={animationVariants}
      layout
    >
      {children}
    </motion.div>
  );
});

OptimizedPanelWrapper.displayName = 'OptimizedPanelWrapper';
