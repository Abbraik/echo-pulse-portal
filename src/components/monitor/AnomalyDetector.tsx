
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      case 'high': return '#FF6E6E';
      case 'medium': return '#FFC107';
      case 'low': return '#00FFC3';
      default: return '#00FFC3';
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

  return (
    <div 
      className="h-full rounded-3xl flex flex-col"
      style={{
        background: 'rgba(10,20,40,0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,255,195,0.15)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* Header */}
      <div 
        className="h-8 flex items-center justify-between px-4 rounded-t-3xl flex-shrink-0"
        style={{
          background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
        }}
      >
        <div className="flex items-center space-x-2">
          {anomalies.length > 1 && (
            <>
              <button 
                onClick={handlePrevious}
                className="w-6 h-6 text-[#00FFC3] hover:text-white transition-colors flex items-center justify-center"
                aria-label="Previous anomaly"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext}
                className="w-6 h-6 text-[#00FFC3] hover:text-white transition-colors flex items-center justify-center"
                aria-label="Next anomaly"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        <h3 
          className="font-bold text-white text-base flex-1 text-center"
          style={{ 
            fontFamily: 'Noto Sans',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)' 
          }}
        >
          Anomaly Detector
        </h3>
        <div className="flex items-center space-x-2">
          <button className="w-6 h-6 text-white/50 hover:text-[#00FFC3] transition-colors">
            <span className="text-sm">⋮</span>
          </button>
          <button className="w-6 h-6 text-white/50 hover:text-[#00FFC3] transition-colors">
            <span className="text-sm">—</span>
          </button>
          <button className="w-6 h-6 text-white/50 hover:text-[#00FFC3] transition-colors">
            <span className="text-sm">⛶</span>
          </button>
        </div>
      </div>

      {/* Carousel Body */}
      <div 
        className="flex-1 p-3 flex items-center justify-center relative"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(32px)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAnomaly.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-40 p-4 rounded-2xl relative"
            style={{
              background: 'rgba(20,30,50,0.4)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            }}
            role="region"
            aria-labelledby="anomaly-heading"
          >
            {/* Title and Severity */}
            <div className="flex items-start justify-between mb-2">
              <h4 
                id="anomaly-heading"
                className="font-bold text-[#00FFC3] text-sm"
                style={{ 
                  fontFamily: 'Noto Sans',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)' 
                }}
              >
                {currentAnomaly.title}
              </h4>
              <span 
                className="px-3 py-1 rounded-full font-medium text-white text-xs"
                style={{ 
                  fontFamily: 'Noto Sans',
                  backgroundColor: getSeverityColor(currentAnomaly.severity),
                  color: currentAnomaly.severity === 'low' ? '#081226' : '#FFFFFF'
                }}
              >
                {getSeverityLabel(currentAnomaly.severity)}
              </span>
            </div>

            {/* Timestamp */}
            <p 
              className="text-[#E0E0E0] text-xs mb-3"
              style={{ fontFamily: 'Noto Sans' }}
            >
              {currentAnomaly.timestamp}
            </p>

            {/* Description */}
            <p 
              className="text-[#E0E0E0] text-xs leading-relaxed mb-4 flex-1"
              style={{ fontFamily: 'Noto Sans' }}
            >
              {currentAnomaly.description}
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-auto absolute bottom-4 left-4 right-4">
              <button
                className="flex-1 h-8 rounded-lg font-medium text-[#081226] text-xs transition-all duration-200 hover:scale-105"
                style={{
                  fontFamily: 'Noto Sans',
                  background: '#00FFC3',
                  boxShadow: '0 4px 8px rgba(0,255,195,0.4)',
                }}
                aria-label="Investigate Anomaly"
              >
                Investigate ▶
              </button>
              <button
                className="flex-1 h-8 rounded-lg font-medium text-[#081226] text-xs transition-all duration-200 hover:scale-105"
                style={{
                  fontFamily: 'Noto Sans',
                  background: '#00B8FF',
                  boxShadow: '0 4px 8px rgba(0,184,255,0.4)',
                }}
                aria-label="Trigger Playbook"
              >
                Trigger Playbook ▶
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        {anomalies.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {anomalies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-[#00FFC3]' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to anomaly ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyDetector;
