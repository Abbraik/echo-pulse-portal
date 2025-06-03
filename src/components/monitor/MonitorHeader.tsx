
import React from 'react';
import { Monitor, HelpCircle, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MonitorHeader: React.FC = () => {
  return (
    <motion.header 
      className="w-full h-20 flex items-center justify-between px-8"
      style={{
        background: 'rgba(4, 18, 37, 0.65)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        borderBottom: '1px solid rgba(0, 255, 195, 0.20)',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Side */}
      <div className="flex items-center">
        <motion.div
          style={{
            filter: 'drop-shadow(0 0 10px rgba(0, 255, 195, 0.5))',
          }}
          whileHover={{
            filter: 'drop-shadow(0 0 15px rgba(0, 255, 195, 0.8))',
          }}
        >
          <Monitor className="text-[#00FFC3] mr-4" size={24} />
        </motion.div>
        <div>
          <h1 
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
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
            }}
          >
            Real-time system health and performance insights
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <motion.button
          className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200"
          style={{ opacity: 0.6 }}
          whileHover={{ 
            opacity: 1,
            filter: 'drop-shadow(0 0 12px rgba(0, 255, 195, 0.6))',
            background: 'rgba(0, 255, 195, 0.10)',
          }}
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </motion.button>
        <motion.button
          className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200"
          style={{ opacity: 0.6 }}
          whileHover={{ 
            opacity: 1,
            filter: 'drop-shadow(0 0 12px rgba(0, 255, 195, 0.6))',
            background: 'rgba(0, 255, 195, 0.10)',
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
