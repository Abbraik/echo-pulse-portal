
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';

const pillars = [
  { id: 'economic', color: '#38bdf8' },
  { id: 'social', color: '#a78bfa' },
  { id: 'environmental', color: '#4ade80' },
  { id: 'governance', color: '#fb923c' }
];

export const SystemPulseOrb: React.FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [pulseSize, setPulseSize] = useState(1);
  
  React.useEffect(() => {
    // Simulate a "heartbeat" by changing the pulse size
    const interval = setInterval(() => {
      setPulseSize(prev => {
        const newSize = prev + (Math.random() * 0.1 - 0.05);
        return Math.max(0.95, Math.min(1.05, newSize));
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleOrbClick = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main orb */}
      <motion.div 
        className="cursor-pointer backdrop-blur-xl rounded-full bg-gradient-to-br from-teal-400/30 to-blue-500/30 border border-teal-300/30 shadow-lg shadow-teal-500/10 relative overflow-hidden flex items-center justify-center"
        animate={{ 
          scale: expanded ? 1.2 : pulseSize,
          backgroundColor: expanded ? 'rgba(45, 212, 191, 0.1)' : 'rgba(56, 189, 248, 0.1)'
        }}
        transition={{ 
          type: "spring", 
          duration: expanded ? 0.8 : 0.3 
        }}
        onClick={handleOrbClick}
        style={{
          width: '160px',
          height: '160px'
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-blue-500/10"
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="text-center">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
            72
          </div>
          <div className="text-xs text-teal-300/80">
            {t('stability' as any)}
          </div>
        </div>
      </motion.div>
      
      {/* Spokes that appear when expanded */}
      {expanded && (
        <>
          {pillars.map((pillar, index) => {
            const angle = (index * 90) * (Math.PI / 180);
            const radius = 140;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.div
                key={pillar.id}
                className="absolute glass-panel p-3 rounded-xl"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ 
                  x, 
                  y, 
                  opacity: 1,
                  scale: [0.8, 1]
                }}
                transition={{ 
                  type: "spring",
                  damping: 20,
                  delay: index * 0.1
                }}
                style={{
                  width: '80px',
                  boxShadow: `0 0 15px ${pillar.color}30`
                }}
              >
                <div className="text-sm font-medium" style={{ color: pillar.color }}>
                  {t(pillar.id as any)}
                </div>
                <div 
                  className="h-1 mt-1 rounded-full" 
                  style={{ 
                    backgroundColor: pillar.color,
                    opacity: 0.7
                  }}
                />
                <div className="text-lg font-bold mt-1">
                  {65 + Math.round(Math.random() * 25)}
                </div>
              </motion.div>
            );
          })}
        </>
      )}
    </div>
  );
};
