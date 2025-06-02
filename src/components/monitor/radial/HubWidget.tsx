
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DeiDrillDownModal } from '../DeiDrillDownModal';

export const HubWidget: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Mock data
  const deiStability = {
    current: 82,
    target: { min: 80, max: 85 },
    trend: [78, 79, 81, 83, 82, 82]
  };

  const sparklinePoints = deiStability.trend.map((value, index) => {
    const x = 20 + (index * 30);
    const y = 160 - (value / 100) * 40;
    return `${x},${y}`;
  }).join(' ');

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="relative w-48 h-48 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
          >
            {/* Outer Ring */}
            <svg width="192" height="192" className="absolute inset-0">
              {/* Background Circle */}
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="rgba(255, 255, 255, 0.1)"
                stroke="rgba(20, 184, 166, 0.3)"
                strokeWidth="2"
              />
              
              {/* Progress Arc */}
              <motion.circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="rgba(20, 184, 166, 1)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - deiStability.current / 100)}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 80}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 80 * (1 - deiStability.current / 100)}` }}
                transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                style={{ transformOrigin: '96px 96px', transform: 'rotate(-90deg)' }}
              />
              
              {/* Sparkline Overlay */}
              <motion.polyline
                points={sparklinePoints}
                fill="none"
                stroke="rgba(20, 184, 166, 0.8)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.div
                className="text-2xl font-bold text-teal-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                {deiStability.current}%
              </motion.div>
              <motion.div
                className="text-sm text-gray-300 font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                DEI Stability
              </motion.div>
              <motion.div
                className="text-xs text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                in-band
              </motion.div>
            </div>

            {/* Hover Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 70%)',
                opacity: 0
              }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>DEI in-band {deiStability.current}% of time (target {deiStability.target.min}–{deiStability.target.max}%)</p>
        </TooltipContent>
      </Tooltip>

      <DeiDrillDownModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={deiStability}
      />
    </>
  );
};
