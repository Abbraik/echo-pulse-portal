
import React from 'react';
import { motion } from 'framer-motion';
import UniversalAlertHub from './UniversalAlertHub';
import AnomalyDetector from './AnomalyDetector';

const AlertsAnomalySection: React.FC = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[30vh] flex-shrink-0"
    >
      <motion.div 
        className="lg:col-span-2"
        whileHover={{ 
          y: -2,
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)"
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full rounded-2xl backdrop-blur-xl bg-slate-800/40 border border-white/20 overflow-hidden shadow-2xl">
          <UniversalAlertHub />
        </div>
      </motion.div>
      <motion.div
        whileHover={{ 
          y: -2,
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)"
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full rounded-2xl backdrop-blur-xl bg-slate-800/40 border border-white/20 overflow-hidden shadow-2xl">
          <AnomalyDetector />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlertsAnomalySection;
