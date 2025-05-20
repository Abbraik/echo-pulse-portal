
import React from 'react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LeveragePoint {
  id: number;
  title: string;
  rationale: string;
  relevance: number; // 0-100
}

interface LeveragePointPillProps {
  leveragePoint: LeveragePoint;
  isSelected: boolean;
  onClick: () => void;
}

const LeveragePointPill: React.FC<LeveragePointPillProps> = ({ 
  leveragePoint, 
  isSelected, 
  onClick 
}) => {
  // Get appropriate color based on leverage point level
  const getColorClass = () => {
    // Lower numbers in Meadows' leverage points are more powerful
    if (leveragePoint.id <= 3) {
      return isSelected 
        ? 'bg-purple-500/40 border-purple-500/80 text-purple-300' 
        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10';
    } else if (leveragePoint.id <= 6) {
      return isSelected 
        ? 'bg-teal-500/40 border-teal-500/80 text-teal-300' 
        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10';
    } else {
      return isSelected 
        ? 'bg-blue-500/40 border-blue-500/80 text-blue-300' 
        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            className={`px-2 py-1 rounded-full text-xs border ${getColorClass()} transition-colors`}
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
            animate={isSelected ? { 
              scale: [1, 1.05, 1],
              transition: { 
                duration: 0.5, 
                repeat: 0, 
                ease: "easeInOut" 
              }
            } : {}}
          >
            #{leveragePoint.id} {leveragePoint.title}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs max-w-[200px]">{leveragePoint.rationale}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LeveragePointPill;
