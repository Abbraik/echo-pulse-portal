
import React from 'react';
import { Monitor, HelpCircle, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MonitorHeader: React.FC = () => {
  return (
    <motion.header 
      className="w-full h-20 flex items-center justify-between px-8"
      style={{
        background: 'rgba(10, 20, 40, 0.6)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Side */}
      <div className="flex items-center">
        <Monitor className="text-white mr-4" size={24} />
        <div>
          <h1 
            className="text-xl font-bold"
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 700,
              fontSize: '20px',
              color: '#00FFC3',
              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.6)',
            }}
          >
            MONITOR ▮ : OPERATIONAL & STRATEGIC TRACKING
          </h1>
          <p 
            className="mt-1"
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 400,
              fontSize: '14px',
              color: '#E0E0E0',
            }}
          >
            Real-time system health and performance insights
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <motion.button
          className="p-2 text-white opacity-50 hover:opacity-100 transition-all duration-200"
          whileHover={{ 
            filter: 'drop-shadow(0 0 8px #00FFC3)',
          }}
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </motion.button>
        <motion.button
          className="p-2 text-white opacity-50 hover:opacity-100 transition-all duration-200"
          whileHover={{ 
            filter: 'drop-shadow(0 0 8px #00FFC3)',
          }}
          aria-label="Full Screen"
          disabled
        >
          <Maximize2 size={20} />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default MonitorHeader;
