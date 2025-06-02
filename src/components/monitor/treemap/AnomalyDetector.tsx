
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Minus, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Anomaly {
  id: number;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
  description: string;
}

const anomalies: Anomaly[] = [
  {
    id: 1,
    title: 'Water Resources Anomaly',
    severity: 'High',
    timestamp: '2025-05-17',
    description: 'Unusual consumption patterns detected in District 7 water usage'
  },
  {
    id: 2,
    title: 'Population Density Alert',
    severity: 'Medium',
    timestamp: '2025-05-17',
    description: 'Unexpected concentration in residential zones during work hours'
  },
  {
    id: 3,
    title: 'Social Trust Fluctuation',
    severity: 'Low',
    timestamp: '2025-05-16',
    description: 'Minor variations in community engagement metrics'
  }
];

const AnomalyDetector: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % anomalies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#FF6E6E';
      case 'Medium': return '#FFC107';
      case 'Low': return '#00FFC3';
      default: return '#00FFC3';
    }
  };

  const nextAnomaly = () => {
    setCurrentIndex((prev) => (prev + 1) % anomalies.length);
  };

  const prevAnomaly = () => {
    setCurrentIndex((prev) => (prev - 1 + anomalies.length) % anomalies.length);
  };

  const currentAnomaly = anomalies[currentIndex];

  return (
    <div 
      className="w-full h-full"
      style={{
        background: 'rgba(10,20,40,0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,255,195,0.15)',
        borderRadius: '1.5rem',
        boxShadow: '0 12px 24px rgba(0,0,0,0.6)'
      }}
    >
      {/* Inner Glass */}
      <div 
        className="w-full h-full relative"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(32px)',
          borderRadius: '1.25rem',
          margin: '2px'
        }}
      >
        {/* Header */}
        <div 
          className="h-8 flex items-center justify-between px-4"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
            borderRadius: '1.25rem 1.25rem 0 0'
          }}
        >
          <div className="flex items-center gap-2">
            <button 
              onClick={prevAnomaly}
              className="text-[#00FFC3] hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 
              className="text-white font-bold text-sm"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
            >
              Anomaly Detector
            </h3>
            <button 
              onClick={nextAnomaly}
              className="text-[#00FFC3] hover:text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
              <MoreVertical size={14} />
            </button>
            <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
              <Minus size={14} />
            </button>
            <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* Carousel Card */}
        <div className="p-4 h-[calc(100%-2rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full p-4 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(20,30,50,0.8) 0%, rgba(30,41,59,0.8) 100%)',
                backdropFilter: 'blur(16px)',
                borderRadius: '1rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {/* Title and Severity */}
              <div className="flex items-start justify-between mb-2">
                <h4 
                  className="text-[#00FFC3] font-bold text-sm"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                >
                  {currentAnomaly.title}
                </h4>
                <span 
                  className="px-2 py-1 rounded-full text-white text-xs font-semibold"
                  style={{ background: getSeverityColor(currentAnomaly.severity) }}
                >
                  {currentAnomaly.severity}
                </span>
              </div>

              {/* Timestamp */}
              <p className="text-[#E0E0E0] text-xs mb-3">{currentAnomaly.timestamp}</p>

              {/* Description */}
              <p className="text-[#E0E0E0] text-xs mb-4 flex-1">{currentAnomaly.description}</p>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                <button 
                  className="flex-1 h-8 bg-[#00FFC3] text-[#081226] text-xs font-semibold rounded-lg hover:bg-[#00E6B3] transition-all"
                  style={{ boxShadow: '0 4px 8px rgba(0,255,195,0.4)' }}
                >
                  Investigate ▶
                </button>
                <button 
                  className="flex-1 h-8 bg-[#00B8FF] text-[#081226] text-xs font-semibold rounded-lg hover:bg-[#0099CC] transition-all"
                  style={{ boxShadow: '0 4px 8px rgba(0,184,255,0.4)' }}
                >
                  Trigger Playbook ▶
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetector;
