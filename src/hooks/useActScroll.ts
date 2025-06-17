
import { useState, useEffect } from 'react';

export const useActScroll = () => {
  const [scrollToDelivery, setScrollToDelivery] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Effect to scroll to delivery chains when needed
  useEffect(() => {
    if (scrollToDelivery) {
      setTimeout(() => {
        document.getElementById('delivery-chains')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
        setScrollToDelivery(false);
      }, 800); // Give time for animations
    }
  }, [scrollToDelivery]);
  
  // Effect to track scroll position for showing scroll-to-top button and header behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollToTop(currentScrollY > 500);
      
      // Header hide/show logic
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      setLastScrollY(currentScrollY);
    };
    
    // Handle mouse near top to reveal header
    const handleMouseNearTop = (e: MouseEvent) => {
      if (e.clientY < 20 && hideHeader) {
        setHideHeader(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseNearTop);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseNearTop);
    };
  }, [lastScrollY, hideHeader]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    scrollToDelivery,
    setScrollToDelivery,
    showScrollToTop,
    hideHeader,
    scrollToTop
  };
};
