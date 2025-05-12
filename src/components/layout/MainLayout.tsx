
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeOverlay from '../home/WelcomeOverlay';
import { useTheme } from '@/hooks/use-theme';

const MainLayout = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hideNav, setHideNav] = useState(false);
  const { resolvedTheme } = useTheme();
  
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
  
  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300`}>
      {showWelcome && <WelcomeOverlay onDismiss={handleDismissWelcome} />}
      <Navbar hidden={hideNav} />
      <main className="flex-grow container mx-auto px-4 py-6 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
