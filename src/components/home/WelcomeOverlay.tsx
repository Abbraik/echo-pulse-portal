
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface WelcomeOverlayProps {
  onDismiss: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onDismiss }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-lg flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="glass-panel max-w-3xl w-full p-8 md:p-12"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-extrabold mb-6 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-500">
            Welcome to the Population Dynamics System
          </span>
        </motion.h1>
        
        <motion.p 
          className="mb-8 text-lg text-gray-300 text-center max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Analyze, strategize, and optimize population dynamics with our comprehensive system. Navigate through four specialized zones to gain insights and take action.
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { name: 'THINK', description: 'Frame systems and analyze patterns' },
            { name: 'ACT', description: 'Implement strategies and coordinate' },
            { name: 'MONITOR', description: 'Track metrics and spot trends' },
            { name: 'INNOVATE', description: 'Learn and improve continuously' },
          ].map((zone) => (
            <div key={zone.name} className="glass-panel p-4 text-center">
              <h3 className="font-bold text-teal-400 mb-1">{zone.name}</h3>
              <p className="text-sm text-gray-300">{zone.description}</p>
            </div>
          ))}
        </motion.div>
        
        <motion.div 
          className="flex justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button 
            onClick={onDismiss}
            className="bg-teal-500 hover:bg-teal-400 text-white button-glow px-8 py-6 text-lg font-medium rounded-xl"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeOverlay;
