
import React, { useState, ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Network, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SNAData } from './types/sna-types';

interface ConcentricRingProps {
  children: ReactNode;
  className?: string;
  label: string;
  ringIndex: number;
  isVisible: boolean;
  isFocused: boolean;
  onFocus: () => void;
  animateDelay?: number;
}

const ConcentricRing: React.FC<ConcentricRingProps> = ({
  children,
  className,
  label,
  ringIndex,
  isVisible,
  isFocused,
  onFocus,
  animateDelay = 0
}) => {
  const baseRingClasses = "absolute rounded-full border border-white/20 flex items-center justify-center transition-all duration-500";
  
  const ringClasses = cn(
    baseRingClasses,
    className,
    {
      "bg-navy-900/30": ringIndex === 0,
      "bg-navy-800/20": ringIndex === 1,
      "bg-navy-700/10": ringIndex === 2, 
      "bg-navy-600/10": ringIndex === 3,
      "opacity-100": isVisible,
      "opacity-0": !isVisible,
      "z-20 scale-110 border-teal-500/50": isFocused,
    }
  );
  
  return (
    <motion.div 
      className={ringClasses}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.3, 
        scale: isFocused ? 1.1 : 1,
        zIndex: isFocused ? 20 : 10 + ringIndex
      }}
      transition={{ 
        duration: 0.6, 
        delay: animateDelay,
        type: "spring",
        stiffness: 100
      }}
      onClick={() => onFocus()}
      whileHover={{ 
        scale: isFocused ? 1.1 : 1.03,
        transition: { duration: 0.2 }
      }}
    >
      {/* Ring Label */}
      <div className="absolute text-white/80 font-medium text-sm tracking-wide transform -translate-y-1/2 bg-navy-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
        {label}
      </div>
      {children}
    </motion.div>
  );
};

interface ConcentricLayoutProps {
  children?: ReactNode;
  centralContent: ReactNode;
  innerRingContent: ReactNode;
  equilibriumRingContent: ReactNode;
  sensitivityRingContent: ReactNode;
  strategyRingContent: ReactNode;
  snaOverlayVisible: boolean;
  toggleSnaOverlay: () => void;
  focusedRing: string | null;
  onResetFocus: () => void;
  snaData: SNAData;
}

