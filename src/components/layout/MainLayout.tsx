
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeOverlay from '../home/WelcomeOverlay';
import { useTheme } from '@/hooks/use-theme';

const MainLayout = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    const hasVisited = localStorage.getItem('pds_visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('pds_visited', 'true');
    }
  }, []);
  
  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300`}>
      {showWelcome && <WelcomeOverlay onDismiss={handleDismissWelcome} />}
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
