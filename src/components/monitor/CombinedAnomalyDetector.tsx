
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface Anomaly {
  id: number;
  title: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  description: string;
  type: 'strategic' | 'operational';
}

interface CombinedAnomalyDetectorProps {
  className?: string;
}

const CombinedAnomalyDetector: React.FC<CombinedAnomalyDetectorProps> = ({ className }) => {
  const { t } = useTranslation();
  const [currentAnomalyIndex, setCurrentAnomalyIndex] = useState(0);
  
  // Mock anomaly data
  const anomalies: Anomaly[] = [
    {
      id: 1,
      title: 'Social Trust Anomaly',
      severity: 'high',
      timestamp: '2025-05-18',
      description: 'Social trust index dropped by 15% in 2 cycles, potential link to migration surge.',
      type: 'strategic'
    },
    {
      id: 2,
      title: 'Water Resources Anomaly',
      severity: 'medium',
      timestamp: '2025-05-17',
      description: 'Water consumption patterns show unusual spikes in residential areas.',
      type: 'operational'
    },
    {
      id: 3,
      title: 'Economic Activity Anomaly',
      severity: 'low',
      timestamp: '2025-05-16',
      description: 'Minor fluctuation in local market activity during expected stable period.',
      type: 'strategic'
    }
  ];

  const currentAnomaly = anomalies[currentAnomalyIndex];

  // Auto-cycle through anomalies every 8 seconds
  useEffect(() => {
    if (anomalies.length > 1) {
      const interval = setInterval(() => {
        setCurrentAnomalyIndex((prev) => (prev + 1) % anomalies.length);
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

  const handlePrevious = () => {
    setCurrentAnomalyIndex((prev) => 
      prev === 0 ? anomalies.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentAnomalyIndex((prev) => (prev + 1) % anomalies.length);
  };

  const handleInvestigate = () => {
    console.log(`Investigating anomaly: ${currentAnomaly.title}`);
  };

  const handleTriggerPlaybook = () => {
    console.log(`Triggering playbook for: ${currentAnomaly.title}`);
  };

  if (!currentAnomaly) return null;

  return (
    <motion.div 
      className={cn('h-full flex flex-col', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* ACT-style Header Bar with Neon Gradient */}
      <div 
        className="h-10 flex items-center justify-between px-6 flex-shrink-0"
        style={{ 
          background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)'
        }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Zap size={16} className="text-white" />
          </motion.div>
          <h3 className="text-base font-bold text-white font-['Noto_Sans']" style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
            fontSize: '16px'
          }}>
            Anomaly Detector
          </h3>
        </div>
        
        {/* ACT-style Navigation arrows */}
        {anomalies.length > 1 && (
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handlePrevious}
              className="text-white/70 hover:text-white h-6 w-6 flex items-center justify-center transition-all duration-200"
              whileHover={{ boxShadow: '0 0 8px rgba(0,255,195,0.5)' }}
            >
              <ChevronLeft size={16} />
            </motion.button>
            <span className="text-xs text-white font-['Noto_Sans']">
              {currentAnomalyIndex + 1}/{anomalies.length}
            </span>
            <motion.button
              onClick={handleNext}
              className="text-white/70 hover:text-white h-6 w-6 flex items-center justify-center transition-all duration-200"
              whileHover={{ boxShadow: '0 0 8px rgba(0,255,195,0.5)' }}
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        )}
      </div>

      {/* ACT-style Anomaly Carousel Card */}
      <div className="flex-1 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAnomaly.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-xl border border-white/10 p-6 flex flex-col transition-transform duration-300"
            style={{
              // Radial vignette background - matching ACT
              background: 'radial-gradient(circle at center, rgba(20,30,50,0.8) 0%, rgba(10,20,40,0.9) 100%)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
              filter: 'drop-shadow(0 0 8px rgba(0,255,195,0.1))'
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 12px 24px rgba(0,0,0,0.6)'
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-sm font-bold text-[#00FFC3] font-['Noto_Sans'] flex-1" style={{
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                fontSize: '14px'
              }}>
                {currentAnomaly.title}
              </h4>
              <Badge 
                className="font-['Noto_Sans'] text-white ml-3"
                style={{
                  background: getSeverityColor(currentAnomaly.severity),
                  fontSize: '12px',
                  height: '20px',
                  fontWeight: '600'
                }}
              >
                {currentAnomaly.severity.charAt(0).toUpperCase() + currentAnomaly.severity.slice(1)}
              </Badge>
            </div>

            <div className="mb-6 flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-[#E0E0E0] font-['Noto_Sans']">
                  {currentAnomaly.timestamp}
                </span>
                <Badge 
                  className="font-['Noto_Sans'] text-white"
                  style={{
                    background: currentAnomaly.type === 'strategic' ? '#00FFC3' : '#00B8FF',
                    fontSize: '10px',
                    height: '18px',
                    fontWeight: '500'
                  }}
                >
                  {currentAnomaly.type.charAt(0).toUpperCase() + currentAnomaly.type.slice(1)}
                </Badge>
              </div>
              <p className="text-xs text-[#E0E0E0] font-['Noto_Sans'] leading-relaxed">
                {currentAnomaly.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <motion.button
                onClick={handleInvestigate}
                className="h-8 font-['Noto_Sans'] rounded-lg transition-all duration-200"
                style={{
                  background: '#00FFC3',
                  color: '#081226',
                  boxShadow: '0 4px 8px rgba(0,255,195,0.4)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
                whileHover={{
                  background: '#00E6B8',
                  boxShadow: '0 6px 12px rgba(0,255,195,0.6)'
                }}
              >
                Investigate ▶
              </motion.button>
              <motion.button
                onClick={handleTriggerPlaybook}
                className="h-8 font-['Noto_Sans'] rounded-lg border transition-all duration-200"
                style={{
                  background: '#00B8FF',
                  color: '#081226',
                  border: '1px solid rgba(0,184,255,0.3)',
                  boxShadow: '0 4px 8px rgba(0,184,255,0.4)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
                whileHover={{
                  background: '#00A3E6',
                  boxShadow: '0 6px 12px rgba(0,184,255,0.6)'
                }}
              >
                Trigger Playbook ▶
              </motion.button>
            </div>

            {/* ACT-style Indicator dots */}
            {anomalies.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-white/10">
                {anomalies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAnomalyIndex(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-200',
                      index === currentAnomalyIndex 
                        ? 'bg-[#00FFC3]' 
                        : 'bg-gray-500 hover:bg-gray-400'
                    )}
                    style={index === currentAnomalyIndex ? {
                      boxShadow: '0 0 4px rgba(0,255,195,0.8)'
                    } : {}}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CombinedAnomalyDetector;