const ConcentricLayout: React.FC<ConcentricLayoutProps> = ({
  centralContent,
  innerRingContent,
  equilibriumRingContent,
  sensitivityRingContent,
  strategyRingContent,
  snaOverlayVisible,
  toggleSnaOverlay,
  focusedRing,
  onResetFocus,
  snaData
}) => {
  // Progressive disclosure - tracks which rings are visible
  const [visibleRings, setVisibleRings] = useState({
    dei: true,
    equilibrium: false,
    sensitivity: false,
    strategy: false
  });
  const [zoom, setZoom] = useState(1);
  const [hovering, setHovering] = useState(false);

  // Handle progressive disclosure based on hover and zoom
  useEffect(() => {
    if (hovering || zoom > 1) {
      // Show more rings when hovering or zoomed in
      setVisibleRings({
        dei: true,
        equilibrium: true,
        sensitivity: true,
        strategy: true
      });
    } else {
      // When not hovering, show fewer rings
      setVisibleRings({
        dei: true,
        equilibrium: true,
        sensitivity: zoom >= 0.8,
        strategy: zoom >= 0.9
      });
    }
  }, [hovering, zoom]);

  const zoomIn = () => {
    if (zoom < 1.5) setZoom(prev => prev + 0.1);
  };

  const zoomOut = () => {
    if (zoom > 0.7) setZoom(prev => prev - 0.1);
  };

  return (
    <div 
      className="relative w-full aspect-square max-w-[900px] max-h-[900px] mx-auto my-8"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{ transform: `scale(${zoom})` }}
    >
      {/* Zoom Controls */}
      <div className="absolute top-0 left-0 z-50 flex flex-col gap-2 m-2">
        <button 
          className="w-8 h-8 rounded-full bg-navy-800/80 text-white/80 flex items-center justify-center hover:bg-teal-500/70 transition-colors"
          onClick={zoomIn}
        >
          <ZoomIn size={16} />
        </button>
        <button 
          className="w-8 h-8 rounded-full bg-navy-800/80 text-white/80 flex items-center justify-center hover:bg-teal-500/70 transition-colors"
          onClick={zoomOut}
        >
          <ZoomOut size={16} />
        </button>
        <button 
          className="w-8 h-8 rounded-full bg-navy-800/80 text-white/80 flex items-center justify-center hover:bg-teal-500/70 transition-colors"
          onClick={onResetFocus}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      
      {/* SNA Overlay Toggle */}
      <button 
        className={`absolute top-0 right-0 z-50 flex items-center gap-2 px-3 py-2 rounded-full ${
          snaOverlayVisible 
            ? 'bg-teal-500 text-white' 
            : 'bg-white/10 text-gray-300'
        } transition-all duration-300`}
        onClick={toggleSnaOverlay}
      >
        <Network size={16} />
        <span className="text-sm font-medium">SNA Overlay</span>
      </button>
      
      {/* SNA Overlay - conditionally visible */}
      {snaOverlayVisible && (
        <div className="absolute inset-0 z-40 bg-navy-900/80 rounded-full border-2 border-teal-500/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-bold text-teal-400">SNA Overlay</h3>
            <p className="text-sm text-white/70">Network analysis visualization</p>
            
            {/* SNA visualization would go here */}
            <div className="absolute inset-0 rounded-full">
              {/* Nodes */}
              {snaData.nodes.map((node, index) => {
                // Calculate position in a spiral pattern
                const angle = (index / snaData.nodes.length) * Math.PI * 6;
                const radius = 40 + (index * 5);
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                
                return (
                  <div 
                    key={node.id}
                    className="absolute w-3 h-3 rounded-full bg-white/80"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      backgroundColor: node.color || '#14b8a6',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                );
              })}
              
              {/* We would render edges here if we had an SVG overlay */}
            </div>
          </div>
        </div>
      )}

      {/* Outer Ring - Strategy */}
      <ConcentricRing 
        label="Initial Strategy" 
        ringIndex={3}
        className="inset-0"
        isVisible={visibleRings.strategy}
        isFocused={focusedRing === 'Initial Strategy'}
        onFocus={() => !focusedRing ? setVisibleRings({...visibleRings, strategy: true}) : null}
        animateDelay={0.3}
      >
        {strategyRingContent}
      </ConcentricRing>
      
      {/* Third Ring - Sensitivity Analysis */}
      <ConcentricRing 
        label="Sensitivity Analysis" 
        ringIndex={2}
        className="inset-[15%]"
        isVisible={visibleRings.sensitivity}
        isFocused={focusedRing === 'Sensitivity Analysis'}
        onFocus={() => !focusedRing ? setVisibleRings({...visibleRings, sensitivity: true}) : null}
        animateDelay={0.2}
      >
        {sensitivityRingContent}
      </ConcentricRing>
      
      {/* Second Ring - Equilibrium Solver */}
      <ConcentricRing 
        label="Equilibrium Solver" 
        ringIndex={1}
        className="inset-[30%]"
        isVisible={visibleRings.equilibrium}
        isFocused={focusedRing === 'Equilibrium Solver'}
        onFocus={() => !focusedRing ? setVisibleRings({...visibleRings, equilibrium: true}) : null}
        animateDelay={0.1}
      >
        {equilibriumRingContent}
      </ConcentricRing>
      
      {/* Inner Ring - DEI & Foresight */}
      <ConcentricRing 
        label="DEI & Foresight" 
        ringIndex={0}
        className="inset-[45%]"
        isVisible={visibleRings.dei}
        isFocused={focusedRing === 'DEI & Foresight'}
        onFocus={() => !focusedRing ? setVisibleRings({...visibleRings, dei: true}) : null}
        animateDelay={0}
      >
        {innerRingContent}
      </ConcentricRing>
      
      {/* Center - CLD Map */}
      <motion.div 
        className={cn(
          "absolute inset-[60%] rounded-full bg-navy-950/80 border border-white/20 flex flex-col items-center justify-center",
          focusedRing === null ? "z-30" : "z-10"
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {centralContent}
      </motion.div>
      
      {/* Reset focus button - only appears when a ring is focused */}
      <AnimatePresence>
        {focusedRing && (
          <motion.button
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-teal-500/80 hover:bg-teal-500 rounded-full text-white font-medium flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={onResetFocus}
          >
            <RotateCcw size={16} />
            Reset View
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConcentricLayout;
