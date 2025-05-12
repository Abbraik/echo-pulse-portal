
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeOverlay from '../home/WelcomeOverlay';

const MainLayout = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  
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
    <div className="flex flex-col min-h-screen bg-navy-900 text-white">
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
