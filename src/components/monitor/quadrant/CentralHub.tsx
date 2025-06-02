
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DeiDrillDownModal } from '../DeiDrillDownModal';

export const CentralHub: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Mock data
  const deiData = {
    current: 78,
    inBand: 82,
    target: { min: 80, max: 85 },
    trend: [78, 79, 81, 83, 82, 82]
  };

  const sparklinePoints = deiData.trend.map((value, index) => {
    const x = 40 + (index * 20);
    const y = 120 - (value / 100) * 30;
    return `${x},${y}`;
  }).join(' ');

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="relative w-80 h-80 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            {/* Outer Circle */}
            <svg width="320" height="320" className="absolute inset-0">
              {/* Background Circle */}
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="rgba(255, 255, 255, 0.2)"
                stroke="rgba(20, 184, 166, 0.3)"
                strokeWidth="4"
                style={{ backdropFilter: 'blur(24px)' }}
              />
              
              {/* Progress Arc */}
              <motion.circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="rgba(20, 184, 166, 1)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 140}`}
                strokeDashoffset={`${2 * Math.PI * 140 * (1 - deiData.inBand / 100)}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 140}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 140 * (1 - deiData.inBand / 100)}` }}
                transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                style={{ transformOrigin: '160px 160px', transform: 'rotate(-90deg)' }}
              />
              
              {/* Sparkline Overlay */}
              <motion.polyline
                points={sparklinePoints}
                fill="none"
                stroke="rgba(20, 184, 166, 0.8)"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.div
                className="text-4xl font-bold text-teal-400 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                DEI = {deiData.current}%
              </motion.div>
              <motion.div
                className="text-lg text-gray-300 font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                {deiData.inBand}% in-band
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
          <p>DEI in-band {deiData.inBand}% (target {deiData.target.min}–{deiData.target.max}%)</p>
        </TooltipContent>
      </Tooltip>

      <DeiDrillDownModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={deiData}
      />
    </>
  );
};
