
import { useState, useEffect } from 'react';

export const useAutoplay = (intervalTime: number = 5000) => {
  const [autoplay, setAutoplay] = useState(true);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (autoplay) {
      interval = setInterval(() => {
        // Auto-rotate logic would go here if we weren't using the Carousel component
        // which handles this internally
      }, intervalTime);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, intervalTime]);

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  return { autoplay, handleMouseEnter, handleMouseLeave };
};
