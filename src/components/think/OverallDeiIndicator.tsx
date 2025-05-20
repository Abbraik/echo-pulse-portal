
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import DeiCompositeModal from './DeiCompositeModal';

interface OverallDeiIndicatorProps {
  value: number;
  minBand: number;
  maxBand: number;
  pillars?: any;
  equilibriumBands?: any;
}

const OverallDeiIndicator: React.FC<OverallDeiIndicatorProps> = ({
  value,
  minBand,
  maxBand,
  pillars,
  equilibriumBands
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  
  const isInEquilibrium = value >= minBand && value <= maxBand;
  const isPulsing = !isInEquilibrium;
  
  // Calculate color based on value relative to bands
  const getColor = () => {
    if (value < minBand) return 'from-red-500 to-orange-500';
    if (value > maxBand) return 'from-yellow-400 to-amber-500';
    return 'from-teal-400 to-blue-500';
  };
  
  // Calculate deviation from equilibrium band
  const getDeviation = () => {
    if (value < minBand) return minBand - value;
    if (value > maxBand) return value - maxBand;
    return 0;
  };
  
  const deviation = getDeviation();
  const deviationText = deviation === 0 
    ? t("inEquilibrium") 
    : value < minBand 
      ? `${deviation} ${t("pointsBelow")}`
      : `${deviation} ${t("pointsAbove")}`;

  // Create default empty structures for pillars and equilibriumBands if they're not provided
  const defaultPillars = {
    population: { value: 0, subIndicators: [] },
    resources: { value: 0, subIndicators: [] },
    goods: { value: 0, subIndicators: [] },
    social: { value: 0, subIndicators: [] }
  };

  const defaultEquilibriumBands = {
    population: { min: 0, max: 0 },
    resources: { min: 0, max: 0 },
    goods: { min: 0, max: 0 },
    social: { min: 0, max: 0 }
  };
  
  return (
    <div className="flex flex-col items-center">
      <motion.button
        className="relative outline-none focus:ring-2 focus:ring-teal-500/50 focus-visible:ring-2 focus-visible:ring-teal-500/50 rounded-full"
        onClick={() => setModalOpen(true)}
        aria-label={t("expandDeiIndicator")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Outer ring - represents the equilibrium band */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-400/20 dark:border-gray-600/20" />
        
        {/* Equilibrium band visualization */}
        <svg width="200" height="200" viewBox="0 0 100 100" className="relative z-10">
          <defs>
            <linearGradient id="bandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(45, 212, 191, 0.2)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
            </linearGradient>
          </defs>
          
          {/* Equilibrium band arc */}
          <path
            d={`M 50,50 L 50,5 A 45,45 0 ${(maxBand - minBand) / 100 * Math.PI > Math.PI ? 1 : 0},1 ${
              50 + 45 * Math.sin((maxBand - minBand) / 100 * 2 * Math.PI)
            },${
              50 - 45 * Math.cos((maxBand - minBand) / 100 * 2 * Math.PI)
            } Z`}
            fill="url(#bandGradient)"
            transform={`rotate(${minBand / 100 * 360}, 50, 50)`}
          />
        </svg>
        
        {/* Inner orb - the DEI indicator */}
        <motion.div 
          className={`absolute inset-2 rounded-full bg-gradient-to-br ${getColor()} 
            flex items-center justify-center text-white shadow-lg shadow-teal-500/20 glass-glow`}
          animate={{ 
            scale: isPulsing ? [1, 1.05, 1] : 1 
          }}
          transition={{ 
            repeat: isPulsing ? Infinity : 0, 
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <div className="text-center">
            <span className="text-4xl font-bold">{value}</span>
            <span className="text-xl">%</span>
            <div className="text-sm mt-1">DEI</div>
          </div>
        </motion.div>
      </motion.button>
      
      {/* Status indicator */}
      <div className={`mt-4 px-3 py-1 rounded-full text-sm flex items-center gap-1
        ${isInEquilibrium 
          ? 'bg-teal-500/20 text-teal-400' 
          : value < minBand 
            ? 'bg-red-500/20 text-red-400' 
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
        {isInEquilibrium ? (
          <span>{t("inEquilibrium")}</span>
        ) : (
          <>
            {value < minBand ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
            <span>{deviationText}</span>
          </>
        )}
      </div>
      
      {/* Premium DEI Modal */}
      <DeiCompositeModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        deiValue={value}
        minBand={minBand}
        maxBand={maxBand}
        pillars={pillars || defaultPillars}
        equilibriumBands={equilibriumBands || defaultEquilibriumBands}
      />
    </div>
  );
};

export default OverallDeiIndicator;
