
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

interface Anomaly {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  description: string;
}

const AnomalyDetector: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const anomalies: Anomaly[] = [
    {
      id: '1',
      title: 'Water Resources Anomaly',
      severity: 'high',
      timestamp: '2025-05-17',
      description: 'Unusual spike in water consumption detected in residential zones during off-peak hours.',
    },
    {
      id: '2',
      title: 'Energy Grid Fluctuation',
      severity: 'medium',
      timestamp: '2025-05-17',
      description: 'Minor power fluctuations observed in the eastern distribution network.',
    },
    {
      id: '3',
      title: 'Traffic Pattern Shift',
      severity: 'low',
      timestamp: '2025-05-16',
      description: 'Gradual change in morning commute patterns detected over the past week.',
    },
  ];

  // Auto-cycle every 8 seconds
  useEffect(() => {
    if (anomalies.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % anomalies.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [anomalies.length]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/80';
      case 'medium': return 'bg-amber-500/80';
      case 'low': return 'bg-green-500/80';
      default: return 'bg-green-500/80';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Low';
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + anomalies.length) % anomalies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % anomalies.length);
  };

  const currentAnomaly = anomalies[currentIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const headerButtonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="h-full rounded-xl flex flex-col backdrop-blur-xl bg-slate-800/30 border border-white/10 overflow-hidden"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -1,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        borderColor: "rgba(255, 255, 255, 0.2)"
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between px-4 py-3 border-b border-white/10"
        initial={{ opacity: 0.9 }}
        whileHover={{ 
          opacity: 1,
          backgroundColor: "rgba(15, 23, 42, 0.05)"
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-2">
          {anomalies.length > 1 && (
            <>
              <motion.button 
                onClick={handlePrevious}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
                aria-label="Previous anomaly"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(20, 184, 166, 0.15)",
                  boxShadow: "0 0 15px rgba(20, 184, 166, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <ChevronLeft size={16} />
              </motion.button>
              <motion.button 
                onClick={handleNext}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
                aria-label="Next anomaly"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(20, 184, 166, 0.15)",
                  boxShadow: "0 0 15px rgba(20, 184, 166, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <ChevronRight size={16} />
              </motion.button>
            </>
          )}
        </div>
        <motion.h3 
          className="text-lg font-semibold text-white flex-1 text-center"
          whileHover={{ 
            scale: 1.02,
            textShadow: "0 0 10px rgba(255, 255, 255, 0.3)"
          }}
          transition={{ duration: 0.2 }}
        >
          Anomaly Detector
        </motion.h3>
        <motion.div 
          className="flex items-center space-x-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {['⋮', '—', '⛶'].map((symbol, index) => (
            <motion.button 
              key={symbol}
              variants={headerButtonVariants}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 1)"
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <span className="text-sm">{symbol}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Carousel Body */}
      <div className="flex-1 p-4 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAnomaly.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ 
              duration: 0.4,
              ease: "easeInOut"
            }}
            className="w-full p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 relative"
            whileHover={{
              scale: 1.01,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.2)"
            }}
            transition={{ duration: 0.2 }}
            role="region"
            aria-labelledby="anomaly-heading"
          >
            {/* Severity Icon */}
            <motion.div 
              className="absolute top-3 right-3"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AlertTriangle 
                size={20} 
                className={`${
                  currentAnomaly.severity === 'high' ? 'text-red-400' :
                  currentAnomaly.severity === 'medium' ? 'text-amber-400' : 'text-green-400'
                }`}
              />
            </motion.div>

            {/* Title and Severity */}
            <div className="flex items-start justify-between mb-3">
              <motion.h4 
                id="anomaly-heading"
                className="font-semibold text-white text-base pr-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {currentAnomaly.title}
              </motion.h4>
              <motion.span 
                className={`px-2 py-1 rounded-full font-medium text-white text-xs ${getSeverityColor(currentAnomaly.severity)}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
                }}
              >
                {getSeverityLabel(currentAnomaly.severity)}
              </motion.span>
            </div>

            {/* Timestamp */}
            <motion.p 
              className="text-slate-400 text-xs mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {currentAnomaly.timestamp}
            </motion.p>

            {/* Description */}
            <motion.p 
              className="text-slate-300 text-xs leading-relaxed mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {currentAnomaly.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              className="flex space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <motion.button
                className="flex-1 px-3 py-2 rounded-lg font-medium text-slate-900 text-xs bg-teal-500 transition-all duration-200"
                aria-label="Investigate Anomaly"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(20, 184, 166, 1)",
                  boxShadow: "0 2px 8px rgba(20, 184, 166, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                Investigate ▶
              </motion.button>
              <motion.button
                className="flex-1 px-3 py-2 rounded-lg font-medium text-slate-900 text-xs bg-blue-500 transition-all duration-200"
                aria-label="Trigger Playbook"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(59, 130, 246, 1)",
                  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                Trigger Playbook ▶
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        {anomalies.length > 1 && (
          <motion.div 
            className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {anomalies.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-teal-400' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to anomaly ${index + 1}`}
                whileHover={{ 
                  scale: 1.2,
                  backgroundColor: index === currentIndex ? "rgba(20, 184, 166, 1)" : "rgba(255, 255, 255, 0.7)"
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AnomalyDetector;
