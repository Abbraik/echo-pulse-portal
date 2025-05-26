
import React from 'react';
import { Play } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

export const SystemRedesignOverview: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div 
      className="h-full w-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="text-center space-y-8 max-w-md">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            System Redesign
          </h1>
          <p className="text-base text-muted-foreground">
            Select a lesson, concept, or scenario to begin
          </p>
        </div>

        {/* DEI Gauge */}
        <div className="relative">
          <div className="w-48 h-48 mx-auto relative">
            {/* Outer ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              
              {/* Target range band (65-80) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(20, 184, 166, 0.3)"
                strokeWidth="8"
                strokeDasharray="94 157"
                strokeDashoffset="-47"
                className="animate-pulse-subtle"
              />
              
              {/* Current value (72) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray="180 70"
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
              
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">72</div>
                <div className="text-xs text-muted-foreground">DEI Index</div>
                <div className="text-xs text-green-400 mt-1">Target: 65-80</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Hint */}
        <motion.div 
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Play size={16} className="text-teal-400" />
          <span>Click any item on the left to open the Working Canvas</span>
        </motion.div>
      </div>
    </motion.div>
  );
};
