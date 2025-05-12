
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface PulseCategory {
  id: string;
  name: string;
  value: number;
  color: string;
}

const SystemPulseOrb: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [pulseData] = useState<PulseCategory[]>([
    { id: 'health', name: 'Health', value: 82, color: 'teal-400' },
    { id: 'education', name: 'Education', value: 68, color: 'blue-400' },
    { id: 'economy', name: 'Economy', value: 74, color: 'emerald-400' },
    { id: 'environment', name: 'Environment', value: 61, color: 'amber-400' },
    { id: 'governance', name: 'Governance', value: 79, color: 'purple-400' },
  ]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Calculate overall pulse (average of all values)
  const overallPulse = Math.round(
    pulseData.reduce((sum, item) => sum + item.value, 0) / pulseData.length
  );

  const getSize = (value: number) => {
    // Scale the size based on the value (50-100% of base size)
    const minSize = 50;
    const maxSize = 100;
    const percentage = ((value - 0) / (100 - 0)) * (maxSize - minSize) + minSize;
    return `${percentage}%`;
  };

  return (
    <div className="glass-panel p-6">
      <h2 className="text-lg font-semibold mb-4 text-left">System Pulse</h2>

      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center my-6"
          >
            <motion.button
              onClick={toggleExpanded}
              className="relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Pulsing background */}
              <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-breathe"></div>
              <div className="absolute inset-2 rounded-full bg-teal-500/15 animate-breathe [animation-delay:0.2s]"></div>
              <div className="absolute inset-4 rounded-full bg-teal-500/10 animate-breathe [animation-delay:0.4s]"></div>
              
              {/* Core orb */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 shadow-lg shadow-teal-500/20 flex items-center justify-center">
                <motion.span
                  className="text-2xl font-bold text-white"
                  whileHover={{ scale: 1.1 }}
                >
                  {overallPulse}
                </motion.span>
              </div>
              
              {/* Hover text */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-navy-800/80 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.9 }}
              >
                <span className="text-sm text-white">Click to expand</span>
              </motion.div>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="py-8 relative"
          >
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <span className="text-xl font-bold text-white">{overallPulse}</span>
              </div>
            </div>

            <div className="relative">
              {/* Center dot */}
              <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-white -translate-x-1 -translate-y-1"></div>
              
              {/* Radial items */}
              <div className="relative h-48">
                {pulseData.map((item, index) => {
                  // Position items in a circle
                  const angle = (index / pulseData.length) * 2 * Math.PI;
                  const radius = 120; // distance from center
                  const x = Math.cos(angle) * radius + 50; // 50% + radius%
                  const y = Math.sin(angle) * radius + 50; // 50% + radius%
                  
                  return (
                    <motion.div
                      key={item.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`, 
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`relative bg-${item.color} rounded-full flex items-center justify-center`}
                        style={{ 
                          width: getSize(item.value), 
                          height: getSize(item.value),
                          backgroundColor: `var(--${item.color.replace('-', '-')})`,
                          minWidth: '40px',
                          minHeight: '40px'
                        }}
                      >
                        <span className="text-xs font-bold text-navy-900">{item.value}</span>
                        
                        {/* Line connecting to center */}
                        <div className="absolute left-1/2 top-1/2 w-[1px] h-[120px] bg-gray-500/30 opacity-50 origin-top"
                          style={{
                            transform: `rotate(${angle + Math.PI}rad)`,
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 text-center whitespace-nowrap text-xs font-medium">
                        {item.name}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <motion.button
                onClick={toggleExpanded}
                className="px-4 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Collapse View
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SystemPulseOrb;
