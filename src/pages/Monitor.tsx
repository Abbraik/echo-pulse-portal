
import React from 'react';
import { motion } from 'framer-motion';
import FocusContextDashboard from '@/components/monitor/FocusContextDashboard';

const Monitor: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <motion.div 
        className="container mx-auto p-6 h-screen flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <motion.h1 
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Monitor Zone
          </motion.h1>
          <motion.p 
            className="text-gray-300 mt-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Focus + Context Dashboard with Fisheye Interactions
          </motion.p>
        </div>
        
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <FocusContextDashboard />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Monitor;
