
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, TrendingUp } from 'lucide-react';
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

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
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
      className={cn('h-full', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div 
        className="h-full rounded-2xl border border-white/20 overflow-hidden"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 16px 32px rgba(0,0,0,0.4)'
        }}
      >
        {/* Header */}
        <div 
          className="h-8 flex items-center justify-between px-4"
          style={{ background: 'rgba(10,20,40,0.8)' }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap size={16} className="text-[#00FFC3]" />
            </motion.div>
            <h3 className="text-base font-bold text-[#00FFC3] font-['Noto_Sans']">
              Anomaly Detector
            </h3>
          </div>
          
          {/* Navigation arrows */}
          {anomalies.length > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="text-gray-400 hover:text-[#00FFC3] h-6 w-6 p-0"
              >
                <ChevronLeft size={12} />
              </Button>
              <span className="text-xs text-gray-400 font-['Noto_Sans']">
                {currentAnomalyIndex + 1}/{anomalies.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="text-gray-400 hover:text-[#00FFC3] h-6 w-6 p-0"
              >
                <ChevronRight size={12} />
              </Button>
            </div>
          )}
        </div>

        {/* Anomaly Card */}
        <div className="p-4 h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAnomaly.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-xl border border-white/10 p-4 hover:scale-[1.02] transition-transform duration-300"
              style={{
                background: 'rgba(10,20,40,0.6)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                filter: 'drop-shadow(0 0 8px rgba(0,255,195,0.1))'
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-medium text-white font-['Noto_Sans'] flex-1">
                  {currentAnomaly.title}
                </h4>
                <Badge 
                  variant={getSeverityVariant(currentAnomaly.severity)}
                  className="text-xs font-['Noto_Sans'] ml-2"
                >
                  {currentAnomaly.severity.charAt(0).toUpperCase() + currentAnomaly.severity.slice(1)}
                </Badge>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400 font-['Noto_Sans']">
                    {currentAnomaly.timestamp}
                  </span>
                  <Badge 
                    variant={currentAnomaly.type === 'strategic' ? 'default' : 'secondary'}
                    className="text-xs font-['Noto_Sans']"
                  >
                    {currentAnomaly.type.charAt(0).toUpperCase() + currentAnomaly.type.slice(1)}
                  </Badge>
                </div>
                <p className="text-xs text-gray-300 font-['Noto_Sans'] leading-relaxed">
                  {currentAnomaly.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <Button
                  size="sm"
                  onClick={handleInvestigate}
                  className="bg-[#00FFC3] text-white hover:bg-[#00FFC3]/80 text-xs font-['Noto_Sans'] h-8"
                >
                  Investigate ▶
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTriggerPlaybook}
                  className="border-[#00B8FF]/30 text-[#00B8FF] hover:bg-[#00B8FF]/10 text-xs font-['Noto_Sans'] h-8"
                >
                  Trigger Playbook ▶
                </Button>
              </div>

              {/* Indicator dots for navigation */}
              {anomalies.length > 1 && (
                <div className="flex justify-center gap-1 mt-3 pt-3 border-t border-white/10">
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
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CombinedAnomalyDetector;
