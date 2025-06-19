
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Brain, Zap, Monitor, GraduationCap, Lightbulb } from 'lucide-react';

const zones = [
  { name: 'THINK', icon: Brain, color: 'teal', preview: 'Strategic analysis & planning' },
  { name: 'ACT', icon: Zap, color: 'blue', preview: 'Implementation & execution' },
  { name: 'MONITOR', icon: Monitor, color: 'purple', preview: 'Performance tracking' },
  { name: 'LEARN', icon: GraduationCap, color: 'orange', preview: 'Knowledge acquisition' },
  { name: 'INNOVATE', icon: Lightbulb, color: 'green', preview: 'Creative solutions' }
];

const LoopRibbon: React.FC = () => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <div className="relative px-6 py-3">
      <div className="glass-panel-cinematic p-4">
        <div className="flex items-center justify-center space-x-6">
          {zones.map((zone, index) => (
            <React.Fragment key={zone.name}>
              <motion.div
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredZone(zone.name)}
                onMouseLeave={() => setHoveredZone(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-${zone.color}-500/20 border border-${zone.color}-500/30 hover:bg-${zone.color}-500/30 transition-all duration-200`}>
                  <zone.icon size={16} className={`text-${zone.color}-400`} />
                  <span className={`font-medium text-${zone.color}-400`}>{zone.name}</span>
                </div>

                {/* Preview Tooltip */}
                <AnimatePresence>
                  {hoveredZone === zone.name && (
                    <motion.div
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-10"
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-black/90 backdrop-blur-lg border border-teal-500/30 rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap">
                        {zone.preview}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-teal-500/30 rotate-45"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {index < zones.length - 1 && (
                <ArrowRight size={16} className="text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoopRibbon;
