
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Minus, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

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
      className="h-full rounded-3xl border relative"
      style={{
        background: 'rgba(10,20,40,0.45)',
        backdropFilter: 'blur(24px)',
        borderColor: 'rgba(0,255,195,0.15)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.6)',
      }}
    >
      {/* Inner Glass Layer */}
      <div 
        className="absolute inset-0.5 rounded-[1.25rem] p-4 flex flex-col"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(32px)',
        }}
      >
        {/* Header */}
        <div 
          className="h-8 flex items-center justify-between px-4 rounded-lg mb-4 flex-shrink-0"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
          }}
        >
          <div className="flex items-center space-x-2">
            {anomalies.length > 1 && (
              <>
                <button 
                  onClick={handlePrevious}
                  className="w-5 h-5 text-[#00FFC3] hover:text-white transition-colors"
                  aria-label="Previous anomaly"
                >
                  <ChevronLeft className="w-full h-full" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-5 h-5 text-[#00FFC3] hover:text-white transition-colors"
                  aria-label="Next anomaly"
                >
                  <ChevronRight className="w-full h-full" />
                </button>
              </>
            )}
          </div>
          <h3 
            className="font-noto-bold text-white text-base flex-1 text-center"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Anomaly Detector
          </h3>
          <div className="flex items-center space-x-2">
            <button className="w-5 h-5 text-white/50 hover:text-[#00FFC3] transition-colors">
              <MoreVertical className="w-full h-full" />
            </button>
            <button className="w-5 h-5 text-white/50 hover:text-[#00FFC3] transition-colors">
              <Minus className="w-full h-full" />
            </button>
            <button className="w-5 h-5 text-white/50 hover:text-[#00FFC3] transition-colors">
              <Maximize2 className="w-full h-full" />
            </button>
          </div>
        </div>

        {/* Carousel Card */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAnomaly.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full p-4 rounded-xl"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              }}
              role="region"
              aria-labelledby="anomaly-heading"
            >
              {/* Title and Severity */}
              <div className="flex items-start justify-between mb-2">
                <h4 
                  id="anomaly-heading"
                  className="font-noto-bold text-[#00FFC3] text-sm"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  {currentAnomaly.title}
                </h4>
                <span 
                  className="px-3 py-1 rounded-full font-noto-medium text-white text-xs"
                  style={{ 
                    backgroundColor: getSeverityColor(currentAnomaly.severity),
                    color: currentAnomaly.severity === 'low' ? '#081226' : '#FFFFFF'
                  }}
                >
                  {getSeverityLabel(currentAnomaly.severity)}
                </span>
              </div>

              {/* Timestamp */}
              <p className="font-noto-regular text-[#E0E0E0] text-xs mb-3">
                {currentAnomaly.timestamp}
              </p>

              {/* Description */}
              <p className="font-noto-regular text-[#E0E0E0] text-xs leading-relaxed mb-4 flex-1">
                {currentAnomaly.description}
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-auto">
                <button
                  className="flex-1 h-8 rounded-lg font-noto-medium text-[#081226] text-xs transition-all duration-200 hover:scale-105"
                  style={{
                    background: '#00FFC3',
                    boxShadow: '0 4px 8px rgba(0,255,195,0.4)',
                  }}
                  aria-label="Investigate Anomaly"
                >
                  Investigate ▶
                </button>
                <button
                  className="flex-1 h-8 rounded-lg font-noto-medium text-[#081226] text-xs transition-all duration-200 hover:scale-105"
                  style={{
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
    </div>
  );
};

export default AnomalyDetector;
