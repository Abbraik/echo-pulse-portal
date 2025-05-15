
import React from 'react';
import { motion } from 'framer-motion';
import { Gauge as GaugeIcon } from 'lucide-react';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'teal' | 'blue' | 'amber' | 'purple' | 'emerald' | 'gold' | 'rose';
  showValue?: boolean;
}

const Gauge: React.FC<GaugeProps> = ({ 
  value, 
  min = 0, 
  max = 100, 
  label, 
  size = 'md',
  color = 'teal',
  showValue = false
}) => {
  // Normalize value between 0 and 1
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const percentage = Math.round(normalizedValue * 100);
  
  // Calculate rotation angle for needle (from -90 to 90 degrees)
  const rotation = (normalizedValue * 180) - 90;
  
  const sizeClasses = {
    sm: {
      container: 'w-24 h-24',
      needle: 'w-0.5 h-8',
      icon: 16,
      centerCircle: 'w-10 h-10',
      valueText: 'text-xl',
    },
    md: {
      container: 'w-32 h-32',
      needle: 'w-1 h-12',
      icon: 24,
      centerCircle: 'w-16 h-16',
      valueText: 'text-2xl',
    },
    lg: {
      container: 'w-40 h-40',
      needle: 'w-1.5 h-16',
      icon: 28,
      centerCircle: 'w-20 h-20',
      valueText: 'text-3xl',
    },
    xl: {
      container: 'w-48 h-48',
      needle: 'w-2 h-20',
      icon: 32,
      centerCircle: 'w-24 h-24',
      valueText: 'text-4xl',
    },
  };
  
  const colorClasses = {
    teal: {
      fill: 'from-teal-500 to-teal-300',
      text: 'text-teal-400',
      icon: 'text-teal-400',
    },
    blue: {
      fill: 'from-blue-500 to-blue-300',
      text: 'text-blue-400',
      icon: 'text-blue-400',
    },
    amber: {
      fill: 'from-amber-500 to-amber-300',
      text: 'text-amber-400',
      icon: 'text-amber-400',
    },
    gold: {
      fill: 'from-amber-500 to-amber-300',
      text: 'text-amber-400',
      icon: 'text-amber-400',
    },
    rose: {
      fill: 'from-rose-500 to-rose-300',
      text: 'text-rose-400',
      icon: 'text-rose-400',
    },
    purple: {
      fill: 'from-purple-500 to-purple-300',
      text: 'text-purple-400',
      icon: 'text-purple-400',
    },
    emerald: {
      fill: 'from-emerald-500 to-emerald-300',
      text: 'text-emerald-400',
      icon: 'text-emerald-400',
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size].container}`}>
        {/* Gauge background */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-700/30"></div>
        
        {/* Gauge fill */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <motion.div 
            initial={{ height: '0%' }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colorClasses[color].fill}`}
          ></motion.div>
        </div>
        
        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${sizeClasses[size].centerCircle} rounded-full bg-navy-800/80 flex items-center justify-center backdrop-blur`}>
            <GaugeIcon className={colorClasses[color].icon} size={sizeClasses[size].icon} />
          </div>
        </div>
        
        {/* Gauge needle */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1, type: "spring", stiffness: 60, damping: 15 }}
        >
          <div 
            className={`${sizeClasses[size].needle} bg-gradient-to-b from-white to-gray-300 rounded origin-bottom transform -translate-y-1/2`}
          ></div>
        </motion.div>
        
        {/* Gauge value indicator */}
        {showValue && (
          <div className="absolute -bottom-2 inset-x-0 text-center">
            <motion.span 
              className={`${sizeClasses[size].valueText} font-bold text-white`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {value}
            </motion.span>
            <span className="text-xs text-gray-400">/{max}</span>
          </div>
        )}
      </div>
      
      {label && (
        <span className={`mt-2 font-medium ${colorClasses[color].text}`}>{label}</span>
      )}
    </div>
  );
};

export default Gauge;
