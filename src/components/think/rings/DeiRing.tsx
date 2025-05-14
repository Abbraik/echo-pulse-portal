
import React from 'react';
import { CircleDot } from 'lucide-react';

const DeiRing: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Simplified radial chart representation */}
      <div className="relative w-2/3 h-2/3">
        {/* Chart lines */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <path d="M50,10 L50,90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <path d="M10,50 L90,50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <path d="M25,25 L75,75" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <path d="M75,25 L25,75" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          
          {/* Data paths */}
          <path d="M50,50 L70,30 L80,50 L65,70 L40,65 Z" fill="rgba(20,184,166,0.3)" stroke="#14b8a6" strokeWidth="1" />
          <circle cx="70" cy="30" r="2" fill="#14b8a6" />
          <circle cx="80" cy="50" r="2" fill="#14b8a6" />
          <circle cx="65" cy="70" r="2" fill="#14b8a6" />
          <circle cx="40" cy="65" r="2" fill="#14b8a6" />
        </svg>
      </div>

      {/* Indicator dots at cardinal positions */}
      <CircleDot size={8} className="absolute top-[15%] left-1/2 transform -translate-x-1/2 text-teal-400" />
      <CircleDot size={8} className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 text-teal-400" />
      <CircleDot size={8} className="absolute top-1/2 left-[15%] transform -translate-y-1/2 text-teal-400" />
      <CircleDot size={8} className="absolute top-1/2 right-[15%] transform -translate-y-1/2 text-teal-400" />
    </div>
  );
};

export default DeiRing;
