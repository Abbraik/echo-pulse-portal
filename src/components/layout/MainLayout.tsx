
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeOverlay from '../home/WelcomeOverlay';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

interface MainLayoutProps {
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hideNav, setHideNav] = useState(false);
  const { resolvedTheme } = useTheme();
  const { isRTL } = useTranslation();
  const [isPageChanging, setIsPageChanging] = useState(false);
  const location = useLocation();
  
  // Check if we're on the innovate page
  const isInnovatePage = location.pathname === '/innovate';
  
  // Handle welcome overlay
  useEffect(() => {
    const hasVisited = localStorage.getItem('pds_visited');
    const neverShowWelcome = localStorage.getItem('pds_never_show_welcome');
    
    if (!hasVisited && !neverShowWelcome) {
      setShowWelcome(true);
      localStorage.setItem('pds_visited', 'true');
    }
  }, []);

  // Handle sticky navigation behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 80 && currentScrollY > lastScrollY) {
        setHideNav(true);
      } else {
        setHideNav(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const handleMouseNearTop = (e: MouseEvent) => {
      if (e.clientY < 20 && hideNav) {
        setHideNav(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseNearTop);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseNearTop);
    };
  }, [lastScrollY, hideNav]);
  
  // Simulate page transitions
  const handlePageChange = () => {
    setIsPageChanging(true);
    setTimeout(() => {
      setIsPageChanging(false);
    }, 1000);
  };
  
  useEffect(() => {
    window.addEventListener('popstate', handlePageChange);
    
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      handlePageChange();
    };
    
    return () => {
      window.removeEventListener('popstate', handlePageChange);
      history.pushState = originalPushState;
    };
  }, []);
  
  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 ${isRTL ? 'rtl' : ''}`}>
      {/* Page transition overlay */}
      <AnimatePresence mode="wait">
        {isPageChanging && (
          <motion.div
            className="fixed inset-0 z-50 bg-gradient-to-r from-teal-500/20 to-blue-500/20 backdrop-blur-lg flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 bg-teal-500/20 rounded-full animate-pulse blur-xl"></div>
              <div className="relative z-10 h-full w-full rounded-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '1s' }}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showWelcome && <WelcomeOverlay onDismiss={handleDismissWelcome} />}
      <Navbar hidden={hideNav && !isInnovatePage} onLogout={onLogout} />
      
      <main className={`flex-grow ${isInnovatePage ? 'pt-16' : 'container mx-auto px-4 py-6 pt-20'} ${isRTL ? 'font-noto-arabic' : ''}`}>
        <Outlet />
      </main>
      
      {!isInnovatePage && <Footer />}
    </div>
  );
};

export default MainLayout;
