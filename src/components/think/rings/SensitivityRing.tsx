
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface SensitivityParameter {
  parameter: string;
  impact: number;
  direction: 'positive' | 'negative';
}

interface SensitivityRingProps {
  data: {
    parameters: SensitivityParameter[];
  };
  onFocus: () => void;
}

const SensitivityRing: React.FC<SensitivityRingProps> = ({ data, onFocus }) => {
  const [hoveredParameter, setHoveredParameter] = useState<SensitivityParameter | null>(null);
  
  const handleParameterHover = (parameter: SensitivityParameter) => {
    setHoveredParameter(parameter);
  };
  
  const handleParameterClick = (parameter: SensitivityParameter) => {
    onFocus();
    
    toast({
      title: parameter.parameter,
      description: `Impact: ${parameter.impact}% (${parameter.direction === 'positive' ? 'positive' : 'negative'})`,
      variant: "default",
    });
  };
  
  // Mock sensitivity data
  const sensitivityData = [
    { parameter: "Water Tariff", impact: 34, direction: 'positive' as const },
    { parameter: "Migration Policy", impact: 28, direction: 'negative' as const },
    { parameter: "Educational Investment", impact: 25, direction: 'positive' as const },
    { parameter: "Energy Subsidies", impact: 22, direction: 'negative' as const },
    { parameter: "Healthcare Access", impact: 20, direction: 'positive' as const },
    { parameter: "Housing Density", impact: 18, direction: 'negative' as const },
    { parameter: "Carbon Tax", impact: 16, direction: 'positive' as const },
    { parameter: "Food Imports", impact: 15, direction: 'negative' as const },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Tornado chart visualization around the ring */}
      <div className="w-5/6 h-5/6 relative">
        {sensitivityData.map((item, index) => {
          // Position the bars around the circle
          const angle = (index / sensitivityData.length) * 360;
          const radians = (angle - 90) * (Math.PI / 180);
          const radius = 45; // percentage from center
          const centerX = 50;
          const centerY = 50;
          const x = centerX + radius * Math.cos(radians);
          const y = centerY + radius * Math.sin(radians);
          
          // Scale impact into bar width
          const barWidth = item.impact / 2; // scale factor
          const isHovered = hoveredParameter?.parameter === item.parameter;
          
          return (
            <motion.div 
              key={item.parameter}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${y}%`,
                left: `${x}%`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
              onMouseEnter={() => handleParameterHover(item)}
              onMouseLeave={() => setHoveredParameter(null)}
              onClick={() => handleParameterClick(item)}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className={`h-2 rounded-full ${item.direction === 'positive' ? 'bg-teal-500/50' : 'bg-orange-500/50'}`}
                style={{ width: `${barWidth}px` }}
                animate={{ 
                  width: isHovered ? `${barWidth * 1.2}px` : `${barWidth}px`,
                  opacity: isHovered ? 1 : 0.7
                }}
              />
            </motion.div>
          );
        })}
      </div>
      
      {/* Parameter info popover */}
      <AnimatePresence>
        {hoveredParameter && (
          <motion.div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-2 z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="text-center">
              <div className="text-xs font-medium text-white">{hoveredParameter.parameter}</div>
              <div className={`text-[10px] ${hoveredParameter.direction === 'positive' ? 'text-teal-400' : 'text-orange-400'}`}>
                {hoveredParameter.impact}% impact ({hoveredParameter.direction === 'positive' ? '+' : '-'})
              </div>
            </div>
            
            {/* Sparkline representation */}
            <div className="flex items-end h-4 mt-1 justify-center space-x-0.5">
              {[0.3, 0.5, 0.4, 0.6, 0.7, 0.9, 0.8].map((value, i) => (
                <div 
                  key={i}
                  className={`w-[2px] ${hoveredParameter.direction === 'positive' ? 'bg-teal-500' : 'bg-orange-500'}`}
                  style={{ height: `${value * 100}%` }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SensitivityRing;
