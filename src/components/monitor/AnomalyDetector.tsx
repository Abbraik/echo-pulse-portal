
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Minimize2, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface AnomalyDetectorProps {
  onFullscreen: () => void;
}

const AnomalyDetector: React.FC<AnomalyDetectorProps> = ({ onFullscreen }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const anomalies = [
    {
      title: 'Water Resources Anomaly',
      severity: 'High',
      timestamp: '2025-05-17',
      description: 'Unexpected drop in water availability across agricultural regions affecting crop yield projections.',
      severityColor: '#FF6E6E'
    },
    {
      title: 'Social Trust Decline',
      severity: 'Medium',
      timestamp: '2025-05-16',
      description: 'Significant decrease in social trust metrics following recent policy changes in northern Emirates.',
      severityColor: '#FFC107'
    },
    {
      title: 'Economic Activity Spike',
      severity: 'Low',
      timestamp: '2025-05-15',
      description: 'Unusual surge in economic activity in coastal regions - potentially positive indicator requiring monitoring.',
      severityColor: '#00FFC3'
    },
  ];

  const nextAnomaly = () => {
    setCurrentIndex((prev) => (prev + 1) % anomalies.length);
  };

  const prevAnomaly = () => {
    setCurrentIndex((prev) => (prev - 1 + anomalies.length) % anomalies.length);
  };

  // Auto-cycle every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextAnomaly();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevAnomaly();
      } else if (e.key === 'ArrowRight') {
        nextAnomaly();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentAnomaly = anomalies[currentIndex];

  return (
    <div
      className="w-full h-80 rounded-3xl relative overflow-hidden"
      style={{
        background: 'rgba(10, 20, 40, 0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 255, 195, 0.15)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Outer Layer */}
      <div
        className="absolute inset-0.5 rounded-3xl"
        style={{
          background: 'rgba(20, 30, 50, 0.6)',
          backdropFilter: 'blur(32px)',
        }}
      >
        {/* Header */}
        <div
          className="h-8 flex items-center justify-between px-4"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
          }}
        >
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={prevAnomaly}
              className="text-teal-400 hover:text-teal-300"
              whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 8px #00FFC3)' }}
              aria-label="Previous anomaly"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <h2
              style={{
                fontFamily: 'Noto Sans',
                fontWeight: 700,
                fontSize: '16px',
                color: '#FFFFFF',
              }}
            >
              Anomaly Detector
            </h2>
            <motion.button
              onClick={nextAnomaly}
              className="text-teal-400 hover:text-teal-300"
              whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 8px #00FFC3)' }}
              aria-label="Next anomaly"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              className="text-white opacity-50 hover:opacity-100"
              whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
            >
              <MoreVertical size={16} />
            </motion.button>
            <motion.button
              className="text-white opacity-50 hover:opacity-100"
              whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
            >
              <Minimize2 size={16} />
            </motion.button>
            <motion.button
              className="text-white opacity-50 hover:opacity-100"
              whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
              onClick={onFullscreen}
            >
              <Maximize2 size={16} />
            </motion.button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="p-4 h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="w-full h-40 p-4 rounded-3xl relative"
              style={{
                background: 'rgba(20, 30, 50, 0.4)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
              }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              role="region"
              aria-labelledby="anomaly-title"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <h3
                  id="anomaly-title"
                  style={{
                    fontFamily: 'Noto Sans',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#00FFC3',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {currentAnomaly.title}
                </h3>
                <span
                  className="px-2 py-1 rounded text-xs font-semibold text-white"
                  style={{
                    background: currentAnomaly.severityColor,
                  }}
                >
                  {currentAnomaly.severity}
                </span>
              </div>

              {/* Timestamp */}
              <p
                className="mb-3"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '10px',
                  color: '#E0E0E0',
                }}
              >
                {currentAnomaly.timestamp}
              </p>

              {/* Description */}
              <p
                className="mb-4 leading-relaxed"
                style={{
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                  color: '#E0E0E0',
                  lineHeight: '1.5',
                }}
              >
                {currentAnomaly.description}
              </p>

              {/* Action Buttons */}
              <div className="absolute bottom-4 left-4 right-4 flex space-x-3">
                <motion.button
                  className="flex-1 py-2 px-4 rounded-lg text-center font-medium text-sm"
                  style={{
                    background: '#00FFC3',
                    color: '#081226',
                    boxShadow: '0 4px 8px rgba(0, 255, 195, 0.4)',
                    fontFamily: 'Noto Sans',
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(0, 255, 195, 0.9)',
                    boxShadow: '0 6px 12px rgba(0, 255, 195, 0.6)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Investigate Anomaly"
                >
                  Investigate ▶
                </motion.button>
                <motion.button
                  className="flex-1 py-2 px-4 rounded-lg text-center font-medium text-sm"
                  style={{
                    background: '#00B8FF',
                    color: '#081226',
                    boxShadow: '0 4px 8px rgba(0, 184, 255, 0.4)',
                    fontFamily: 'Noto Sans',
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(0, 184, 255, 0.9)',
                    boxShadow: '0 6px 12px rgba(0, 184, 255, 0.6)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Trigger Playbook"
                >
                  Trigger Playbook ▶
                </motion.button>
              </div>

              {/* Carousel Navigation Arrows */}
              <motion.button
                onClick={prevAnomaly}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-teal-400/20 flex items-center justify-center"
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: 'rgba(0, 255, 195, 0.4)',
                  filter: 'drop-shadow(0 0 8px #00FFC3)' 
                }}
                aria-label="Previous anomaly"
              >
                <ChevronLeft size={12} className="text-teal-400" />
              </motion.button>
              <motion.button
                onClick={nextAnomaly}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-teal-400/20 flex items-center justify-center"
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: 'rgba(0, 255, 195, 0.4)',
                  filter: 'drop-shadow(0 0 8px #00FFC3)' 
                }}
                aria-label="Next anomaly"
              >
                <ChevronRight size={12} className="text-teal-400" />
              </motion.button>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-2 mt-4">
            {anomalies.map((_, index) => (
              <motion.button
                key={index}
                className="w-2 h-2 rounded-full"
                style={{
                  background: index === currentIndex ? '#00FFC3' : 'rgba(255, 255, 255, 0.3)',
                }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetector;
