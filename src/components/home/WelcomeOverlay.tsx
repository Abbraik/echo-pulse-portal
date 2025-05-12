
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { BrainCircuit, ClipboardCheck, LineChart, Lightbulb } from 'lucide-react';

interface WelcomeOverlayProps {
  onDismiss: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onDismiss }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleDismiss = () => {
    if (dontShowAgain) {
      localStorage.setItem('pds_never_show_welcome', 'true');
    }
    onDismiss();
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-3xl flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated particle background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
              ],
              y: [
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
              ],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div 
        className="glass-panel max-w-3xl w-full p-8 md:p-12 relative overflow-hidden"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        {/* Background gradient effect */}
        <div className="absolute -inset-1/2 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full blur-3xl transform -rotate-12 pointer-events-none"></div>
        
        <motion.h1 
          className="text-3xl md:text-5xl font-extrabold mb-6 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-blue-400 to-teal-300">
            Welcome to the Population Dynamics System
          </span>
        </motion.h1>
        
        <motion.p 
          className="mb-8 text-lg md:text-xl text-gray-300 text-center max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your governance engine
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-4 mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center space-x-4 md:space-x-8 text-lg md:text-xl font-medium">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="text-blue-400" />
              <span>THINK 🔍</span>
            </div>
            <span className="text-gray-500">·</span>
            <div className="flex items-center space-x-2">
              <ClipboardCheck className="text-teal-400" />
              <span>ACT 🛠️</span>
            </div>
            <span className="text-gray-500">·</span>
            <div className="flex items-center space-x-2">
              <LineChart className="text-amber-400" />
              <span>MONITOR 📈</span>
            </div>
            <span className="text-gray-500">·</span>
            <div className="flex items-center space-x-2">
              <Lightbulb className="text-purple-400" />
              <span>INNOVATE 🚀</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { name: 'THINK', description: 'Frame systems and analyze patterns' },
            { name: 'ACT', description: 'Implement strategies and coordinate' },
            { name: 'MONITOR', description: 'Track metrics and spot trends' },
            { name: 'INNOVATE', description: 'Learn and improve continuously' },
          ].map((zone, index) => (
            <motion.div 
              key={zone.name} 
              className="glass-panel p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <h3 className="font-bold text-teal-400 mb-1">{zone.name}</h3>
              <p className="text-sm text-gray-300">{zone.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button 
            onClick={handleDismiss}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white button-glow px-8 py-6 text-lg font-medium rounded-xl transform transition-transform hover:scale-105"
          >
            Get Started
          </Button>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dont-show" 
              className="data-[state=checked]:bg-teal-500 border-white/30" 
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(!!checked)}
            />
            <label 
              htmlFor="dont-show" 
              className="text-sm text-gray-300 cursor-pointer"
            >
              Don't show again
            </label>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeOverlay;
