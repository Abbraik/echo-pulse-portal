
import { useState, useEffect, useRef } from 'react';

interface UsePanelCompactOptions {
  compactThreshold?: number; // Percentage of container width
}

export const usePanelCompact = (options: UsePanelCompactOptions = {}) => {
  const { compactThreshold = 25 } = options;
  const [isCompact, setIsCompact] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          setContainerWidth(entry.contentRect.width);
        }
        
        if (entry.target === panelRef.current && containerWidth > 0) {
          const panelWidth = entry.contentRect.width;
          const widthPercentage = (panelWidth / containerWidth) * 100;
          const shouldBeCompact = widthPercentage < compactThreshold;
          
          if (shouldBeCompact !== isCompact) {
            setIsCompact(shouldBeCompact);
          }
        }
      }
    });

    if (panelRef.current) {
      resizeObserver.observe(panelRef.current);
    }
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [compactThreshold, isCompact, containerWidth]);

  return {
    isCompact,
    panelRef,
    containerRef,
    containerWidth
  };
};
