import React from 'react';
import { motion } from 'framer-motion';

interface PulseBarProps {
  onFilterClick: (filter: string) => void;
}

export const PulseBar: React.FC<PulseBarProps> = ({ onFilterClick }) => {
  const pulseMetrics = [
    { 
      emoji: '😱', 
      label: 'Loops in Distress', 
      count: 3, 
      filter: 'distress',
      color: 'text-red-400' 
    },
    { 
      emoji: '📅', 
      label: 'Sprints Due', 
      count: 7, 
      filter: 'sprints',
      color: 'text-yellow-400' 
    },
    { 
      emoji: '👥', 
      label: 'Juror Approvals', 
      count: 12, 
      filter: 'approvals',
      color: 'text-green-400' 
    },
  ];

  return (
    <motion.div 
      className="w-full bg-secondary/40 backdrop-blur-md border-b border-white/10 px-6 py-2"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-center space-x-8">
        {pulseMetrics.map((metric, index) => (
          <motion.button
            key={metric.filter}
            onClick={() => onFilterClick(metric.filter)}
            className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 
                       hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <span className="text-lg" role="img" aria-label={metric.label}>
              {metric.emoji}
            </span>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {metric.label}:
            </span>
            <motion.span 
              className={`text-sm font-semibold ${metric.color}`}
              animate={{ 
                scale: [1, 1.1, 1],
                color: ["currentColor", "#ffffff", "currentColor"] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {metric.count}
            </motion.span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};