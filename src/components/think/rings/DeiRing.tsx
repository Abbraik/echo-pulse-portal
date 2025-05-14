
import React, { useState } from 'react';
import { CircleDot, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface DeiRingProps {
  data: any;
  onFocus: () => void;
}

const DeiRing: React.FC<DeiRingProps> = ({ data, onFocus }) => {
  const [activeChart, setActiveChart] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleChartClick = (chartName: string) => {
    setActiveChart(chartName);
    setIsModalOpen(true);
    onFocus();
    
    toast({
      title: `${chartName} Chart`,
      description: `Viewing detailed ${chartName.toLowerCase()} metrics and forecasts.`,
      variant: "default",
    });
  };
  
  const chartPositions = [
    { name: 'Population', position: 'top' },
    { name: 'Resources', position: 'right' },
    { name: 'Goods', position: 'bottom' },
    { name: 'Social', position: 'left' }
  ];

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
          
          {/* Equilibrium band */}
          <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(20,184,166,0.1)" strokeWidth="15" strokeDasharray="4 2" />
          
          {/* Data paths */}
          <path d="M50,50 L70,30 L80,50 L65,70 L40,65 Z" fill="rgba(20,184,166,0.3)" stroke="#14b8a6" strokeWidth="1" />
          <circle cx="70" cy="30" r="2" fill="#14b8a6" />
          <circle cx="80" cy="50" r="2" fill="#14b8a6" />
          <circle cx="65" cy="70" r="2" fill="#14b8a6" />
          <circle cx="40" cy="65" r="2" fill="#14b8a6" />
        </svg>
      </div>

      {/* Interactive charts at cardinal positions */}
      {chartPositions.map((chart) => {
        let positionClass = "";
        let transform = "";
        
        switch (chart.position) {
          case 'top':
            positionClass = "top-[15%] left-1/2 transform -translate-x-1/2";
            break;
          case 'right':
            positionClass = "top-1/2 right-[15%] transform -translate-y-1/2";
            break;
          case 'bottom':
            positionClass = "bottom-[15%] left-1/2 transform -translate-x-1/2";
            break;
          case 'left':
            positionClass = "top-1/2 left-[15%] transform -translate-y-1/2";
            break;
        }
        
        return (
          <motion.div
            key={chart.name}
            className={`absolute ${positionClass} flex flex-col items-center`}
            whileHover={{ scale: 1.1 }}
            onClick={() => handleChartClick(chart.name)}
          >
            <CircleDot size={10} className="text-teal-400 mb-1" />
            <div className="bg-navy-800/50 px-2 py-0.5 rounded-full text-[10px] backdrop-blur-sm">
              {chart.name}
            </div>
          </motion.div>
        );
      })}

      {/* Modal for expanded chart view */}
      {isModalOpen && activeChart && (
        <div 
          className="absolute inset-0 bg-navy-900/90 rounded-full flex items-center justify-center z-20"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white/10 backdrop-blur-md p-4 rounded-xl w-2/3 h-2/3 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-medium text-sm">{activeChart} Metrics</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <Eye size={16} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center border border-white/20 rounded-lg">
              {/* Here we would render a more detailed chart or visualization */}
              <div className="text-white/70 text-xs">
                Detailed {activeChart} chart would appear here
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeiRing;
