
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface KpiData {
  id: string;
  name: string;
  value: number;
  target: number;
  min: number;
  max: number;
  color: string;
}

const KpiCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [kpis, setKpis] = useState<KpiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setKpis([
        { 
          id: '1', 
          name: 'Network Development Index', 
          value: 76, 
          target: 80, 
          min: 0, 
          max: 100,
          color: 'teal' 
        },
        { 
          id: '2', 
          name: 'Network Reach', 
          value: 45, 
          target: 60, 
          min: 0, 
          max: 100,
          color: 'blue' 
        },
        { 
          id: '3', 
          name: 'Equilibrium Status', 
          value: 82, 
          target: 75, 
          min: 0, 
          max: 100,
          color: 'emerald'
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const nextKpi = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % kpis.length);
  };

  const prevKpi = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? kpis.length - 1 : prevIndex - 1
    );
  };

  const calculateRotation = (value: number, min: number, max: number) => {
    // Convert value to degrees (0-180 degree rotation)
    const percentage = ((value - min) / (max - min)) * 100;
    return (percentage / 100) * 180 - 90; // -90 to +90 degrees
  };

  if (loading) {
    return (
      <div className="glass-panel animate-pulse flex items-center justify-center p-12 h-56">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-500/20 rounded-full mb-3"></div>
          <div className="w-36 h-3 bg-gray-500/20 rounded-full"></div>
        </div>
      </div>
    );
  }

  const currentKpi = kpis[currentIndex];
  const rotation = calculateRotation(
    currentKpi.value,
    currentKpi.min,
    currentKpi.max
  );

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      teal: 'from-teal-500 to-teal-300',
      blue: 'from-blue-500 to-blue-300',
      emerald: 'from-emerald-500 to-emerald-300',
      amber: 'from-amber-500 to-amber-300',
      red: 'from-red-500 to-red-300',
    };
    
    return colorMap[color] || 'from-teal-500 to-teal-300';
  };

  return (
    <div className="glass-panel p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      
      <h2 className="text-lg font-semibold mb-4 text-left">Key Performance Indicators</h2>
      
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/10 z-10"
          onClick={prevKpi}
        >
          <ChevronLeft size={20} />
        </Button>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentKpi.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center flex-1 px-4"
          >
            <div className="relative w-32 h-32">
              {/* Gauge background */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-700/30"></div>
              
              {/* Gauge fill */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div 
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getColorClass(currentKpi.color)}`} 
                  style={{ height: `${(currentKpi.value / currentKpi.max) * 100}%`, transition: 'height 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                ></div>
              </div>
              
              {/* Center circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-navy-800/80 flex items-center justify-center backdrop-blur">
                  <Gauge className="text-teal-400" size={24} />
                </div>
              </div>
              
              {/* Gauge needle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                  className="w-1 h-12 bg-gradient-to-b from-white to-teal-400 rounded origin-bottom transform"
                  style={{ transform: `translateY(-6px) rotate(${rotation}deg)`, transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                ></div>
              </div>
              
              {/* Gauge value indicator */}
              <div className="absolute -bottom-2 inset-x-0 text-center">
                <span className="text-2xl font-bold text-white">{currentKpi.value}</span>
                <span className="text-xs text-gray-400">/{currentKpi.max}</span>
              </div>
            </div>
            
            <h3 className="mt-4 font-medium text-center">{currentKpi.name}</h3>
            <p className="text-sm text-gray-400">
              Target: {currentKpi.target}
            </p>
          </motion.div>
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/10 z-10"
          onClick={nextKpi}
        >
          <ChevronRight size={20} />
        </Button>
      </div>
      
      {/* Indicator dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {kpis.map((kpi, index) => (
          <button
            key={kpi.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-teal-400 w-4' : 'bg-gray-600'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default KpiCarousel;
