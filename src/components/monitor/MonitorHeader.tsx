
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, HelpCircle } from 'lucide-react';

const MonitorHeader: React.FC = () => {
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
    <motion.header 
      variants={itemVariants}
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-900/30 border-b border-white/20 py-6 px-4"
      role="banner"
      aria-labelledby="monitor-title"
      whileHover={{ 
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(15, 23, 42, 0.4)"
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <motion.div 
            className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-400/30"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(20, 184, 166, 0.4)",
              borderColor: "rgba(20, 184, 166, 0.6)"
            }}
            animate={{ 
              scale: [1, 1.02, 1],
              boxShadow: [
                "0 0 10px rgba(20, 184, 166, 0.2)",
                "0 0 15px rgba(20, 184, 166, 0.3)",
                "0 0 10px rgba(20, 184, 166, 0.2)"
              ]
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              boxShadow: { duration: 3, repeat: Infinity }
            }}
          >
            <Activity size={32} className="text-teal-400" />
          </motion.div>
          <div className="text-left">
            <motion.h1 
              id="monitor-title"
              className="text-4xl font-bold bg-gradient-to-r from-white via-teal-200 to-blue-400 bg-clip-text text-transparent"
              whileHover={{ 
                scale: 1.02,
                textShadow: "0 0 20px rgba(20, 184, 166, 0.5)"
              }}
              transition={{ duration: 0.2 }}
            >
              MONITOR ▮ : OPERATIONAL & STRATEGIC TRACKING
            </motion.h1>
            <motion.p 
              className="text-lg text-slate-300 mt-2"
              initial={{ opacity: 0.8 }}
              whileHover={{ 
                opacity: 1,
                color: "rgba(148, 163, 184, 1)"
              }}
              transition={{ duration: 0.2 }}
            >
              Real-time system health and performance insights
            </motion.p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button 
            className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
            whileHover={{ 
              scale: 1.1,
              backgroundColor: "rgba(20, 184, 166, 0.15)",
              boxShadow: "0 0 15px rgba(20, 184, 166, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <HelpCircle className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default MonitorHeader;
