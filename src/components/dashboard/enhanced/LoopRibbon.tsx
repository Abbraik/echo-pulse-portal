
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const LoopRibbon: React.FC = () => {
  const loops = ['THINK', 'ACT', 'MONITOR', 'LEARN', 'INNOVATE'];
  
  const getLoopColor = (loop: string) => {
    switch (loop) {
      case 'THINK': return 'text-teal-400';
      case 'ACT': return 'text-blue-400';
      case 'MONITOR': return 'text-purple-400';
      case 'LEARN': return 'text-orange-400';
      case 'INNOVATE': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center space-x-4 py-3 px-6 rounded-full"
        style={{ 
          background: 'rgba(10, 20, 40, 0.4)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(20, 184, 166, 0.2)',
        }}
      >
        {loops.map((loop, index) => (
          <React.Fragment key={loop}>
            <motion.div
              className={`font-semibold text-sm ${getLoopColor(loop)}`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {loop}
            </motion.div>
            {index < loops.length - 1 && (
              <ArrowRight size={14} className="text-gray-500" />
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
