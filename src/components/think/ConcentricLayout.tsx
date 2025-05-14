
import React, { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Network } from 'lucide-react';

interface ConcentricRingProps {
  children: ReactNode;
  className?: string;
  label: string;
  ringIndex: number;
}

const ConcentricRing: React.FC<ConcentricRingProps> = ({
  children,
  className,
  label,
  ringIndex
}) => {
  const ringClasses = cn(
    "absolute rounded-full border border-white/20 flex items-center justify-center",
    className,
    {
      "bg-navy-900/30": ringIndex === 0,
      "bg-navy-800/20": ringIndex === 1,
      "bg-navy-700/10": ringIndex === 2, 
      "bg-navy-600/10": ringIndex === 3
    }
  );
  
  return (
    <div className={ringClasses}>
      {/* Ring Label */}
      <div className="absolute text-white/80 font-medium text-sm tracking-wide transform -translate-y-1/2 bg-navy-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
        {label}
      </div>
      {children}
    </div>
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
}

const ConcentricLayout: React.FC<ConcentricLayoutProps> = ({
  centralContent,
  innerRingContent,
  equilibriumRingContent,
  sensitivityRingContent,
  strategyRingContent,
  snaOverlayVisible,
  toggleSnaOverlay
}) => {
  return (
    <div className="relative w-full aspect-square max-w-[900px] max-h-[900px] mx-auto my-8">
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
          </div>
        </div>
      )}

      {/* Outer Ring - Strategy */}
      <ConcentricRing 
        label="Initial Strategy" 
        ringIndex={3}
        className="inset-0"
      >
        {strategyRingContent}
      </ConcentricRing>
      
      {/* Third Ring - Sensitivity Analysis */}
      <ConcentricRing 
        label="Sensitivity Analysis" 
        ringIndex={2}
        className="inset-[15%]"
      >
        {sensitivityRingContent}
      </ConcentricRing>
      
      {/* Second Ring - Equilibrium Solver */}
      <ConcentricRing 
        label="Equilibrium Solver" 
        ringIndex={1}
        className="inset-[30%]"
      >
        {equilibriumRingContent}
      </ConcentricRing>
      
      {/* Inner Ring - DEI & Foresight */}
      <ConcentricRing 
        label="DEI & Foresight" 
        ringIndex={0}
        className="inset-[45%]"
      >
        {innerRingContent}
      </ConcentricRing>
      
      {/* Center - CLD Map */}
      <div className="absolute inset-[60%] rounded-full bg-navy-950/80 border border-white/20 flex flex-col items-center justify-center z-10">
        {centralContent}
      </div>
    </div>
  );
};

export default ConcentricLayout;
