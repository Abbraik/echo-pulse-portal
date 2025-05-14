
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Layers } from 'lucide-react';
import ConcentricLayout from '@/components/think/ConcentricLayout';
import AiAdvisorSidebar from '@/components/think/AiAdvisorSidebar';
import FooterCTA from '@/components/think/FooterCTA';
import { motion } from 'framer-motion';
import CentralCLD from '@/components/think/rings/CentralCLD';
import DeiRing from '@/components/think/rings/DeiRing';
import EquilibriumRing from '@/components/think/rings/EquilibriumRing';
import SensitivityRing from '@/components/think/rings/SensitivityRing';
import StrategyRing from '@/components/think/rings/StrategyRing';
import { toast } from '@/hooks/use-toast';

const ThinkPage: React.FC = () => {
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [snaOverlayVisible, setSnaOverlayVisible] = useState(false);

  // Handle scroll behavior for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Handle mouse near top to reveal header
    const handleMouseNearTop = (e: MouseEvent) => {
      if (e.clientY < 20 && hideHeader) {
        setHideHeader(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseNearTop);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseNearTop);
    };
  }, [lastScrollY, hideHeader]);

  const toggleSnaOverlay = () => {
    setSnaOverlayVisible(!snaOverlayVisible);
    
    toast({
      title: snaOverlayVisible ? "SNA Overlay hidden" : "SNA Overlay visible",
      description: snaOverlayVisible 
        ? "Social Network Analysis layer has been hidden" 
        : "Social Network Analysis layer is now visible",
      variant: "default",
      duration: 2000,
    });
  };

  return (
    <AnimatedPage>
      {/* Top Navigation Bar */}
      <motion.header 
        className="sticky top-0 z-50 w-full glass-panel py-3 px-6 mb-8 border-b border-white/20"
        initial={{ y: 0 }}
        animate={{ y: hideHeader ? -100 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Layers size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">THINK 🔍: Diagnose & Plan</h1>
              <p className="text-sm md:text-base text-gray-400">
                Concentric System Modeling Interface
              </p>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Concentric Layout */}
      <div className="glass-panel p-6">
        <ConcentricLayout
          centralContent={<CentralCLD />}
          innerRingContent={<DeiRing />}
          equilibriumRingContent={<EquilibriumRing />}
          sensitivityRingContent={<SensitivityRing />}
          strategyRingContent={<StrategyRing />}
          snaOverlayVisible={snaOverlayVisible}
          toggleSnaOverlay={toggleSnaOverlay}
        />
      </div>
      
      {/* AI Advisor */}
      <AiAdvisorSidebar className="glass-panel p-4 mt-6" />

      {/* Footer CTA */}
      <div className="mt-8">
        <FooterCTA />
      </div>
    </AnimatedPage>
  );
};

export default ThinkPage;
